import { expect } from 'chai';
import { By, until, Key } from 'selenium-webdriver';
import { createDriver, BASE_URL } from '../setup.js';

const POLIS_URL = `${BASE_URL}/admin/polis`;

async function login(driver) {
    await driver.get(`${BASE_URL}/login`);
    await driver.wait(until.elementLocated(By.id('email')), 5000);
    await driver.findElement(By.id('email')).sendKeys('admin@gmail.com');
    await driver.findElement(By.id('password')).sendKeys('Password123@');
    await driver.findElement(By.xpath("//button[contains(., 'Masuk')]")).click();
    await driver.wait(until.urlContains('/admin'), 10000);
}

async function openAddModal(driver) {
    await driver.wait(until.elementLocated(By.id('btn-tambah-poli')), 5000);
    const btn = await driver.findElement(By.id('btn-tambah-poli'));
    await driver.wait(until.elementIsVisible(btn), 5000);
    
    // Use executeScript if click is intercepted
    try {
        await btn.click();
    } catch (e) {
        if (e.name === 'ElementClickInterceptedError') {
            await driver.executeScript("arguments[0].click();", btn);
        } else {
            throw e;
        }
    }
    await driver.sleep(1000);
}

async function closeModal(driver) {
    const batalBtn = await driver.findElements(By.xpath("//div[@role='dialog']//button[normalize-space()='Batal']"));
    if (batalBtn.length > 0) {
        await batalBtn[0].click();
        await driver.sleep(1000);
    }
}

async function submitForm(driver, isEdit = false) {
    const text = isEdit ? 'Simpan Perubahan' : 'Tambah Poli';
    // Use exact text match and target the dialog to avoid hitting the background button
    const btn = await driver.wait(
        until.elementLocated(By.xpath(`//div[@role='dialog']//button[normalize-space()='${text}']`)),
        5000
    );
    await driver.wait(until.elementIsVisible(btn), 5000);
    await btn.click();
    await driver.sleep(1500); 
}

describe('Manajemen Poli', function () {
    let driver;

    this.timeout(60000);

    before(async function () {
        driver = await createDriver();
        await login(driver);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    describe('TS.POL.001 — View, Search & Filter', function () {
        it('TC.POL.001.001 — Mencari poli berdasarkan nama yang ada -> List poli terfilter', async function () {
            await driver.get(POLIS_URL);
            await driver.sleep(1000);
            const searchInput = await driver.findElement(By.xpath("//input[@placeholder='Cari unit spesialisasi...']"));
            
            // Assume "Umum" exists for testing search
            await searchInput.sendKeys('Umum');
            await driver.sleep(500);
            
            const rows = await driver.findElements(By.xpath("//tbody/tr"));
            if (rows.length > 0 && !(await rows[0].getText()).includes('Tidak ada poli')) {
                const firstRowText = await rows[0].getText();
                expect(firstRowText.toLowerCase()).to.include('umum');
            }
        });

        it('TC.POL.001.002 — Klik tab "Aktif" -> Hanya poli aktif yang muncul', async function () {
            await driver.get(POLIS_URL);
            await driver.sleep(1000);
            const tabAktif = await driver.findElement(By.xpath("//button[text()='Aktif']"));
            await tabAktif.click();
            await driver.sleep(500);

            const statusBadges = await driver.findElements(By.xpath("//span[contains(@class, 'text-emerald-700')]"));
            const inactiveBadges = await driver.findElements(By.xpath("//span[contains(@class, 'text-slate-500')]"));
            
            if (statusBadges.length > 0) {
                expect(inactiveBadges.length).to.equal(0);
            }
        });
    });

    describe('TS.POL.002 — Tambah Poli', function () {
        it('TC.POL.002.001 — Submit form dengan nama poli kosong -> Muncul pesan error', async function () {
            await driver.get(POLIS_URL);
            await driver.sleep(1000);
            await openAddModal(driver);
            await submitForm(driver);

            await driver.wait(until.elementLocated(By.xpath("//p[contains(text(), 'Nama poli wajib diisi')]")), 5000);
            const errorMsg = await driver.findElement(By.xpath("//p[contains(text(), 'Nama poli wajib diisi')]"));
            expect(await errorMsg.isDisplayed()).to.be.true;

            await closeModal(driver);
        });

        it('TC.POL.002.004 — Input data valid dan simpan -> Modal tertutup, poli baru muncul', async function () {
            await driver.get(POLIS_URL);
            await driver.sleep(1000);
            await openAddModal(driver);

            const uniqueName = `Poli Test ${Date.now()}`;
            await driver.wait(until.elementLocated(By.id('name')), 5000);
            await driver.findElement(By.id('name')).sendKeys(uniqueName);
            await driver.wait(until.elementLocated(By.id('description')), 5000);
            await driver.findElement(By.id('description')).sendKeys('Deskripsi unit pengetesan otomatis');
            
            // Select second icon
            const icons = await driver.findElements(By.xpath("//div[contains(@class, 'grid-cols-4')]/button"));
            if (icons.length > 1) await icons[1].click();
            
            const nameInputForStaleness = await driver.findElement(By.id('name'));
            await submitForm(driver);

            // Wait for modal to close
            await driver.wait(until.stalenessOf(nameInputForStaleness), 5000);
            
            // Verify in list
            const searchInput = await driver.findElement(By.xpath("//input[@placeholder='Cari unit spesialisasi...']"));
            await searchInput.clear();
            await searchInput.sendKeys(uniqueName);
            await driver.sleep(500);
            
            const firstRow = await driver.findElement(By.xpath("//tbody/tr[1]"));
            expect(await firstRow.getText()).to.include(uniqueName);
        });
    });

    describe('TS.POL.003 — Edit Poli', function () {
        it('TC.POL.003.001 — Klik tombol edit -> Modal terbuka dengan data terisi', async function () {
            await driver.get(POLIS_URL);
            await driver.sleep(1000);
            const editBtn = await driver.wait(until.elementLocated(By.xpath("//button[@title='Edit']")), 5000);
            await editBtn.click();
            await driver.sleep(1000);

            await driver.wait(until.elementLocated(By.id('name')), 5000);
            const nameValue = await driver.findElement(By.id('name')).getAttribute('value');
            expect(nameValue).to.not.be.empty;
        });
    });

    describe('TS.POL.004 — Hapus Poli', function () {
        it('TC.POL.004.001 — Klik batal pada dialog konfirmasi -> Dialog tertutup', async function () {
            await driver.get(POLIS_URL);
            await driver.sleep(1000);
            const deleteBtn = await driver.wait(until.elementLocated(By.xpath("//button[@title='Hapus']")), 5000);
            await deleteBtn.click();
            await driver.sleep(500);

            const batalBtn = await driver.findElement(By.xpath("//button[text()='Batal']"));
            await batalBtn.click();
            await driver.sleep(500);

            const dialogs = await driver.findElements(By.xpath("//h2[text()='Hapus Poli']"));
            expect(dialogs.length).to.equal(0);
        });
    });
});
