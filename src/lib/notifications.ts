// Notification service for Telegram and WhatsApp integration

interface NotificationConfig {
  telegram?: {
    botToken: string;
    enabled: boolean;
  };
  whatsapp?: {
    apiKey: string;
    phoneNumberId: string;
    enabled: boolean;
  };
}

interface NotificationRecipient {
  type: 'telegram' | 'whatsapp' | 'both';
  telegramChatId?: string;
  whatsappPhone?: string;
  name: string;
}

interface NotificationTemplate {
  type: 'activity_created' | 'activity_updated' | 'activity_reminder' | 'payment_reminder' | 'payment_received' | 'fee_overdue';
  title: string;
  message: string;
  buttons?: Array<{
    text: string;
    url?: string;
    callback_data?: string;
  }>;
}

class NotificationService {
  private config: NotificationConfig;

  constructor(config: NotificationConfig) {
    this.config = config;
  }

  // Telegram Bot Integration
  async sendTelegramMessage(chatId: string, message: string, buttons?: any[]) {
    if (!this.config.telegram?.enabled || !this.config.telegram?.botToken) {
      console.log('Telegram notifications disabled');
      return;
    }

    try {
      const url = `https://api.telegram.org/bot${this.config.telegram.botToken}/sendMessage`;

      const payload: any = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      };

      if (buttons && buttons.length > 0) {
        payload.reply_markup = {
          inline_keyboard: [buttons]
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      throw error;
    }
  }

  // WhatsApp Business API Integration
  async sendWhatsAppMessage(phoneNumber: string, message: string, templateName?: string) {
    if (!this.config.whatsapp?.enabled || !this.config.whatsapp?.apiKey) {
      console.log('WhatsApp notifications disabled');
      return;
    }

    try {
      const url = `https://graph.facebook.com/v18.0/${this.config.whatsapp.phoneNumberId}/messages`;

      const payload = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: {
          body: message
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.whatsapp.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  // Send notification to multiple recipients
  async sendNotification(
    recipients: NotificationRecipient[],
    template: NotificationTemplate,
    data: any
  ) {
    const message = this.formatMessage(template, data);
    const results = [];

    for (const recipient of recipients) {
      try {
        if (recipient.type === 'telegram' || recipient.type === 'both') {
          if (recipient.telegramChatId) {
            await this.sendTelegramMessage(
              recipient.telegramChatId,
              message,
              template.buttons
            );
            results.push({ recipient: recipient.name, platform: 'telegram', status: 'sent' });
          }
        }

        if (recipient.type === 'whatsapp' || recipient.type === 'both') {
          if (recipient.whatsappPhone) {
            await this.sendWhatsAppMessage(recipient.whatsappPhone, message);
            results.push({ recipient: recipient.name, platform: 'whatsapp', status: 'sent' });
          }
        }
      } catch (error) {
        console.error(`Error sending notification to ${recipient.name}:`, error);
        results.push({
          recipient: recipient.name,
          platform: recipient.type,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  // Format message with template variables
  private formatMessage(template: NotificationTemplate, data: any): string {
    let message = `<b>${template.title}</b>\n\n${template.message}`;

    // Replace template variables
    Object.keys(data).forEach(key => {
      const placeholder = `{{${key}}}`;
      message = message.replace(new RegExp(placeholder, 'g'), data[key]);
    });

    return message;
  }

  // Activity Notifications
  async notifyActivityCreated(activity: any, recipients: NotificationRecipient[]) {
    const template: NotificationTemplate = {
      type: 'activity_created',
      title: '🎉 New Activity Created!',
      message: `A new activity "<b>{{activityName}}</b>" has been scheduled for {{date}} at {{time}}.\n\n📍 Location: {{location}}\n👥 Target: {{targetClass}}\n⏰ Duration: {{duration}} minutes\n\n{{description}}`,
      buttons: [
        {
          text: '📅 View Details',
          url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/activities`
        }
      ]
    };

    const data = {
      activityName: activity.name,
      date: new Date(activity.date).toLocaleDateString(),
      time: new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: activity.location,
      targetClass: activity.class ? `${activity.class.name} (${activity.class.level})` : 'All Classes',
      duration: activity.duration || 'Not specified',
      description: activity.description || 'No additional details provided.'
    };

    return await this.sendNotification(recipients, template, data);
  }

  async notifyActivityReminder(activity: any, recipients: NotificationRecipient[]) {
    const template: NotificationTemplate = {
      type: 'activity_reminder',
      title: '⏰ Activity Reminder',
      message: `Don't forget! The activity "<b>{{activityName}}</b>" is scheduled for tomorrow ({{date}}) at {{time}}.\n\n📍 Location: {{location}}\n👥 For: {{targetClass}}\n\nPlease ensure your child is prepared and arrives on time.`,
      buttons: [
        {
          text: '📋 Activity Details',
          url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/activities`
        }
      ]
    };

    const data = {
      activityName: activity.name,
      date: new Date(activity.date).toLocaleDateString(),
      time: new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: activity.location,
      targetClass: activity.class ? `${activity.class.name} (${activity.class.level})` : 'All Classes'
    };

    return await this.sendNotification(recipients, template, data);
  }

  // Payment Notifications
  async notifyPaymentReceived(payment: any, recipients: NotificationRecipient[]) {
    const template: NotificationTemplate = {
      type: 'payment_received',
      title: '✅ Payment Received',
      message: `Thank you! We have received your payment for <b>{{feeDescription}}</b>.\n\n💰 Amount Paid: RM {{amount}}\n💳 Payment Method: {{method}}\n📅 Payment Date: {{date}}\n👤 Student: {{studentName}}\n\nReceipt number: {{receiptId}}`,
      buttons: [
        {
          text: '🧾 View Receipt',
          url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fees`
        }
      ]
    };

    const data = {
      feeDescription: payment.fee.description,
      amount: payment.paidAmount.toLocaleString(),
      method: payment.paymentMethod,
      date: new Date(payment.paidDate).toLocaleDateString(),
      studentName: `${payment.fee.student.firstName} ${payment.fee.student.lastName}`,
      receiptId: payment.id.slice(-8).toUpperCase()
    };

    return await this.sendNotification(recipients, template, data);
  }

  async notifyPaymentReminder(fee: any, recipients: NotificationRecipient[]) {
    const template: NotificationTemplate = {
      type: 'payment_reminder',
      title: '💳 Payment Reminder',
      message: `This is a friendly reminder that payment for <b>{{feeDescription}}</b> is due on {{dueDate}}.\n\n💰 Amount Due: RM {{amount}}\n👤 Student: {{studentName}}\n📚 Class: {{className}}\n\nPlease make your payment to avoid any late fees.`,
      buttons: [
        {
          text: '💳 Make Payment',
          url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fees`
        }
      ]
    };

    const data = {
      feeDescription: fee.description,
      amount: (fee.amount - (fee.paidAmount || 0)).toLocaleString(),
      dueDate: new Date(fee.dueDate).toLocaleDateString(),
      studentName: `${fee.student.firstName} ${fee.student.lastName}`,
      className: fee.student.class ? `${fee.student.class.name} (${fee.student.class.level})` : 'Not assigned'
    };

    return await this.sendNotification(recipients, template, data);
  }

  async notifyFeeOverdue(fee: any, recipients: NotificationRecipient[]) {
    const template: NotificationTemplate = {
      type: 'fee_overdue',
      title: '⚠️ Payment Overdue',
      message: `URGENT: Payment for <b>{{feeDescription}}</b> was due on {{dueDate}} and is now overdue.\n\n💰 Outstanding Amount: RM {{amount}}\n👤 Student: {{studentName}}\n📚 Class: {{className}}\n\nPlease contact the school office or make payment immediately to avoid further action.`,
      buttons: [
        {
          text: '📞 Contact School',
          url: `tel:+60123456789`
        },
        {
          text: '💳 Pay Now',
          url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fees`
        }
      ]
    };

    const data = {
      feeDescription: fee.description,
      amount: (fee.amount - (fee.paidAmount || 0)).toLocaleString(),
      dueDate: new Date(fee.dueDate).toLocaleDateString(),
      studentName: `${fee.student.firstName} ${fee.student.lastName}`,
      className: fee.student.class ? `${fee.student.class.name} (${fee.student.class.level})` : 'Not assigned'
    };

    return await this.sendNotification(recipients, template, data);
  }
}

// Initialize notification service
const notificationConfig: NotificationConfig = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    enabled: !!process.env.TELEGRAM_BOT_TOKEN
  },
  whatsapp: {
    apiKey: process.env.WHATSAPP_API_KEY || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    enabled: !!(process.env.WHATSAPP_API_KEY && process.env.WHATSAPP_PHONE_NUMBER_ID)
  }
};

export const notificationService = new NotificationService(notificationConfig);
export type { NotificationRecipient, NotificationTemplate };