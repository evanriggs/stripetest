# Stripe Setup Guide for The Foundation for American Innovation

## Your Stripe Configuration

### Publishable Key (Public - Safe to use in frontend)
```
pk_live_51J3ofBCziD0U4pcT7HE9lwByNjEXS9hv3uayoy2dKTCtRjZnotxIZswEAZjjuwqv8aVQr3sJfbrrE416qji2jBdz00qrg4rSh7
```

### Secret Key (Private - Keep secure)
You need to get your **Secret Key** from your Stripe Dashboard:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API keys**
3. Copy your **Secret key** (starts with `sk_live_`)

## Environment Variables Setup

Create a `.env.local` file in your project root with:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51J3ofBCziD0U4pcT7HE9lwByNjEXS9hv3uayoy2dKTCtRjZnotxIZswEAZjjuwqv8aVQr3sJfbrrE416qji2jBdz00qrg4rSh7
```

## Stripe Dashboard Setup

### 1. Create Donation Product

1. Go to **Products** in your Stripe Dashboard
2. Click **Add product**
3. Set product name: "Donation to The Foundation for American Innovation"
4. Set price to **One-time** with **Custom amount**
5. Save the product

### 2. Create Recurring Product (for monthly donations)

1. Create another product for recurring donations
2. Set price to **Recurring** with **Monthly** interval
3. Set price to **Custom amount**
4. Save the product

### 3. Configure Webhooks

1. Go to **Webhooks** in your Stripe Dashboard
2. Click **Add endpoint**
3. Set endpoint URL: `https://your-domain.vercel.app/api/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. Copy the webhook signing secret (starts with `whsec_`)

## Testing

### Test Card Numbers
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### Test the System
1. Run `npm run dev`
2. Visit `http://localhost:3000/donate`
3. Try a test donation with the success card number
4. Check that you receive the webhook events

## Production Deployment

When deploying to Vercel, add these environment variables:

```env
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51J3ofBCziD0U4pcT7HE9lwByNjEXS9hv3uayoy2dKTCtRjZnotxIZswEAZjjuwqv8aVQr3sJfbrrE416qji2jBdz00qrg4rSh7
```

## Security Notes

- ✅ Your publishable key is safe to use in frontend code
- ✅ Never expose your secret key in frontend code
- ✅ Use environment variables for all sensitive keys
- ✅ Enable webhook signature verification in production

## Support

If you need help with Stripe setup:
1. Check [Stripe Documentation](https://stripe.com/docs)
2. Contact Stripe Support
3. Email: info@foundation-innovation.org 