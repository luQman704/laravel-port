<?php
namespace App\Filament\Admin\Pages;

use App\Models\Setting;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class TcgSettings extends Page
{
    protected static ?string $navigationIcon  = 'heroicon-o-truck';
    protected static ?string $navigationLabel = 'The Courier Guy';
    protected static ?string $navigationGroup = 'Integrations';
    protected static ?int    $navigationSort  = 20;
    protected static string  $view            = 'filament.pages.tcg-settings';

    public array $data = [];

    public function mount(): void
    {
        $this->data = [
            'tcg' => [
                'api_key'        => Setting::get('tcg.api_key', ''),
                'company_name'   => Setting::get('tcg.company_name', 'Performance Products SA'),
                'address_line1'  => Setting::get('tcg.address_line1', ''),
                'address_line2'  => Setting::get('tcg.address_line2', ''),
                'city'           => Setting::get('tcg.city', ''),
                'province'       => Setting::get('tcg.province', ''),
                'postal_code'    => Setting::get('tcg.postal_code', ''),
                'contact_person' => Setting::get('tcg.contact_person', ''),
                'contact_phone'  => Setting::get('tcg.contact_phone', ''),
                'email'          => Setting::get('tcg.email', ''),
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
        Notification::make()->title('The Courier Guy settings saved.')->success()->send();
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
