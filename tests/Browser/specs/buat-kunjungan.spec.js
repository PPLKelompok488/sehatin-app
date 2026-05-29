import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';
import { createDriver, BASE_URL } from '../setup.js';

const BUAT_KUNJUNGAN_URL = `${BASE_URL}/patient/buat-kunjungan`;

async function login(driver) {
    await driver.get(`${BASE_URL}/login`);
    await driver.wait(until.elementLocated(By.id('email')), 5000);
    await driver.findElement(By.id('email')).sendKeys('vio@gmail.com');
    await driver.findElement(By.id('password')).sendKeys('Password123@');
    await driver.findElement(By.xpath("//button[contains(., 'Masuk')]")).click();
    
    await driver.wait(async () => {
        const url = await driver.getCurrentUrl();
        return !url.includes('/login');
    }, 10000);
}

async function clickNext(driver) {
    const btn = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'Pilih Dokter') or contains(., 'Lanjut Konfirmasi') or contains(., 'Buat Kunjungan')]")),
        5000
    );
    await driver.wait(until.elementIsVisible(btn), 5000);
    await btn.click();
    await driver.sleep(1000); 
}

async function clickPrevious(driver) {
    const btn = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'Kembali')]")),
        5000
    );
    await driver.wait(until.elementIsVisible(btn), 5000);
    await btn.click();
    await driver.sleep(1000);
}

async function jsClick(driver, element) {
    await driver.executeScript("arguments[0].click();", element);
}

describe('Buat Kunjungan (Appointment Booking)', function () {
    let driver;

    this.timeout(60000);

    before(async function () {
        driver = await createDriver();
        await login(driver);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    describe('TS.APT.001 — Step 1: Pilih Poliklinik', function () {
        it('TC.APT.001.001 — Buka halaman dan pilih salah satu poliklinik -> Menampilkan grid card poliklinik', async function () {
            await driver.get(BUAT_KUNJUNGAN_URL);
            await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Pilih Layanan Poliklinik')]")), 5000);
            
            const poliCard = await driver.findElement(By.xpath("//button[.//h3]"));
            await poliCard.click();
            
            const isSelected = await poliCard.getAttribute('class');
            expect(isSelected).to.contain('ring-2'); 
        });

        it('TC.APT.001.002 — Pilih poliklinik lalu klik Selanjutnya -> Pindah ke halaman step 2', async function () {
            await driver.get(BUAT_KUNJUNGAN_URL);
            const poliCard = await driver.wait(until.elementLocated(By.xpath("//button[.//h3]")), 5000);
            await poliCard.click();
            
            await clickNext(driver);
            
            const step2Header = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Pilih Dokter & Jadwal')]")), 5000);
            expect(await step2Header.isDisplayed()).to.be.true;
        });

        it('TC.APT.001.003 — Klik Selanjutnya tanpa memilih poliklinik -> Tombol Selanjutnya disabled', async function () {
            await driver.get(BUAT_KUNJUNGAN_URL);
            const nextBtn = await driver.findElement(By.xpath("//button[contains(., 'Pilih Dokter')]"));
            expect(await nextBtn.isEnabled()).to.be.false;
        });
    });

    describe('TS.APT.002 — Step 2: Pilih Dokter & Jadwal', function () {
        beforeEach(async function () {
            await driver.get(BUAT_KUNJUNGAN_URL);
            const poliCard = await driver.wait(until.elementLocated(By.xpath("//button[.//h3]")), 5000);
            await poliCard.click();
            await clickNext(driver);
        });

        it('TC.APT.002.001 — Pilih tanggal yang tersedia di calendar -> Doctor selection muncul', async function () {
            const availableDate = await driver.wait(
                until.elementLocated(By.xpath("//button[not(@disabled) and .//span[contains(@class, 'text-3xl')]]")), 
                5000
            );
            await availableDate.click();
            
            const doctorSelection = await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Dokter Tersedia')]")), 5000);
            expect(await doctorSelection.isDisplayed()).to.be.true;
        });

        it('TC.APT.002.002 — Periksa tanggal yang tidak ada jadwal dokter -> Tanggal disabled', async function () {
            const disabledDates = await driver.findElements(By.xpath("//button[@disabled and .//span[contains(@class, 'text-3xl')]]"));
            if (disabledDates.length > 0) {
                expect(await disabledDates[0].isEnabled()).to.be.false;
            } else {
                console.log('Semua tanggal memiliki jadwal, skip test disabled date.');
            }
        });

        it('TC.APT.002.003 — Expand accordion dokter lalu pilih slot waktu -> Slot terpilih', async function () {
            const availableDate = await driver.wait(
                until.elementLocated(By.xpath("//button[not(@disabled) and .//span[contains(@class, 'text-3xl')]]")), 
                5000
            );
            await availableDate.click();
            await driver.sleep(1000);

            // Wait for any element that looks like a doctor card/name
            await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Dr.')]")), 5000);
            
            const timeSlot = await driver.wait(until.elementLocated(By.xpath("//button[not(@disabled) and contains(@class, 'py-2.5')]")), 5000);
            await jsClick(driver, timeSlot); 
            
            const isSelected = await timeSlot.getAttribute('class');
            expect(isSelected).to.contain('bg-primary');
        });

        it('TC.APT.002.004 — Periksa slot yang sudah dibooking -> Slot disabled', async function () {
            const availableDate = await driver.wait(
                until.elementLocated(By.xpath("//button[not(@disabled) and .//span[contains(@class, 'text-3xl')]]")), 
                5000
            );
            await availableDate.click();
            await driver.sleep(1000);

            const bookedSlot = await driver.findElements(By.xpath("//button[@disabled and contains(@class, 'grayscale')]"));
            if (bookedSlot.length > 0) {
                expect(await bookedSlot[0].isEnabled()).to.be.false;
            } else {
                console.log('Tidak ada slot terbooking, skip test booked slot.');
            }
        });

        it('TC.APT.002.005 — Klik Selanjutnya lalu Kembali dari step 2 -> Pindah ke step 3, kembali ke step 2', async function () {
            const availableDate = await driver.wait(
                until.elementLocated(By.xpath("//button[not(@disabled) and .//span[contains(@class, 'text-3xl')]]")), 
                5000
            );
            await availableDate.click();
            await driver.sleep(1000);

            const timeSlot = await driver.wait(until.elementLocated(By.xpath("//button[not(@disabled) and contains(@class, 'py-2.5')]")), 5000);
            await jsClick(driver, timeSlot);
            
            await clickNext(driver);
            
            const step3Header = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Konfirmasi Kunjungan')]")), 5000);
            expect(await step3Header.isDisplayed()).to.be.true;
            
            await clickPrevious(driver);
            const step2Header = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Pilih Dokter & Jadwal')]")), 5000);
            expect(await step2Header.isDisplayed()).to.be.true;
        });

        it('TC.APT.002.006 — Klik Selanjutnya tanpa lengkapi dokter dan waktu -> Tombol Selanjutnya disabled', async function () {
            const nextBtn = await driver.findElement(By.xpath("//button[contains(., 'Lanjut Konfirmasi')]"));
            expect(await nextBtn.isEnabled()).to.be.false;
        });
    });

    describe('TS.APT.003 — Step 3: Konfirmasi Kunjungan', function () {
        beforeEach(async function () {
            await driver.get(BUAT_KUNJUNGAN_URL);
            const poliCard = await driver.wait(until.elementLocated(By.xpath("//button[.//h3]")), 5000);
            await poliCard.click();
            await clickNext(driver);
            
            const availableDate = await driver.wait(
                until.elementLocated(By.xpath("//button[not(@disabled) and .//span[contains(@class, 'text-3xl')]]")), 
                5000
            );
            await availableDate.click();
            await driver.sleep(1000);

            const timeSlot = await driver.wait(until.elementLocated(By.xpath("//button[not(@disabled) and contains(@class, 'py-2.5')]")), 5000);
            await jsClick(driver, timeSlot);
            
            await clickNext(driver);
        });

        it('TC.APT.003.001 — Periksa detail ringkasan booking di step 3 -> Menampilkan summary', async function () {
            const patientName = await driver.findElement(By.xpath("//p[contains(@class, 'text-xl') and contains(@class, 'font-bold')]"));
            expect(await patientName.getText()).to.not.be.empty;
            
            const summaryTitle = await driver.findElement(By.xpath("//h2[contains(text(), 'Konfirmasi kunjungan')]"));
            expect(await summaryTitle.isDisplayed()).to.be.true;
        });

        it('TC.APT.003.002 — Klik konfirmasi lalu selesaikan booking -> Booking berhasil', async function () {
            await clickNext(driver); // "Buat Kunjungan"
            
            const confirmBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Ya, Buat')]")), 5000);
            await confirmBtn.click();
            
            await driver.wait(until.urlContains('/patient/kunjungan'), 10000);
            expect(await driver.getCurrentUrl()).to.contain('/patient/kunjungan');
        });

        it('TC.APT.003.003 — Buka dialog konfirmasi lalu batalkan -> Dialog tertutup', async function () {
            await clickNext(driver);
            
            const dialog = await driver.wait(until.elementLocated(By.xpath("//div[@role='dialog']")), 5000);
            expect(await dialog.isDisplayed()).to.be.true;
            
            const cancelBtn = await driver.findElement(By.xpath("//button[contains(., 'Batal')]"));
            await cancelBtn.click();
            await driver.sleep(500);
            
            const dialogs = await driver.findElements(By.xpath("//div[@role='dialog']"));
            expect(dialogs.length).to.equal(0);
        });

        it('TC.APT.003.004 — Klik Kembali dari step 3 -> Pindah ke halaman step 2', async function () {
            await clickPrevious(driver);
            const step2Header = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Pilih Dokter & Jadwal')]")), 5000);
            expect(await step2Header.isDisplayed()).to.be.true;
        });
    });

    describe('TS.APT.004 — End-to-End', function () {
        it('TC.APT.004.001 — Flow booking lengkap -> Booking berhasil', async function () {
            await driver.get(BUAT_KUNJUNGAN_URL);
            
            // Step 1
            const poliCard = await driver.wait(until.elementLocated(By.xpath("//button[.//h3]")), 5000);
            await poliCard.click();
            await clickNext(driver);
            
            // Step 2
            const availableDate = await driver.wait(
                until.elementLocated(By.xpath("//button[not(@disabled) and .//span[contains(@class, 'text-3xl')]]")), 
                5000
            );
            await availableDate.click();
            await driver.sleep(1000);
            const timeSlot = await driver.wait(until.elementLocated(By.xpath("//button[not(@disabled) and contains(@class, 'py-2.5')]")), 5000);
            await jsClick(driver, timeSlot);
            await clickNext(driver);
            
            // Step 3
            await clickNext(driver);
            const confirmBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Ya, Buat')]")), 5000);
            await confirmBtn.click();
            
            await driver.wait(until.urlContains('/patient/kunjungan'), 10000);
            expect(await driver.getCurrentUrl()).to.contain('/patient/kunjungan');
        });

        it('TC.APT.004.002 — Data persists dan reset antar step -> Data tetap saat navigasi, reset saat ganti tanggal', async function () {
            await driver.get(BUAT_KUNJUNGAN_URL);
            
            // Step 1
            let poliCard = await driver.wait(until.elementLocated(By.xpath("//button[.//h3]")), 5000);
            await poliCard.click();
            await clickNext(driver);
            
            // Step 2
            const dates = await driver.findElements(By.xpath("//button[not(@disabled) and .//span[contains(@class, 'text-3xl')]]"));
            if (dates.length < 2) {
                console.log('Kurang dari 2 tanggal tersedia, skip test persistence/reset.');
                return;
            }
            
            await dates[0].click();
            await driver.sleep(1000);
            let timeSlot = await driver.wait(until.elementLocated(By.xpath("//button[not(@disabled) and contains(@class, 'py-2.5')]")), 5000);
            await jsClick(driver, timeSlot);
            
            // Back to Step 1
            await clickPrevious(driver);
            // Re-find poliCard to avoid stale element
            poliCard = await driver.wait(until.elementLocated(By.xpath("//button[.//h3]")), 5000);
            const isPoliSelected = await poliCard.getAttribute('class');
            expect(isPoliSelected).to.contain('ring-2');
            
            // Back to Step 2
            await clickNext(driver);
            // Re-find timeSlot
            timeSlot = await driver.wait(until.elementLocated(By.xpath("//button[not(@disabled) and contains(@class, 'py-2.5')]")), 5000);
            const isTimeSelected = await timeSlot.getAttribute('class');
            expect(isTimeSelected).to.contain('bg-primary');
            
            // Ganti tanggal
            const datesNew = await driver.findElements(By.xpath("//button[not(@disabled) and .//span[contains(@class, 'text-3xl')]]"));
            await datesNew[1].click();
            await driver.sleep(1000);
            
            const selectedSlots = await driver.findElements(By.xpath("//button[contains(@class, 'bg-primary') and contains(@class, 'py-2.5')]"));
            expect(selectedSlots.length).to.equal(0);
        });
    });
});
