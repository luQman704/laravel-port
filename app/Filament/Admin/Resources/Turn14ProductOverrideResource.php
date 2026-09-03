<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\Turn14ProductOverrideResource\Pages;
use App\Models\Turn14ProductOverride;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class Turn14ProductOverrideResource extends Resource
{
    protected static ?string $model = Turn14ProductOverride::class;

    protected static ?string $navigationIcon  = 'heroicon-o-pencil-square';
    protected static ?string $navigationGroup = 'Products';
    protected static ?string $navigationLabel = 'Product Overrides';
    protected static ?int    $navigationSort  = 12;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('turn14_product_id')
                ->label('Turn14 Product ID')->required()->unique(ignoreRecord: true),
            Forms\Components\TextInput::make('product_name')->label('Override Name')->nullable(),
            Forms\Components\TextInput::make('category')->nullable(),
            Forms\Components\TextInput::make('subcategory')->nullable(),
            Forms\Components\TextInput::make('weight')->numeric()->step(0.0001)->suffix('lbs')->nullable(),
            Forms\Components\TextInput::make('length')->numeric()->step(0.0001)->suffix('in')->nullable(),
            Forms\Components\TextInput::make('width')->numeric()->step(0.0001)->suffix('in')->nullable(),
            Forms\Components\TextInput::make('height')->numeric()->step(0.0001)->suffix('in')->nullable(),
            Forms\Components\Textarea::make('notes')->nullable()->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('turn14_product_id')->label('Product ID')->searchable(),
                Tables\Columns\TextColumn::make('product_name')->label('Name Override')->placeholder('—')->limit(40),
                Tables\Columns\TextColumn::make('category')->placeholder('—'),
                Tables\Columns\TextColumn::make('updated_at')->dateTime()->sortable(),
            ])
            ->actions([Tables\Actions\EditAction::make()])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()]),
            ]);
    }

    public static function getRelations(): array { return []; }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListTurn14ProductOverrides::route('/'),
            'create' => Pages\CreateTurn14ProductOverride::route('/create'),
            'edit'   => Pages\EditTurn14ProductOverride::route('/{record}/edit'),
        ];
    }
}
