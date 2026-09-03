<?php

namespace App\Filament\Admin\Widgets;

use App\Models\OrderItem;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Support\Carbon;

class TopProductsWidget extends BaseWidget
{
    protected static ?int $sort = 4;
    protected int | string | array $columnSpan = 'full';
    protected static ?string $heading = 'Top Selling Products — This Month';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                OrderItem::query()
                    ->selectRaw('turn14_product_id, product_name, part_number, brand_name, SUM(qty) as total_qty, SUM(line_total_incl) as total_revenue, COUNT(DISTINCT order_id) as order_count')
                    ->whereHas('order', fn ($q) => $q
                        ->where('created_at', '>=', Carbon::now()->startOfMonth())
                        ->whereIn('status', ['paid', 'processing', 'shipped', 'delivered'])
                    )
                    ->groupBy('turn14_product_id', 'product_name', 'part_number', 'brand_name')
                    ->orderByDesc('total_revenue')
            )
            ->columns([
                Tables\Columns\TextColumn::make('product_name')
                    ->label('Product')
                    ->limit(40)
                    ->searchable(),

                Tables\Columns\TextColumn::make('part_number')
                    ->label('Part #')
                    ->fontFamily('mono')
                    ->color('gray'),

                Tables\Columns\TextColumn::make('brand_name')
                    ->label('Brand')
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('total_qty')
                    ->label('Units Sold')
                    ->alignCenter()
                    ->sortable(),

                Tables\Columns\TextColumn::make('order_count')
                    ->label('Orders')
                    ->alignCenter()
                    ->sortable(),

                Tables\Columns\TextColumn::make('total_revenue')
                    ->label('Revenue')
                    ->money('ZAR')
                    ->sortable(),
            ])
            ->paginated([5, 10])
            ->defaultPaginationPageOption(5);
    }
}
