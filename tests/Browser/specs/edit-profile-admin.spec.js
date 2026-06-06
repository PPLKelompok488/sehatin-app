import path from 'path';
import { fileURLToPath } from 'url';
import { expect } from 'chai';
import { By, until, Key } from 'selenium-webdriver';
import { createDriver, BASE_URL } from '../setup.js';

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'Password123@';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROFILE_PHOTO_PATH = path.join(__dirname, '../fixtures/profile-pic.png');

async function loginAdmin(driver, email = ADMIN_EMAIL, password = ADMIN_PASSWORD) {
    await driver.manage().deleteAllCookies();
    await driver.get(`${BASE_URL}/login`);
    await driver.wait(until.elementLocated(By.xpath("//input[@id='email' or @name='email']")), 5000);

    const emailInput = await driver.findElement(By.xpath("//input[@id='email' or @name='email']"));
    await emailInput.click();
    await emailInput.sendKeys(Key.CONTROL + 'a');
    await emailInput.sendKeys(Key.DELETE);
    await emailInput.sendKeys(email);

    const passwordInput = await driver.findElement(By.xpath("//input[@id='password' or @name='password']"));
    await passwordInput.click();
    await passwordInput.sendKeys(Key.CONTROL + 'a');
    await passwordInput.sendKeys(Key.DELETE);
    await passwordInput.sendKeys(password);

    const btn = await driver.findElement(By.xpath("//button[contains(text(), 'Masuk') or contains(text(), 'Login')]"));
    await btn.click();

    await driver.wait(async () => {
        const currentUrl = await driver.getCurrentUrl();
        return currentUrl.includes('/admin');
    }, 10000);
}

async function goToAdminProfile(driver) {
    await driver.get(`${BASE_URL}/settings/profile`);
    await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Data Profil')]")), 5000);
}

async function clickSave(driver) {
    const saveBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Simpan Perubahan') or contains(text(), 'Menyimpan...')]"));
    await saveBtn.click();
}

async function clearAndFillInput(driver, id, value) {
    const input = await driver.findElement(By.id(id));
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", input);
    await driver.sleep(300);
    await driver.executeScript("arguments[0].click();", input);
    await input.sendKeys(Key.CONTROL + 'a');
    await input.sendKeys(Key.DELETE);
    if (value) {
        await input.sendKeys(value);
    }
}

async function uploadProfilePhoto(driver, filePath) {
    const fileInput = await driver.findElement(By.css('input[type="file"]'));
    await fileInput.sendKeys(filePath);
}

async function waitForStatusMessage(driver, text) {
    const status = await driver.wait(
        until.elementLocated(By.xpath(`//div[contains(text(), '${text}')]`)),
        10000,
    );
    expect(await status.isDisplayed()).to.be.true;
}

async function ensureLoggedInAndOpenProfile(driver) {
    await loginAdmin(driver);
    await goToAdminProfile(driver);
}

describe('Edit Profile Admin', function () {
    let driver;

    this.timeout(90000);

    before(async function () {
        driver = await createDriver();
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    describe('TS.ADM.001 — Akses Halaman Profil Admin', function () {
        it('TC.ADM.001.001 — Berhasil membuka halaman profil admin', async function () {
            await ensureLoggedInAndOpenProfile(driver);

            const heading = await driver.findElement(By.xpath("//h3[contains(text(), 'Data Profil')]"));
            expect(await heading.isDisplayed()).to.be.true;

            const emailInput = await driver.findElement(By.id('email'));
            expect(await emailInput.getAttribute('disabled')).to.not.be.null;
            expect(await emailInput.isEnabled()).to.be.false;

            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.include('/settings/profile');
        });
    });

    describe('TS.ADM.002 — Update Informasi Dasar', function () {
        it('TC.ADM.002.001 — Berhasil mengupdate nama dan nomor telepon', async function () {
            await ensureLoggedInAndOpenProfile(driver);

            const newName = `Admin Test ${Date.now()}`;
            const newPhone = `0812${String(Date.now()).slice(-9)}`;

            await clearAndFillInput(driver, 'name', newName);
            await clearAndFillInput(driver, 'phone', newPhone);
            await clickSave(driver);

            await waitForStatusMessage(driver, 'Profil berhasil diperbarui.');

            const nameInput = await driver.findElement(By.id('name'));
            const phoneInput = await driver.findElement(By.id('phone'));
            expect(await nameInput.getAttribute('value')).to.equal(newName);
            expect(await phoneInput.getAttribute('value')).to.equal(newPhone);
        });
    });

    describe('TS.ADM.003 — Foto Profil', function () {
        it('TC.ADM.003.001 — Berhasil upload foto profil', async function () {
            await ensureLoggedInAndOpenProfile(driver);

            await uploadProfilePhoto(driver, PROFILE_PHOTO_PATH);
            await clickSave(driver);

            await waitForStatusMessage(driver, 'Profil berhasil diperbarui.');
            await goToAdminProfile(driver);

            const avatarImg = await driver.wait(
                until.elementLocated(By.xpath("//div[contains(@class, 'relative') and contains(@class, 'w-32') and contains(@class, 'h-32')]//img")),
                5000,
            );
            expect(await avatarImg.isDisplayed()).to.be.true;
            expect(await avatarImg.getAttribute('src')).to.include('/storage/');
        });

        it('TC.ADM.003.002 — Berhasil hapus foto profil', async function () {
            await ensureLoggedInAndOpenProfile(driver);

            let avatarImages = await driver.findElements(By.xpath("//div[contains(@class, 'relative') and contains(@class, 'w-32') and contains(@class, 'h-32')]//img"));
            if (avatarImages.length === 0) {
                await uploadProfilePhoto(driver, PROFILE_PHOTO_PATH);
                await clickSave(driver);
                await waitForStatusMessage(driver, 'Profil berhasil diperbarui.');
                await goToAdminProfile(driver);
                avatarImages = await driver.findElements(By.xpath("//div[contains(@class, 'relative') and contains(@class, 'w-32') and contains(@class, 'h-32')]//img"));
            }

            const removeBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Hapus Foto Profil')]"));
            await removeBtn.click();

            await waitForStatusMessage(driver, 'Foto profil berhasil dihapus.');
            await goToAdminProfile(driver);

            const remainingImages = await driver.findElements(By.xpath("//div[contains(@class, 'relative') and contains(@class, 'w-32') and contains(@class, 'h-32')]//img"));
            expect(remainingImages.length).to.equal(0);
        });
    });

    describe('TS.ADM.004 — Ganti Kata Sandi', function () {
        it('TC.ADM.004.001 — Berhasil ganti password', async function () {
            const tempPassword = `Password.${Date.now()}a`;

            await loginAdmin(driver);
            await goToAdminProfile(driver);

            await clearAndFillInput(driver, 'password', tempPassword);
            await clearAndFillInput(driver, 'password_confirmation', tempPassword);
            await clickSave(driver);

            await waitForStatusMessage(driver, 'Profil berhasil diperbarui.');
            await driver.manage().deleteAllCookies();

            await loginAdmin(driver, ADMIN_EMAIL, tempPassword);
            await goToAdminProfile(driver);

            await clearAndFillInput(driver, 'password', ADMIN_PASSWORD);
            await clearAndFillInput(driver, 'password_confirmation', ADMIN_PASSWORD);
            await clickSave(driver);

            await waitForStatusMessage(driver, 'Profil berhasil diperbarui.');
        });
    });

    describe('TS.ADM.005 — Validasi Field dan Email Read-Only', function () {
        it('TC.ADM.005.001 — Validasi field yang required', async function () {
            await ensureLoggedInAndOpenProfile(driver);

            const nameInput = await driver.findElement(By.id('name'));
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", nameInput);
            await driver.sleep(500);
            await driver.executeScript("arguments[0].click();", nameInput);
            await nameInput.sendKeys(Key.CONTROL + 'a');
            await nameInput.sendKeys(Key.DELETE);
            await driver.sleep(300);

            const phoneInput = await driver.findElement(By.id('phone'));
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", phoneInput);
            await driver.sleep(300);
            await driver.executeScript("arguments[0].click();", phoneInput);
            await phoneInput.sendKeys(Key.CONTROL + 'a');
            await phoneInput.sendKeys(Key.DELETE);
            await driver.sleep(300);

            await clickSave(driver);

            const errorName = await driver.wait(
                until.elementLocated(By.xpath("//p[contains(text(), 'The name field is required.')][1]")),
                5000,
            );
            expect(await errorName.isDisplayed()).to.be.true;

        });

        it('TC.ADM.005.002 — Email tidak bisa diubah (read-only)', async function () {
            await ensureLoggedInAndOpenProfile(driver);

            const emailInput = await driver.findElement(By.id('email'));
            expect(await emailInput.getAttribute('disabled')).to.not.be.null;
            expect(await emailInput.isEnabled()).to.be.false;
        });
    });
});