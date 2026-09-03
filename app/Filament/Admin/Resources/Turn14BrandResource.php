<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\Turn14BrandResource\Pages;
use App\Models\Turn14Brand;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class Turn14BrandResource extends Resource
{
    protected static ?string $model = Turn14Brand::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';
    protected static ?string $navigationGroup = 'Products';
    protected static ?string $navigationLabel = 'Brands';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('brand_id')->required()->numeric(),
                Forms\Components\TextInput::make('name')->required()->maxLength(255),
                Forms\Components\TextInput::make('logo')->maxLength(255),
                Forms\Components\Toggle::make('sync_active')->required(),
                Forms\Components\Toggle::make('is_featured')->label('Featured on Homepage')->default(false),
                Forms\Components\TextInput::make('logo_url')->label('Logo URL')->maxLength(500)->nullable(),
                Forms\Components\DateTimePicker::make('date_add'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('brand_id')->sortable(),
                Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
                Tables\Columns\IconColumn::make('sync_active')->boolean(),
                Tables\Columns\TextColumn::make('date_add')->dateTime()->sortable(),
            ])
            ->filters([
                //
            ])
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
            'index'  => Pages\ListTurn14Brands::route('/'),
            'create' => Pages\CreateTurn14Brand::route('/create'),
            'edit'   => Pages\EditTurn14Brand::route('/{record}/edit'),
        ];
    }
}
