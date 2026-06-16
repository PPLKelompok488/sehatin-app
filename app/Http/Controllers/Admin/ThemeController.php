<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ThemeController extends Controller
{
    /**
     * Display the theme settings page.
     */
    public function index(): Response
    {
        return Inertia::render('admin/theme/index');
    }

    /**
     * Update the theme settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'primary_color' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'secondary_color' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'brand_logo' => ['nullable', 'image', 'mimes:png,jpg,jpeg,svg', 'max:2048'],
        ]);

        try {
            Theme::updateOrCreate(
                ['key' => 'primary_color'],
                ['value' => strtolower($request->primary_color)]
            );

            Theme::updateOrCreate(
                ['key' => 'secondary_color'],
                ['value' => strtolower($request->secondary_color)]
            );

            if ($request->hasFile('brand_logo')) {
                // Delete old logo if it was uploaded
                $oldLogo = Theme::getByKey('brand_logo');
                if ($oldLogo && str_starts_with($oldLogo, '/storage/themes/')) {
                    $oldPath = str_replace('/storage/', '', $oldLogo);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }

                $path = $request->file('brand_logo')->store('themes', 'public');
                Theme::updateOrCreate(
                    ['key' => 'brand_logo'],
                    ['value' => '/storage/' . $path]
                );
            }

            return redirect()->back()->with('success', 'tema berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'gagal memperbarui tema. silakan coba lagi.');
        }
    }
}
