<x-filament-panels::page>
    <div class="grid lg:grid-cols-2 gap-6">

        {{-- Makes panel --}}
        <div class="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-900">Vehicle Makes</h3>
                <span class="text-xs text-gray-400">{{ count($this->getMakes()) }} makes</span>
            </div>

            <div class="px-5 py-3 border-b border-gray-100">
                <input wire:model.live="makeSearch" type="text" placeholder="Search makes…"
                    class="w-full text-sm rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>

            <div class="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                @foreach($this->getMakes() as $make)
                <div class="flex items-center justify-between px-5 py-2.5 hover:bg-gray-50 cursor-pointer {{ $selectedMake == $make['id_make'] ? 'bg-primary-50' : '' }}"
                     wire:click="selectMake({{ $make['id_make'] }})">
                    <span class="text-sm font-medium text-gray-800">{{ $make['make'] }}</span>
                    <button wire:click.stop="deleteMake({{ $make['id_make'] }})"
                        wire:confirm="Delete this make and all its models?"
                        class="text-red-400 hover:text-red-600 text-xs">✕</button>
                </div>
                @endforeach
            </div>

            <div class="px-5 py-4 border-t border-gray-100 flex gap-2">
                <input wire:model="newMakeName" type="text" placeholder="New make name…"
                    class="flex-1 text-sm rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                <button wire:click="addMake"
                    class="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700">Add</button>
            </div>
        </div>

        {{-- Models panel --}}
        <div class="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <h3 class="text-sm font-semibold text-gray-900">
                    @if($selectedMake)
                        Models for {{ collect($this->getMakes())->firstWhere('id_make', $selectedMake)['make'] ?? 'Make' }}
                    @else
                        Select a make to manage models
                    @endif
                </h3>
            </div>

            @if($selectedMake)
            <div class="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                @forelse($this->getModelsForMake() as $m)
                <div class="flex items-center justify-between px-5 py-2.5 hover:bg-gray-50">
                    <div>
                        <span class="text-sm font-medium text-gray-800">{{ $m->model }}</span>
                        @if($m->year)
                            <span class="ml-2 text-xs text-gray-400">{{ $m->year }}</span>
                        @endif
                    </div>
                    <button wire:click="deleteModel({{ $m->id_vehicle_filter }})"
                        wire:confirm="Delete this model?"
                        class="text-red-400 hover:text-red-600 text-xs">✕</button>
                </div>
                @empty
                <div class="px-5 py-8 text-center text-sm text-gray-400">No models yet.</div>
                @endforelse
            </div>

            <div class="px-5 py-4 border-t border-gray-100 flex gap-2">
                <input wire:model="newModelName" type="text" placeholder="Model name…"
                    class="flex-1 text-sm rounded-lg border border-gray-200 px-3 py-2 focus:outline-none" />
                <input wire:model="newModelYear" type="number" placeholder="Year"
                    class="w-24 text-sm rounded-lg border border-gray-200 px-3 py-2 focus:outline-none" />
                <button wire:click="addModel"
                    class="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700">Add</button>
            </div>
            @else
            <div class="px-5 py-16 text-center text-sm text-gray-400">← Select a make first</div>
            @endif
        </div>
    </div>
</x-filament-panels::page>
