<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Poli;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PoliController extends Controller
{
    public function index(): Response
    {
        $polis = Poli::withCount('doctors')
            ->orderBy('name')
            ->get()
            ->map(fn($poli) => [
                'id'          => $poli->id,
                'name'        => $poli->name,
                'icon'        => $poli->icon,
                'description' => $poli->description,
                'is_active'   => (bool) $poli->is_active,
                'doctors_count' => $poli->doctors_count,
            ]);

        $stats = [
            'total'    => $polis->count(),
            'active'   => $polis->where('is_active', true)->count(),
            'inactive' => $polis->where('is_active', false)->count(),
        ];

        return Inertia::render('admin/polis/pages/polis', [
            'polis' => $polis,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:polis,name',
            'icon'        => 'nullable|string|max:100',
            'description' => 'nullable|string|max:1000',
            'is_active'   => 'required|boolean',
        ]);

        try {
            Poli::create($validated);
            return redirect()->back()->with('success', 'Poli berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menambahkan poli. Silakan coba lagi.');
        }
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $poli = Poli::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:polis,name,' . $id,
            'icon'        => 'nullable|string|max:100',
            'description' => 'nullable|string|max:1000',
            'is_active'   => 'required|boolean',
        ]);

        try {
            $poli->update($validated);
            return redirect()->back()->with('success', 'Poli berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui poli. Silakan coba lagi.');
        }
    }

    public function destroy(int $id): RedirectResponse
    {
        try {
            $poli = Poli::findOrFail($id);
            $poli->delete();
            return redirect()->back()->with('success', 'Poli berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus poli. Silakan coba lagi.');
        }
    }
}
