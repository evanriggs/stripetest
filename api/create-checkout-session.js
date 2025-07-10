import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, recurring, email, name } = req.body;

    // Validate input
    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(parseFloat(amount) * 100),
          product_data: {
            name: 'Donation to The Foundation for American Innovation',
            description: recurring ? 'Monthly donation' : 'One-time donation',
            // Add your nonprofit logo URL here
            images: ['https://foundation-innovation.org/logo.png'],
          },
          recurring: recurring ? { interval: 'month' } : undefined,
        },
        quantity: 1,
      }],
      mode: recurring ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/donate`,
      metadata: {
        donor_name: name,
        donation_type: recurring ? 'recurring' : 'one-time',
        nonprofit: 'The Foundation for American Innovation',
      },
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
} 