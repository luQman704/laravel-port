<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class OrderStatsWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $today     = Carbon::today();
        $weekStart = Carbon::now()->startOfWeek();
        $monthStart = Carbon::now()->startOfMonth();

        $todayOrders   = Order::whereDate('created_at', $today)->count();
        $weekOrders    = Order::where('created_at', '>=', $weekStart)->count();
        $pendingOrders = Order::whereIn('status', ['pending', 'paid', 'processing'])->count();
        $todayRevenue  = Order::whereDate('created_at', $today)
            ->whereIn('status', ['paid', 'processing', 'shipped', 'delivered'])
            ->sum('total_incl');
        $mtdRevenue    = Order::where('created_at', '>=', $monthStart)
            ->whereIn('status', ['paid', 'processing', 'shipped', 'delivered'])
            ->sum('total_incl');

        return [
            Stat::make('Orders Today', $todayOrders)
                ->description('New orders placed today')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('primary'),

            Stat::make('Orders This Week', $weekOrders)
                ->description('Since ' . $weekStart->format('D d M'))
                ->descriptionIcon('heroicon-m-calendar-days')
                ->color('info'),

            Stat::make('Needs Action', $pendingOrders)
                ->description('Pending / paid / processing')
                ->descriptionIcon('heroicon-m-clock')
                ->color($pendingOrders > 0 ? 'warning' : 'success'),

            Stat::make('Revenue Today', 'R ' . number_format($todayRevenue, 0, '.', ' '))
                ->description('Paid orders only')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),

            Stat::make('Revenue MTD', 'R ' . number_format($mtdRevenue, 0, '.', ' '))
                ->description(Carbon::now()->format('F Y'))
                ->descriptionIcon('heroicon-m-chart-bar')
                ->color('success'),
        ];
    }
}
