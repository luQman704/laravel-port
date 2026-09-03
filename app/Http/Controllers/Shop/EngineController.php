<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Services\VehicleFilterService;
use Inertia\Inertia;
use Inertia\Response;

class EngineController extends Controller
{
    public function __construct(private readonly VehicleFilterService $vehicles) {}

    public function index(): Response
    {
        $data = $this->vehicles->getEnginesGrouped();
        return Inertia::render('Engines', [
            'groups'    => $data['groups'],
            'make_meta' => $data['make_meta'],
        ]);
    }

    public function show(int $id): Response
    {
        $engine = $this->vehicles->getEngine($id);
        abort_if(!$engine, 404);

        $products = $this->vehicles->getProductsForEngine($id);

        return Inertia::render('EngineDetail', [
            'engine'   => $engine,
            'products' => $products,
        ]);
    }
}
