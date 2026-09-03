<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\CustomerResource\Pages;
use App\Models\User;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class CustomerResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon  = 'heroicon-o-users';
    protected static ?string $navigationLabel = 'Customers';
    protected static ?string $navigationGroup = 'Orders';
    protected static ?int    $navigationSort  = 2;
    protected static ?string $slug            = 'customers';

    public static function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->copyable(),

                Tables\Columns\TextColumn::make('phone')
                    ->label('Phone')
                    ->placeholder('—'),

                Tables\Columns\TextColumn::make('orders_count')
                    ->label('Orders')
                    ->counts('orders')
                    ->sortable(),

                Tables\Columns\TextColumn::make('orders_sum_total_incl')
                    ->label('Total Spent')
                    ->money('ZAR')
                    ->sum('orders', 'total_incl')
                    ->sortable(),

                Tables\Columns\IconColumn::make('newsletter_subscribed')
                    ->label('Newsletter')
                    ->boolean(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Registered')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\Filter::make('has_orders')
                    ->label('Has orders')
                    ->query(fn ($query) => $query->has('orders')),
                Tables\Filters\Filter::make('newsletter')
                    ->label('Newsletter subscribers')
                    ->query(fn ($query) => $query->where('newsletter_subscribed', true)),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCustomers::route('/'),
            'view'  => Pages\ViewCustomer::route('/{record}'),
        ];
    }
}
