<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendMessageMail extends Mailable
{
    use Queueable, SerializesModels;

        public $data; // البيانات التي ستصل للإيميل

    /**
     * Create a new message instance.
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->subject($this->data['subject'])
                    ->view('emails.send_message')
                    ->with('data', $this->data);
    }
    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'شركة الفارع الدوليه',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.send_message',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
