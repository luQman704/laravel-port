<x-filament-panels::page>
    <div class="space-y-4">
        <div class="flex gap-3">
            <x-filament::input.wrapper class="flex-1">
                <x-filament::input
                    type="text"
                    wire:model="partNumber"
                    placeholder="Enter part number or Turn14 ID…"
                />
            </x-filament::input.wrapper>
            <x-filament::button wire:click="check">Check Price</x-filament::button>
        </div>

        @if($result)
            @if(isset($result['error']))
                <div class="text-red-500">{{ $result['error'] }}</div>
            @else
                <x-filament::card>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div><span class="text-gray-500">Product:</span> <strong>{{ $result['product_name'] }}</strong></div>
                        <div><span class="text-gray-500">Part #:</span> {{ $result['part_number'] }}</div>
                        <div><span class="text-gray-500">USD Cost:</span> ${{ number_format($result['usd_price'], 4) }}</div>
                        <div><span class="text-gray-500">ZAR Excl. VAT:</span> R {{ number_format($result['price_excl'], 2) }}</div>
                        <div class="col-span-2 text-lg font-bold text-green-600">Retail (incl. VAT): {{ $result['formatted'] }}</div>
                    </div>
                </x-filament::card>
            @endif
        @endif
    </div>
</x-filament-panels::page>
