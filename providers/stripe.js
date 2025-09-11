import Stripe from 'stripe';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

export async function createStripeCheckout({ client, amountUSD }){
  if (!stripe) return { ok:false, message:'stripe_not_configured' };
  const success_url = (process.env.PUBLIC_BASE_URL || 'http://localhost:4000') + '/success';
  const cancel_url = (process.env.PUBLIC_BASE_URL || 'http://localhost:4000') + '/cancel';
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url, cancel_url,
    metadata: { client },
    line_items: [{
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(Number(amountUSD) * 100),
        product_data: { name: `SECKIOB Subscription (${client})` }
      },
      quantity: 1
    }]
  });
  return { ok:true, url: session.url, id: session.id };
}
