<?php

namespace App\Filament\Admin\Resources\Turn14BrandResource\Pages;

use App\Filament\Admin\Resources\Turn14BrandResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditTurn14Brand extends EditRecord
{
    protected static string $resource = Turn14BrandResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
