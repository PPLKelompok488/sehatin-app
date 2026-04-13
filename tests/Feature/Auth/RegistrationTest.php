<?php

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'nik' => '1234567890123456',
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '081234567890',
        'password' => 'password',
        'password_confirmation' => 'password',
        'date_of_birth' => '1990-01-01',
        'gender' => 'pria',
        'address' => 'Jl. Kebon Jeruk No. 12',
        'blood_type' => 'O',
    ]);

    $this->assertGuest();
    $response->assertRedirect(route('login'));
});