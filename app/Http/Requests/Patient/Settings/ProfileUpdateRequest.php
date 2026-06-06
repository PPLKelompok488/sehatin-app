<?php

namespace App\Http\Requests\Patient\Settings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->role === 'patient';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, string|array>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'gender' => ['required', 'in:pria,wanita'],
            'blood_type' => ['required', 'in:A,B,AB,O'],
            'address' => ['required', 'string', 'min:5'],
            'password' => ['nullable', 'string', Password::min(8)->mixedCase()->numbers()],
            'password_confirmation' => ['nullable', 'string', 'required_with:password', 'same:password'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap harus diisi.',
            'name.max' => 'Nama lengkap tidak boleh lebih dari 255 karakter.',
            'phone.required' => 'Nomor ponsel harus diisi.',
            'phone.max' => 'Nomor ponsel tidak boleh lebih dari 20 karakter.',
            'date_of_birth.required' => 'Tanggal lahir harus diisi.',
            'date_of_birth.date' => 'Format tanggal lahir tidak valid.',
            'date_of_birth.before' => 'Tanggal lahir harus sebelum hari ini.',
            'gender.required' => 'Jenis kelamin harus dipilih.',
            'gender.in' => 'Jenis kelamin harus pria atau wanita.',
            'blood_type.required' => 'Golongan darah harus dipilih.',
            'blood_type.in' => 'Golongan darah harus A, B, AB, atau O.',
            'address.required' => 'Alamat lengkap harus diisi.',
            'address.min' => 'Alamat lengkap minimal 5 karakter.',
            'password.min' => 'Kata sandi minimal 8 karakter dengan huruf besar, huruf kecil, dan angka.',
            'password.mixed_case' => 'Kata sandi harus mengandung huruf besar dan huruf kecil.',
            'password.numbers' => 'Kata sandi harus mengandung angka.',
            'password_confirmation.required_with' => 'Konfirmasi kata sandi harus diisi jika mengubah kata sandi.',
            'password_confirmation.same' => 'Konfirmasi kata sandi tidak cocok dengan kata sandi baru.',
        ];
    }
}
