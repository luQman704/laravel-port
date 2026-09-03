<?php

namespace App\Filament\Admin\Pages;

use App\Models\Setting;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class Turn14Settings extends Page
{
    protected static ?string $navigationIcon  = 'heroicon-o-adjustments-horizontal';
    protected static ?string $navigationLabel = 'Turn14 Settings';
    protected static ?string $navigationGroup = 'Turn14';
    protected static ?int    $navigationSort  = 10;
    protected static string  $view            = 'filament.pages.turn14-settings';

    public array $data = [];

public function mount(): void
    {
        $cfg     = config('turn14');
        $yocoCfg = config('services.yoco');

        $this->data = [
            'turn14' => [
                'api_url'           => Setting::get('turn14.api_url',           $cfg['api_url'] ?? ''),
                'client_id'         => Setting::get('turn14.client_id',         $cfg['client_id'] ?? ''),
                'client_secret'     => Setting::get('turn14.client_secret',     $cfg['client_secret'] ?? ''),
                'exchange_rate'     => Setting::get('turn14.exchange_rate',     $cfg['exchange_rate'] ?? 17),
                'markup_rate'       => Setting::get('turn14.markup_rate',       $cfg['markup_rate'] ?? 0.7),
                'customs_duty'      => Setting::get('turn14.customs_duty',      $cfg['customs_duty'] ?? 10),
                'tax_rate'          => Setting::get('turn14.tax_rate',          $cfg['tax_rate'] ?? 15),
                'price_rounding'    => Setting::get('turn14.price_rounding',    $cfg['price_rounding'] ?? 5),
                'freight_discount'  => Setting::get('turn14.freight_discount',  $cfg['freight_discount'] ?? 50),
                'fuel_surcharge'    => Setting::get('turn14.fuel_surcharge',    $cfg['fuel_surcharge'] ?? 48),
                'disbursement_rate' => Setting::get('turn14.disbursement_rate', $cfg['disbursement_rate'] ?? 4),
                'disbursement_min'  => Setting::get('turn14.disbursement_min',  $cfg['disbursement_min'] ?? 105),
                'ltl_shipping_cost' => Setting::get('turn14.ltl_shipping_cost', $cfg['ltl_shipping_cost'] ?? 1000),
                'weight_inflation'  => Setting::get('turn14.weight_inflation',  $cfg['weight_inflation'] ?? 10),
            ],
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
        Notification::make()->title('Settings saved.')->success()->send();
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
