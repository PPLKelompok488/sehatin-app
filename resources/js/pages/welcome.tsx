import { type SharedData } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BrandLogo } from '@/components/ui/brand-logo';
import { DocAnimation } from '@/components/ui/doc-animation';
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

                /* Hero animation keyframes */
                @keyframes ecg-draw {
                    0%   { stroke-dashoffset: 900; }
                    100% { stroke-dashoffset: 0; }
                }
                @keyframes ecg-loop {
                    0%   { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: -900; }
                }
                @keyframes float-a {
                    0%, 100% { transform: translateY(0px) rotate(-1deg); }
                    50%      { transform: translateY(-14px) rotate(1deg); }
                }
                @keyframes float-b {
                    0%, 100% { transform: translateY(0px) rotate(1deg); }
                    50%      { transform: translateY(-10px) rotate(-1deg); }
                }
                @keyframes float-c {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-18px); }
                }
                @keyframes pulse-ring {
                    0%   { transform: scale(1);   opacity: 0.6; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                @keyframes pulse-ring2 {
                    0%   { transform: scale(1);   opacity: 0.4; }
                    100% { transform: scale(1.8); opacity: 0; }
                }
                @keyframes orb-drift {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%      { transform: translate(20px, -15px) scale(1.05); }
                    66%      { transform: translate(-10px, 12px) scale(0.95); }
                }
                @keyframes counter-up {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-slide-in {
                    from { opacity: 0; transform: translateX(30px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                .ecg-line {
                    stroke-dasharray: 900;
                    stroke-dashoffset: 900;
                    animation: ecg-draw 1.8s ease-out forwards, ecg-loop 3s linear 1.8s infinite;
                }
                .hero-card-a { animation: float-a 6s ease-in-out infinite; }
                .hero-card-b { animation: float-b 7s ease-in-out infinite 0.5s; }
                .hero-card-c { animation: float-c 5s ease-in-out infinite 1s; }
                .hero-card-d { animation: float-a 6.5s ease-in-out infinite 0.3s; }
                .hero-visual  { animation: fade-slide-in 0.9s ease-out both 0.3s; }

                /* Responsive adjustments to prevent card overlap */
                @media (max-width: 1280px) {
                    .hero-card-a { top: 8% !important; right: 6% !important; }
                    .hero-card-b { bottom: 16% !important; right: 6% !important; }
                    .hero-card-c { top: 64% !important; left: 8% !important; }
                    .hero-card-d { top: 100% !important; left: 0% !important; }
                }

                @media (max-width: 1024px) {
                    .hero-card-a { display: none !important; }
                    .hero-card-b { bottom: 18% !important; right: 6% !important; }
                    .hero-card-c { top: 62% !important; left: 5% !important; }
                    .hero-card-d { display: none !important; }
                }
            `}</style>

            {/* ── HEADER ── */}
            <header className="fixed top-0 w-full z-50 glass-nav border-b border-[#E2E8F0]">
                <div className="relative flex items-center px-6 py-3 w-full">
                    {/* Logo – left */}
                    <BrandLogo size={8} />

                    {/* Nav – center */}
                    <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                        <a className="text-primary font-semibold" href="#">Home</a>
                        <a className="text-on-surface-variant hover:text-primary transition-colors" href="#layanan">Layanan</a>
                    </nav>

                    {/* Right – profile or action buttons */}
                    <div className="ml-auto flex items-center gap-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="flex items-center gap-3 group">
                                <Avatar className="h-9 w-9 border-2 border-primary/20 group-hover:border-primary transition-colors">
                                    <AvatarFallback className="bg-primary text-on-primary font-bold text-sm">
                                        {auth.user.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                {/* User Info (hidden on mobile) */}
                                <div className="hidden md:flex flex-col items-start leading-none">
                                    <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                                        {auth.user.name}
                                    </span>
                                    <span className="text-[10px] font-semibold text-on-surface-variant capitalize mt-0.5">
                                        {auth.user.role}
                                    </span>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route('login')}
                                    className="text-sm font-bold text-on-surface hover:text-primary transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-primary text-sm font-bold text-on-primary shadow-sm hover:brightness-95 active:scale-95 transition-all duration-200"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-16">
                {/* ── HERO ── */}
                <section className="relative min-h-[800px] flex items-center px-6 md:px-20 overflow-hidden bg-background">
                    {/* Right — animated health visual */}
                    <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:flex items-center justify-center hero-visual overflow-hidden">

                        {/* Left-edge seamless fade into page background */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '13%', height: '100%', zIndex: 20,
                            background: 'linear-gradient(to right, var(--color-background, #ffffff) 0%, transparent 100%)',
                            pointerEvents: 'none',
                        }} />

                        {/* Ambient gradient background */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'radial-gradient(ellipse at 70% 35%, rgba(0,200,130,0.10) 0%, transparent 65%), radial-gradient(ellipse at 40% 75%, rgba(168,85,247,0.07) 0%, transparent 60%)',
                        }} />

                        {/* Floating orbs */}
                        <div style={{ position:'absolute', top:'12%', right:'18%', width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,200,130,0.15) 0%, transparent 70%)', animation:'orb-drift 9s ease-in-out infinite' }} />
                        <div style={{ position:'absolute', bottom:'15%', left:'8%',  width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', animation:'orb-drift 12s ease-in-out infinite 2s' }} />

                        {/* Doctor Image Background */}
                        <div style={{ position: 'absolute', bottom: '-2%', right: '8%', height: '120%', zIndex: 5, pointerEvents: 'none' }}>
                            <DocAnimation style={{ height: '100%', objectFit: 'contain', opacity: 0.95 }} />
                        </div>

                        {/* Central monitor card (Detak Jantung) */}
                        <div className="hero-card-d" style={{
                            position:'absolute', top:'30%', left:'5%', zIndex:1,
                            width:240, background:'rgba(255,255,255,0.7)',
                            backdropFilter:'blur(18px)', borderRadius:20,
                            border:'1.5px solid rgba(255,255,255,0.9)',
                            boxShadow:'0 24px 64px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)',
                            padding:'16px 16px 14px',
                        }}>
                            {/* Card header */}
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                    <div style={{ width:26, height:26, borderRadius:8, background:'var(--color-primary, #00c882)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        <span className="material-symbols-outlined" style={{ color:'white', fontSize:14, fontVariationSettings:"'FILL' 1" }}>favorite</span>
                                    </div>
                                    <div>
                                        <div style={{ fontSize:10, fontWeight:700, color:'#64748b' }}>Detak jantung</div>
                                        <div style={{ fontSize:9, color:'#94a3b8' }}>Live monitor</div>
                                    </div>
                                </div>
                                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                                    {/* Pulse indicator */}
                                    <div style={{ position:'relative', width:8, height:8 }}>
                                        <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'#22c55e', animation:'pulse-ring 1.4s ease-out infinite' }} />
                                        <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'#22c55e', animation:'pulse-ring2 1.4s ease-out infinite 0.4s' }} />
                                        <div style={{ position:'relative', width:8, height:8, borderRadius:'50%', background:'#22c55e' }} />
                                    </div>
                                </div>
                            </div>

                            {/* BPM display */}
                            <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:10 }}>
                                <span style={{ fontSize:36, fontWeight:900, color:'var(--color-primary, #00c882)', lineHeight:1, fontFamily:'var(--font-headline, sans-serif)' }}>78</span>
                                <span style={{ fontSize:12, color:'#94a3b8', fontWeight:600 }}>bpm</span>
                                <span style={{ marginLeft:'auto', fontSize:9, fontWeight:700, color:'#22c55e', background:'#dcfce7', padding:'2px 6px', borderRadius:20 }}>Normal</span>
                            </div>

                            {/* ECG SVG */}
                            <div style={{ background:'rgba(0,0,0,0.03)', borderRadius:10, padding:'8px 6px', overflow:'hidden' }}>
                                <svg viewBox="0 0 320 70" width="100%" height="45" style={{ display:'block' }}>
                                    <defs>
                                        <linearGradient id="ecg-grad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%"  stopColor="var(--color-primary, #00c882)" stopOpacity="0" />
                                            <stop offset="30%" stopColor="var(--color-primary, #00c882)" stopOpacity="1" />
                                            <stop offset="100%" stopColor="var(--color-primary, #00c882)" stopOpacity="1" />
                                        </linearGradient>
                                    </defs>
                                    {/* Baseline grid lines */}
                                    {[14,28,42,56].map(y => (
                                        <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
                                    ))}
                                    {/* ECG path: flat → spike → dip → recovery × 2 */}
                                    <path
                                        className="ecg-line"
                                        d="M0,35 L30,35 L38,35 L42,15 L46,55 L50,28 L54,35 L80,35 L88,35 L92,15 L96,55 L100,28 L104,35 L150,35 L158,35 L162,15 L166,55 L170,28 L174,35 L220,35 L228,35 L232,15 L236,55 L240,28 L244,35 L290,35 L320,35"
                                        fill="none"
                                        stroke="url(#ecg-grad)"
                                        strokeWidth="3.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Floating card A — Blood Oxygen */}
                        <div className="hero-card-a" style={{
                            position:'absolute', top:'18%', right:'10%', zIndex:1,
                            background:'rgba(255,255,255,0.82)', backdropFilter:'blur(14px)',
                            borderRadius:18, border:'1.5px solid rgba(255,255,255,0.9)',
                            boxShadow:'0 12px 32px rgba(0,0,0,0.09)',
                            padding:'14px 18px', minWidth:148,
                        }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                                <span className="material-symbols-outlined" style={{ color:'#3b82f6', fontSize:18, fontVariationSettings:"'FILL' 1" }}>water_drop</span>
                                <span style={{ fontSize:10, fontWeight:700, color:'#64748b' }}>Oksigen darah</span>
                            </div>
                            <div style={{ fontSize:34, fontWeight:900, color:'#3b82f6', lineHeight:1 }}>98<span style={{ fontSize:14, fontWeight:600, color:'#94a3b8' }}>%</span></div>
                            <div style={{ fontSize:10, color:'#22c55e', fontWeight:600, marginTop:4 }}>↑ SpO₂ Normal</div>
                        </div>

                        {/* Floating card B — Next Appointment */}
                        <div className="hero-card-b" style={{
                            position:'absolute', bottom:'22%', right:'4%', zIndex:12,
                            background:'rgba(255,255,255,0.82)', backdropFilter:'blur(14px)',
                            borderRadius:18, border:'1.5px solid rgba(255,255,255,0.9)',
                            boxShadow:'0 12px 32px rgba(0,0,0,0.09)',
                            padding:'14px 18px', minWidth:172,
                        }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                                <span className="material-symbols-outlined" style={{ color:'#a855f7', fontSize:18, fontVariationSettings:"'FILL' 1" }}>event_available</span>
                                <span style={{ fontSize:10, fontWeight:700, color:'#64748b' }}>Janji dokter</span>
                            </div>
                            <div style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>dr. Bryan Sp.PD</div>
                            <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Hari ini · 09:00 WIB</div>
                            <div style={{ marginTop:8, height:4, borderRadius:4, background:'#f1f5f9', overflow:'hidden' }}>
                                <div style={{ width:'65%', height:'100%', borderRadius:4, background:'linear-gradient(90deg,#a855f7,#7c3aed)' }} />
                            </div>
                        </div>

                        {/* Floating card C — Records */}
                        <div className="hero-card-c" style={{
                            position:'absolute', top:'64%', left:'12%', zIndex:12,
                            background:'rgba(255,255,255,0.82)', backdropFilter:'blur(14px)',
                            borderRadius:18, border:'1.5px solid rgba(255,255,255,0.9)',
                            boxShadow:'0 12px 32px rgba(0,0,0,0.09)',
                            padding:'14px 18px', minWidth:148,
                        }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                                <span className="material-symbols-outlined" style={{ color:'#f97316', fontSize:18, fontVariationSettings:"'FILL' 1" }}>clinical_notes</span>
                                <span style={{ fontSize:10, fontWeight:700, color:'#64748b' }}>Rekam medis</span>
                            </div>
                            <div style={{ fontSize:30, fontWeight:900, color:'#f97316', lineHeight:1 }}>12</div>
                            <div style={{ fontSize:10, color:'#94a3b8', fontWeight:600, marginTop:4 }}>Kunjungan Tersimpan</div>
                        </div>

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
                        <BrandLogo size={8} />
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
