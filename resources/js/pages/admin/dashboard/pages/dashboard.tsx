import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { ArrowDownRight, ArrowUpRight, Calendar, CheckCircle2, Users, XCircle } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface DashboardProps {
    stats: {
        totalAppointments: { value: string; growth: number };
        newPatients: { value: string; growth: number };
        completedVisits: { value: string; growth: number };
        cancelledVisits: { value: string; growth: number };
    };
    visitStats: Array<{ day: string; visits: number; new: number; old: number }>;
    favoritePolis: Array<{ id: number; name: string; count: number; color: string }>;
    topDoctors: Array<{ name: string; specialization: string; count: number; avatar: string }>;
}

export default function AdminDashboard({ stats, visitStats, favoritePolis, topDoctors }: DashboardProps) {
    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="flex items-center justify-between">
                <PageHeader
                    title="Laporan & Analitik"
                    subtitle="Pantau performa klinik dan aktivitas pasien dalam satu dashboard terintegrasi."
                />
            </div>

            <div className="mt-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Janji Temu"
                        value={stats.totalAppointments.value}
                        growth={stats.totalAppointments.growth}
                        icon={<Calendar className="h-5 w-5 text-blue-500" />}
                        iconBg="bg-blue-50"
                    />
                    <StatCard
                        title="Pasien Baru"
                        value={stats.newPatients.value}
                        growth={stats.newPatients.growth}
                        icon={<Users className="h-5 w-5 text-orange-500" />}
                        iconBg="bg-orange-50"
                    />
                    <StatCard
                        title="Kunjungan Selesai"
                        value={stats.completedVisits.value}
                        growth={stats.completedVisits.growth}
                        icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
                        iconBg="bg-green-50"
                    />
                    <StatCard
                        title="Batal & Absen"
                        value={stats.cancelledVisits.value}
                        growth={stats.cancelledVisits.growth}
                        icon={<XCircle className="h-5 w-5 text-red-500" />}
                        iconBg="bg-red-50"
                    />
                </div>

                {/* Main Chart */}
                <Card className="overflow-hidden rounded-3xl border-none bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-8">
                        <div>
                            <CardTitle className="text-xl font-bold">Statistik Kunjungan</CardTitle>
                            <p className="text-sm text-muted-foreground">Tren volume pasien mingguan</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-primary/30"></span>
                                <span className="text-muted-foreground">Pasien Baru</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-primary"></span>
                                <span className="text-muted-foreground">Pasien Lama</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px] px-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={visitStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="visits"
                                    stroke="var(--color-primary)"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorVisits)"
                                    dot={{ r: 4, fill: 'var(--color-primary)', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, fill: 'var(--color-primary)', strokeWidth: 2, stroke: '#fff' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Favorite Polis */}
                    <Card className="rounded-3xl border-none bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-6">
                            <div>
                                <CardTitle className="text-lg font-bold">Trafik Poli Favorit</CardTitle>
                            </div>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50">Bulan Ini</Badge>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {favoritePolis.map((poli, index) => (
                                <div key={poli.id} className="group flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-sm font-bold text-slate-400">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-slate-700">{poli.name}</span>
                                            <span className="font-bold text-slate-900">{poli.count}</span>
                                        </div>
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full transition-all duration-1000"
                                                style={{
                                                    width: `${(poli.count / (favoritePolis[0]?.count || 1)) * 100}%`,
                                                    backgroundColor: poli.color
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Top Doctors */}
                    <Card className="rounded-3xl border-none bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-6">
                            <div>
                                <CardTitle className="text-lg font-bold">Performa Dokter</CardTitle>
                            </div>
                            <Badge variant="secondary" className="bg-purple-50 text-purple-600 hover:bg-purple-50">Tertinggi</Badge>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {topDoctors.map((doctor, index) => (
                                <div key={index} className="flex items-center justify-between rounded-2xl p-2 transition-colors hover:bg-slate-50">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                            <AvatarImage src={doctor.avatar} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {doctor.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-bold text-slate-900">{doctor.name}</div>
                                            <div className="text-xs text-muted-foreground">{doctor.specialization}</div>
                                        </div>
                                    </div>
                                    <div className="text-right text-xs">
                                        <div className="font-bold text-slate-900">{doctor.count}</div>
                                        <div className="text-muted-foreground text-[10px]">Kunjungan</div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, growth, icon, iconBg }: { title: string; value: string; growth: number; icon: React.ReactNode; iconBg: string }) {
    const isPositive = growth >= 0;
    return (
        <Card className="rounded-3xl border-none bg-white shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-6">
                <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-2xl", iconBg)}>
                    {icon}
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-black text-slate-900">{value}</h3>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <div className={cn(
                        "flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold",
                        isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                        {isPositive ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />}
                        {Math.abs(growth)}%
                    </div>
                    <span className="text-[10px] text-muted-foreground">Bulan ini</span>
                </div>
            </CardContent>
        </Card>
    );
}
