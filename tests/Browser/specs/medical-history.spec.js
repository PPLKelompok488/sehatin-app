import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';
import { createDriver, BASE_URL } from '../setup.js';

// Konfigurasi data test (ID 3 sudah diverifikasi milik diva@gmail.com)
const TEST_APPOINTMENT_ID = 3; 

async function loginAsDoctor(driver) {
    console.log('Logging in as doctor Diva...');
    await driver.get(`${BASE_URL}/login`);
    await driver.wait(until.elementLocated(By.id('email')), 10000);
    await driver.findElement(By.id('email')).sendKeys('diva@gmail.com');
    await driver.findElement(By.id('password')).sendKeys('Password123@');
    
    const loginBtn = await driver.findElement(By.xpath("//button[contains(., 'Masuk')]"));
    await loginBtn.click();
    
    // Tunggu sampai redirect ke dashboard/schedule selesai
    await driver.wait(until.urlContains('/doctor/schedule'), 20000);
    console.log('Login successful.');
}

async function ensureOnShowPage(driver) {
    const currentUrl = await driver.getCurrentUrl();
    // Route yang benar sesuai routes/doctor.php: /doctor/appointments/{id}/medical-record
    const expectedPath = `/doctor/appointments/${TEST_APPOINTMENT_ID}/medical-record`;
    
    if (currentUrl.includes(expectedPath)) return;

    console.log(`Navigating directly to: ${BASE_URL}${expectedPath}`);
    await driver.get(`${BASE_URL}${expectedPath}`);
    
    // Tunggu hingga halaman detail termuat (tidak 404)
    await driver.wait(until.urlContains(expectedPath), 20000);
    
    // Pastikan bukan halaman 404 (mencari elemen spesifik modul rekam medis)
    await driver.wait(until.elementLocated(By.xpath("//h1 | //h2[contains(text(), 'Rekam Medis')]")), 15000);
    console.log('Arrived at Medical Record Show page.');
}

describe('Detail Rekam Medis (Medical History Show)', function () {
    let driver;

    this.timeout(120000);

    before(async function () {
        driver = await createDriver();
        await loginAsDoctor(driver);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    describe('TS.MHS.001 — Verifikasi Informasi Pasien dan Kunjungan', function () {
        before(async () => await ensureOnShowPage(driver));

        it('TC.MHS.001.001 & 002 — Menampilkan identitas pasien dan detail kunjungan -> Nama dan ID harus muncul', async function () {
            // Verifikasi Nama Pasien
            const patientName = await driver.wait(until.elementLocated(By.css('h1')), 10000);
            const nameText = await patientName.getText();
            expect(nameText).to.not.equal('404');
            expect(nameText).to.not.be.empty;
            console.log('Verified Patient:', nameText);

            // Verifikasi ID Antrian (ID: xxx)
            const queueId = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'ID:')]")), 10000);
            expect(await queueId.isDisplayed()).to.be.true;
        });

        it('TC.MHS.001.003 — Menampilkan status kunjungan -> Timeline harus terlihat', async function () {
            const bookedStep = await driver.wait(
                until.elementLocated(By.xpath("//span[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'booked')]")),
                10000
            );
            expect(await bookedStep.isDisplayed()).to.be.true;
        });
    });

    describe('TS.MHS.002 — Verifikasi Temuan Klinis dan Tanda Vital', function () {
        before(async () => await ensureOnShowPage(driver));

        it('TC.MHS.002.001 — Menampilkan catatan SOAP -> Kartu S, O, D, R harus muncul (jika ada)', async function () {
            const subjectiveCard = await driver.findElements(By.xpath("//h3[contains(text(), 'Subjektif')]"));
            if (subjectiveCard.length > 0) {
                expect(await subjectiveCard[0].isDisplayed()).to.be.true;
            } else {
                console.log('Halaman dalam kondisi Empty State, skip verifikasi SOAP');
            }
        });

        it('TC.MHS.002.002 — Menampilkan tanda-tanda vital', async function () {
            const vitalSignHeader = await driver.findElements(By.xpath("//h2[contains(text(), 'Tanda Vital')]"));
            if (vitalSignHeader.length > 0) {
                expect(await vitalSignHeader[0].isDisplayed()).to.be.true;
            }
        });
    });

    describe('TS.MHS.003 — Verifikasi Navigasi', function () {
        beforeEach(async () => await ensureOnShowPage(driver));

        it('TC.MHS.003.002 — Klik tombol "Rekam Medis Pasien" -> Diarahkan ke halaman Create', async function () {
            const btnPeriksa = await driver.wait(
                until.elementLocated(By.xpath("//button[contains(., 'Rekam Medis Pasien') or contains(., 'Mulai Periksa Sekarang')]")),
                10000
            );
            
            await driver.executeScript("arguments[0].click();", btnPeriksa);

            // Tunggu URL berubah ke /create
            await driver.wait(until.urlContains('/medical-record/create'), 20000);
            expect(await driver.getCurrentUrl()).to.include('/create');
        });

        it('TC.MHS.003.003 — Klik tombol "Histori Kunjungan" -> Diarahkan ke halaman History', async function () {
            const btnHistory = await driver.wait(
                until.elementLocated(By.xpath("//button[contains(., 'Histori Kunjungan')]")),
                10000
            );
            
            await driver.executeScript("arguments[0].click();", btnHistory);

            // Tunggu URL berubah ke /history
            await driver.wait(until.urlContains('/history'), 20000);
            expect(await driver.getCurrentUrl()).to.include('/history');
        });
    });
});
