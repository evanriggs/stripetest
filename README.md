# The Foundation for American Innovation - Donation System

A modern, secure donation system built with Next.js, Stripe, and Vercel for The Foundation for American Innovation.

## Features

- ✅ **One-time and recurring donations** via Stripe Checkout
- ✅ **Modern React UI** with Tailwind CSS and Framer Motion
- ✅ **Vercel API routes** for secure backend processing
- ✅ **Webhook handling** for donation events
- ✅ **Mobile-responsive design**
- ✅ **SEO optimized** with proper meta tags
- ✅ **Social sharing** on thank you page
- ✅ **Tax receipt collection** via Stripe
- ✅ **Billing address collection** for tax purposes

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Backend**: Vercel API Routes
- **Payment Processing**: Stripe
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your Stripe keys:

```bash
cp env.example .env.local
```

Update `.env.local` with your actual Stripe keys:

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your donation system.

## Stripe Setup

### 1. Create Stripe Products

In your Stripe Dashboard, create products for your donations:

1. Go to **Products** in your Stripe Dashboard
2. Create a product called "Donation to The Foundation for American Innovation"
3. Set the price to be variable (custom amount)
4. Enable recurring billing for monthly donations

### 2. Configure Webhooks

1. Go to **Webhooks** in your Stripe Dashboard
2. Add endpoint: `https://your-domain.vercel.app/api/webhook`
3. Select these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
4. Copy the webhook secret to your `.env.local`

### 3. Update Success/Cancel URLs

In `api/create-checkout-session.js`, update the URLs:

```javascript
success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/donate`,
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_BASE_URL`

### Environment Variables for Production

```env
STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

## Customization

### Update Nonprofit Branding

1. **Logo**: Update the `images` array in `api/create-checkout-session.js`
2. **Colors**: Modify the color scheme in `tailwind.config.js`
3. **Content**: Update text content in components and pages
4. **Contact Info**: Update footer contact information

### Add Additional Features

- **Email Integration**: Add email service (SendGrid, Mailgun) to send receipts
- **Database**: Add database (PostgreSQL, MongoDB) to track donations
- **Analytics**: Integrate Google Analytics or Mixpanel
- **CRM Integration**: Connect to Salesforce or HubSpot

## File Structure

```
├── api/
│   ├── create-checkout-session.js  # Stripe checkout API
│   └── webhook.js                  # Stripe webhook handler
├── components/
│   ├── DonationForm.jsx           # Main donation form
│   └── ThankYouPage.jsx           # Thank you page component
├── pages/
│   ├── _app.js                    # App wrapper
│   ├── index.js                   # Homepage
│   ├── donate.js                  # Donation page
│   └── thank-you.js               # Thank you page
├── styles/
│   └── globals.css                # Global styles
├── package.json                   # Dependencies
├── next.config.js                 # Next.js config
├── tailwind.config.js             # Tailwind config
└── vercel.json                    # Vercel config
```

## Security Features

- ✅ **Stripe webhook signature verification**
- ✅ **Input validation** on all forms
- ✅ **HTTPS enforcement** in production
- ✅ **No sensitive data storage** on your servers
- ✅ **CORS protection** for API routes

## Testing

### Test Donations

1. Use Stripe test keys for development
2. Test with these card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
3. Test both one-time and recurring donations

### Webhook Testing

1. Use Stripe CLI to test webhooks locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

## Airtable CRM Integration

### 1. Create a Personal Access Token (PAT)
1. Go to your [Airtable Developer Hub](https://airtable.com/developers/web/api/personal-access-tokens/)
2. Click **Create token**
3. Name your token (e.g., "Stripe Donations Integration")
4. Set the **scope** to `data.records:read` and `data.records:write` (and optionally `schema.bases:read`)
5. Under **Access**, select your donation base (or "All workspaces")
6. Click **Create token** and copy the token (starts with `pat...`)

### 2. Get Your Base ID
1. Open your Airtable base
2. Go to **Help** → **API Documentation**
3. Copy the **Base ID** from the URL (it's in the format `appXXXXXXXXXXXXXX`)

### 3. Add to Environment Variables
Add these to your `.env.local` file:

```env
AIRTABLE_PERSONAL_ACCESS_TOKEN=pat_your_token_here
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

### 4. Test the Integration
(unchanged)

### 5. Troubleshooting
- Make sure your PAT is correct and has the right scopes
- Check that your base ID is correct
- Verify table names match exactly

## Support

For questions or issues:

1. Check the [Stripe Documentation](https://stripe.com/docs)
2. Review [Next.js Documentation](https://nextjs.org/docs)
3. Contact: info@foundation-innovation.org

## License

This project is proprietary to The Foundation for American Innovation.
