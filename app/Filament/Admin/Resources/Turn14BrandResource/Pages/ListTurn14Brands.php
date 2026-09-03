<?php

namespace App\Filament\Admin\Resources\Turn14BrandResource\Pages;

use App\Filament\Admin\Resources\Turn14BrandResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListTurn14Brands extends ListRecords
{
    protected static string $resource = Turn14BrandResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
