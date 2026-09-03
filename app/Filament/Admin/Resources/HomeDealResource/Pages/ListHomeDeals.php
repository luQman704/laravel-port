<?php

namespace App\Filament\Admin\Resources\HomeDealResource\Pages;

use App\Filament\Admin\Resources\HomeDealResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListHomeDeals extends ListRecords
{
    protected static string $resource = HomeDealResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\CreateAction::make()];
    }
}
