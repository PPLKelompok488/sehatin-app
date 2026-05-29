import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';
import { createDriver, BASE_URL } from '../setup.js';

// Helpers
async function goToLogin(driver) {
    await driver.get(`${BASE_URL}/login`);
    await driver.wait(until.elementLocated(By.id('email')), 5000);
}

async function fillLoginForm(driver, email, password) {
    await driver.findElement(By.id('email')).clear();
    await driver.findElement(By.id('email')).sendKeys(email);
    await driver.findElement(By.id('password')).clear();
    await driver.findElement(By.id('password')).sendKeys(password);
}

async function clickMasuk(driver) {
    const btn = await driver.findElement(By.xpath("//button[contains(text(), 'Masuk')]"));
    await btn.click();
}

async function disableBrowserValidation(driver) {
    await driver.executeScript("document.querySelector('form').setAttribute('novalidate', '')");
}

// Credentials — sesuaikan dengan data yang tersedia di database testing
const PATIENT_EMAIL = 'qalam@gmail.com';
const PATIENT_PASSWORD = 'Password123@';
const DOCTOR_EMAIL = 'diva@gmail.com';
const DOCTOR_PASSWORD = 'Password123@';
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'Password123@';

describe('Login Pasien', function () {
    let driver;

    this.timeout(60000);

    before(async function () {
        driver = await createDriver();
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    describe('TS.LGN.001 — Form Login', function () {
        it('TC.LGN.001.001 — Input semua field kosong dan klik Masuk -> Muncul pesan error di field Email dan Kata Sandi', async function () {
            await goToLogin(driver);
            await disableBrowserValidation(driver);
            await clickMasuk(driver);

            const errorEmail = await driver.wait(
                until.elementLocated(By.xpath("//p[contains(text(), 'email') or contains(text(), 'Email')]")), 5000
            );
            expect(await errorEmail.isDisplayed()).to.be.true;

            const errorPassword = await driver.findElement(By.xpath("//p[contains(text(), 'password') or contains(text(), 'sandi') or contains(text(), 'Kata')]"));
            expect(await errorPassword.isDisplayed()).to.be.true;
        });

        it('TC.LGN.001.002 — Input email format salah, password valid -> Muncul pesan error format email tidak valid', async function () {
            await goToLogin(driver);
            await disableBrowserValidation(driver);
            await fillLoginForm(driver, 'usertest', 'password123');
            await clickMasuk(driver);

            const errorEmail = await driver.wait(
                until.elementLocated(By.xpath("//p[contains(text(), 'email') or contains(text(), 'Email')]")), 5000
            );
            expect(await errorEmail.isDisplayed()).to.be.true;
        });

        it('TC.LGN.001.003 — Input hanya password, email dikosongkan -> Muncul pesan error pada field Email', async function () {
            await goToLogin(driver);
            await disableBrowserValidation(driver);

            await driver.findElement(By.id('password')).sendKeys('password123');
            await clickMasuk(driver);

            const errorEmail = await driver.wait(
                until.elementLocated(By.xpath("//p[contains(text(), 'email') or contains(text(), 'Email')]")), 5000
            );
            expect(await errorEmail.isDisplayed()).to.be.true;
        });

        it('TC.LGN.001.004 — Input hanya email, password dikosongkan -> Muncul pesan error pada field Kata Sandi', async function () {
            await goToLogin(driver);
            await disableBrowserValidation(driver);

            await driver.findElement(By.id('email')).sendKeys('test@example.com');
            await clickMasuk(driver);

            const errorPassword = await driver.wait(
                until.elementLocated(By.xpath("//p[contains(text(), 'password') or contains(text(), 'sandi') or contains(text(), 'Kata')]")), 5000
            );
            expect(await errorPassword.isDisplayed()).to.be.true;
        });

        it('TC.LGN.001.005 — Input email terdaftar dengan password yang salah -> Muncul pesan error kredensial tidak cocok', async function () {
            await goToLogin(driver);
            await fillLoginForm(driver, PATIENT_EMAIL, 'passwordsalah999');
            await clickMasuk(driver);
            await driver.sleep(1000);

            const errorEmail = await driver.findElement(By.xpath("//p[contains(text(), 'credentials') or contains(text(), 'kredensial') or contains(text(), 'tidak cocok') or contains(text(), 'These credentials')]"));
            expect(await errorEmail.isDisplayed()).to.be.true;
        });

        it('TC.LGN.001.006 — Input email yang tidak ada di database -> Muncul pesan error kredensial tidak cocok', async function () {
            await goToLogin(driver);
            await fillLoginForm(driver, 'tidakada@example.com', 'password123');
            await clickMasuk(driver);
            await driver.sleep(1000);

            const errorEmail = await driver.findElement(By.xpath("//p[contains(text(), 'credentials') or contains(text(), 'kredensial') or contains(text(), 'tidak cocok') or contains(text(), 'These credentials')]"));
            expect(await errorEmail.isDisplayed()).to.be.true;
        });

        it('TC.LGN.001.007 — Klik icon mata pada field Kata Sandi -> Password tampil saat klik pertama, dan password tersembunyi saat klik kedua', async function () {
            await goToLogin(driver);

            const passwordInput = await driver.findElement(By.id('password'));
            await passwordInput.sendKeys('password123');

            expect(await passwordInput.getAttribute('type')).to.equal('password');

            const toggleBtn = await driver.findElement(
                By.xpath("//input[@id='password']/parent::div/button[@type='button']")
            );

            await toggleBtn.click();
            await driver.sleep(300);
            expect(await passwordInput.getAttribute('type')).to.equal('text');

            await toggleBtn.click();
            await driver.sleep(300);
            expect(await passwordInput.getAttribute('type')).to.equal('password');
        });

        it('TC.LGN.001.008 — Klik checkbox "Ingat saya di perangkat ini" -> Checkbox tercentang saat klik pertama, tidak tercentang saat klik kedua', async function () {
            await goToLogin(driver);

            const checkbox = await driver.findElement(By.id('remember'));

            expect(await checkbox.isSelected()).to.be.false;

            await checkbox.click();
            await driver.sleep(200);
            expect(await checkbox.isSelected()).to.be.true;

            await checkbox.click();
            await driver.sleep(200);
            expect(await checkbox.isSelected()).to.be.false;
        });

        it('TC.LGN.001.009 — Klik link "Daftar" di halaman Login -> User diarahkan ke halaman Registrasi', async function () {
            await goToLogin(driver);

            const registerLink = await driver.findElement(By.xpath("//a[contains(text(), 'Daftar')]"));
            await registerLink.click();

            await driver.wait(until.urlContains('/register'), 5000);
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.include('/register');
        });
    });

    describe('TS.LGN.002 — Login Berhasil & Redirect', function () {
        it('TC.LGN.002.001 — Login dengan akun role pasien yang valid -> User diarahkan ke /patient/kunjungan', async function () {
            await goToLogin(driver);
            await fillLoginForm(driver, PATIENT_EMAIL, PATIENT_PASSWORD);
            await clickMasuk(driver);

            await driver.wait(async () => {
                const url = await driver.getCurrentUrl();
                return url.includes('/patient') || url.includes('/dashboard');
            }, 10000);

            const finalUrl = await driver.getCurrentUrl();
            expect(finalUrl).to.include('/patient');

            // Logout dengan menghapus cookie (agar tidak error 405 Method Not Allowed pada rute POST /logout)
            await driver.manage().deleteAllCookies();
        });

        it('TC.LGN.002.002 — Login dengan akun role dokter yang valid -> User diarahkan ke /doctor/schedule', async function () {
            await goToLogin(driver);
            await fillLoginForm(driver, DOCTOR_EMAIL, DOCTOR_PASSWORD);
            await clickMasuk(driver);

            await driver.wait(async () => {
                const url = await driver.getCurrentUrl();
                return url.includes('/doctor') || url.includes('/dashboard');
            }, 10000);

            const finalUrl = await driver.getCurrentUrl();
            expect(finalUrl).to.include('/doctor');

            // Logout dengan menghapus cookie (agar tidak error 405 Method Not Allowed pada rute POST /logout)
            await driver.manage().deleteAllCookies();
        });

        it('TC.LGN.002.003 — Login dengan akun role admin yang valid -> User diarahkan ke /admin/dashboard', async function () {
            await goToLogin(driver);
            await fillLoginForm(driver, ADMIN_EMAIL, ADMIN_PASSWORD);
            await clickMasuk(driver);

            await driver.wait(async () => {
                const url = await driver.getCurrentUrl();
                return url.includes('/admin') || url.includes('/dashboard');
            }, 10000);

            const finalUrl = await driver.getCurrentUrl();
            expect(finalUrl).to.include('/admin');

            // Logout dengan menghapus cookie (agar tidak error 405 Method Not Allowed pada rute POST /logout)
            await driver.manage().deleteAllCookies();
        });
    });

    describe('TS.LGN.003 — End-to-End', function () {
        it('TC.LGN.003.001 — Isi email dan password pasien yang valid dan submit -> User berhasil login dan diarahkan ke /patient/kunjungan', async function () {
            await goToLogin(driver);
            await fillLoginForm(driver, PATIENT_EMAIL, PATIENT_PASSWORD);
            await clickMasuk(driver);

            await driver.wait(async () => {
                const url = await driver.getCurrentUrl();
                return !url.includes('/login');
            }, 10000).catch(async () => {
                const errors = await driver.findElements(By.css('p'));
                const errorTexts = [];
                for (const e of errors) { errorTexts.push(await e.getText()); }
                const url = await driver.getCurrentUrl();
                throw new Error(`Redirect timeout. URL: ${url}. Errors on page: [${errorTexts.join(', ')}]`);
            });

            const finalUrl = await driver.getCurrentUrl();
            expect(finalUrl).to.not.include('/login');
            expect(finalUrl).to.include('/patient');

            // Logout dengan menghapus cookie (agar tidak error 405 Method Not Allowed pada rute POST /logout)
            await driver.manage().deleteAllCookies();
        });

        it('TC.LGN.003.002 — User yang sudah login mencoba mengakses /login -> User diarahkan kembali ke dashboard sesuai role', async function () {
            // Login terlebih dahulu
            await goToLogin(driver);
            await fillLoginForm(driver, PATIENT_EMAIL, PATIENT_PASSWORD);
            await clickMasuk(driver);

            await driver.wait(async () => {
                const url = await driver.getCurrentUrl();
                return !url.includes('/login');
            }, 10000);

            // Coba navigasi ke /login saat sudah login
            await driver.get(`${BASE_URL}/login`);
            await driver.sleep(1000);

            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.not.include('/login');

            // Logout setelah selesai
            await driver.get(`${BASE_URL}/logout`);
        });
    });
});
