<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\Turn14ProductResource\Pages;
use App\Models\Turn14Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class Turn14ProductResource extends Resource
{
    protected static ?string $model = Turn14Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';
    protected static ?string $navigationGroup = 'Products';
    protected static ?string $navigationLabel = 'Products';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('product_name')->required(),
                Forms\Components\TextInput::make('part_number'),
                Forms\Components\TextInput::make('usd_price')->numeric()->prefix('$'),
                Forms\Components\Toggle::make('sync_active'),
                Forms\Components\Toggle::make('discontinued'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->label('ID')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('product_name')->label('Name')->searchable()->limit(50),
                Tables\Columns\TextColumn::make('part_number')->label('Part #')->searchable(),
                Tables\Columns\TextColumn::make('brand.name')->label('Brand')->sortable(),
                Tables\Columns\TextColumn::make('category')->sortable(),
                Tables\Columns\TextColumn::make('usd_price')->label('USD')->money('USD')->sortable(),
                Tables\Columns\IconColumn::make('sync_active')->label('Active')->boolean(),
                Tables\Columns\IconColumn::make('discontinued')->boolean(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('sync_active'),
                Tables\Filters\TernaryFilter::make('discontinued'),
                Tables\Filters\SelectFilter::make('category')
                    ->options(fn() => Turn14Product::distinct()->pluck('category', 'category')->toArray()),
            ])
            ->defaultSort('id_turn14_product', 'desc')
            ->paginated([25, 50, 100])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListTurn14Products::route('/'),
            'create' => Pages\CreateTurn14Product::route('/create'),
            'edit'   => Pages\EditTurn14Product::route('/{record}/edit'),
        ];
    }
}
