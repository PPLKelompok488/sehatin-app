import path from 'path';
import { fileURLToPath } from 'url';
import { expect } from 'chai';
import { By, until, Key } from 'selenium-webdriver';
import { createDriver, BASE_URL } from '../setup.js';

const PATIENT_EMAIL = 'qalam@gmail.com';
const PATIENT_PASSWORD = 'Password123@';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROFILE_PHOTO_PATH = path.join(__dirname, '../fixtures/profile-pic.png');

async function loginPatient(driver, email = PATIENT_EMAIL, password = PATIENT_PASSWORD) {
    await driver.manage().deleteAllCookies();
    await driver.get(`${BASE_URL}/login`);
    await driver.wait(until.elementLocated(By.xpath("//input[@id='email' or @name='email']")), 5000);

    const emailInput = await driver.findElement(By.xpath("//input[@id='email' or @name='email']"));
    await emailInput.clear();
    await emailInput.sendKeys(email);

    const passwordInput = await driver.findElement(By.xpath("//input[@id='password' or @name='password']"));
    await passwordInput.clear();
    await passwordInput.sendKeys(password);

    const btn = await driver.findElement(By.xpath("//button[contains(text(), 'Masuk') or contains(text(), 'Login')]") );
    await btn.click();

    await driver.wait(async () => {
        const currentUrl = await driver.getCurrentUrl();
        return currentUrl.includes('/patient');
    }, 10000);
}

async function goToPatientProfile(driver) {
    await driver.get(`${BASE_URL}/patient/settings/profile`);
    await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Data Profil Pasien')]")), 5000);
}

async function clickSave(driver) {
    const saveBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Simpan Perubahan') or contains(text(), 'Menyimpan...')]") );
    await saveBtn.click();
}

async function setSelectOption(driver, labelText, optionText) {
    const select = await driver.findElement(By.xpath(`//label[contains(normalize-space(.), '${labelText}')]/following::select[1]`));
    await select.click();
    const option = await driver.findElement(By.xpath(`//option[normalize-space(text())='${optionText}']`));
    await option.click();
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

async function setDateValue(driver, elementId, dateValue) {
    await driver.executeScript(`
        const input = document.getElementById('${elementId}');
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(input, '${dateValue}');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    `);
}

async function clearAndFillInput(driver, id, value) {
    const input = await driver.findElement(By.id(id));
    await input.clear();
    if (value) {
        await input.sendKeys(value);
    }
}

async function ensureLoggedInAndOpenProfile(driver) {
    await loginPatient(driver);
    await goToPatientProfile(driver);
}

describe('Edit Profile Pasien', function () {
    let driver;

    this.timeout(90000);

    before(async function () {
        driver = await createDriver();
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    describe('TS.PRF.001 — Akses Halaman Profil Pasien', function () {
        it('TC.PRF.001.001 — Berhasil membuka halaman profil pasien', async function () {
            await ensureLoggedInAndOpenProfile(driver);

            const heading = await driver.findElement(By.xpath("//h3[contains(text(), 'Data Profil Pasien')]"));
            expect(await heading.isDisplayed()).to.be.true;

            const emailInput = await driver.findElement(By.id('email'));
            expect(await emailInput.getAttribute('disabled')).to.not.be.null;

            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.include('/patient/settings/profile');
        });
    });

    describe('TS.PRF.002 — Update Informasi Dasar', function () {
        it('TC.PRF.002.001 — Berhasil mengupdate nama dan nomor telepon', async function () {
            await ensureLoggedInAndOpenProfile(driver);

            const newName = `Test Pasien ${Date.now()}`;
            const newPhone = `0812${String(Date.now()).slice(-9)}`;

            await clearAndFillInput(driver, 'name', newName);
            await clearAndFillInput(driver, 'phone', newPhone);
            await clickSave(driver);

            await waitForStatusMessage(driver, 'Profil Anda berhasil diperbarui.');

            const nameInput = await driver.findElement(By.id('name'));
            const phoneInput = await driver.findElement(By.id('phone'));
            expect(await nameInput.getAttribute('value')).to.equal(newName);
            expect(await phoneInput.getAttribute('value')).to.equal(newPhone);
        });

        it('TC.PRF.002.002 — Berhasil mengupdate data pasien (tanggal lahir, jenis kelamin, golongan darah, alamat)', async function () {
            await ensureLoggedInAndOpenProfile(driver);

            const newAddress = `Jl. Selenium Test No. ${String(Date.now()).slice(-3)}`;
            await setDateValue(driver, 'dob', '1990-12-31');
            await setSelectOption(driver, 'Jenis Kelamin', 'Perempuan');
            await setSelectOption(driver, 'Golongan Darah', 'AB');
            await clearAndFillInput(driver, 'address', newAddress);
            await clickSave(driver);

            await waitForStatusMessage(driver, 'Profil Anda berhasil diperbarui.');

            const dobInput = await driver.findElement(By.id('dob'));
            expect(await dobInput.getAttribute('value')).to.equal('1990-12-31');

            const genderSelect = await driver.findElement(By.xpath("//label[contains(normalize-space(.), 'Jenis Kelamin')]/following::select[1]"));
            expect(await genderSelect.getAttribute('value')).to.equal('wanita');

            const bloodTypeSelect = await driver.findElement(By.xpath("//label[contains(normalize-space(.), 'Golongan Darah')]/following::select[1]"));
            expect(await bloodTypeSelect.getAttribute('value')).to.equal('AB');

            const addressTextarea = await driver.findElement(By.id('address'));
            expect(await addressTextarea.getAttribute('value')).to.equal(newAddress);
        });
    });

    describe('TS.PRF.003 — Foto Profil', function () {
        it('TC.PRF.003.001 — Berhasil upload foto profil', async function () {
            await ensureLoggedInAndOpenProfile(driver);

            await uploadProfilePhoto(driver, PROFILE_PHOTO_PATH);
            await clickSave(driver);

            await waitForStatusMessage(driver, 'Profil Anda berhasil diperbarui.');
            await goToPatientProfile(driver);

            const avatarImg = await driver.wait(
                until.elementLocated(By.xpath("//div[contains(@class, 'relative') and contains(@class, 'w-32') and contains(@class, 'h-32')]//img")),
                5000,
            );
            expect(await avatarImg.isDisplayed()).to.be.true;
            expect(await avatarImg.getAttribute('src')).to.include('/storage/');
        });

        it('TC.PRF.003.002 — Berhasil hapus foto profil', async function () {
            await ensureLoggedInAndOpenProfile(driver);

            let avatarImages = await driver.findElements(By.xpath("//div[contains(@class, 'relative') and contains(@class, 'w-32') and contains(@class, 'h-32')]//img"));
            if (avatarImages.length === 0) {
                await uploadProfilePhoto(driver, PROFILE_PHOTO_PATH);
                await clickSave(driver);
                await waitForStatusMessage(driver, 'Profil Anda berhasil diperbarui.');
                await goToPatientProfile(driver);
                avatarImages = await driver.findElements(By.xpath("//div[contains(@class, 'relative') and contains(@class, 'w-32') and contains(@class, 'h-32')]//img"));
            }

            const removeBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Hapus Foto Profil')]") );
            await removeBtn.click();

            await waitForStatusMessage(driver, 'Foto profil berhasil dihapus.');

            const remainingImages = await driver.findElements(By.xpath("//div[contains(@class, 'relative') and contains(@class, 'w-32') and contains(@class, 'h-32')]//img"));
            expect(remainingImages.length).to.equal(0);
        });
    });

    describe('TS.PRF.004 — Ganti Kata Sandi', function () {
        it('TC.PRF.004.001 — Berhasil ganti password', async function () {
            const tempPassword = `Password.${Date.now()}a`;

            await loginPatient(driver);
            await goToPatientProfile(driver);

            await clearAndFillInput(driver, 'password', tempPassword);
            await clearAndFillInput(driver, 'password_confirmation', tempPassword);
            await clickSave(driver);

            await waitForStatusMessage(driver, 'Profil Anda berhasil diperbarui.');
            await driver.manage().deleteAllCookies();

            await loginPatient(driver, PATIENT_EMAIL, tempPassword);
            await goToPatientProfile(driver);

            await clearAndFillInput(driver, 'password', PATIENT_PASSWORD);
            await clearAndFillInput(driver, 'password_confirmation', PATIENT_PASSWORD);
            await clickSave(driver);

            await waitForStatusMessage(driver, 'Profil Anda berhasil diperbarui.');
        });
    });

    describe('TS.PRF.005 — Validasi Field dan Email Read-Only', function () {
        it('TC.PRF.005.001 — Validasi field yang required', async function () {
            await ensureLoggedInAndOpenProfile(driver);

            const nameInput = await driver.findElement(By.id('name'));
            await nameInput.click();
            await nameInput.sendKeys(Key.CONTROL + 'a');
            await nameInput.sendKeys(Key.DELETE);

            const phoneInput = await driver.findElement(By.id('phone'));
            await phoneInput.click();
            await phoneInput.sendKeys(Key.CONTROL + 'a');
            await phoneInput.sendKeys(Key.DELETE);

            await driver.executeScript(`
                const input = document.getElementById('dob');
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                nativeInputValueSetter.call(input, '');
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            `);
            await setSelectOption(driver, 'Jenis Kelamin', 'Pilih Jenis Kelamin');
            await setSelectOption(driver, 'Golongan Darah', 'Pilih Golongan Darah');
            const addressInput = await driver.findElement(By.id('address'));
            await addressInput.click();
            await addressInput.sendKeys(Key.CONTROL + 'a');
            await addressInput.sendKeys(Key.DELETE);
            await clickSave(driver);

            const errorName = await driver.wait(
                until.elementLocated(By.xpath("//p[contains(text(), 'Nama lengkap harus diisi.')][1]")),
                5000,
            );
            expect(await errorName.isDisplayed()).to.be.true;

            const errorDob = await driver.findElement(By.xpath("//p[contains(text(), 'Tanggal lahir harus diisi.')][1]"));
            expect(await errorDob.isDisplayed()).to.be.true;

            const errorGender = await driver.findElement(By.xpath("//p[contains(text(), 'Jenis kelamin harus dipilih.')][1]"));
            expect(await errorGender.isDisplayed()).to.be.true;

            const errorBloodType = await driver.findElement(By.xpath("//p[contains(text(), 'Golongan darah harus dipilih.')][1]"));
            expect(await errorBloodType.isDisplayed()).to.be.true;

            const errorAddress = await driver.findElement(By.xpath("//p[contains(text(), 'Alamat lengkap harus diisi.')][1]"));
            expect(await errorAddress.isDisplayed()).to.be.true;
        });

        it('TC.PRF.005.002 — Email tidak bisa diubah (read-only)', async function () {
            await ensureLoggedInAndOpenProfile(driver);

            const emailInput = await driver.findElement(By.xpath("//input[@id='email' or @name='email']"));
            expect(await emailInput.getAttribute('disabled')).to.not.be.null;
            expect(await emailInput.isEnabled()).to.be.false;
        });
    });
});
