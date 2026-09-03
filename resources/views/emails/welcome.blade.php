<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body{font-family:sans-serif;color:#111;max-width:600px;margin:0 auto;padding:0}
.header{background:#111;padding:24px 32px}
.header h1{color:#fff;margin:0;font-size:20px;letter-spacing:0.05em}
.header span{color:#16a34a}
.content{padding:32px}
.btn{display:inline-block;background:#16a34a;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:20px;font-size:15px}
.divider{border:none;border-top:1px solid #eee;margin:28px 0}
.footer{padding:20px 32px;color:#999;font-size:12px;border-top:1px solid #eee}
ul{padding-left:20px;line-height:2}
</style>
</head>
<body>

<div class="header">
    <h1>Performance Products <span>SA</span></h1>
</div>

<div class="content">
    <h2 style="margin-top:0">Welcome, {{ explode(' ', $user->name)[0] }}!</h2>
    <p>Your account has been created. You can now browse and shop our full range of performance parts.</p>

    <ul>
        <li>Track your orders from your account dashboard</li>
        <li>Set back-in-stock alerts on out-of-stock products</li>
        <li>Save your delivery address for faster checkout</li>
        <li>View your order history and invoices</li>
    </ul>

    <a href="{{ url('/account') }}" class="btn">Go to My Account</a>

    <hr class="divider">

    <p style="color:#666;font-size:13px">
        Need help? Reply to this email or contact us at
        <a href="mailto:{{ config('mail.from.address') }}">{{ config('mail.from.address') }}</a>.
    </p>
</div>

<div class="footer">
    © {{ date('Y') }} Performance Products SA. You're receiving this because you created an account with us.
</div>

</body>
</html>
