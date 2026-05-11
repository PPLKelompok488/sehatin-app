import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const bookNowHref = auth.user ? route('patient.kunjungan') : route('login');

    return (
        <>
            <Head title="SEHATIN - Platform Kesehatan Digital" />

            <style>{`
                .glass-nav {
                    backdrop-filter: blur(12px);
                    background-color: rgba(255, 255, 255, 0.9);
                }
                :root {
                    --accent-purple: #A855F7;
                    --accent-orange: #F97316;
                    --outline-variant: #E2E8F0;
                    --surface-container-lowest: #FFFFFF;
                }
            `}</style>

            {/* ── HEADER ── */}
            <header className="fixed top-0 w-full z-50 glass-nav border-b border-[#E2E8F0]">
                <div className="relative flex items-center px-6 py-3 w-full">
                    {/* Logo – left */}
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            favorite
                        </span>
                        <span className="font-headline font-extrabold text-xl text-on-surface">Sehatin</span>
                    </div>

                    {/* Nav – center */}
                    <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                        <a className="text-primary font-semibold" href="#">Home</a>
                        <a className="text-on-surface-variant hover:text-primary transition-colors" href="#layanan">Layanan</a>
                    </nav>

                    {/* Right – profile or empty */}
                    <div className="ml-auto flex items-center gap-3">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="flex items-center gap-2 group">
                                {/* Avatar initial */}
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
                                    {auth.user.name?.charAt(0).toUpperCase()}
                                </div>
                                {/* Role badge */}
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-container text-primary capitalize hidden md:inline">
                                    {auth.user.role}
                                </span>
                            </Link>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                                <span className="material-symbols-outlined text-xl">person</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-16">

                {/* ── HERO ── */}
                <section className="relative min-h-[800px] flex items-center px-6 md:px-20 overflow-hidden bg-background">
                    {/* Right image */}
                    <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
                        <div className="absolute inset-0 z-10" />
                        <img
                            alt="Digital Health Platform"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz7_DjhyO3-eljvyhia84G5QLE63sAiIGoH7ztThiIbNoet8i-9qtZoOS2CQdKKcz6Ji_5JbDszC964Yx_rKnZzp4jsrE3OV0Ni2-6xbngudPtByk9MZeWpHvXzAZEK__uDKnYWBK55qRqzgChP-6tx-8yCo3LpX9HEg3iMKkRDeh-EdOlcj1lEd_lACbcqNP0FSL_JFSQus79wnAYccwMgHk-RCtrjxcF-bsJuc11KmyazDpPO0pi2sXMXpRqFONc1xTnpGIWbLk"
                        />
                    </div>

                    {/* Left content */}
                    <div className="relative z-20 max-w-2xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container text-primary rounded-full text-xs font-semibold mb-6 tracking-wide uppercase">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                health_and_safety
                            </span>
                            Digital Clinical Sanctuary
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold font-headline text-on-surface leading-[1.1] mb-6 tracking-tight">
                            Kendalikan <br />
                            <span className="text-primary">Kesehatan</span> Anda <br />
                            Secara Digital
                        </h1>

                        <p className="text-lg text-on-surface-variant mb-10 max-w-lg leading-relaxed">
                            Sehatin adalah platform kesehatan digital untuk klinik kecil. Catat dan lacak rekam medis,
                            riwayat kunjungan, dan rekomendasi dokter dengan mudah secara mandiri tanpa kertas.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href={bookNowHref}
                                id="btn-book-now"
                                className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold shadow-sm hover:brightness-95 active:scale-95 transition-all flex items-center gap-2"
                            >
                                Booking Sekarang
                                <span className="material-symbols-outlined">calendar_add_on</span>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-12 flex items-center gap-8">
                            <div>
                                <div className="text-2xl font-bold text-on-surface">Digital</div>
                                <div className="text-sm text-on-surface-variant">Tanpa Kertas</div>
                            </div>
                            <div className="w-[1px] h-8 bg-[#E2E8F0]" />
                            <div>
                                <div className="text-2xl font-bold text-on-surface">Aman</div>
                                <div className="text-sm text-on-surface-variant">Enkripsi Data</div>
                            </div>
                            <div className="w-[1px] h-8 bg-[#E2E8F0]" />
                            <div>
                                <div className="text-2xl font-bold text-on-surface">Mandiri</div>
                                <div className="text-sm text-on-surface-variant">Akses Pasien</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FEATURES ── */}
                <section id="layanan" className="py-24 px-6 md:px-20 bg-surface">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-on-surface mb-4">
                                Monitor Kesehatan Mandiri
                            </h2>
                            <p className="text-on-surface-variant">
                                Kelola data vital Anda dalam satu dashboard intuitif yang terhubung langsung dengan rekam medis klinis.
                            </p>
                        </div>
                        <a className="text-primary font-bold flex items-center gap-1 group" href="#mengapa">
                            Eksplorasi Fitur
                            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="group bg-surface-container p-8 rounded-xl transition-all hover:-translate-y-2">
                            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-on-primary mb-6">
                                <span className="material-symbols-outlined text-3xl">monitoring</span>
                            </div>
                            <h3 className="text-xl font-bold font-headline mb-3 text-on-surface">Lacak Data Vital</h3>
                            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                                Pantau berat badan, tekanan darah, dan kadar gula darah secara rutin untuk melihat tren kesehatan jangka panjang Anda.
                            </p>
                            <div className="flex items-center gap-2 py-2 px-4 bg-surface rounded-full w-fit">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Update Real-time</span>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group bg-surface-container p-8 rounded-xl transition-all hover:-translate-y-2">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-6" style={{ background: 'var(--accent-purple)' }}>
                                <span className="material-symbols-outlined text-3xl">history_edu</span>
                            </div>
                            <h3 className="text-xl font-bold font-headline mb-3 text-on-surface">Riwayat Kunjungan</h3>
                            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                                Simpan semua catatan konsultasi dan rekomendasi dokter tanpa perlu menyimpan tumpukan berkas fisik atau resep kertas.
                            </p>
                            <div className="flex items-center gap-2 py-2 px-4 bg-surface rounded-full w-fit">
                                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-purple)' }} />
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-purple)' }}>Akses 24/7</span>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group bg-surface-container p-8 rounded-xl transition-all hover:-translate-y-2">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-6" style={{ background: 'var(--accent-orange)' }}>
                                <span className="material-symbols-outlined text-3xl">medication_liquid</span>
                            </div>
                            <h3 className="text-xl font-bold font-headline mb-3 text-on-surface">Rekomendasi Pintar</h3>
                            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                                Dapatkan notifikasi untuk jadwal pemeriksaan rutin dan tindak lanjut pengobatan berdasarkan riwayat kesehatan Anda.
                            </p>
                            <div className="flex items-center gap-2 py-2 px-4 bg-surface rounded-full w-fit">
                                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-orange)' }} />
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-orange)' }}>Personalisasi</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── WHY SEHATIN ── */}
                <section id="mengapa" className="py-24 px-6 md:px-20 bg-surface-container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Image */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                alt="Patient Dashboard"
                                className="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaEN3wsTT80UHDe07XouJPBgKfzLL3678wuyBG_o92OL2HVNtAjbTvTG9U4ZBvOScvxb4r8xzkpzp9TfsTBczbSSEQGXR9wJSeXznpmwM3bcogt7t9Cfzq00zrNq4GzhoAS_cxH-1rI9ZfJWW3SvjF9PfyvYDcIW-pk_6djcKWo_wGGRigHZKFiLTRTv9cvqBlQnSkmlzmRW6f-5Szkb3KS3JuS5BiZwOMCVsr0La5kkPGqPv6ckPtlO3w4PfMe56_1uTKkNJIm-c"
                            />
                            <div className="absolute inset-0 bg-primary/10" />
                        </div>

                        {/* Text */}
                        <div>
                            <h2 className="text-3xl font-extrabold font-headline mb-8 text-on-surface">
                                Mengapa Menggunakan Sehatin?
                            </h2>
                            <div className="space-y-8">
                                {[
                                    {
                                        title: 'Pemberdayaan Pasien',
                                        desc: 'Anda memegang kendali penuh atas data kesehatan Anda sendiri, kapan saja dan di mana saja.',
                                    },
                                    {
                                        title: 'Ramah Lingkungan & Efisien',
                                        desc: 'Sistem paperless yang mengurangi risiko kehilangan dokumen penting dan lebih ramah lingkungan.',
                                    },
                                    {
                                        title: 'Rekam Medis Digital Terpadu',
                                        desc: 'Memudahkan dokter memberikan diagnosa yang lebih baik dengan melihat riwayat kesehatan lengkap Anda secara instan.',
                                    },
                                ].map((item) => (
                                    <div key={item.title} className="flex gap-4">
                                        <div className="text-primary mt-1">
                                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                check_circle
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-on-surface mb-1">{item.title}</h4>
                                            <p className="text-sm text-on-surface-variant">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* ── FOOTER ── */}
            <footer className="bg-surface-container pt-20 pb-10 px-6 md:px-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                            <span className="font-headline font-extrabold text-xl text-on-surface">Sehatin</span>
                        </div>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                            Platform kesehatan digital masa depan untuk klinik kecil. Berfokus pada kemudahan akses data medis mandiri dan efisiensi pelayanan kesehatan tanpa kertas.
                        </p>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-on-primary transition-all">
                                <span className="material-symbols-outlined text-xl">share</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-on-primary transition-all">
                                <span className="material-symbols-outlined text-xl">mail</span>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold font-headline mb-6 text-on-surface">Dukungan Digital</h4>
                        <ul className="space-y-4 text-sm text-on-surface-variant">
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">smartphone</span>
                                Aplikasi Pasien
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">devices</span>
                                Dashboard Klinik
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">email</span>
                                support@sehatin.id
                            </li>
                        </ul>
                    </div>

                    {/* Security */}
                    <div>
                        <h4 className="font-bold font-headline mb-6 text-on-surface">Keamanan Data</h4>
                        <div className="space-y-4">
                            <div className="flex gap-3 text-sm text-on-surface-variant">
                                <span className="material-symbols-outlined text-primary shrink-0">verified_user</span>
                                <p>Data Anda dilindungi dengan enkripsi tingkat tinggi sesuai standar keamanan data medis global.</p>
                            </div>
                            <div className="flex gap-3 text-sm text-on-surface-variant">
                                <span className="material-symbols-outlined text-primary shrink-0">cloud_done</span>
                                <p>Penyimpanan cloud yang aman dengan backup rutin untuk menjamin ketersediaan rekam medis Anda.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-[#E2E8F0]/30 pt-8 flex flex-col md:flex-row justify-between gap-4 items-center">
                    <p className="text-xs text-on-surface-variant">© 2024 SEHATIN. Seluruh hak cipta dilindungi.</p>
                    <div className="flex gap-6 text-xs text-on-surface-variant">
                        <a className="hover:underline" href="#">Kebijakan Privasi</a>
                        <a className="hover:underline" href="#">Syarat &amp; Ketentuan</a>
                    </div>
                </div>
            </footer>
        </>
    );
}
