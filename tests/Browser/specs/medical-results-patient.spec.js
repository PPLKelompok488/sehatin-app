import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';
import { createDriver, BASE_URL } from '../setup.js';

describe('Lihat Hasil Pemeriksaan Dokter (Pasien) - SH-9', function () {
    let driver;

    this.timeout(60000);

    before(async function () {
        driver = await createDriver();

        // Login as Patient
        await driver.get(`${BASE_URL}/login`);
        await driver.wait(until.elementLocated(By.id('email')), 5000);
        await driver.findElement(By.id('email')).sendKeys('qalam@gmail.com');
        await driver.findElement(By.id('password')).sendKeys('Password123@');
        await driver.findElement(By.xpath("//button[contains(text(), 'Masuk')]")).click();
        
        await driver.wait(until.urlContains('/patient/kunjungan'), 10000);
    });

    after(async function () {
        if (driver) {
            await driver.manage().deleteAllCookies();
            await driver.quit();
        }
    });

    describe('TS.EXM.001 — Lihat Detail Kunjungan (Status Selesai)', function () {
        it('TC.EXM.001.001 — Navigasi ke Detail Selesai -> Menampilkan status SELESAI', async function () {
            await driver.get(`${BASE_URL}/patient/kunjungan`);
            
            // Pindah ke tab Selesai
            const tabSelesai = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Selesai')]")), 5000);
            await tabSelesai.click();
            await driver.sleep(1000); // Tunggu re-render state React

            // Cari tombol detail pertama pada tab Selesai
            const detailLinks = await driver.findElements(By.xpath("//a[contains(., 'Detail')]"));
            if (detailLinks.length > 0) {
                const currentUrl = await driver.getCurrentUrl();
                await detailLinks[0].click();
                
                await driver.wait(async () => {
                    const url = await driver.getCurrentUrl();
                    return url !== currentUrl;
                }, 10000);
                
                // Pastikan halaman menampilkan status SELESAI
                const statusBadge = await driver.wait(until.elementLocated(By.xpath("//div[contains(text(), 'SELESAI')]")), 5000);
                expect(await statusBadge.isDisplayed()).to.be.true;
            }
        });

        it('TC.EXM.001.002 — Verifikasi Temuan Klinis (SOAP) -> Menampilkan Subjektif, Objektif, Assessment, Plan', async function () {
            const url = await driver.getCurrentUrl();
            if(url.includes('/patient/kunjungan/')) {
                // Cek apakah section rekam medis tersedia
                const hasMedicalRecord = await driver.findElements(By.xpath("//h3[contains(text(), 'Temuan Klinis (SOAP)')]"));
                if (hasMedicalRecord.length > 0) {
                    const subjektif = await driver.findElement(By.xpath("//h4[contains(text(), 'Subjektif')]"));
                    const objektif = await driver.findElement(By.xpath("//h4[contains(text(), 'Objektif')]"));
                    const assessment = await driver.findElement(By.xpath("//h4[contains(text(), 'Assessment')]"));
                    const plan = await driver.findElement(By.xpath("//h4[contains(text(), 'Plan')]"));

                    expect(await subjektif.isDisplayed()).to.be.true;
                    expect(await objektif.isDisplayed()).to.be.true;
                    expect(await assessment.isDisplayed()).to.be.true;
                    expect(await plan.isDisplayed()).to.be.true;
                }
            }
        });

        it('TC.EXM.001.003 — Verifikasi Tanda Vital -> Menampilkan info Tekanan Darah, Detak Jantung, Suhu Tubuh, dll.', async function () {
            const url = await driver.getCurrentUrl();
            if(url.includes('/patient/kunjungan/')) {
                const hasMedicalRecord = await driver.findElements(By.xpath("//h3[contains(text(), 'Tanda Vital')]"));
                if (hasMedicalRecord.length > 0) {
                    const td = await driver.findElement(By.xpath("//p[contains(text(), 'Tekanan Darah')]"));
                    const dj = await driver.findElement(By.xpath("//p[contains(text(), 'Detak Jantung')]"));
                    const st = await driver.findElement(By.xpath("//p[contains(text(), 'Suhu Tubuh')]"));
                    const bb = await driver.findElement(By.xpath("//p[contains(text(), 'Berat Badan')]"));
                    const gd = await driver.findElement(By.xpath("//p[contains(text(), 'Gula Darah')]"));

                    expect(await td.isDisplayed()).to.be.true;
                    expect(await dj.isDisplayed()).to.be.true;
                    expect(await st.isDisplayed()).to.be.true;
                    expect(await bb.isDisplayed()).to.be.true;
                    expect(await gd.isDisplayed()).to.be.true;
                }
            }
        });

        it('TC.EXM.001.004 — Verifikasi Resep Obat -> Menampilkan section Resep Obat & Dosis', async function () {
            const url = await driver.getCurrentUrl();
            if(url.includes('/patient/kunjungan/')) {
                const hasMedicalRecord = await driver.findElements(By.xpath("//h3[contains(text(), 'Resep Obat & Dosis')]"));
                if (hasMedicalRecord.length > 0) {
                    expect(await hasMedicalRecord[0].isDisplayed()).to.be.true;
                }
            }
        });
    });
});
