import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();

    // Handle different types of Telegram updates
    if (update.message) {
      await handleMessage(update.message);
    } else if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleMessage(message: any) {
  const chatId = message.chat.id;
  const text = message.text;

  // Handle different commands
  if (text === '/start') {
    await sendTelegramMessage(chatId, `
🏫 <b>Welcome to SwiftTaska Nursery!</b>

This bot will send you notifications about:
📚 Activities and events
💳 Payment reminders
📋 Important announcements

To get started, please share this chat ID with the school: <code>${chatId}</code>

Use /help to see available commands.
    `);
  } else if (text === '/help') {
    await sendTelegramMessage(chatId, `
📖 <b>Available Commands:</b>

/start - Get started with notifications
/help - Show this help message
/activities - View upcoming activities
/payments - Check payment status
/settings - Notification preferences

For support, contact the school office.
    `);
  } else if (text === '/activities') {
    await sendActivitiesList(chatId);
  } else if (text === '/payments') {
    await sendPaymentStatus(chatId);
  } else if (text === '/settings') {
    await sendNotificationSettings(chatId);
  }
}

async function handleCallbackQuery(callbackQuery: any) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  // Handle button callbacks
  if (data.startsWith('activity_')) {
    const activityId = data.split('_')[1];
    await showActivityDetails(chatId, activityId);
  } else if (data.startsWith('payment_')) {
    const paymentId = data.split('_')[1];
    await showPaymentDetails(chatId, paymentId);
  }

  // Answer the callback query
  await answerCallbackQuery(callbackQuery.id);
}

async function sendActivitiesList(chatId: string) {
  try {
    // Fetch upcoming activities from your API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/activities?upcoming=true`);

    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }

    const activities = await response.json();

    if (activities.length === 0) {
      await sendTelegramMessage(chatId, '📅 No upcoming activities scheduled.');
      return;
    }

    let message = '📅 <b>Upcoming Activities:</b>\n\n';

    activities.slice(0, 5).forEach((activity: any, index: number) => {
      const date = new Date(activity.date).toLocaleDateString();
      const time = new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      message += `${index + 1}. <b>${activity.name}</b>\n`;
      message += `   📅 ${date} at ${time}\n`;
      message += `   📍 ${activity.location}\n\n`;
    });

    const buttons = activities.slice(0, 3).map((activity: any) => ({
      text: `📋 ${activity.name}`,
      callback_data: `activity_${activity.id}`
    }));

    await sendTelegramMessage(chatId, message, [buttons]);
  } catch (error) {
    console.error('Error fetching activities:', error);
    await sendTelegramMessage(chatId, '❌ Sorry, I could not fetch the activities list right now.');
  }
}

async function sendPaymentStatus(chatId: string) {
  // For demo purposes, showing sample payment status
  // In real implementation, you'd fetch from database based on chat ID
  const message = `
💳 <b>Payment Status</b>

<b>Outstanding Payments:</b>
• Monthly Tuition - RM 300 (Due: 15 Jan 2024)
• Activity Fee - RM 50 (Due: 20 Jan 2024)

<b>Recent Payments:</b>
✅ Registration Fee - RM 100 (Paid: 5 Jan 2024)

Use the button below to make payments online.
  `;

  const buttons = [
    {
      text: '💳 Make Payment',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fees`
    }
  ];

  await sendTelegramMessage(chatId, message, [buttons]);
}

async function sendNotificationSettings(chatId: string) {
  const message = `
⚙️ <b>Notification Settings</b>

Current preferences:
📚 Activity notifications: ✅ Enabled
💳 Payment reminders: ✅ Enabled
⏰ Activity reminders: ✅ Enabled
🚨 Overdue notices: ✅ Enabled

To modify these settings, please contact the school office or use the parent portal.
  `;

  const buttons = [
    {
      text: '🌐 Open Parent Portal',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    }
  ];

  await sendTelegramMessage(chatId, message, [buttons]);
}

async function showActivityDetails(chatId: string, activityId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/activities/${activityId}`);

    if (!response.ok) {
      throw new Error('Activity not found');
    }

    const activity = await response.json();
    const date = new Date(activity.date).toLocaleDateString();
    const time = new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const message = `
📚 <b>${activity.name}</b>

📅 <b>Date:</b> ${date}
⏰ <b>Time:</b> ${time}
📍 <b>Location:</b> ${activity.location}
👥 <b>For:</b> ${activity.class ? `${activity.class.name} (${activity.class.level})` : 'All Classes'}
⏱️ <b>Duration:</b> ${activity.duration ? `${activity.duration} minutes` : 'Not specified'}

📝 <b>Description:</b>
${activity.description || 'No additional details provided.'}
    `;

    await sendTelegramMessage(chatId, message);
  } catch (error) {
    await sendTelegramMessage(chatId, '❌ Sorry, I could not find that activity.');
  }
}

async function showPaymentDetails(chatId: string, paymentId: string) {
  // Implementation for showing payment details
  await sendTelegramMessage(chatId, 'Payment details feature coming soon!');
}

async function sendTelegramMessage(chatId: string, text: string, buttons?: any[]) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const payload: any = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML'
  };

  if (buttons && buttons.length > 0) {
    payload.reply_markup = {
      inline_keyboard: buttons.length > 1 ? [buttons] : buttons.map(btn => [btn])
    };
  }

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

async function answerCallbackQuery(callbackQueryId: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;

  const url = `https://api.telegram.org/bot${botToken}/answerCallbackQuery`;

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQueryId }),
  });
}