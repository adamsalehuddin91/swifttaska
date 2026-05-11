import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json();

    // In a real implementation, you would save to database
    // For now, we'll just validate and return success

    // Validate required fields
    if (!settings.studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Validate contact information if notifications are enabled
    const { notifications, contacts } = settings;

    if (notifications.activities.telegram || notifications.payments.telegram) {
      if (!contacts.telegram.fatherChatId && !contacts.telegram.motherChatId) {
        return NextResponse.json({
          error: 'At least one Telegram chat ID is required when Telegram notifications are enabled'
        }, { status: 400 });
      }
    }

    if (notifications.activities.whatsapp || notifications.payments.whatsapp) {
      if (!contacts.whatsapp.fatherPhone && !contacts.whatsapp.motherPhone) {
        return NextResponse.json({
          error: 'At least one WhatsApp phone number is required when WhatsApp notifications are enabled'
        }, { status: 400 });
      }
    }

    // In a real application, save to database:
    // await prisma.notificationSettings.upsert({
    //   where: { studentId: settings.studentId },
    //   update: settings,
    //   create: settings
    // });

    console.log('Notification settings saved for student:', settings.studentId);
    console.log('Settings:', JSON.stringify(settings, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Notification settings saved successfully'
    });

  } catch (error) {
    console.error('Error saving notification settings:', error);
    return NextResponse.json({
      error: 'Failed to save notification settings'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    // In a real implementation, fetch from database
    // const settings = await prisma.notificationSettings.findUnique({
    //   where: { studentId }
    // });

    // For now, return default settings
    const defaultSettings = {
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
          fatherChatId: '',
          motherChatId: ''
        },
        whatsapp: {
          fatherPhone: '',
          motherPhone: ''
        }
      }
    };

    return NextResponse.json(defaultSettings);

  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json({
      error: 'Failed to fetch notification settings'
    }, { status: 500 });
  }
}