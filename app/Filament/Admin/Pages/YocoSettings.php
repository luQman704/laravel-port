<?php
namespace App\Filament\Admin\Pages;

use App\Models\Setting;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class YocoSettings extends Page
{
    protected static ?string $navigationIcon  = 'heroicon-o-credit-card';
    protected static ?string $navigationLabel = 'Yoco Payment';
    protected static ?string $navigationGroup = 'Integrations';
    protected static ?int    $navigationSort  = 10;
    protected static string  $view            = 'filament.pages.yoco-settings';

    public array $data = [];

    public function mount(): void
    {
        $yocoCfg = config('services.yoco', []);

        $this->data = [
            'yoco' => [
                'public_key' => Setting::get('yoco.public_key', $yocoCfg['public_key'] ?? ''),
                'secret_key' => Setting::get('yoco.secret_key', $yocoCfg['secret_key'] ?? ''),
            ],
        ];
    }

    public function save(): void
    {
        $flat = [];
        foreach ($this->data as $group => $fields) {
            foreach ((array) $fields as $key => $value) {
                $flat["{$group}.{$key}"] = $value;
            }
        }
        Setting::setMany($flat);
        Notification::make()->title('Yoco payment settings saved.')->success()->send();
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('save')
                ->label('Save Settings')
                ->icon('heroicon-o-check')
                ->action('save'),
        ];
    }
}
