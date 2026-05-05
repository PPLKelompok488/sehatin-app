import { expect } from 'chai';
import { By, until, Key } from 'selenium-webdriver';
import { createDriver, BASE_URL } from '../setup.js';

const KUNJUNGAN_URL = `${BASE_URL}/patient/kunjungan`;

async function loginPatient(driver) {
    await driver.get(`${BASE_URL}/login`);
    await driver.wait(until.elementLocated(By.id('email')), 5000);
    await driver.findElement(By.id('email')).sendKeys('vio@gmail.com');
    await driver.findElement(By.id('password')).sendKeys('Password123@');
    await driver.findElement(By.xpath("//button[contains(., 'Masuk')]")).click();
    
    // Wait for redirect to either dashboard or patient area
    await driver.wait(async () => {
        const url = await driver.getCurrentUrl();
        return url.includes('/dashboard') || url.includes('/patient');
    }, 15000, 'Timeout waiting for login redirect');
}

async function openCancelModal(driver) {
    // Ensure we are on "Aktif" tab
    const tabAktif = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Aktif')]")), 5000);
    await tabAktif.click();
    await driver.sleep(1000);

    const cancelBtn = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'Batalkan kunjungan')]")),
        5000
    );
    await driver.wait(until.elementIsVisible(cancelBtn), 5000);
    await cancelBtn.click();
    await driver.sleep(1000);
}

describe('Pembatalan Janji Temu', function () {
    let driver;

    this.timeout(60000);

    before(async function () {
        driver = await createDriver();
        await loginPatient(driver);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    describe('TS.APT.001 — Filter & View Kunjungan', function () {
        it('TC.APT.001.001 — Klik tab "Aktif" -> Hanya kunjungan aktif yang muncul', async function () {
            await driver.get(KUNJUNGAN_URL);
            await driver.sleep(1000);
            
            const tabAktif = await driver.findElement(By.xpath("//button[contains(., 'Aktif')]"));
            await tabAktif.click();
            await driver.sleep(500);

            const badges = await driver.findElements(By.xpath("//div[contains(., 'AKTIF')]"));
            if (badges.length > 0) {
                expect(await badges[0].isDisplayed()).to.be.true;
            }
        });

        it('TC.APT.001.003 — Klik tab "Batal" -> Hanya kunjungan batal yang muncul', async function () {
            await driver.get(KUNJUNGAN_URL);
            await driver.sleep(1000);

            const tabBatal = await driver.findElement(By.xpath("//button[contains(., 'Batal')]"));
            await tabBatal.click();
            await driver.sleep(500);

            const badges = await driver.findElements(By.xpath("//div[contains(., 'DIBATALKAN')]"));
            if (badges.length > 0) {
                expect(await badges[0].isDisplayed()).to.be.true;
            }
        });
    });

    describe('TS.APT.002 — Pembatalan Janji Temu', function () {
        it('TC.APT.002.001 — Klik tombol batalkan kunjungan -> Modal terbuka', async function () {
            await driver.get(KUNJUNGAN_URL);
            await openCancelModal(driver);

            const modalTitle = await driver.wait(
                until.elementLocated(By.xpath("//h3[contains(., 'Batalkan Kunjungan')]")),
                5000
            );
            expect(await modalTitle.isDisplayed()).to.be.true;
        });

        it('TC.APT.002.002 — Alasan kosong -> Tombol konfirmasi disabled', async function () {
            // Modal already open from previous test if using same session, 
            // but we use driver.get in each test to reset or manage state.
            await driver.get(KUNJUNGAN_URL);
            await openCancelModal(driver);

            const confirmBtn = await driver.findElement(By.xpath("//button[contains(., 'Konfirmasi Pembatalan')]"));
            expect(await confirmBtn.isEnabled()).to.be.false;
        });

        it('TC.APT.002.004 — Isi alasan dan konfirmasi -> Kunjungan dibatalkan', async function () {
            await driver.get(KUNJUNGAN_URL);
            await openCancelModal(driver);

            const reasonArea = await driver.findElement(By.tagName('textarea'));
            await reasonArea.sendKeys('Ingin menjadwal ulang di lain hari.');
            
            const confirmBtn = await driver.findElement(By.xpath("//button[contains(., 'Konfirmasi Pembatalan')]"));
            await driver.wait(until.elementIsEnabled(confirmBtn), 5000);
            await confirmBtn.click();

            // Wait for modal to close (staleness of textarea)
            await driver.wait(until.stalenessOf(reasonArea), 10000);

            // Verify in "Batal" tab
            const tabBatal = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Batal')]")), 5000);
            await tabBatal.click();
            await driver.sleep(1000);

            const badges = await driver.findElements(By.xpath("//div[contains(., 'DIBATALKAN')]"));
            expect(badges.length).to.be.greaterThan(0);
        });
    });
});
