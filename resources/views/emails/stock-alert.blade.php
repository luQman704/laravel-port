<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
body{font-family:sans-serif;color:#111;max-width:600px;margin:0 auto;padding:20px}
h1{color:#16a34a}
.btn{display:inline-block;background:#16a34a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px}
</style></head>
<body>
<h1>Back in Stock!</h1>
<p><strong>{{ $product?->product_name }}</strong> ({{ $product?->part_number }}) is now available.</p>

<p>
@if($stock && $stock->quantity > 0) ✅ In stock at SA Warehouse ({{ $stock->quantity }} units)<br> @endif
@if($stock && array_sum(array_values(is_array($stock->warehouse_stock) ? $stock->warehouse_stock : (json_decode($stock->warehouse_stock, true) ?? []))) > 0) ✅ Available at USA Warehouse<br> @endif
@if($stock && $stock->mfr_quantity > 0) ✅ Available at Manufacturer ({{ $stock->mfr_quantity }} units)<br> @endif
@if(!$stock) Product stock information is being updated — check back soon. @endif
</p>

<a href="{{ url('/product/'.$alert->turn14_product_id) }}" class="btn">View Product</a>

<p style="margin-top:24px;color:#999;font-size:12px">
You are receiving this because you set a stock alert at Performance Products SA.<br>
<a href="{{ url('/account/alerts/unsubscribe/'.$alert->token) }}">Unsubscribe from this alert</a>
</p>
</body>
</html>
