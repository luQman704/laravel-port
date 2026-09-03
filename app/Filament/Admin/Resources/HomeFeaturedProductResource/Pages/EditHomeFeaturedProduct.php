<?php

namespace App\Filament\Admin\Resources\HomeFeaturedProductResource\Pages;

use App\Filament\Admin\Resources\HomeFeaturedProductResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditHomeFeaturedProduct extends EditRecord
{
    protected static string $resource = HomeFeaturedProductResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\DeleteAction::make()];
    }
}
