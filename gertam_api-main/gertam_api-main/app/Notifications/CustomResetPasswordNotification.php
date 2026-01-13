<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomResetPasswordNotification extends Notification
{
    public string $token;

    public function __construct(string $token)
    {
        $this->token = $token;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $url = config('app.frontend_url') .
               "/reset-password?token={$this->token}&email={$notifiable->getEmailForPasswordReset()}";

        return (new MailMessage)
            ->subject('إعادة تعيين كلمة المرور')
            ->greeting('مرحباً ' . $notifiable->name)
            ->line('لقد استلمنا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.')
            ->action('إعادة تعيين كلمة المرور', $url)
            ->line('إذا لم تطلب إعادة تعيين كلمة المرور، فلا داعي لاتخاذ أي إجراء.');
    }
}