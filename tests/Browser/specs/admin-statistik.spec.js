import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';
import { createDriver, BASE_URL } from '../setup.js';

// Helpers
async function loginAsAdmin(driver) {
    // Helper untuk login sebagai admin, 
    // Sesuaikan URL dan elemen input dengan halaman login di aplikasi Anda.
    await driver.get(`${BASE_URL}/login`);
    
    try {
        const emailField = await driver.wait(until.elementLocated(By.id('email')), 3000);
        await emailField.sendKeys('admin@gmail.com'); 
        await driver.findElement(By.id('password')).sendKeys('Password123@');
        
        const loginBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Masuk') or @type='submit']"));
        await loginBtn.click();
        
        // Tunggu hingga redirect ke dashboard selesai
        await driver.wait(until.urlContains('/dashboard'), 5000);
    } catch (e) {
        console.log('Form login tidak ditemukan atau bypass login aktif.');
    }
}

describe('Admin Statistik Dashboard', function () {
    let driver;

    this.timeout(60000);

    before(async function () {
        driver = await createDriver();
        // Login sebagai admin sebelum menjalankan test suite
        await loginAsAdmin(driver);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    describe('TS.STAT.001 — Modul Statistik Dashboard', function () {
        
        beforeEach(async function () {
            // Pastikan berada di halaman dashboard admin untuk setiap test case
            // Sesuaikan URL jika routing dashboard admin berbeda
            await driver.get(`${BASE_URL}/admin/dashboard`);
            await driver.sleep(1000); // Tunggu proses render halaman React/Inertia
        });

        it('TC.STAT.001.001 — Memuat Halaman Dashboard -> Halaman berhasil dimuat dengan judul "Laporan & Analitik"', async function () {
            const pageTitle = await driver.wait(
                until.elementLocated(By.xpath("//*[contains(text(), 'Laporan & Analitik')]")), 
                5000
            );
            expect(await pageTitle.isDisplayed()).to.be.true;
        });

        it('TC.STAT.001.002 — Validasi Kartu Ringkasan -> Muncul 4 kartu metrik utama (Total Janji Temu, Pasien Baru, Kunjungan Selesai, Batal & Absen)', async function () {
            const cardJanjiTemu = await driver.findElement(By.xpath("//p[contains(text(), 'Total Janji Temu')]"));
            expect(await cardJanjiTemu.isDisplayed()).to.be.true;

            const cardPasienBaru = await driver.findElement(By.xpath("//p[contains(text(), 'Pasien Baru')]"));
            expect(await cardPasienBaru.isDisplayed()).to.be.true;

            const cardSelesai = await driver.findElement(By.xpath("//p[contains(text(), 'Kunjungan Selesai')]"));
            expect(await cardSelesai.isDisplayed()).to.be.true;

            const cardBatal = await driver.findElement(By.xpath("//p[contains(text(), 'Batal & Absen')]"));
            expect(await cardBatal.isDisplayed()).to.be.true;
        });

        it('TC.STAT.001.003 — Validasi Grafik Statistik Kunjungan -> Grafik dirender dengan benar', async function () {
            const chartTitle = await driver.findElement(By.xpath("//*[contains(text(), 'Statistik Kunjungan')]"));
            expect(await chartTitle.isDisplayed()).to.be.true;

            // Validasi keberadaan kontainer grafik Recharts
            const chartContainer = await driver.findElement(By.css('.recharts-responsive-container'));
            expect(await chartContainer.isDisplayed()).to.be.true;
            
            // Validasi legenda chart
            const legendPasienBaru = await driver.findElement(By.xpath("//span[contains(text(), 'Pasien Baru')]"));
            expect(await legendPasienBaru.isDisplayed()).to.be.true;
            
            const legendPasienLama = await driver.findElement(By.xpath("//span[contains(text(), 'Pasien Lama')]"));
            expect(await legendPasienLama.isDisplayed()).to.be.true;
        });

        it('TC.STAT.001.004 — Validasi Daftar Trafik Poli Favorit -> Menampilkan daftar poli peringkat teratas', async function () {
            const poliTitle = await driver.findElement(By.xpath("//*[contains(text(), 'Trafik Poli Favorit')]"));
            expect(await poliTitle.isDisplayed()).to.be.true;

            // Validasi badge
            const badgeBulanIni = await driver.findElement(By.xpath("//div[contains(text(), 'Bulan Ini')]"));
            expect(await badgeBulanIni.isDisplayed()).to.be.true;
        });

        it('TC.STAT.001.005 — Validasi Daftar Performa Dokter -> Menampilkan informasi dokter dengan performa tertinggi', async function () {
            const doctorTitle = await driver.findElement(By.xpath("//*[contains(text(), 'Performa Dokter')]"));
            expect(await doctorTitle.isDisplayed()).to.be.true;

            // Validasi badge
            const badgeTertinggi = await driver.findElement(By.xpath("//div[contains(text(), 'Tertinggi')]"));
            expect(await badgeTertinggi.isDisplayed()).to.be.true;
        });
    });
});
