<?php

namespace App\Filament\Admin\Pages;

use App\Models\Turn14VehicleMake;
use App\Models\Turn14VehicleFilter;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\DB;

class VehicleManager extends Page
{
    protected static ?string $navigationIcon  = 'heroicon-o-truck';
    protected static ?string $navigationLabel = 'Vehicle Manager';
    protected static ?string $navigationGroup = 'Catalogue';
    protected static ?int    $navigationSort  = 20;
    protected static string  $view            = 'filament.pages.vehicle-manager';

    public ?int $selectedMake  = null;
    public string $makeSearch  = '';
    public string $newMakeName = '';
    public string $newModelName = '';
    public string $newModelYear = '';
    public ?int $selectedModel = null;

    public function getMakes(): array
    {
        $q = Turn14VehicleMake::orderBy('make');
        if ($this->makeSearch) {
            $q->where('make', 'like', "%{$this->makeSearch}%");
        }
        return $q->get(['id_make', 'make'])->toArray();
    }

    public function getModelsForMake(): array
    {
        if (!$this->selectedMake) return [];
        return DB::table('new902_turn14_vehicle_filter')
            ->where('id_make', $this->selectedMake)
            ->select('id_vehicle_filter', 'model', 'year')
            ->orderBy('model')
            ->orderBy('year')
            ->get()
            ->toArray();
    }

    public function addMake(): void
    {
        $name = trim($this->newMakeName);
        if (!$name) return;

        Turn14VehicleMake::create(['make' => $name]);
        $this->newMakeName = '';
        Notification::make()->title("Make '{$name}' added")->success()->send();
    }

    public function selectMake(int $id): void
    {
        $this->selectedMake = $id;
        $this->selectedModel = null;
    }

    public function deleteMake(int $id): void
    {
        Turn14VehicleMake::find($id)?->delete();
        if ($this->selectedMake === $id) $this->selectedMake = null;
        Notification::make()->title('Make deleted')->success()->send();
    }

    public function addModel(): void
    {
        if (!$this->selectedMake || !trim($this->newModelName)) return;

        DB::table('new902_turn14_vehicle_filter')->insert([
            'id_make' => $this->selectedMake,
            'model'   => trim($this->newModelName),
            'year'    => (int) $this->newModelYear ?: null,
        ]);
        $this->newModelName = '';
        $this->newModelYear = '';
        Notification::make()->title('Model added')->success()->send();
    }

    public function deleteModel(int $id): void
    {
        DB::table('new902_turn14_vehicle_filter')->where('id_vehicle_filter', $id)->delete();
        Notification::make()->title('Model deleted')->success()->send();
    }
}
