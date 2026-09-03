<?php
namespace App\Filament\Admin\Resources\Turn14WeightRangeResource\Pages;
use App\Filament\Admin\Resources\Turn14WeightRangeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
class EditTurn14WeightRange extends EditRecord
{
    protected static string $resource = Turn14WeightRangeResource::class;
    protected function getHeaderActions(): array
    {
        return [Actions\DeleteAction::make()];
    }
}
