<?php
namespace App\Mail;

use App\Models\Turn14StockAlert;
use App\Models\Turn14Stock;
use App\Models\Turn14Product;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StockAlertNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Turn14StockAlert $alert,
        public readonly ?Turn14Product $product,
        public readonly ?Turn14Stock $stock,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: "Back in Stock: {$this->product?->product_name}");
    }

    public function content(): Content
    {
        return new Content(view: 'emails.stock-alert');
    }
}
