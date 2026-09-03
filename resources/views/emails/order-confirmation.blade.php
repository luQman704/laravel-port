<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body{font-family:sans-serif;color:#111;max-width:600px;margin:0 auto;padding:20px}
h1{color:#16a34a}
table{width:100%;border-collapse:collapse;margin:20px 0}
th,td{text-align:left;padding:8px;border-bottom:1px solid #eee}
th{background:#f9f9f9;font-size:12px;text-transform:uppercase;color:#666}
.total{font-size:1.2em;font-weight:bold;color:#16a34a}
</style>
</head>
<body>
<h1>Order Confirmed!</h1>
<p>Hi {{ $order->shipping_name }}, thanks for your order.</p>
<p><strong>Order #{{ $order->id }}</strong> — R {{ number_format($order->total_incl, 2) }} incl. VAT</p>

<table>
<tr><th>Product</th><th>Part #</th><th>Qty</th><th>Price</th></tr>
@foreach($order->items as $item)
<tr>
    <td>{{ $item->product_name }}</td>
    <td>{{ $item->part_number }}</td>
    <td>{{ $item->qty }}</td>
    <td>R {{ number_format($item->line_total_incl, 2) }}</td>
</tr>
@endforeach
</table>

<p><strong>Delivery to:</strong><br>
{{ $order->shipping_address }}, {{ $order->shipping_city }}, {{ $order->shipping_province }} {{ $order->shipping_postal_code }}
</p>

<p style="color:#666;font-size:13px">We'll be in touch with a tracking number once your order ships.</p>
<p>— Performance Products SA</p>
</body>
</html>
