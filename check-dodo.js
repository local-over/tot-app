import DodoPayments from 'dodopayments';
const dodo = new DodoPayments({ bearerToken: process.env.DODO_PAYMENTS_API_KEY, environment: 'live_mode' });
async function run() {
  try {
    const customers = await dodo.customers.list();
    const customer = customers.items.find(c => c.email === 'heromoheromo1998@gmail.com');
    if (customer) {
      console.log('Found customer:', customer);
    } else {
      console.log('Customer not found in Dodo');
    }
  } catch(e) {
    console.error(e);
  }
}
run();
