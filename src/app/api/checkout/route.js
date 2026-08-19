import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'test_mode',
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    const session = await dodo.checkoutSessions.create({
      product_cart: [
        { product_id: 'pdt_tot_monthly', quantity: 1 } 
      ],
      customer: {
        email: email || 'customer@example.com',
        name: name || 'TOT Reader',
      },
      return_url: 'http://localhost:3000/app?success=true',
    });

    return NextResponse.json({ url: session.checkout_url });
  } catch (error) {
    console.error('Dodo checkout error:', error);
    return NextResponse.json({ error: 'Payment setup failed' }, { status: 500 });
  }
}
