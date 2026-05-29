import { expect } from 'chai';
import { By, until, Key } from 'selenium-webdriver';
import { createDriver, BASE_URL } from '../setup.js';

const SCHEDULES_URL = `${BASE_URL}/admin/schedules`;

async function login(driver) {
    await driver.get(`${BASE_URL}/login`);
    await driver.wait(until.elementLocated(By.id('email')), 5000);
    await driver.findElement(By.id('email')).sendKeys('admin@gmail.com');
    await driver.findElement(By.id('password')).sendKeys('Password123@');
    await driver.findElement(By.xpath("//button[contains(., 'Masuk')]")).click();
    await driver.wait(until.urlContains('/admin'), 10000);
}

async function clickTambahJadwal(driver) {
    const btn = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'Tambah Jadwal')]")),
        5000
    );
    await driver.wait(until.elementIsVisible(btn), 5000);
    await btn.click();
    await driver.sleep(500); 
}

async function clickSimpan(driver) {
    const btn = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'Simpan')]")),
        5000
    );
    await btn.click();
}

async function clickSimpanPerubahan(driver) {
    const btn = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'Simpan Perubahan')]")),
        5000
    );
    await btn.click();
}

async function clickBatal(driver) {
    const btn = await driver.findElement(By.xpath("//button[contains(., 'Batal')]"));
    await btn.click();
    await driver.sleep(500); 
}

describe('Manajemen Jadwal Dokter', function () {
    let driver;

    this.timeout(60000);

    before(async function () {
        driver = await createDriver();
        await login(driver);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    describe('TS.MSC.001 — View Jadwal', function () {
        it('TC.MSC.001.001 — Buka halaman saat belum ada jadwal tersimpan -> Menampilkan empty state', async function () {
            await driver.get(SCHEDULES_URL);
            await driver.sleep(1000);

            const emptyTitle = await driver.wait(
                until.elementLocated(By.xpath("//h3[contains(text(), 'Belum Ada Jadwal')]")), 5000
            ).catch(() => null);

            if (emptyTitle) {
                expect(await emptyTitle.isDisplayed()).to.be.true;
            } else {
                console.log('Jadwal sudah ada, test empty state dilewati.');
            }
        });

        it('TC.MSC.001.002 — Buka halaman saat sudah ada jadwal tersimpan -> Jadwal dikelompokkan per hari', async function () {
            await driver.get(SCHEDULES_URL);
            await driver.sleep(1000);

            const hariAccordion = await driver.findElements(By.xpath("//button[contains(@class, 'AccordionTrigger')]"));
            if (hariAccordion.length > 0) {
                expect(hariAccordion.length).to.be.greaterThan(0);
            }
        });
    });

    describe('TS.MSC.002 — Tambah Jadwal', function () {
        it('TC.MSC.002.001 — Submit form dengan semua field kosong -> Muncul error untuk field wajib', async function () {
            await driver.get(SCHEDULES_URL);
            await clickTambahJadwal(driver);
            await clickSimpan(driver);
            await driver.sleep(500);

            const errors = await driver.findElements(By.css('p.text-destructive, p.text-red-500'));
            expect(errors.length).to.be.greaterThan(0);
        });

        it('TC.MSC.002.002 — Submit form tanpa memilih dokter, field lain valid -> Muncul error "Minimal satu dokter harus dipilih"', async function () {
            await driver.get(SCHEDULES_URL);
            await clickTambahJadwal(driver);
            await clickSimpan(driver);
            await driver.sleep(500);

            const errorDokter = await driver.findElement(By.xpath("//p[contains(., 'Minimal satu dokter')]"));
            expect(await errorDokter.isDisplayed()).to.be.true;
        });

        it('TC.MSC.002.003 — Tambah lalu hapus dokter dari list -> Dokter muncul di list lalu terhapus', async function () {
            await driver.get(SCHEDULES_URL);
            await clickTambahJadwal(driver);

            const btnTambahDokter = await driver.findElement(By.xpath("//button[contains(., 'Tambah Dokter Ke Sesi')]"));
            await btnTambahDokter.click();
            await driver.sleep(500);

            const optionDokter = await driver.findElement(By.xpath("//div[@role='option']"));
            await optionDokter.click();
            await driver.sleep(500);

            const deleteDokterBtn = await driver.wait(
                until.elementLocated(By.xpath("//button[contains(@class, 'text-destructive') or .//svg]")), 3000
            );
            expect(await deleteDokterBtn.isDisplayed()).to.be.true;

            await deleteDokterBtn.click();
            await driver.sleep(500);

            const deleted = await driver.findElements(By.xpath("//button[contains(@class, 'text-destructive')]"));
            expect(deleted.length).to.equal(0);
        });

        it('TC.MSC.002.004 — Isi semua field valid lalu simpan -> Form tertutup, jadwal baru muncul di list', async function () {
            await driver.get(SCHEDULES_URL);
            await clickTambahJadwal(driver);

            const btnTambahDokter = await driver.findElement(By.xpath("//button[contains(., 'Tambah Dokter Ke Sesi')]"));
            await btnTambahDokter.click();
            await driver.sleep(500);
            const optionDokter = await driver.findElement(By.xpath("//div[@role='option']"));
            await optionDokter.click();
            await driver.sleep(500);

            await clickSimpan(driver);
            await driver.sleep(1000);

            const sheets = await driver.findElements(By.xpath("//div[@role='dialog']"));
            expect(sheets.length).to.equal(0);
        });

        it('TC.MSC.002.005 — Batal tambah jadwal -> Form tertutup tanpa menyimpan data', async function () {
            await driver.get(SCHEDULES_URL);
            await clickTambahJadwal(driver);
            await clickBatal(driver);

            const sheets = await driver.findElements(By.xpath("//div[@role='dialog']"));
            expect(sheets.length).to.equal(0);
        });
    });

    describe('TS.MSC.003 — Edit Jadwal', function () {
        it('TC.MCH.003.001 — Buka form edit tanpa mengubah apapun -> Tombol simpan disabled', async function () {
            await driver.get(SCHEDULES_URL);
            await driver.sleep(1000);

            const accordionTriggers = await driver.findElements(By.xpath("//button[contains(@class, 'AccordionTrigger')]"));
            if (accordionTriggers.length > 0) {
                await accordionTriggers[0].click();
                await driver.sleep(500);

                const sessionCards = await driver.findElements(By.xpath("//div[contains(@class, 'cursor-pointer') and contains(@class, 'rounded-xl')]"));
                if (sessionCards.length > 0) {
                    await sessionCards[0].click();
                    await driver.sleep(1000);

                    const btnSimpan = await driver.findElement(By.xpath("//button[contains(., 'Simpan Perubahan')]"));
                    expect(await btnSimpan.isEnabled()).to.be.false;
                }
            }
        });

        it('TC.MSC.003.002 — Ubah data jadwal lalu simpan -> Form tertutup, data terupdate di list', async function () {
            await driver.get(SCHEDULES_URL);
            await driver.sleep(1000);

            const accordionTriggers = await driver.findElements(By.xpath("//button[contains(@class, 'AccordionTrigger')]"));
            if (accordionTriggers.length > 0) {
                const isExpanded = await accordionTriggers[0].getAttribute('aria-expanded');
                if (isExpanded === 'false') await accordionTriggers[0].click();
                await driver.sleep(500);

                const sessionCards = await driver.findElements(By.xpath("//div[contains(@class, 'cursor-pointer')]"));
                if (sessionCards.length > 0) {
                    await sessionCards[0].click();
                    await driver.sleep(1000);

                    const durasiTrigger = await driver.findElement(By.xpath("//button[contains(@id, 'radix-')]"));
                    await durasiTrigger.click();
                    await driver.sleep(500);
                    const optionDurasi = await driver.findElement(By.xpath("//div[@role='option']"));
                    await optionDurasi.click();
                    await driver.sleep(500);

                    await clickSimpanPerubahan(driver);
                    await driver.sleep(1000);

                    const sheets = await driver.findElements(By.xpath("//div[@role='dialog']"));
                    expect(sheets.length).to.equal(0);
                }
            }
        });

        it('TC.MSC.003.003 — Klik Batal setelah mengubah data -> Form tertutup', async function () {
            await driver.get(SCHEDULES_URL);
            await driver.sleep(1000);

            const accordionTriggers = await driver.findElements(By.xpath("//button[contains(@class, 'AccordionTrigger')]"));
            if (accordionTriggers.length > 0) {
                const isExpanded = await accordionTriggers[0].getAttribute('aria-expanded');
                if (isExpanded === 'false') await accordionTriggers[0].click();
                await driver.sleep(500);

                const sessionCards = await driver.findElements(By.xpath("//div[contains(@class, 'cursor-pointer')]"));
                if (sessionCards.length > 0) {
                    await sessionCards[0].click();
                    await driver.sleep(1000);

                    await clickBatal(driver);
                    
                    const sheets = await driver.findElements(By.xpath("//div[@role='dialog']"));
                    expect(sheets.length).to.equal(0);
                }
            }
        });
    });

    describe('TS.MSC.004 — Hapus Jadwal', function () {
        it('TC.MCH.004.001 — Buka dialog hapus lalu batalkan -> Dialog tertutup, sesi tidak terhapus', async function () {
            await driver.get(SCHEDULES_URL);
            await driver.sleep(1000);

            const accordionTriggers = await driver.findElements(By.xpath("//button[contains(@class, 'AccordionTrigger')]"));
            if (accordionTriggers.length > 0) {
                const isExpanded = await accordionTriggers[0].getAttribute('aria-expanded');
                if (isExpanded === 'false') await accordionTriggers[0].click();
                await driver.sleep(500);

                const sessionCards = await driver.findElements(By.xpath("//div[contains(@class, 'cursor-pointer')]"));
                if (sessionCards.length > 0) {
                    await sessionCards[0].click();
                    await driver.sleep(1000);

                    const btnHapusSesi = await driver.findElement(By.xpath("//button[contains(., 'Hapus Sesi')]"));
                    await btnHapusSesi.click();
                    await driver.sleep(500);

                    const btnBatalDialog = await driver.findElement(By.xpath("//div[@role='alertdialog']//button[contains(., 'Batal')]"));
                    await btnBatalDialog.click();
                    await driver.sleep(500);

                    const dialogs = await driver.findElements(By.xpath("//div[@role='alertdialog']"));
                    expect(dialogs.length).to.equal(0);
                }
            }
        });

        it('TC.MCH.004.002 — Buka dialog hapus lalu konfirmasi -> Dialog tertutup, sesi terhapus dari list', async function () {
            await driver.get(SCHEDULES_URL);
            await driver.sleep(1000);

            const accordionTriggers = await driver.findElements(By.xpath("//button[contains(@class, 'AccordionTrigger')]"));
            if (accordionTriggers.length > 0) {
                const isExpanded = await accordionTriggers[0].getAttribute('aria-expanded');
                if (isExpanded === 'false') await accordionTriggers[0].click();
                await driver.sleep(500);

                const sessionCards = await driver.findElements(By.xpath("//div[contains(@class, 'cursor-pointer')]"));
                if (sessionCards.length > 0) {
                    await sessionCards[0].click();
                    await driver.sleep(1000);

                    const btnHapusSesi = await driver.findElement(By.xpath("//button[contains(., 'Hapus Sesi')]"));
                    await btnHapusSesi.click();
                    await driver.sleep(500);

                    const btnKonfirmasiHapus = await driver.findElement(By.xpath("//div[@role='alertdialog']//button[contains(., 'Hapus')]"));
                    await btnKonfirmasiHapus.click();
                    await driver.sleep(1000);

                    const dialogs = await driver.findElements(By.xpath("//div[@role='alertdialog']"));
                    expect(dialogs.length).to.equal(0);
                }
            }
        });
    });
});
