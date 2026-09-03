<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Receipt — Order #{{ $order->id }}</title>
<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        font-size: 13px;
        color: #111;
        background: #fff;
        padding: 40px;
        max-width: 720px;
        margin: 0 auto;
    }

    /* ── Header ── */
    .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 32px;
        padding-bottom: 20px;
        border-bottom: 2px solid #111;
    }
    .logo { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
    .logo span { color: #16a34a; }
    .receipt-meta { text-align: right; }
    .receipt-meta h2 { font-size: 22px; font-weight: 700; color: #16a34a; margin-bottom: 4px; }
    .receipt-meta p { font-size: 12px; color: #555; line-height: 1.6; }

    /* ── Status badge ── */
    .status {
        display: inline-block;
        padding: 2px 10px;
        border-radius: 99px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 4px;
    }
    .status-paid, .status-delivered { background: #dcfce7; color: #166534; }
    .status-pending                 { background: #fef9c3; color: #854d0e; }
    .status-processing              { background: #dbeafe; color: #1e40af; }
    .status-shipped                 { background: #e0e7ff; color: #3730a3; }
    .status-cancelled               { background: #fee2e2; color: #991b1b; }

    /* ── Addresses ── */
    .addresses {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin-bottom: 28px;
    }
    .address-block h3 {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #777;
        margin-bottom: 6px;
    }
    .address-block p { line-height: 1.7; color: #333; }

    /* ── Items table ── */
    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 0;
    }
    thead th {
        background: #f4f4f4;
        padding: 9px 12px;
        text-align: left;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        color: #555;
        border-bottom: 1px solid #ddd;
    }
    thead th:last-child { text-align: right; }
    tbody td {
        padding: 10px 12px;
        border-bottom: 1px solid #eee;
        vertical-align: top;
    }
    tbody td:last-child { text-align: right; font-weight: 600; }
    .part-number { font-family: monospace; font-size: 11px; color: #777; }
    .brand { font-size: 11px; color: #888; }
    tfoot td {
        padding: 7px 12px;
        font-size: 12px;
        color: #444;
    }
    tfoot td:last-child { text-align: right; }
    .total-row td {
        padding: 10px 12px;
        font-size: 14px;
        font-weight: 700;
        background: #f4f4f4;
        border-top: 2px solid #111;
        color: #16a34a;
    }
    .total-row td:last-child { text-align: right; }

    /* ── Shipping + payment ── */
    .meta-section {
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        font-size: 12px;
        color: #444;
        line-height: 1.7;
    }
    .meta-section h3 {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #777;
        margin-bottom: 4px;
    }
    .waybill { font-family: monospace; font-weight: 700; color: #111; }

    /* ── Footer ── */
    .footer {
        margin-top: 36px;
        padding-top: 16px;
        border-top: 1px solid #eee;
        font-size: 11px;
        color: #999;
        text-align: center;
        line-height: 1.7;
    }

    /* ── Print button (hidden when printing) ── */
    .print-btn {
        display: block;
        margin: 0 auto 28px;
        padding: 10px 28px;
        background: #16a34a;
        color: #fff;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        text-align: center;
    }
    .print-btn:hover { background: #15803d; }

    @media print {
        .print-btn { display: none; }
        body { padding: 20px; }
    }
</style>
</head>
<body>

<button class="print-btn" onclick="window.print()">🖨 Print / Save as PDF</button>

<div class="header">
    <div>
        <div class="logo">Performance Products <span>SA</span></div>
        <p style="font-size:11px;color:#777;margin-top:4px;">performanceproductssa.co.za</p>
    </div>
    <div class="receipt-meta">
        <h2>Tax Invoice</h2>
        <p>
            Order #{{ $order->id }}<br>
            {{ $order->created_at->format('d F Y') }}<br>
            <span class="status status-{{ $order->status }}">{{ ucfirst($order->status) }}</span>
        </p>
    </div>
</div>

<div class="addresses">
    <div class="address-block">
        <h3>Bill / Ship To</h3>
        <p>
            {{ $order->shipping_name }}<br>
            {{ $order->shipping_email }}<br>
            @if($order->shipping_phone){{ $order->shipping_phone }}<br>@endif
            {{ $order->shipping_address }}<br>
            {{ $order->shipping_city }}, {{ $order->shipping_province }} {{ $order->shipping_postal_code }}<br>
            South Africa
        </p>
    </div>
    <div class="address-block">
        <h3>Issued By</h3>
        <p>
            Performance Products SA<br>
            {{ config('mail.from.address') }}<br>
            South Africa<br>
            VAT Reg: Pending
        </p>
    </div>
</div>

<table>
    <thead>
        <tr>
            <th style="width:50%">Product</th>
            <th>Brand</th>
            <th style="text-align:center">Qty</th>
            <th style="text-align:right">Unit (incl.)</th>
            <th style="text-align:right">Total</th>
        </tr>
    </thead>
    <tbody>
        @foreach($order->items as $item)
        <tr>
            <td>
                <div style="font-weight:600">{{ $item->product_name }}</div>
                <div class="part-number">{{ $item->part_number }}</div>
            </td>
            <td class="brand">{{ $item->brand_name ?? '—' }}</td>
            <td style="text-align:center">{{ $item->qty }}</td>
            <td style="text-align:right">R {{ number_format($item->unit_price_incl, 2) }}</td>
            <td>R {{ number_format($item->line_total_incl, 2) }}</td>
        </tr>
        @endforeach
    </tbody>
    <tfoot>
        <tr>
            <td colspan="4" style="text-align:right;color:#777">Subtotal (excl. VAT)</td>
            <td>R {{ number_format($order->subtotal_excl, 2) }}</td>
        </tr>
        <tr>
            <td colspan="4" style="text-align:right;color:#777">VAT (15%)</td>
            <td>R {{ number_format($order->vat_amount, 2) }}</td>
        </tr>
        @if($order->shipping_cost > 0)
        <tr>
            <td colspan="4" style="text-align:right;color:#777">Shipping (incl. VAT)</td>
            <td>R {{ number_format($order->shipping_cost, 2) }}</td>
        </tr>
        @endif
        @if($order->gift_wrapped && $order->gift_wrap_cost > 0)
        <tr>
            <td colspan="4" style="text-align:right;color:#777">Gift Wrapping</td>
            <td>R {{ number_format($order->gift_wrap_cost, 2) }}</td>
        </tr>
        @endif
        <tr class="total-row">
            <td colspan="4">Total (incl. VAT)</td>
            <td>R {{ number_format($order->total_incl, 2) }}</td>
        </tr>
    </tfoot>
</table>

<div class="meta-section">
    <div>
        <h3>Payment</h3>
        <p>
            Method: {{ strtoupper($order->payment_method ?? '—') }}<br>
            @if($order->payment_ref)Reference: {{ $order->payment_ref }}<br>@endif
            @if($order->yoco_charge_id)Yoco Charge: {{ $order->yoco_charge_id }}@endif
        </p>
    </div>
    <div>
        <h3>Shipping</h3>
        <p>
            {{ $order->shipping_carrier ?? 'The Courier Guy' }}
            @if($order->shipping_service) — {{ $order->shipping_service }}@endif<br>
            @if($order->waybill_number)
                Waybill: <span class="waybill">{{ $order->waybill_number }}</span>
            @else
                Tracking: Pending
            @endif
        </p>
    </div>
</div>

<div class="footer">
    Thank you for your order! This document serves as your tax invoice.<br>
    Performance Products SA · {{ config('mail.from.address') }} · performanceproductssa.co.za
</div>

<script>
    // Auto-print when opened directly (e.g. from a new tab)
    if (window.location.search.includes('print=1')) {
        window.addEventListener('load', () => window.print());
    }
</script>
</body>
</html>
