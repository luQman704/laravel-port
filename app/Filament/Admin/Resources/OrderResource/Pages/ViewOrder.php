<?php

namespace App\Filament\Admin\Resources\OrderResource\Pages;

use App\Filament\Admin\Resources\OrderResource;
use App\Models\Order;
use Filament\Actions;
use Filament\Forms;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Pages\ViewRecord;

class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('updateStatus')
                ->label('Update Status')
                ->icon('heroicon-o-arrow-path')
                ->form([
                    Forms\Components\Select::make('status')
                        ->label('New Status')
                        ->options([
                            'pending'    => 'Pending',
                            'paid'       => 'Paid',
                            'processing' => 'Processing',
                            'shipped'    => 'Shipped',
                            'delivered'  => 'Delivered',
                            'cancelled'  => 'Cancelled',
                        ])
                        ->required()
                        ->default(fn () => $this->record->status),
                ])
                ->action(function (array $data): void {
                    $this->record->update(['status' => $data['status']]);
                    $this->refreshFormData(['status']);
                })
                ->modalHeading('Update Order Status')
                ->modalSubmitActionLabel('Save'),
        ];
    }

    public function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                // ── Order summary ────────────────────────────────────────────
                Infolists\Components\Section::make('Order Summary')
                    ->columns(3)
                    ->schema([
                        Infolists\Components\TextEntry::make('id')
                            ->label('Order #'),

                        Infolists\Components\TextEntry::make('status')
                            ->label('Status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'pending'    => 'warning',
                                'paid'       => 'success',
                                'processing' => 'info',
                                'shipped'    => 'primary',
                                'delivered'  => 'success',
                                'cancelled'  => 'danger',
                                default      => 'gray',
                            })
                            ->formatStateUsing(fn (string $state): string => ucfirst($state)),

                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Order Date')
                            ->dateTime('d M Y, H:i'),

                        Infolists\Components\TextEntry::make('payment_method')
                            ->label('Payment Method'),

                        Infolists\Components\TextEntry::make('payment_ref')
                            ->label('Payment Reference')
                            ->default('—'),

                        Infolists\Components\TextEntry::make('yoco_checkout_id')
                            ->label('Yoco Checkout ID')
                            ->default('—'),

                        Infolists\Components\TextEntry::make('yoco_charge_id')
                            ->label('Yoco Charge ID')
                            ->default('—'),
                    ]),

                // ── Shipping address ─────────────────────────────────────────
                Infolists\Components\Section::make('Shipping Address')
                    ->columns(2)
                    ->schema([
                        Infolists\Components\TextEntry::make('shipping_name')
                            ->label('Name'),

                        Infolists\Components\TextEntry::make('shipping_email')
                            ->label('Email'),

                        Infolists\Components\TextEntry::make('shipping_phone')
                            ->label('Phone')
                            ->default('—'),

                        Infolists\Components\TextEntry::make('shipping_address')
                            ->label('Street Address'),

                        Infolists\Components\TextEntry::make('shipping_city')
                            ->label('City'),

                        Infolists\Components\TextEntry::make('shipping_province')
                            ->label('Province'),

                        Infolists\Components\TextEntry::make('shipping_postal_code')
                            ->label('Postal Code'),
                    ]),

                // ── Shipping details ─────────────────────────────────────────
                Infolists\Components\Section::make('Shipping Details')
                    ->columns(3)
                    ->schema([
                        Infolists\Components\TextEntry::make('shipping_carrier')
                            ->label('Carrier')
                            ->default('—'),

                        Infolists\Components\TextEntry::make('shipping_service')
                            ->label('Service')
                            ->default('—'),

                        Infolists\Components\TextEntry::make('cart_weight_kg')
                            ->label('Weight (kg)')
                            ->default('—'),

                        Infolists\Components\TextEntry::make('shiplogic_shipment_id')
                            ->label('Shiplogic Shipment ID')
                            ->default('—'),

                        Infolists\Components\TextEntry::make('waybill_number')
                            ->label('Waybill Number')
                            ->default('—'),
                    ]),

                // ── Order items ──────────────────────────────────────────────
                Infolists\Components\Section::make('Order Items')
                    ->schema([
                        Infolists\Components\RepeatableEntry::make('items')
                            ->label('')
                            ->columns(6)
                            ->schema([
                                Infolists\Components\TextEntry::make('product_name')
                                    ->label('Product'),

                                Infolists\Components\TextEntry::make('part_number')
                                    ->label('Part #'),

                                Infolists\Components\TextEntry::make('brand_name')
                                    ->label('Brand'),

                                Infolists\Components\TextEntry::make('qty')
                                    ->label('Qty'),

                                Infolists\Components\TextEntry::make('unit_price_incl')
                                    ->label('Unit Price')
                                    ->money('ZAR'),

                                Infolists\Components\TextEntry::make('line_total_incl')
                                    ->label('Line Total')
                                    ->money('ZAR'),
                            ]),
                    ]),

                // ── Totals ───────────────────────────────────────────────────
                Infolists\Components\Section::make('Totals')
                    ->columns(4)
                    ->schema([
                        Infolists\Components\TextEntry::make('subtotal_excl')
                            ->label('Subtotal (excl. VAT)')
                            ->money('ZAR'),

                        Infolists\Components\TextEntry::make('vat_amount')
                            ->label('VAT')
                            ->money('ZAR'),

                        Infolists\Components\TextEntry::make('shipping_cost')
                            ->label('Shipping')
                            ->money('ZAR'),

                        Infolists\Components\TextEntry::make('total_incl')
                            ->label('Total (incl. VAT)')
                            ->money('ZAR')
                            ->weight(\Filament\Support\Enums\FontWeight::Bold),
                    ]),

                // ── Gift wrap & notes ────────────────────────────────────────
                Infolists\Components\Section::make('Gift Wrap & Notes')
                    ->columns(2)
                    ->schema([
                        Infolists\Components\IconEntry::make('gift_wrapped')
                            ->label('Gift Wrapped')
                            ->boolean(),

                        Infolists\Components\TextEntry::make('gift_wrap_cost')
                            ->label('Gift Wrap Cost')
                            ->money('ZAR')
                            ->default('—'),

                        Infolists\Components\TextEntry::make('order_notes')
                            ->label('Order Notes')
                            ->columnSpanFull()
                            ->default('—'),
                    ]),
            ]);
    }
}
