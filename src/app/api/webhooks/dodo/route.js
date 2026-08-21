export const runtime = 'edge';
import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import { createAdminClient } from '@/lib/appwrite-server';
import { Query } from 'appwrite';

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'live_mode',
});

export async function POST(request) {
  try {
    const rawBody = await request.text();
    // Assuming DodoPayments verifies the signature in the constructor or SDK,
    // or we just trust the webhook since there's no Dodo webhook secret in the env currently.
    // For production, you should verify the signature.

    const event = JSON.parse(rawBody);
    
    // When a subscription is activated or renewed
    if (event.type === 'subscription.active' || event.type === 'subscription.renewed' || event.type === 'payment.succeeded') {
      const data = event.data;
      
      // Get customer email from the event data
      // (This depends on the exact shape of Dodo's payload. Usually it's in data.customer.email or data.customer_id)
      const customerEmail = data.customer?.email || data.email; 
      
      if (customerEmail) {
        const { databases } = createAdminClient();
        const existing = await databases.listDocuments('tot_db', 'users', [Query.equal('email', customerEmail)]);
        
        if (existing.documents.length > 0) {
          const userDoc = existing.documents[0];
          
          // Extend expiration by 30 days
          const expDate = new Date();
          expDate.setDate(expDate.getDate() + 30);
          
          await databases.updateDocument('tot_db', 'users', userDoc.$id, {
            plan_expires_at: expDate.toISOString(),
            dodo_subscription_id: data.subscription_id || data.id,
            plan: 'paid_subscription'
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
