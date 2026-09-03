<?php
namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Turn14CustomerGarage;
use App\Models\Turn14VehicleFilter;
use App\Services\VehicleFilterService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class GarageController extends Controller
{
    public function __construct(private readonly VehicleFilterService $vehicles) {}

    public function index()
    {
        $garageItems = Turn14CustomerGarage::where('id_customer', auth()->id())
            ->get();

        $vehicles = $garageItems->map(function ($g) {
            $vf = Turn14VehicleFilter::find($g->id_vehicle_filter);
            return [
                'id'                => $g->id,
                'stage'             => $g->stage,
                'id_vehicle_filter' => $g->id_vehicle_filter,
                'make'              => $vf?->make,
                'year'              => $vf?->year,
                'model'             => $vf?->model,
                'image'             => $vf?->image,
            ];
        });

        return Inertia::render('Account/Garage', [
            'vehicles' => $vehicles,
            'makes'    => $this->vehicles->getMakes(),
        ]);
    }

    public function add(Request $request)
    {
        $request->validate(['id_vehicle_filter' => 'required|integer']);

        Turn14CustomerGarage::firstOrCreate([
            'id_customer'       => auth()->id(),
            'id_vehicle_filter' => $request->id_vehicle_filter,
        ], [
            'secure_key' => Str::random(64),
            'stage'      => 0,
            'date_add'   => now(),
        ]);

        return back()->with('vehicle_added', true);
    }

    public function remove(int $id)
    {
        Turn14CustomerGarage::where('id_customer', auth()->id())
            ->where('id', $id)
            ->delete();
        return back();
    }
}
