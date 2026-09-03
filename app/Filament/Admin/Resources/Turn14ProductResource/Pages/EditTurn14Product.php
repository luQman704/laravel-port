<?php

namespace App\Filament\Admin\Resources\Turn14ProductResource\Pages;

use App\Filament\Admin\Resources\Turn14ProductResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditTurn14Product extends EditRecord
{
    protected static string $resource = Turn14ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
