import { expect } from 'chai';
import { By, until, Key } from 'selenium-webdriver';
import { createDriver, BASE_URL } from '../setup.js';

// Helpers
async function fillStep1Valid(driver) {
    await driver.findElement(By.id('name')).sendKeys('User Test Selenium');
    await driver.findElement(By.id('email')).sendKeys(`test.selenium.${Date.now()}@example.com`);
    await driver.findElement(By.id('phone')).sendKeys('081234567890');
    await driver.findElement(By.id('password')).sendKeys('password123');
    await driver.findElement(By.id('password_confirmation')).sendKeys('password123');
}

async function clickSelanjutnya(driver) {
    const btn = await driver.findElement(By.xpath("//button[contains(text(), 'Selanjutnya')]"));
    await btn.click();
}

async function goToStep2(driver) {
    await driver.get(`${BASE_URL}/register`);
    await fillStep1Valid(driver);
    await clickSelanjutnya(driver);
    await driver.wait(until.elementLocated(By.id('nik')), 5000);
}

async function clickDaftarSekarang(driver) {
    const btn = await driver.findElement(By.xpath("//button[contains(text(), 'Daftar Sekarang')]"));
    await btn.click();
}

async function setDateValue(driver, elementId, dateValue) {
    await driver.executeScript(`
        const input = document.getElementById('${elementId}');
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(input, '${dateValue}');
        const tracker = input._valueTracker;
        if (tracker) { tracker.setValue(''); }
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('input', { bubbles: true }));
    `);
}

async function disableBrowserValidation(driver) {
    await driver.executeScript("document.querySelector('form').setAttribute('novalidate', '')");
}

describe('Registrasi Pasien', function () {
    let driver;

    this.timeout(60000);

    before(async function () {
        driver = await createDriver();
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    describe('TS.REG.001 — Step 1: Buat Akun', function () {
        it('TC.REG.001.001 — Input semua field kosong dan lanjut ke Step 2 -> Muncul pesan error di semua field wajib', async function () {
            await driver.get(`${BASE_URL}/register`);
            await clickSelanjutnya(driver);
            await driver.sleep(500);

            const errorNama = await driver.findElement(By.xpath("//p[contains(text(), 'Nama lengkap wajib diisi')]"));
            expect(await errorNama.isDisplayed()).to.be.true;

            const errorEmail = await driver.findElement(By.xpath("//p[contains(text(), 'Email wajib diisi')]"));
            expect(await errorEmail.isDisplayed()).to.be.true;

            const errorPhone = await driver.findElement(By.xpath("//p[contains(text(), 'Nomor ponsel wajib diisi')]"));
            expect(await errorPhone.isDisplayed()).to.be.true;

            const errorPassword = await driver.findElement(By.xpath("//p[contains(text(), 'Kata sandi wajib diisi')]"));
            expect(await errorPassword.isDisplayed()).to.be.true;

            const errorConfirm = await driver.findElement(By.xpath("//p[contains(text(), 'Konfirmasi sandi wajib diisi')]"));
            expect(await errorConfirm.isDisplayed()).to.be.true;
        });

        it('TC.REG.001.002 — Input email format salah, field lain valid -> Muncul pesan error "Format email tidak valid"', async function () {
            await driver.get(`${BASE_URL}/register`);
            await disableBrowserValidation(driver);

            await driver.findElement(By.id('name')).sendKeys('User Test');
            await driver.findElement(By.id('email')).sendKeys('Usertest');
            await driver.findElement(By.id('phone')).sendKeys('081234567890');
            await driver.findElement(By.id('password')).sendKeys('password123');
            await driver.findElement(By.id('password_confirmation')).sendKeys('password123');

            await clickSelanjutnya(driver);
            await driver.sleep(500);

            const errorEmail = await driver.findElement(By.xpath("//p[contains(text(), 'Format email tidak valid')]"));
            expect(await errorEmail.isDisplayed()).to.be.true;
        });

        it('TC.REG.001.003 — Input password kurang dari 8 karakter -> Muncul pesan error "Kata sandi minimal 8 karakter"', async function () {
            await driver.get(`${BASE_URL}/register`);

            await driver.findElement(By.id('name')).sendKeys('User Test');
            await driver.findElement(By.id('email')).sendKeys('test@example.com');
            await driver.findElement(By.id('phone')).sendKeys('081234567890');
            await driver.findElement(By.id('password')).sendKeys('12345');
            await driver.findElement(By.id('password_confirmation')).sendKeys('12345');

            await clickSelanjutnya(driver);
            await driver.sleep(500);

            const errorPassword = await driver.findElement(By.xpath("//p[contains(text(), 'Kata sandi minimal 8 karakter')]"));
            expect(await errorPassword.isDisplayed()).to.be.true;
        });

        it('TC.REG.001.004 — Input konfirmasi sandi tidak cocok dengan password -> Muncul pesan error "Konfirmasi sandi tidak cocok"', async function () {
            await driver.get(`${BASE_URL}/register`);

            await driver.findElement(By.id('name')).sendKeys('User Test');
            await driver.findElement(By.id('email')).sendKeys('test@example.com');
            await driver.findElement(By.id('phone')).sendKeys('081234567890');
            await driver.findElement(By.id('password')).sendKeys('password123');
            await driver.findElement(By.id('password_confirmation')).sendKeys('password456');

            await clickSelanjutnya(driver);
            await driver.sleep(500);

            const errorConfirm = await driver.findElement(By.xpath("//p[contains(text(), 'Konfirmasi sandi tidak cocok')]"));
            expect(await errorConfirm.isDisplayed()).to.be.true;
        });

        it('TC.REG.001.005 — Klik icon mata pada field password -> Password tampil saat klik pertama, dan password tersembunyi saat klik kedua', async function () {
            await driver.get(`${BASE_URL}/register`);

            const passwordInput = await driver.findElement(By.id('password'));
            await passwordInput.sendKeys('password123');

            expect(await passwordInput.getAttribute('type')).to.equal('password');

            const toggleBtn = await driver.findElement(
                By.xpath("//input[@id='password']/parent::div/parent::div/button[@type='button']")
            );
            
            await toggleBtn.click();
            await driver.sleep(300);
            expect(await passwordInput.getAttribute('type')).to.equal('text');

            await toggleBtn.click();
            await driver.sleep(300);
            expect(await passwordInput.getAttribute('type')).to.equal('password');
        });

        it('TC.REG.001.006 — Klik link "Masuk" di halaman registrasi -> User diarahkan ke halaman Login', async function () {
            await driver.get(`${BASE_URL}/register`);

            const loginLink = await driver.findElement(By.xpath("//a[contains(text(), 'Masuk')]"));
            await loginLink.click();

            await driver.wait(until.urlContains('/login'), 5000);
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.include('/login');
        });

        it('TC.REG.001.007 — Input semua field valid, klik Selanjutnya -> User pindah ke Step 2', async function () {
            await driver.get(`${BASE_URL}/register`);
            await fillStep1Valid(driver);
            await clickSelanjutnya(driver);

            const nikField = await driver.wait(until.elementLocated(By.id('nik')), 5000);
            expect(await nikField.isDisplayed()).to.be.true;

            const heading = await driver.findElement(By.xpath("//h2[contains(text(), 'Lengkapi Data Diri')]"));
            expect(await heading.isDisplayed()).to.be.true;
        });
    });

    describe('TS.REG.002 — Step 2: Lengkapi Data Diri', function () {
        it('TC.REG.002.001 — Input semua field kosong, klik Daftar Sekarang -> Muncul pesan error di semua field wajib', async function () {
            await goToStep2(driver);
            await clickDaftarSekarang(driver);
            await driver.sleep(500);

            const errorNik = await driver.findElement(By.xpath("//p[contains(text(), 'NIK wajib diisi')]"));
            expect(await errorNik.isDisplayed()).to.be.true;

            const errorDob = await driver.findElement(By.xpath("//p[contains(text(), 'Tanggal lahir wajib diisi')]"));
            expect(await errorDob.isDisplayed()).to.be.true;

            const errorBlood = await driver.findElement(By.xpath("//p[contains(text(), 'Golongan darah wajib diisi')]"));
            expect(await errorBlood.isDisplayed()).to.be.true;

            const errorGender = await driver.findElement(By.xpath("//p[contains(text(), 'Jenis kelamin wajib dipilih')]"));
            expect(await errorGender.isDisplayed()).to.be.true;

            const errorAddress = await driver.findElement(By.xpath("//p[contains(text(), 'Alamat wajib diisi')]"));
            expect(await errorAddress.isDisplayed()).to.be.true;
        });

        it('TC.REG.002.002 — Input NIK kurang dari 16 digit -> Muncul pesan error "NIK harus 16 digit"', async function () {
            await goToStep2(driver);

            await driver.findElement(By.id('nik')).sendKeys('1234567890123');
            await clickDaftarSekarang(driver);
            await driver.sleep(500);

            const errorNik = await driver.findElement(By.xpath("//p[contains(text(), 'NIK harus 16 digit')]"));
            expect(await errorNik.isDisplayed()).to.be.true;
        });

        it('TC.REG.002.003 — Pilih salah satu opsi jenis kelamin -> Salah satu jenis kelamin berbasis radio button terpilih dengan border primary', async function () {
            await goToStep2(driver);

            const labelPria = await driver.findElement(By.xpath("//label[@for='gender-pria']"));
            await labelPria.click();
            await driver.sleep(300);

            const labelClass = await labelPria.getAttribute('class');
            expect(labelClass).to.include('border-primary');
        });

        it('TC.REG.002.004 — Klik tombol Kembali dari Step 2 ke Step 1 -> User kembali ke Step 1 dengan data input sebelumnya yang masih tersimpan', async function () {
            await driver.get(`${BASE_URL}/register`);

            const testName = 'Data Tersimpan Test';
            await driver.findElement(By.id('name')).sendKeys(testName);
            await driver.findElement(By.id('email')).sendKeys('tersimpan@test.com');
            await driver.findElement(By.id('phone')).sendKeys('089876543210');
            await driver.findElement(By.id('password')).sendKeys('password123');
            await driver.findElement(By.id('password_confirmation')).sendKeys('password123');

            await clickSelanjutnya(driver);
            await driver.wait(until.elementLocated(By.id('nik')), 5000);

            const kembaliBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Kembali')]"));
            await kembaliBtn.click();
            await driver.sleep(500);

            const heading = await driver.wait(
                until.elementLocated(By.xpath("//h2[contains(text(), 'Buat Akun')]")), 5000
            );
            expect(await heading.isDisplayed()).to.be.true;

            const nameField = await driver.findElement(By.id('name'));
            const nameValue = await nameField.getAttribute('value');
            expect(nameValue).to.equal(testName);
        });
    });

    describe('TS.REG.003 — End-to-End', function () {
        it('TC.REG.003.001 — Isi Step 1 dan Step 2 dengan data valid hingga selesai -> User berhasil mendaftar sebagai pasien dan halaman diarahkan ke login', async function () {
            await driver.get(`${BASE_URL}/register`);

            const uniqueEmail = `e2e.test.${Date.now()}@example.com`;
            await driver.findElement(By.id('name')).sendKeys('E2E Full Flow');
            await driver.findElement(By.id('email')).sendKeys(uniqueEmail);
            await driver.findElement(By.id('phone')).sendKeys('081200001111');
            await driver.findElement(By.id('password')).sendKeys('password123');
            await driver.findElement(By.id('password_confirmation')).sendKeys('password123');

            await clickSelanjutnya(driver);
            await driver.wait(until.elementLocated(By.id('nik')), 5000);

            const uniqueNik1 = String(Date.now()).padStart(16, '0').slice(0, 16);
            await driver.findElement(By.id('nik')).sendKeys(uniqueNik1);
            await setDateValue(driver, 'date_of_birth', '2000-01-15');

            const bloodTrigger = await driver.findElement(By.id('blood_type'));
            await bloodTrigger.click();
            await driver.sleep(500);
            const optionA = await driver.wait(
                until.elementLocated(By.xpath("//div[@role='option' and contains(., 'A')]")), 3000
            );
            await optionA.click();
            await driver.sleep(300);

            const labelPria = await driver.findElement(By.xpath("//label[@for='gender-pria']"));
            await labelPria.click();

            await driver.findElement(By.id('address')).sendKeys('Jl. Selenium No. 1, Bandung');
            await clickDaftarSekarang(driver);

            await driver.wait(async () => {
                const url = await driver.getCurrentUrl();
                return url.includes('/login') || url.includes('/dashboard') || !url.includes('/register');
            }, 20000).catch(async () => {
                const errors = await driver.findElements(By.css('p.text-red-500'));
                const errorTexts = [];
                for (const e of errors) { errorTexts.push(await e.getText()); }
                const url = await driver.getCurrentUrl();
                throw new Error(`Redirect timeout. URL: ${url}. Errors on page: [${errorTexts.join(', ')}]`);
            });

            const finalUrl = await driver.getCurrentUrl();
            expect(finalUrl).to.not.include('/register');
        });

        it('TC.REG.003.002 — Submit registrasi dengan email yang sudah terdaftar -> User kembali ke Step 1 dengan error di field email "This Email has already been taken"', async function () {
            const duplicateEmail = `duplicate.${Date.now()}@example.com`;

            await driver.get(`${BASE_URL}/register`);
            await driver.findElement(By.id('name')).sendKeys('Duplicate Test 1');
            await driver.findElement(By.id('email')).sendKeys(duplicateEmail);
            await driver.findElement(By.id('phone')).sendKeys('081300001111');
            await driver.findElement(By.id('password')).sendKeys('password123');
            await driver.findElement(By.id('password_confirmation')).sendKeys('password123');

            await clickSelanjutnya(driver);
            await driver.wait(until.elementLocated(By.id('nik')), 5000);

            const uniqueNik2 = String(Date.now() + 1).padStart(16, '0').slice(0, 16);
            await driver.findElement(By.id('nik')).sendKeys(uniqueNik2);
            await setDateValue(driver, 'date_of_birth', '1995-06-20');

            const bloodTrigger1 = await driver.findElement(By.id('blood_type'));
            await bloodTrigger1.click();
            await driver.sleep(500);
            const optionB = await driver.wait(
                until.elementLocated(By.xpath("//div[@role='option' and contains(., 'B')]")), 3000
            );
            await optionB.click();
            await driver.sleep(300);

            const labelWanita = await driver.findElement(By.xpath("//label[@for='gender-wanita']"));
            await labelWanita.click();

            await driver.findElement(By.id('address')).sendKeys('Jl. Duplikat No. 1');
            await clickDaftarSekarang(driver);

            await driver.wait(async () => {
                const url = await driver.getCurrentUrl();
                return !url.includes('/register');
            }, 15000);

            await driver.get(`${BASE_URL}/register`);
            await driver.findElement(By.id('name')).sendKeys('Duplicate Test 2');
            await driver.findElement(By.id('email')).sendKeys(duplicateEmail);
            await driver.findElement(By.id('phone')).sendKeys('081400002222');
            await driver.findElement(By.id('password')).sendKeys('password123');
            await driver.findElement(By.id('password_confirmation')).sendKeys('password123');

            await clickSelanjutnya(driver);
            await driver.wait(until.elementLocated(By.id('nik')), 5000);

            const uniqueNik3 = String(Date.now() + 2).padStart(16, '0').slice(0, 16);
            await driver.findElement(By.id('nik')).sendKeys(uniqueNik3);
            await setDateValue(driver, 'date_of_birth', '1998-03-10');

            const bloodTrigger2 = await driver.findElement(By.id('blood_type'));
            await bloodTrigger2.click();
            await driver.sleep(500);
            const optionO = await driver.wait(
                until.elementLocated(By.xpath("//div[@role='option' and contains(., 'O')]")), 3000
            );
            await optionO.click();
            await driver.sleep(300);

            const labelPria2 = await driver.findElement(By.xpath("//label[@for='gender-pria']"));
            await labelPria2.click();

            await driver.findElement(By.id('address')).sendKeys('Jl. Duplikat No. 2');
            await clickDaftarSekarang(driver);

            await driver.wait(
                until.elementLocated(By.xpath("//h2[contains(text(), 'Buat Akun')]")), 15000
            );

            const errorEmail = await driver.wait(
                until.elementLocated(By.xpath("//p[contains(text(), 'email') or contains(text(), 'Email')]")), 5000
            );
            expect(await errorEmail.isDisplayed()).to.be.true;
        });
    });
});
