<?php

namespace App\Filament\Admin\Pages\Auth;

use Filament\Pages\Auth\Login as BaseLogin;
use Illuminate\Contracts\View\View;

class Login extends BaseLogin
{
    public function render(): View
    {
        return view('filament.admin.auth.login', ['livewire' => $this]);
    }
}
