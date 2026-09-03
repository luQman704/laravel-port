<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\HomeFeaturedProductResource\Pages;
use App\Models\HomeFeaturedProduct;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class HomeFeaturedProductResource extends Resource
{
    protected static ?string $model = HomeFeaturedProduct::class;

    protected static ?string $navigationIcon  = 'heroicon-o-star';
    protected static ?string $navigationGroup = 'Homepage';
    protected static ?string $navigationLabel = 'Featured & Trending Products';
    protected static ?int    $navigationSort  = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('turn14_product_id')
                ->label('Turn14 Product ID')
                ->required()
                ->numeric(),
            Forms\Components\Select::make('section')
                ->options([
                    'trending' => 'Top Trending',
                    'popular'  => 'Popular Products (with tabs)',
                ])
                ->required()
                ->default('trending')
                ->reactive(),
            Forms\Components\TextInput::make('category_tab')
                ->label('Category Tab')
                ->helperText('Only used for "Popular Products" section — e.g. "Suspension", "Air Filter"')
                ->visible(fn ($get) => $get('section') === 'popular'),
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
                Tables\Columns\BadgeColumn::make('section')
                    ->colors(['primary' => 'trending', 'success' => 'popular']),
                Tables\Columns\TextColumn::make('category_tab')->label('Tab')->placeholder('—'),
                Tables\Columns\IconColumn::make('is_active')->boolean(),
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
            'index'  => Pages\ListHomeFeaturedProducts::route('/'),
            'create' => Pages\CreateHomeFeaturedProduct::route('/create'),
            'edit'   => Pages\EditHomeFeaturedProduct::route('/{record}/edit'),
        ];
    }
}
