import Stripe from 'stripe';
import { buffer } from 'micro';
import { processDonationFromStripe, sendTaxReceipt } from './airtable-integration';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleSuccessfulDonation(session);
      break;
    
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      await handleRecurringDonation(invoice);
      break;
    
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      await handleSubscriptionCancelled(subscription);
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

async function handleSuccessfulDonation(session) {
  console.log('Successful donation:', {
    sessionId: session.id,
    amount: session.amount_total / 100,
    customerEmail: session.customer_details?.email,
    metadata: session.metadata,
  });

  try {
    // Process donation in Airtable CRM
    const result = await processDonationFromStripe(session);
    
    console.log('Donation processed in Airtable:', {
      donorId: result.donor.id,
      donationId: result.donation.id,
      amount: session.amount_total / 100
    });

    // Send tax receipt (optional - you can enable this later)
    // await sendTaxReceipt(result.donor.id, result.donation.id);
    
  } catch (error) {
    console.error('Error processing donation in Airtable:', error);
    // Don't throw error to avoid webhook failure
  }
}

async function handleRecurringDonation(invoice) {
  console.log('Recurring donation processed:', {
    invoiceId: invoice.id,
    amount: invoice.amount_paid / 100,
    customerId: invoice.customer,
  });
}

async function handleSubscriptionCancelled(subscription) {
  console.log('Subscription cancelled:', {
    subscriptionId: subscription.id,
    customerId: subscription.customer,
  });
} 