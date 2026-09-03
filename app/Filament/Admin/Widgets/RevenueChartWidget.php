<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class RevenueChartWidget extends ChartWidget
{
    protected static ?int $sort = 2;
    protected static ?string $heading = 'Revenue — Last 30 Days';
    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        $days = collect(range(29, 0))->map(fn ($i) => Carbon::today()->subDays($i)->format('Y-m-d'));

        $rows = Order::query()
            ->select(
                DB::raw('DATE(created_at) as day'),
                DB::raw('SUM(total_incl) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->where('created_at', '>=', Carbon::today()->subDays(29)->startOfDay())
            ->whereIn('status', ['paid', 'processing', 'shipped', 'delivered'])
            ->groupBy('day')
            ->pluck(null, 'day')
            ->mapWithKeys(fn ($r) => [$r->day => $r]);

        $labels  = $days->map(fn ($d) => Carbon::parse($d)->format('d M'))->values()->toArray();
        $revenue = $days->map(fn ($d) => (float) ($rows[$d]->revenue ?? 0))->values()->toArray();
        $orders  = $days->map(fn ($d) => (int)   ($rows[$d]->orders  ?? 0))->values()->toArray();

        return [
            'datasets' => [
                [
                    'label'           => 'Revenue (ZAR)',
                    'data'            => $revenue,
                    'borderColor'     => '#16a34a',
                    'backgroundColor' => 'rgba(22,163,74,0.08)',
                    'fill'            => true,
                    'tension'         => 0.4,
                    'pointRadius'     => 3,
                    'yAxisID'         => 'y',
                ],
                [
                    'label'           => 'Orders',
                    'data'            => $orders,
                    'borderColor'     => '#2563eb',
                    'backgroundColor' => 'rgba(37,99,235,0.07)',
                    'fill'            => false,
                    'tension'         => 0.4,
                    'pointRadius'     => 3,
                    'yAxisID'         => 'y1',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getOptions(): array
    {
        return [
            'responsive' => true,
            'interaction' => [
                'mode'      => 'index',
                'intersect' => false,
            ],
            'plugins' => [
                'legend' => ['position' => 'top'],
                'tooltip' => [
                    'callbacks' => [
                        // Revenue formatted server-side; JS formatting happens client-side
                    ],
                ],
            ],
            'scales' => [
                'y' => [
                    'type'     => 'linear',
                    'display'  => true,
                    'position' => 'left',
                    'ticks'    => [
                        'callback' => "function(v){ return 'R' + v.toLocaleString(); }",
                    ],
                    'grid' => ['color' => 'rgba(0,0,0,0.04)'],
                ],
                'y1' => [
                    'type'     => 'linear',
                    'display'  => true,
                    'position' => 'right',
                    'grid'     => ['drawOnChartArea' => false],
                    'ticks'    => ['precision' => 0],
                ],
            ],
        ];
    }
}
