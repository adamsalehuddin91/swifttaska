import { NextRequest, NextResponse } from 'next/server';
import { notificationService, NotificationRecipient } from '@/lib/notifications';

// Send manual notification
export async function POST(request: NextRequest) {
  try {
    const { type, recipients, data } = await request.json();

    let result;
    switch (type) {
      case 'activity_created':
        result = await notificationService.notifyActivityCreated(data.activity, recipients);
        break;
      case 'activity_reminder':
        result = await notificationService.notifyActivityReminder(data.activity, recipients);
        break;
      case 'payment_received':
        result = await notificationService.notifyPaymentReceived(data.payment, recipients);
        break;
      case 'payment_reminder':
        result = await notificationService.notifyPaymentReminder(data.fee, recipients);
        break;
      case 'fee_overdue':
        result = await notificationService.notifyFeeOverdue(data.fee, recipients);
        break;
      default:
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, results: result });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}

// Get notification settings
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    // In a real implementation, fetch from database
    // For now, return mock data
    const settings = {
      studentId,
      notifications: {
        activities: {
          telegram: true,
          whatsapp: true,
          reminders: true
        },
        payments: {
          telegram: true,
          whatsapp: true,
          reminders: true,
          overdue: true
        }
      },
      contacts: {
        telegram: {
          fatherChatId: process.env.DEMO_FATHER_TELEGRAM_ID,
          motherChatId: process.env.DEMO_MOTHER_TELEGRAM_ID
        },
        whatsapp: {
          fatherPhone: process.env.DEMO_FATHER_WHATSAPP,
          motherPhone: process.env.DEMO_MOTHER_WHATSAPP
        }
      }
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}