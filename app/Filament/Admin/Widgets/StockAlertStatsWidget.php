<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Turn14StockAlert;
use App\Models\Turn14Stock;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StockAlertStatsWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected function getStats(): array
    {
        $pending   = Turn14StockAlert::whereNull('date_notified')->count();
        $notified  = Turn14StockAlert::whereNotNull('date_notified')->count();
        $outOfStock = Turn14Stock::where('quantity', '<=', 0)
            ->where('mfr_quantity', '<=', 0)
            ->count();
        $lowStock   = Turn14Stock::where(function ($q) {
            $q->where('quantity', '>', 0)->where('quantity', '<=', 5);
        })->orWhere(function ($q) {
            $q->where('mfr_quantity', '>', 0)->where('mfr_quantity', '<=', 5);
        })->count();

        return [
            Stat::make('Pending Alerts', $pending)
                ->description('Customers waiting for restock')
                ->descriptionIcon('heroicon-m-bell-alert')
                ->color($pending > 0 ? 'warning' : 'success'),

            Stat::make('Alerts Sent', $notified)
                ->description('Notifications dispatched')
                ->descriptionIcon('heroicon-m-bell')
                ->color('info'),

            Stat::make('Out of Stock', $outOfStock)
                ->description('Products with zero quantity everywhere')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color($outOfStock > 100 ? 'danger' : 'warning'),

            Stat::make('Low Stock', $lowStock)
                ->description('5 or fewer units across all locations')
                ->descriptionIcon('heroicon-m-exclamation-triangle')
                ->color('warning'),
        ];
    }
}
