<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\Turn14WeightRangeResource\Pages;
use App\Models\Turn14WeightRange;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class Turn14WeightRangeResource extends Resource
{
    protected static ?string $model = Turn14WeightRange::class;

    protected static ?string $navigationIcon  = 'heroicon-o-scale';
    protected static ?string $navigationGroup = 'Products';
    protected static ?string $navigationLabel = 'Shipping Weight Bands';
    protected static ?int    $navigationSort  = 11;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('from')
                ->label('From weight (kg)')
                ->numeric()->required()->step(0.01),
            Forms\Components\TextInput::make('to')
                ->label('To weight (kg)')
                ->numeric()->required()->step(0.01),
            Forms\Components\TextInput::make('price')
                ->label('Shipping cost (ZAR)')
                ->numeric()->required()->step(0.01)->prefix('R'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('from')->label('From (kg)')->sortable(),
                Tables\Columns\TextColumn::make('to')->label('To (kg)')->sortable(),
                Tables\Columns\TextColumn::make('price')->label('Cost (ZAR)')->money('ZAR')->sortable(),
            ])
            ->defaultSort('from')
            ->actions([Tables\Actions\EditAction::make()])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()]),
            ]);
    }

    public static function getRelations(): array { return []; }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListTurn14WeightRanges::route('/'),
            'create' => Pages\CreateTurn14WeightRange::route('/create'),
            'edit'   => Pages\EditTurn14WeightRange::route('/{record}/edit'),
        ];
    }
}
