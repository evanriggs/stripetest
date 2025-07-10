const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/create-checkout-session', async (req, res) => {
  const { amount, recurring } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        unit_amount: parseInt(amount) * 100,
        product_data: { name: 'Donation' },
        recurring: recurring ? { interval: 'month' } : undefined,
      },
      quantity: 1,
    }],
    mode: recurring ? 'subscription' : 'payment',
    success_url: 'https://yourdomain.com/thank-you',
    cancel_url: 'https://yourdomain.com/cancel',
  });

  res.json({ url: session.url });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
