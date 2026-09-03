<?php
namespace App\Services;

use App\Models\CartItem;
use App\Services\Turn14\CatalogService;
use Illuminate\Support\Collection;

class CartService
{
    public function __construct(private readonly CatalogService $catalog) {}

    private function sessionId(): string
    {
        return request()->session()->getId();
    }

    private function userId(): ?int
    {
        return auth()->id();
    }

    private function baseQuery()
    {
        if ($this->userId()) {
            return CartItem::where('user_id', $this->userId());
        }
        return CartItem::where('session_id', $this->sessionId());
    }

    public function add(string $turn14ProductId, int $qty = 1): void
    {
        $existing = $this->baseQuery()
            ->where('turn14_product_id', $turn14ProductId)
            ->first();

        if ($existing) {
            $existing->increment('qty', $qty);
        } else {
            CartItem::create([
                'session_id'         => $this->sessionId(),
                'user_id'            => $this->userId(),
                'turn14_product_id'  => $turn14ProductId,
                'qty'                => $qty,
            ]);
        }
    }

    public function update(string $turn14ProductId, int $qty): void
    {
        if ($qty <= 0) {
            $this->remove($turn14ProductId);
            return;
        }
        $this->baseQuery()
            ->where('turn14_product_id', $turn14ProductId)
            ->update(['qty' => $qty]);
    }

    public function remove(string $turn14ProductId): void
    {
        $this->baseQuery()
            ->where('turn14_product_id', $turn14ProductId)
            ->delete();
    }

    public function clear(): void
    {
        $this->baseQuery()->delete();
    }

    /**
     * Get cart contents with hydrated product data and prices.
     * Returns array of ['item' => CartItem, 'product' => array, 'line_total' => float]
     */
    public function getContents(): array
    {
        $items = $this->baseQuery()->get();
        $result = [];

        foreach ($items as $item) {
            $product = $this->catalog->getProduct($item->turn14_product_id);
            if (!$product) continue;

            $result[] = [
                'item'       => $item,
                'product'    => $product,
                'line_total' => ($product['price_incl'] ?? 0) * $item->qty,
            ];
        }

        return $result;
    }

    public function itemCount(): int
    {
        return (int) $this->baseQuery()->sum('qty');
    }

    public function totals(): array
    {
        $contents     = $this->getContents();
        $totalIncl    = array_sum(array_column($contents, 'line_total'));
        $taxRate      = (float) config('turn14.tax_rate', 15);
        $totalExcl    = $totalIncl / (1 + $taxRate / 100);
        $vatAmount    = $totalIncl - $totalExcl;

        return [
            'subtotal_excl' => round($totalExcl, 2),
            'vat_amount'    => round($vatAmount, 2),
            'total_incl'    => round($totalIncl, 2),
            'item_count'    => array_sum(array_column(array_column($contents, 'item'), 'qty')),
        ];
    }

    /** Merge guest session cart into user cart after login */
    public function mergeSession(int $userId): void
    {
        $sessionItems = CartItem::where('session_id', $this->sessionId())
            ->where('user_id', null)
            ->get();

        foreach ($sessionItems as $item) {
            $existing = CartItem::where('user_id', $userId)
                ->where('turn14_product_id', $item->turn14_product_id)
                ->first();
            if ($existing) {
                $existing->increment('qty', $item->qty);
                $item->delete();
            } else {
                $item->update(['user_id' => $userId]);
            }
        }
    }
}
