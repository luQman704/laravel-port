<?php
namespace App\Filament\Admin\Pages;

use App\Models\Turn14Product;
use App\Services\Turn14\PricingService;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Pages\Page;

class PriceChecker extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-calculator';
    protected static ?string $navigationGroup = 'Turn14';
    protected static ?string $navigationLabel = 'Price Checker';
    protected static string $view = 'filament.pages.price-checker';

    public string $partNumber = '';
    public ?array $result = null;

    public function check(): void
    {
        $product = Turn14Product::where('part_number', $this->partNumber)
            ->orWhere('id', $this->partNumber)
            ->first();

        if (!$product) {
            $this->result = ['error' => 'Product not found'];
            return;
        }

        $pricing = app(PricingService::class);
        $arr = $product->toArray();
        $priceExcl = $pricing->calcDisplayPrice($product->usd_price, $arr);
        $priceIncl = $pricing->inclTax($priceExcl);

        $this->result = [
            'product_name'  => $product->product_name,
            'part_number'   => $product->part_number,
            'usd_price'     => $product->usd_price,
            'price_excl'    => $priceExcl,
            'price_incl'    => $priceIncl,
            'formatted'     => $pricing->formatPrice($priceExcl),
        ];
    }
}
