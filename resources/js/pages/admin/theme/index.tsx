import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { LayoutDashboard, Activity, Stethoscope, Calendar, ArrowUpRight, CheckCircle2, Users } from 'lucide-react';
import * as React from 'react';

export default function ThemeSettings() {
    const { themes } = usePage<SharedData>().props;

    return (
        <AppLayout>
            <Head title="Pengaturan Tema" />

            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
                <PageHeader
                    title="Pengaturan Tema"
                    subtitle="Personalisasi identitas visual klinik Anda untuk pengalaman admin yang lebih baik."
                />
            </div>

            <div className="max-w-4xl mx-auto">
                <Card className="overflow-hidden rounded-3xl border-none bg-white shadow-sm p-8">
                    <div className="mb-6 flex flex-col items-center justify-center border-b border-slate-100 pb-6">
                        <span className="text-xs font-bold text-slate-400 tracking-wider">
                            pratinjau tema real-time
                        </span>
                    </div>

                    <div className="relative aspect-video w-full rounded-2xl border border-slate-200/80 bg-slate-50 shadow-inner overflow-hidden flex flex-col">
                        {/* Mock Header */}
                        <div className="h-12 border-b border-slate-200 bg-white px-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {themes?.brand_logo ? (
                                    <img src={themes.brand_logo} alt="Logo" className="h-6 w-auto object-contain" />
                                ) : (
                                    <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-[10px] text-white font-bold">
                                        S
                                    </div>
                                )}
                                <span className="text-xs font-bold text-slate-800">Sehatin</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="h-2 w-8 rounded bg-slate-200"></span>
                                <span className="h-2 w-8 rounded bg-slate-200"></span>
                                <span className="h-2 w-8 rounded bg-slate-200"></span>
                            </div>
                        </div>

                        {/* Mock Body */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Mock Sidebar */}
                            <div className="w-40 border-r border-slate-200 bg-white p-3 space-y-2 flex flex-col justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
                                        <LayoutDashboard className="size-3.5" />
                                        <span>Dashboard</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-500 text-[10px] font-semibold">
                                        <Activity className="size-3.5" />
                                        <span>Poli</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-500 text-[10px] font-semibold">
                                        <Stethoscope className="size-3.5" />
                                        <span>Dokter</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-500 text-[10px] font-semibold">
                                        <Calendar className="size-3.5" />
                                        <span>Jadwal</span>
                                    </div>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg text-[8px] text-slate-400 text-center">
                                    v1.0.0
                                </div>
                            </div>

                            {/* Mock Content */}
                            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="h-3.5 w-24 rounded bg-slate-800"></div>
                                        <div className="h-2 w-48 rounded bg-slate-400"></div>
                                    </div>
                                    <div className="h-6 w-16 rounded bg-primary text-[8px] text-white flex items-center justify-center font-bold">
                                        tambah
                                    </div>
                                </div>

                                {/* Mock Stats */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="p-2.5 rounded-xl border border-slate-100 bg-white shadow-2xs space-y-2">
                                        <div className="h-5 w-5 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 text-[8px]">
                                            <Calendar className="size-3" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="h-1.5 w-12 rounded bg-slate-400"></div>
                                            <div className="h-3 w-8 rounded bg-slate-800"></div>
                                        </div>
                                        <div className="flex items-center gap-1 text-[6px] text-green-600 font-bold bg-green-50 rounded-full px-1 py-0.25 w-max">
                                            <ArrowUpRight className="size-2" />
                                            <span>12%</span>
                                        </div>
                                    </div>

                                    <div className="p-2.5 rounded-xl border border-slate-100 bg-white shadow-2xs space-y-2">
                                        <div className="h-5 w-5 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-[8px]">
                                            <Users className="size-3" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="h-1.5 w-12 rounded bg-slate-400"></div>
                                            <div className="h-3 w-8 rounded bg-slate-800"></div>
                                        </div>
                                        <div className="flex items-center gap-1 text-[6px] text-green-600 font-bold bg-green-50 rounded-full px-1 py-0.25 w-max">
                                            <ArrowUpRight className="size-2" />
                                            <span>8%</span>
                                        </div>
                                    </div>

                                    <div className="p-2.5 rounded-xl border border-slate-100 bg-white shadow-2xs space-y-2">
                                        <div className="h-5 w-5 rounded-lg bg-green-50 flex items-center justify-center text-green-500 text-[8px]">
                                            <CheckCircle2 className="size-3" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="h-1.5 w-12 rounded bg-slate-400"></div>
                                            <div className="h-3 w-8 rounded bg-slate-800"></div>
                                        </div>
                                        <div className="flex items-center gap-1 text-[6px] text-green-600 font-bold bg-green-50 rounded-full px-1 py-0.25 w-max">
                                            <ArrowUpRight className="size-2" />
                                            <span>15%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mock Interactive Elements */}
                                <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                                        <div className="h-2 w-28 rounded bg-slate-600"></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 rounded text-[8px] bg-secondary text-white font-bold">
                                            sekunder
                                        </span>
                                        <span className="px-2 py-1 rounded text-[8px] border border-primary/20 text-primary font-bold">
                                            outline
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
