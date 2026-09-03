<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Services\VehicleFilterService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function __construct(private readonly VehicleFilterService $vehicles) {}

    public function index(): Response
    {
        $data = $this->vehicles->getVehiclesGrouped();
        return Inertia::render('Vehicles', [
            'grouped'   => $data['grouped'],
            'make_meta' => $data['make_meta'],
        ]);
    }

    public function show(Request $request, int $id): Response
    {
        $vehicle = $this->vehicles->getVehicle($id);
        abort_if(!$vehicle, 404);

        $garageStage   = (int)$request->query('stage', 0);
        $showCompleted = (bool)$request->query('show_completed', 0);

        $products = $this->vehicles->getProductsForVehicle($id, $garageStage, $showCompleted);

        return Inertia::render('VehicleDetail', [
            'vehicle'        => $vehicle,
            'products'       => $products,
            'garage_stage'   => $garageStage,
            'show_completed' => $showCompleted,
            'stage_labels'   => ['Stock', 'Stage 1', 'Stage 2', 'Stage 3', 'Stage 4'],
        ]);
    }

    public function years(Request $request): JsonResponse
    {
        $years = $this->vehicles->getYearsForMake((int)$request->input('make_id'));
        return response()->json($years);
    }

    public function models(Request $request): JsonResponse
    {
        $models = $this->vehicles->getModelsForMakeYear(
            (int)$request->input('make_id'),
            $request->input('year'),
        );
        return response()->json($models);
    }
}
