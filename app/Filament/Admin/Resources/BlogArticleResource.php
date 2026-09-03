<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\BlogArticleResource\Pages;
use App\Models\BlogArticle;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class BlogArticleResource extends Resource
{
    protected static ?string $model = BlogArticle::class;

    protected static ?string $navigationIcon  = 'heroicon-o-newspaper';
    protected static ?string $navigationGroup = 'Homepage';
    protected static ?string $navigationLabel = 'Blog Articles';
    protected static ?int    $navigationSort  = 4;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('title')
                ->required()
                ->maxLength(255)
                ->live(debounce: 500)
                ->afterStateUpdated(fn ($state, Forms\Set $set) => $set('slug', Str::slug($state))),
            Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true),
            Forms\Components\TextInput::make('category')->placeholder('e.g. Engine Builds, Suspension'),
            Forms\Components\TextInput::make('cover_image')->placeholder('URL or path to cover image'),
            Forms\Components\TextInput::make('read_minutes')->numeric()->default(3)->suffix('min read'),
            Forms\Components\Textarea::make('excerpt')->rows(3)->columnSpanFull(),
            Forms\Components\RichEditor::make('body')->columnSpanFull(),
            Forms\Components\Toggle::make('is_published')->default(false),
            Forms\Components\DateTimePicker::make('published_at'),
            Forms\Components\TextInput::make('sort_order')->numeric()->default(0),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')->searchable()->sortable()->limit(50),
                Tables\Columns\TextColumn::make('category')->placeholder('—'),
                Tables\Columns\IconColumn::make('is_published')->boolean()->label('Published'),
                Tables\Columns\TextColumn::make('published_at')->dateTime()->sortable()->placeholder('Draft'),
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
            'index'  => Pages\ListBlogArticles::route('/'),
            'create' => Pages\CreateBlogArticle::route('/create'),
            'edit'   => Pages\EditBlogArticle::route('/{record}/edit'),
        ];
    }
}
