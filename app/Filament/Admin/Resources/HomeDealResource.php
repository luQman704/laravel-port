<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\HomeDealResource\Pages;
use App\Models\HomeDeal;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class HomeDealResource extends Resource
{
    protected static ?string $model = HomeDeal::class;

    protected static ?string $navigationIcon  = 'heroicon-o-fire';
    protected static ?string $navigationGroup = 'Homepage';
    protected static ?string $navigationLabel = 'Deals of the Day';
    protected static ?int    $navigationSort  = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('turn14_product_id')
                ->label('Turn14 Product ID')
                ->required()
                ->numeric()
                ->helperText('The numeric ID from the Turn14 products table.'),
            Forms\Components\TextInput::make('deal_price_incl')
                ->label('Deal Price (Incl. VAT)')
                ->numeric()
                ->prefix('R')
                ->helperText('Leave blank to use the product\'s regular price.'),
            Forms\Components\TextInput::make('deal_price_excl')
                ->label('Deal Price (Excl. VAT)')
                ->numeric()
                ->prefix('R'),
            Forms\Components\DateTimePicker::make('ends_at')
                ->label('Deal Ends At')
                ->helperText('Leave blank for no expiry.'),
            Forms\Components\Toggle::make('is_active')->default(true),
            Forms\Components\TextInput::make('sort_order')->numeric()->default(0),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('turn14_product_id')->label('Product ID')->sortable(),
                Tables\Columns\TextColumn::make('product.product_name')->label('Product')->limit(40)->searchable(),
                Tables\Columns\TextColumn::make('deal_price_incl')->label('Deal Price (Incl.)')->money('ZAR')->sortable(),
                Tables\Columns\TextColumn::make('ends_at')->label('Ends At')->dateTime()->sortable(),
                Tables\Columns\IconColumn::make('is_active')->boolean()->sortable(),
                Tables\Columns\TextColumn::make('sort_order')->sortable(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->actions([Tables\Actions\EditAction::make()])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()]),
            ]);
    }

    public static function getRelations(): array { return []; }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListHomeDeals::route('/'),
            'create' => Pages\CreateHomeDeal::route('/create'),
            'edit'   => Pages\EditHomeDeal::route('/{record}/edit'),
        ];
    }
}
