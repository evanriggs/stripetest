# Airtable Quick Setup Guide

Follow these exact steps to set up your Airtable base for the donation system.

## Step 1: Create the Donors Table

1. In your Airtable base, click **"Add a table"**
2. Name it exactly: **"Donors"**
3. Add these fields in order:

| Field Name | Type | Options |
|------------|------|---------|
| Name | Single line text | - |
| Email | Email | - |
| Phone | Phone number | - |
| Address | Long text | - |
| Organization | Single line text | - |
| Donor Since | Date | - |
| Last Donation Date | Date | - |
| Total Donations | Currency | Currency: USD |
| Status | Single select | Options: Active, Inactive, Pending |
| Notes | Long text | - |

## Step 2: Create the Donations Table

1. Click **"Add a table"** again
2. Name it exactly: **"Donations"**
3. Add these fields in order:

| Field Name | Type | Options |
|------------|------|---------|
| Donor ID | Link to another record | Link to: Donors |
| Amount | Currency | Currency: USD |
| Donation Type | Single select | Options: Online, Mail, Event, Other |
| Payment Method | Single select | Options: Stripe, Check, Cash, Other |
| Stripe Session ID | Single line text | - |
| Recurring | Checkbox | - |
| Date | Date | - |
| Tax Receipt Sent | Checkbox | - |
| Receipt Sent Date | Date | - |
| Notes | Long text | - |
| Status | Single select | Options: Completed, Pending, Failed |

## Step 3: Create a Personal Access Token (PAT)

1. Go to your [Airtable Developer Hub](https://airtable.com/developers/web/api/personal-access-tokens/)
2. Click **Create token**
3. Name your token (e.g., "Stripe Donations Integration")
4. Set the **scope** to `data.records:read` and `data.records:write` (and optionally `schema.bases:read`)
5. Under **Access**, select your donation base (or "All workspaces")
6. Click **Create token** and copy the token (starts with `pat...`)

## Step 4: Get Your Base ID

1. In your Airtable base, click **"Help"** → **"API Documentation"**
2. Look at the URL - it will be like: `https://airtable.com/appXXXXXXXXXXXXXX/api/docs`
3. Copy the **Base ID** (the part after `/app/` and before `/api/`)

## Step 5: Update Environment Variables

Add these to your `.env.local` file:

```env
# Airtable Configuration
AIRTABLE_PERSONAL_ACCESS_TOKEN=pat_your_token_here
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

## Step 6: Test the Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Make a test donation at `http://localhost:3000/donate`

4. Check your Airtable base for new records

## Troubleshooting

### If donations aren't appearing:
1. Check the table names match exactly: "Donors" and "Donations"
2. Verify your PAT and base ID
3. Check Vercel logs for errors

### If you get API errors:
1. Make sure your PAT is correct and has the right scopes
2. Check that your base ID is correct
3. Verify table names match exactly

## Quick Verification Checklist

- [ ] Donors table created with all fields
- [ ] Donations table created with all fields
- [ ] PAT copied from Airtable Developer Hub
- [ ] Base ID copied from API documentation
- [ ] Environment variables added to `.env.local`
- [ ] Test donation made successfully
- [ ] New records appear in Airtable

## Need Help?

If you're stuck on any step:
1. Check the error messages in your browser console
2. Look at the Vercel function logs
3. Verify your Airtable table structure matches exactly 