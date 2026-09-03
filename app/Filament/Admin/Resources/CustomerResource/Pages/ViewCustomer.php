<?php

namespace App\Filament\Admin\Resources\CustomerResource\Pages;

use App\Filament\Admin\Resources\CustomerResource;
use App\Models\User;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Pages\ViewRecord;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Illuminate\Database\Eloquent\Builder;

class ViewCustomer extends ViewRecord implements HasTable
{
    use InteractsWithTable;

    protected static string $resource = CustomerResource::class;

    public function table(Table $table): Table
    {
        /** @var User $customer */
        $customer = $this->record;

        return $table
            ->query(fn (): Builder => $customer->orders()->getQuery())
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('Order #')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
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

                Tables\Columns\TextColumn::make('shipping_service')
                    ->label('Shipping')
                    ->placeholder('—'),

                Tables\Columns\TextColumn::make('total_incl')
                    ->label('Total')
                    ->money('ZAR'),
            ])
            ->defaultSort('id', 'desc')
            ->actions([
                Tables\Actions\Action::make('view')
                    ->label('View')
                    ->icon('heroicon-o-eye')
                    ->url(fn ($record) => route('filament.admin.resources.orders.view', $record)),
            ]);
    }

    public function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('Customer Details')
                    ->columns(3)
                    ->schema([
                        Infolists\Components\TextEntry::make('name')
                            ->label('Name'),

                        Infolists\Components\TextEntry::make('email')
                            ->label('Email')
                            ->copyable(),

                        Infolists\Components\TextEntry::make('phone')
                            ->label('Phone')
                            ->placeholder('—'),

                        Infolists\Components\TextEntry::make('title')
                            ->label('Title')
                            ->placeholder('—'),

                        Infolists\Components\TextEntry::make('birthdate')
                            ->label('Date of Birth')
                            ->date('d M Y')
                            ->placeholder('—'),

                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Registered')
                            ->dateTime('d M Y, H:i'),

                        Infolists\Components\IconEntry::make('newsletter_subscribed')
                            ->label('Newsletter')
                            ->boolean(),
                    ]),
            ]);
    }
}
