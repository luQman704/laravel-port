<?php
namespace App\Observers;

use App\Models\Order;
use App\Services\ShipLogicService;

class OrderObserver
{
    public function __construct(private readonly ShipLogicService $shipLogic) {}

    public function updated(Order $order): void
    {
        // Whenever an order transitions to paid — regardless of how — create the TCG shipment
        if (!$order->wasChanged('status') || $order->status !== 'paid') {
            return;
        }

        $noShipment = in_array($order->shipping_service, ['COLLECT', 'OWN_COURIER']);
        if ($order->waybill_number || $noShipment) {
            return; // already booked or not applicable
        }

        try {
            $shipment = $this->shipLogic->createShipment(
                $order,
                $order->shipping_service ?? 'ECO'
            );

            $order->updateQuietly([
                'shiplogic_shipment_id' => $shipment['shipment_id'],
                'waybill_number'        => $shipment['tracking_reference'],
            ]);
        } catch (\Throwable) {
            // Log but don't throw — admin can manually create shipment
        }
    }
}
