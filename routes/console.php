<?php

use App\Jobs\SyncBrandsJob;
use App\Jobs\SyncStockDeltaJob;
use App\Jobs\SyncStockFullJob;
use App\Jobs\SyncDiscontinueJob;
use App\Jobs\SendStockAlertJob;
use Illuminate\Support\Facades\Schedule;

// Stock delta — every 2 hours
Schedule::job(new SyncStockDeltaJob)->everyTwoHours()->name('sync-stock-delta')->withoutOverlapping();

// Full stock — nightly at 2am
Schedule::job(new SyncStockFullJob)->dailyAt('02:00')->name('sync-stock-full')->withoutOverlapping();

// Discontinue check — daily at 3am
Schedule::job(new SyncDiscontinueJob)->dailyAt('03:00')->name('sync-discontinue')->withoutOverlapping();

// Brand sync — weekly Sunday 4am
Schedule::job(new SyncBrandsJob)->weeklyOn(0, '04:00')->name('sync-brands')->withoutOverlapping();

// Stock alert emails — every 30 minutes
Schedule::job(new SendStockAlertJob)->everyThirtyMinutes()->name('send-stock-alerts');
