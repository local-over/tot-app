export const runtime = 'edge';
import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import { createAdminClient } from '@/lib/appwrite-server';

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'live_mode',
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { dodo_subscription_id, userId } = body;

    if (!dodo_subscription_id) {
      return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
    }

    // Cancel at end of billing cycle
    await dodo.subscriptions.update(dodo_subscription_id, {
      cancel_at_next_billing_date: true
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Dodo cancel error:', error);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
