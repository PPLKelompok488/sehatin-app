<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Theme extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Get a theme value by key.
     */
    public static function getByKey(string $key, $default = null)
    {
        return self::where('key', $key)->first()?->value ?? $default;
    }
}
