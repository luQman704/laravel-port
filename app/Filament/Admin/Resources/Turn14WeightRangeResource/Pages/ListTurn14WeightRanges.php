<?php
namespace App\Filament\Admin\Resources\Turn14WeightRangeResource\Pages;
use App\Filament\Admin\Resources\Turn14WeightRangeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
class ListTurn14WeightRanges extends ListRecords
{
    protected static string $resource = Turn14WeightRangeResource::class;
    protected function getHeaderActions(): array
    {
        return [Actions\CreateAction::make()];
    }
}
