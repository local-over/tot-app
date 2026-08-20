export const runtime = 'edge';
import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'live_mode',
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    const session = await dodo.checkoutSessions.create({
      product_cart: [
        { product_id: 'pdt_0NlnL2RDR0Xgj6a7t2zSd', quantity: 1 } 
      ],
      customer: {
        email: email || 'customer@example.com',
        name: name || 'TOT Reader',
      },
      return_url: 'https://theonetopic.me/gate?success=true',
      cancel_url: 'https://theonetopic.me/gate',
      minimal_address: true,
      feature_flags: {
        allow_discount_code: true,
        allow_phone_number_collection: false,
      }
    });

    return NextResponse.json({ url: session.checkout_url });
  } catch (error) {
    console.error('Dodo checkout error:', error);
    return NextResponse.json({ error: 'Payment setup failed' }, { status: 500 });
  }
}
