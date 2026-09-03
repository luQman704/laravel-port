<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\Turn14StockAlertResource\Pages;
use App\Mail\StockAlertNotification;
use App\Models\Turn14Product;
use App\Models\Turn14StockAlert;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Mail;

class Turn14StockAlertResource extends Resource
{
    protected static ?string $model = Turn14StockAlert::class;

    protected static ?string $navigationIcon  = 'heroicon-o-bell';
    protected static ?string $navigationLabel = 'Stock Alerts';
    protected static ?string $navigationGroup = 'Fitment & Alerts';
    protected static ?int    $navigationSort  = 10;

    public static function getNavigationBadge(): ?string
    {
        $count = Turn14StockAlert::whereNull('date_notified')->count();
        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id_alert')
                    ->label('ID')
                    ->sortable(),

                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->copyable(),

                Tables\Columns\TextColumn::make('product_name')
                    ->label('Product')
                    ->getStateUsing(function (Turn14StockAlert $record): string {
                        $product = Turn14Product::where('id', $record->turn14_product_id)->first();
                        return $product
                            ? "{$product->product_name} ({$product->part_number})"
                            : "#{$record->turn14_product_id}";
                    })
                    ->wrap(),

                Tables\Columns\IconColumn::make('watch_local')->label('SA')->boolean(),
                Tables\Columns\IconColumn::make('watch_usa')->label('USA')->boolean(),
                Tables\Columns\IconColumn::make('watch_mfr')->label('Mfr')->boolean(),

                Tables\Columns\TextColumn::make('date_add')
                    ->label('Subscribed')
                    ->dateTime('d M Y')
                    ->sortable(),

                Tables\Columns\TextColumn::make('date_notified')
                    ->label('Last Notified')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->placeholder('Pending'),

                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->getStateUsing(fn (Turn14StockAlert $record): string =>
                        $record->date_notified ? 'Notified' : 'Pending'
                    )
                    ->color(fn (string $state): string => match ($state) {
                        'Notified' => 'success',
                        default    => 'warning',
                    }),
            ])
            ->defaultSort('date_add', 'desc')
            ->filters([
                Tables\Filters\Filter::make('pending')
                    ->label('Pending only')
                    ->query(fn ($query) => $query->whereNull('date_notified')),
            ])
            ->actions([
                Tables\Actions\Action::make('sendNow')
                    ->label('Send Now')
                    ->icon('heroicon-o-paper-airplane')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function (Turn14StockAlert $record): void {
                        // 'id' column = Turn14 API product ID; 'id_turn14_product' = sequential PK
                        $product = Turn14Product::where('id', $record->turn14_product_id)->first();
                        $stock   = $product?->stock;

                        Mail::to($record->email)->send(new StockAlertNotification($record, $product, $stock));
                        $record->update(['date_notified' => now()]);

                        Notification::make()
                            ->title("Alert sent to {$record->email}")
                            ->success()
                            ->send();
                    }),

                Tables\Actions\DeleteAction::make(),
            ])
            ->headerActions([
                Tables\Actions\Action::make('sendAllPending')
                    ->label('Send All Pending')
                    ->icon('heroicon-o-paper-airplane')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->modalDescription('This will send stock alert emails to all subscribers who have not yet been notified. Continue?')
                    ->action(function (): void {
                        $pending = Turn14StockAlert::whereNull('date_notified')->get();
                        $sent = 0;
                        $failed = 0;

                        foreach ($pending as $alert) {
                            $product = Turn14Product::where('id', $alert->turn14_product_id)->first();
                            $stock   = $product?->stock;

                            try {
                                Mail::to($alert->email)->send(new StockAlertNotification($alert, $product, $stock));
                                $alert->update(['date_notified' => now()]);
                                $sent++;
                            } catch (\Throwable) {
                                $failed++;
                            }
                        }

                        $msg = "Sent {$sent} alert(s).";
                        if ($failed > 0) $msg .= " {$failed} failed (mail error).";

                        Notification::make()
                            ->title($msg)
                            ->success()
                            ->send();
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTurn14StockAlerts::route('/'),
        ];
    }
}
