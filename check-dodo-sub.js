import DodoPayments from 'dodopayments';
const dodo = new DodoPayments({ bearerToken: process.env.DODO_PAYMENTS_API_KEY, environment: 'live_mode' });
async function run() {
  try {
    const subs = await dodo.subscriptions.list({ customer_id: 'cus_0NgoZthoNsFAZPkE1GD94' });
    console.log('Subscriptions:', JSON.stringify(subs, null, 2));
  } catch(e) {
    console.error(e);
  }
}
run();
