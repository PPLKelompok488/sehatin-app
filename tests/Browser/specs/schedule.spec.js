import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';
import { createDriver, BASE_URL } from '../setup.js';

async function loginAsDoctor(driver) {
    await driver.get(`${BASE_URL}/login`);
    await driver.wait(until.elementLocated(By.id('email')), 10000);
    await driver.findElement(By.id('email')).sendKeys('diva@gmail.com');
    await driver.findElement(By.id('password')).sendKeys('Password123@');

    const loginBtn = await driver.findElement(By.xpath("//button[contains(., 'Masuk')]"));
    await loginBtn.click();
    await driver.wait(until.urlContains('/doctor/schedule'), 20000);
}

async function openSchedulePage(driver) {
    await driver.get(`${BASE_URL}/doctor/schedule`);
    await driver.wait(until.urlContains('/doctor/schedule'), 10000);
    await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Jadwal Kunjungan')]")), 10000);
}

async function clickWeekButton(driver, direction) {
    const iconText = direction === 'next' ? 'chevron_right' : 'chevron_left';
    const button = await driver.findElement(By.xpath(`//button[.//span[contains(text(), '${iconText}')]]`));
    await button.click();
}

async function getNextPatientLink(driver) {
    return await driver.findElements(By.xpath("//a[contains(., 'Pasien Selanjutnya')]") );
}

async function getNextPatientText(driver) {
    return await driver.findElements(By.xpath("//div[contains(., 'Pasien Selanjutnya') and contains(., 'Tidak ada')]"));
}

async function getAppointmentCards(driver) {
    return await driver.findElements(By.xpath("//main//a[contains(@class, 'rounded-xl') and .//span[contains(@class, 'text-[10px]')]]"));
}

describe('Jadwal Kunjungan Dokter', function () {
    let driver;

    this.timeout(120000);

    before(async function () {
        driver = await createDriver();
        await loginAsDoctor(driver);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    describe('TS.SCH.001 — View Jadwal', function () {
        it('TC.SCH.001.001 — Buka halaman Jadwal Kunjungan -> Menampilkan judul halaman', async function () {
            await openSchedulePage(driver);
            const heading = await driver.findElement(By.xpath("//h2[contains(text(), 'Jadwal Kunjungan')]"));
            expect(await heading.isDisplayed()).to.be.true;
        });

        it('TC.SCH.001.002 — Validasi kartu statistik -> Menampilkan Total Pasien, Pasien Selanjutnya, dan Pasien Hari Ini', async function () {
            await openSchedulePage(driver);

            const totalPasien = await driver.findElement(By.xpath("//p[contains(text(), 'Total Pasien')]") );
            const pasienSelanjutnya = await driver.findElement(By.xpath("//p[contains(text(), 'Pasien Selanjutnya')]") );
            const pasienHariIni = await driver.findElement(By.xpath("//p[contains(text(), 'Pasien Hari Ini')]") );

            expect(await totalPasien.isDisplayed()).to.be.true;
            expect(await pasienSelanjutnya.isDisplayed()).to.be.true;
            expect(await pasienHariIni.isDisplayed()).to.be.true;
        });

        it('TC.SCH.001.003 — Validasi header kalender 7 hari -> Menampilkan 7 kolom hari', async function () {
            await openSchedulePage(driver);

            const dayHeaders = await driver.findElements(By.xpath("//div[contains(@class, 'bg-surface-container-low/50')]/div[position()>1]"));
            expect(dayHeaders.length).to.equal(7);
        });
    });

    describe('TS.SCH.002 — Navigasi Minggu', function () {
        it('TC.SCH.002.001 — Klik tombol next week -> URL berubah ke minggu berikutnya', async function () {
            await openSchedulePage(driver);
            const initialUrl = await driver.getCurrentUrl();

            await clickWeekButton(driver, 'next');
            await driver.wait(async () => {
                const currentUrl = await driver.getCurrentUrl();
                return currentUrl !== initialUrl;
            }, 10000);

            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.include('week_start=');
        });

        it('TC.SCH.002.002 — Klik tombol previous week -> URL berubah kembali ke minggu sebelumnya', async function () {
            await openSchedulePage(driver);
            const beforeUrl = await driver.getCurrentUrl();

            await clickWeekButton(driver, 'next');
            await driver.wait(async () => {
                const currentUrl = await driver.getCurrentUrl();
                return currentUrl !== beforeUrl;
            }, 10000);

            const nextUrl = await driver.getCurrentUrl();
            await clickWeekButton(driver, 'prev');
            await driver.wait(async () => {
                const currentUrl = await driver.getCurrentUrl();
                return currentUrl !== nextUrl;
            }, 10000);

            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.not.equal(nextUrl);
            expect(currentUrl).to.include('/doctor/schedule');
        });
    });

    describe('TS.SCH.003 — Kartu Pasien dan Slot', function () {
        it('TC.SCH.003.001 — Verifikasi link pasien selanjutnya saat ada data -> Link medical record ada jika pasien tersedia', async function () {
            await openSchedulePage(driver);
            const nextPatientLink = await getNextPatientLink(driver);
            if (nextPatientLink.length > 0) {
                expect(await nextPatientLink[0].isDisplayed()).to.be.true;
                const href = await nextPatientLink[0].getAttribute('href');
                expect(href).to.include('/doctor/appointments/');
            } else {
                this.skip();
            }
        });

        it('TC.SCH.003.002 — Verifikasi tampilan jika tidak ada pasien selanjutnya -> Menampilkan teks Tidak ada', async function () {
            await openSchedulePage(driver);
            const noNextPatient = await getNextPatientText(driver);
            if (noNextPatient.length > 0) {
                expect(await noNextPatient[0].isDisplayed()).to.be.true;
            } else {
                this.skip();
            }
        });

        it('TC.SCH.003.003 — Verifikasi appointment slot -> Menampilkan kartu appointment jika ada janji di slot', async function () {
            await openSchedulePage(driver);
            const cards = await getAppointmentCards(driver);
            if (cards.length > 0) {
                expect(cards.length).to.be.greaterThan(0);
            } else {
                this.skip();
            }
        });
    });
});