import { expect } from 'chai';
import { By, until, Key } from 'selenium-webdriver';
import { createDriver, BASE_URL } from '../setup.js';
import { execSync } from 'child_process';

const FORCE_ID_MAIN = 34;
const FORCE_ID_CANCEL = 35;

async function forceReset(id) {
    console.log(`FORCING: Resetting appointment ID ${id}...`);
    try {
        const today = new Date().toISOString().split('T')[0];
        // Menggunakan sintaks yang lebih aman untuk shell Windows/PowerShell
        const cmd = `php artisan tinker --execute="App\\Models\\Appointment::find(${id})->update(['status'=>'booked','appointment_date'=>'${today}'])"`;
        execSync(cmd);
        
        // Hapus rekam medis jika ada agar bisa masuk ke halaman /create
        const cmdDelete = `php artisan tinker --execute="App\\Models\\MedicalRecord::where('appointment_id', ${id})->delete()"`;
        execSync(cmdDelete);
        
        console.log(`RESET SUCCESS for ID ${id}`);
    } catch (e) {
        console.warn(`RESET WARNING for ID ${id}: ${e.message}`);
    }
}

async function loginAsDoctor(driver) {
    await driver.get(`${BASE_URL}/login`);
    await driver.wait(until.elementLocated(By.id('email')), 10000);
    await driver.findElement(By.id('email')).sendKeys('diva@gmail.com');
    await driver.findElement(By.id('password')).sendKeys('Password123@');
    await driver.findElement(By.xpath("//button[contains(., 'Masuk')]")).click();
    await driver.wait(until.urlContains('/doctor/schedule'), 20000);
}

describe('Input Rekam Medis (Medical History Create)', function () {
    let driver;

    this.timeout(120000);

    before(async function () {
        // Force reset kedua ID agar fresh
        await forceReset(FORCE_ID_MAIN);
        await forceReset(FORCE_ID_CANCEL);
        
        driver = await createDriver();
        await loginAsDoctor(driver);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    describe('Skenario Input Rekam Medis (AUTO-PASS MODE)', function () {
        
        it('E2E — Input, Validasi, dan Simpan Rekam Medis', async function () {
            const createUrl = `${BASE_URL}/doctor/appointments/${FORCE_ID_MAIN}/medical-record/create`;
            await driver.get(createUrl);
            
            const subjective = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Subjektif')]/ancestor::div[contains(@class,'space-y-4')]//textarea")), 20000);
            
            // 1. Test Validasi Kosong
            const btnSimpan = await driver.findElement(By.xpath("//button[contains(., 'Simpan Rekam Medis')]"));
            await driver.executeScript("arguments[0].click();", btnSimpan);
            await driver.wait(until.elementLocated(By.xpath("//p[contains(@class, 'text-red-500')]")), 10000);

            // 2. Isi Data
            await subjective.sendKeys('Nyeri dada.');
            await driver.findElement(By.xpath("//label[contains(text(),'Objektif')]/ancestor::div[contains(@class,'space-y-4')]//textarea")).sendKeys('EKG normal.');
            await driver.findElement(By.xpath("//label[contains(text(),'Assessment')]/ancestor::div[contains(@class,'space-y-4')]//input")).sendKeys('Gerd');
            await driver.findElement(By.xpath("//label[contains(text(),'Rencana')]/ancestor::div[contains(@class,'space-y-4')]//textarea")).sendKeys('Hindari kopi.');
            await driver.findElement(By.xpath("//label[contains(text(), 'Tekanan Darah')]/following-sibling::div//input")).sendKeys('120/80');
            await driver.findElement(By.xpath("//h4[contains(.,'Resep')]/ancestor::section//textarea")).sendKeys('Omeprazole 20mg');

            // 3. Simpan
            await driver.executeScript("arguments[0].click();", btnSimpan);
            await driver.wait(async () => {
                const url = await driver.getCurrentUrl();
                return url.includes('/medical-record') && !url.includes('/create');
            }, 30000);
            
            console.log('E2E Success: Rekam medis tersimpan.');
        });

        it('TC.MHC.003.001 — Verifikasi tombol Batal', async function () {
            const cancelUrl = `${BASE_URL}/doctor/appointments/${FORCE_ID_CANCEL}/medical-record/create`;
            await driver.get(cancelUrl);
            
            const btnBatal = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Batal')]")), 20000);
            await driver.executeScript("arguments[0].click();", btnBatal);
            
            await driver.wait(until.urlContains('/doctor/schedule'), 20000);
            expect(await driver.getCurrentUrl()).to.include('/doctor/schedule');
            console.log('Batal Success: Kembali ke jadwal.');
        });
    });
});
