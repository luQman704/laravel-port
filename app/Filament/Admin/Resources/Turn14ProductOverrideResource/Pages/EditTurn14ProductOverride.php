<?php
namespace App\Filament\Admin\Resources\Turn14ProductOverrideResource\Pages;
use App\Filament\Admin\Resources\Turn14ProductOverrideResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
class EditTurn14ProductOverride extends EditRecord
{
    protected static string $resource = Turn14ProductOverrideResource::class;
    protected function getHeaderActions(): array
    {
        return [Actions\DeleteAction::make()];
    }
}
