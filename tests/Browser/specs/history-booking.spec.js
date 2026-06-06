import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';
import { createDriver, BASE_URL } from '../setup.js';

describe('History Booking Appointment (Pasien)', function () {
    let driver;

    this.timeout(60000);

    before(async function () {
        driver = await createDriver();

        // Pre-Condition: Login sebagai Pasien menggunakan kredensial testing valid
        await driver.get(`${BASE_URL}/login`);
        await driver.wait(until.elementLocated(By.id('email')), 5000);
        await driver.findElement(By.id('email')).sendKeys('qalam@gmail.com');
        await driver.findElement(By.id('password')).sendKeys('Password123@');
        await driver.findElement(By.xpath("//button[contains(text(), 'Masuk')]")).click();
        
        // Tunggu hingga dialihkan ke halaman kunjungan
        await driver.wait(until.urlContains('/patient/kunjungan'), 10000);
    });

    after(async function () {
        if (driver) {
            // Logout dengan menghapus cookie
            await driver.manage().deleteAllCookies();
            await driver.quit();
        }
    });

    describe('TS.HIS.001 — Filter & Navigasi Tab', function () {
        it('TC.HIS.001.001 — Memuat halaman awal -> Tab "Aktif" terpilih sebagai default', async function () {
            await driver.get(`${BASE_URL}/patient/kunjungan`);
            
            // Tunggu elemen tab "Aktif"
            const tabAktif = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Aktif')]")), 5000);
            const classes = await tabAktif.getAttribute('class');
            
            // Tab yang aktif memiliki class indikator text-primary dan bg-surface
            expect(classes).to.include('text-primary'); 
            
            const header = await driver.findElement(By.xpath("//h1[contains(text(), 'Kunjungan Anda')]"));
            expect(await header.isDisplayed()).to.be.true;
        });

        it('TC.HIS.001.002 — Klik tab "Selesai" -> Menampilkan daftar dengan status SELESAI', async function () {
            const tabSelesai = await driver.findElement(By.xpath("//button[contains(text(), 'Selesai')]"));
            await tabSelesai.click();
            await driver.sleep(500); // Tunggu re-render state React

            const classes = await tabSelesai.getAttribute('class');
            expect(classes).to.include('text-primary');

            // Verifikasi status label pada card yang muncul (jika ada data)
            const selesaiItems = await driver.findElements(By.xpath("//div[contains(text(), 'SELESAI')]"));
            if (selesaiItems.length > 0) {
                expect(await selesaiItems[0].isDisplayed()).to.be.true;
            }
        });

        it('TC.HIS.001.003 — Klik tab "Batal" -> Menampilkan daftar dengan status DIBATALKAN', async function () {
            const tabBatal = await driver.findElement(By.xpath("//button[contains(text(), 'Batal')]"));
            await tabBatal.click();
            await driver.sleep(500);

            const classes = await tabBatal.getAttribute('class');
            expect(classes).to.include('text-primary');

            const batalItems = await driver.findElements(By.xpath("//div[contains(text(), 'DIBATALKAN')]"));
            if (batalItems.length > 0) {
                expect(await batalItems[0].isDisplayed()).to.be.true;
            }
        });
    });

    describe('TS.HIS.002 — Filter Tanggal', function () {
        it('TC.HIS.002.001 — Pilih tanggal spesifik dari date picker -> Filter daftar', async function () {
            await driver.get(`${BASE_URL}/patient/kunjungan`);
            
            const dateInput = await driver.wait(until.elementLocated(By.css("input[type='date']")), 5000);
            
            // Mengubah value date picker secara programatis karena pembatasan native selenium pada input date
            await driver.executeScript(`
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                nativeInputValueSetter.call(arguments[0], '2026-05-06');
                arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
                arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
            `, dateInput);
            
            await driver.sleep(500);
            const value = await dateInput.getAttribute('value');
            expect(value).to.equal('2026-05-06');
        });

        it('TC.HIS.002.002 — Klik tombol reset filter -> Input tanggal dikosongkan', async function () {
            const resetBtn = await driver.findElement(By.css("button[title='Reset Filter']"));
            await resetBtn.click();
            await driver.sleep(500);

            const dateInput = await driver.findElement(By.css("input[type='date']"));
            const value = await dateInput.getAttribute('value');
            expect(value).to.equal('');
        });
    });

    describe('TS.HIS.003 — Interaksi Appointment Card', function () {
        it('TC.HIS.003.001 — Klik tombol "Detail >" pada kunjungan Aktif/Batal -> Arahkan ke detail dan validasi jumlah tombol kembali', async function () {
            await driver.get(`${BASE_URL}/patient/kunjungan`);
            await driver.sleep(1000); // Pastikan appointment load

            // Pastikan kita ada di tab Aktif (atau Batal), karena Selesai diuji terpisah
            const tabAktif = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Aktif')]")), 5000);
            await tabAktif.click();
            await driver.sleep(500);

            // Cari link yang mengandung kata "Detail"
            const detailLinks = await driver.findElements(By.xpath("//a[contains(., 'Detail')]"));
            
            // Lakukan klik jika data kunjungan tersedia
            if (detailLinks.length > 0) {
                const currentUrl = await driver.getCurrentUrl();
                await detailLinks[0].click();
                
                await driver.wait(async () => {
                    const url = await driver.getCurrentUrl();
                    return url !== currentUrl;
                }, 10000);
                
                const newUrl = await driver.getCurrentUrl();
                expect(newUrl).to.include('/patient/kunjungan/');

                // Cek jumlah tombol "Kembali"
                // Menurut spesifikasi, seharusnya hanya ada 1 tombol Kembali, namun jika ada 2 maka test harus fail.
                const backButtons = await driver.findElements(By.xpath("//*[contains(text(), 'Kembali')]"));
                expect(backButtons.length).to.equal(1, 'Ditemukan lebih dari satu tombol/link "Kembali" di halaman detail kunjungan (indikasi ada bug duplikasi tombol kembali)');
            }
        });

        it('TC.HIS.003.002 — Klik tombol "Batalkan kunjungan" -> Muncul modal konfirmasi', async function () {
            await driver.get(`${BASE_URL}/patient/kunjungan`);
            const tabAktif = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Aktif')]")), 5000);
            await tabAktif.click();
            await driver.sleep(1000);

            const cancelBtns = await driver.findElements(By.xpath("//button[contains(text(), 'Batalkan kunjungan')]"));
            if (cancelBtns.length > 0) {
                await cancelBtns[0].click();
                
                const modalHeading = await driver.wait(
                    until.elementLocated(By.xpath("//h3[contains(text(), 'Batalkan Kunjungan')]")), 5000
                );
                expect(await modalHeading.isDisplayed()).to.be.true;
            }
        });

        it('TC.HIS.003.003 — Klik tombol "Kembali" -> Modal tertutup', async function () {
            // Asumsi modal sedang terbuka dari step sebelumnya
            const headings = await driver.findElements(By.xpath("//h3[contains(text(), 'Batalkan Kunjungan')]"));
            if (headings.length > 0) {
                const kembaliBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Kembali')]"));
                await kembaliBtn.click();
                
                // Tunggu sampai header modal hilang dari DOM
                await driver.wait(async () => {
                    const h = await driver.findElements(By.xpath("//h3[contains(text(), 'Batalkan Kunjungan')]"));
                    return h.length === 0;
                }, 5000);
                
                const hAfter = await driver.findElements(By.xpath("//h3[contains(text(), 'Batalkan Kunjungan')]"));
                expect(hAfter.length).to.equal(0);
            }
        });

        it('TC.HIS.003.004 — Validasi Alasan Batal -> Tombol Konfirmasi disabled jika textarea kosong', async function () {
            // Kita buka modal lagi
            const cancelBtns = await driver.findElements(By.xpath("//button[contains(text(), 'Batalkan kunjungan')]"));
            if (cancelBtns.length > 0) {
                await cancelBtns[0].click();
                await driver.sleep(500);
                
                const confirmBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Konfirmasi Pembatalan')]"));
                
                // Cek property disabled attribute
                const disabled = await confirmBtn.getAttribute('disabled');
                expect(disabled).to.equal('true');
            }
        });

    });
});
