import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Calendar, CreditCard, Droplet, Home } from 'lucide-react';
import * as React from 'react';
import { RegisterFormData, RegisterFieldName } from '../schema/register.schema';

interface RegisterStep2Props {
    data: RegisterFormData;
    setData: (key: RegisterFieldName, value: string) => void;
    errors: Partial<Record<RegisterFieldName, string>>;
    clearErrors: (key?: RegisterFieldName) => void;
    processing: boolean;
    onPrevious: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function RegisterStep2({ data, setData, errors, clearErrors, processing, onPrevious, onSubmit }: RegisterStep2Props) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2 text-center lg:text-left">
                <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Lengkapi Data Diri</h2>
                <p className="text-on-surface-variant font-medium">Informasi ini diperlukan untuk rekam medis Anda.</p>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="nik">NIK (Nomor Induk Kependudukan)</label>
                        <Input
                            id="nik"
                            value={data.nik}
                            onChange={(e) => { 
                                const val = e.target.value.replace(/\D/g, '');
                                setData('nik', val); 
                                clearErrors('nik'); 
                            }}
                            placeholder="16 digit nomor induk kependudukan"
                            type="text"
                            maxLength={16}
                            icon={CreditCard}
                            className={errors.nik ? 'ring-2 ring-red-500' : ''}
                        />
                        {errors.nik && <p className="text-red-500 text-xs mt-1">{errors.nik}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="date_of_birth">Tanggal Lahir</Label>
                            <Input
                                id="date_of_birth"
                                type="date"
                                className={cn(
                                    errors.date_of_birth ? 'ring-2 ring-red-500' : '',
                                    "text-on-surface [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                )}
                                value={data.date_of_birth}
                                onChange={(e) => {
                                    setData('date_of_birth', e.target.value);
                                    clearErrors('date_of_birth');
                                }}
                                icon={Calendar}
                            />
                            {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="blood_type">Golongan Darah</Label>
                            <Select
                                value={data.blood_type}
                                onValueChange={(value) => { setData('blood_type', value); clearErrors('blood_type'); }}
                            >
                                <SelectTrigger
                                    className={cn(errors.blood_type && "ring-2 ring-red-500")}
                                    id="blood_type"
                                    icon={Droplet}
                                >
                                    <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">A</SelectItem>
                                    <SelectItem value="B">B</SelectItem>
                                    <SelectItem value="AB">AB</SelectItem>
                                    <SelectItem value="O">O</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.blood_type && <p className="text-red-500 text-xs mt-1">{errors.blood_type}</p>}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-on-surface-variant px-1">Jenis Kelamin</label>
                        <RadioGroup
                            value={data.gender}
                            onValueChange={(value) => { setData('gender', value); clearErrors('gender'); }}
                            className="flex gap-4"
                        >
                            <div className="flex-1">
                                <Label
                                    htmlFor="gender-pria"
                                    className={`flex items-center gap-3 p-4 bg-surface-container rounded-lg cursor-pointer border-2 transition-all ${data.gender === 'pria' ? 'border-primary bg-white' : 'border-transparent'} ${errors.gender ? 'border-red-500' : ''}`}
                                >
                                    <RadioGroupItem value="pria" id="gender-pria" />
                                    <span className="text-on-surface-variant font-semibold">Laki-laki</span>
                                </Label>
                            </div>
                            <div className="flex-1">
                                <Label
                                    htmlFor="gender-wanita"
                                    className={`flex items-center gap-3 p-4 bg-surface-container rounded-lg cursor-pointer transition-all border-2 ${data.gender === 'wanita' ? 'border-primary bg-white' : 'border-transparent'} ${errors.gender ? 'border-red-500' : ''}`}
                                >
                                    <RadioGroupItem value="wanita" id="gender-wanita" />
                                    <span className="text-on-surface-variant font-semibold">Perempuan</span>
                                </Label>
                            </div>
                        </RadioGroup>
                        {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="address">Alamat Lengkap</label>
                        <Textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => { setData('address', e.target.value); clearErrors('address'); }}
                            placeholder="Masukkan alamat lengkap Anda saat ini"
                            icon={Home}
                            className={errors.address ? 'ring-2 ring-red-500' : ''}
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button variant="outline" className="flex-1" type="button" onClick={onPrevious}>
                        Kembali
                    </Button>
                    <Button className="flex-[2] group" type="submit" disabled={processing}>
                        {processing ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
