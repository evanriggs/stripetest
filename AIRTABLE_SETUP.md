# Airtable CRM Integration Setup

This guide will help you set up Airtable to automatically track donors and donations from your Stripe integration.

## 1. Airtable Base Setup

### Create Your Base
1. Go to [Airtable.com](https://airtable.com)
2. Create a new base called "Foundation Donations"
3. Create the following tables:

### Donors Table
Create a table called **"Donors"** with these fields:

| Field Name | Type | Description |
|------------|------|-------------|
| Name | Single line text | Donor's full name |
| Email | Email | Donor's email address |
| Phone | Phone number | Donor's phone number |
| Address | Long text | Full address |
| Organization | Single line text | Company/organization |
| Donor Since | Date | First donation date |
| Last Donation Date | Date | Most recent donation |
| Total Donations | Currency | Total amount donated |
| Status | Single select | Active, Inactive, etc. |
| Notes | Long text | Additional notes |

### Donations Table
Create a table called **"Donations"** with these fields:

| Field Name | Type | Description |
|------------|------|-------------|
| Donor ID | Link to another record | Links to Donors table |
| Amount | Currency | Donation amount |
| Donation Type | Single select | Online, Mail, Event, etc. |
| Payment Method | Single select | Stripe, Check, Cash, etc. |
| Stripe Session ID | Single line text | Stripe session identifier |
| Recurring | Checkbox | Is this a recurring donation? |
| Date | Date | Donation date |
| Tax Receipt Sent | Checkbox | Has receipt been sent? |
| Receipt Sent Date | Date | When receipt was sent |
| Notes | Long text | Additional notes |
| Status | Single select | Completed, Pending, Failed |

### Organizations Table (Optional)
Create a table called **"Organizations"** with these fields:

| Field Name | Type | Description |
|------------|------|-------------|
| Name | Single line text | Organization name |
| Contact Person | Single line text | Primary contact |
| Email | Email | Organization email |
| Phone | Phone number | Organization phone |
| Address | Long text | Organization address |
| Notes | Long text | Additional notes |

## 2. Get Airtable Personal Access Token (PAT) and Base ID

### Create a Personal Access Token (PAT)
1. Go to your [Airtable Developer Hub](https://airtable.com/developers/web/api/personal-access-tokens/)
2. Click **Create token**
3. Name your token (e.g., "Stripe Donations Integration")
4. Set the **scope** to `data.records:read` and `data.records:write` (and optionally `schema.bases:read`)
5. Under **Access**, select your donation base (or "All workspaces")
6. Click **Create token** and copy the token (starts with `pat...`)

### Get Your Base ID
1. Open your Airtable base
2. Go to **Help** → **API Documentation**
3. Copy the **Base ID** from the URL (it's in the format `appXXXXXXXXXXXXXX`)

## 3. Environment Variables

Add these to your `.env.local` file:

```env
# Airtable Configuration
AIRTABLE_PERSONAL_ACCESS_TOKEN=pat_your_token_here
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

## 4. Update Table Names (if needed)

If your table names are different, update them in `api/airtable-integration.js`:

```javascript
const TABLES = {
  DONORS: 'Your Donors Table Name',
  DONATIONS: 'Your Donations Table Name',
  ORGANIZATIONS: 'Your Organizations Table Name'
};
```

## 5. Test the Integration

### Test Donation Flow
1. Make a test donation on your site
2. Check your Airtable base for:
   - New donor record in "Donors" table
   - New donation record in "Donations" table
   - Updated total donations amount

### Verify Data Mapping
Check that these fields are populated correctly:
- **Donor Name**: From Stripe customer details
- **Email**: From Stripe customer details
- **Amount**: From Stripe session (converted from cents)
- **Donation Type**: "Online"
- **Payment Method**: "Stripe"
- **Recurring**: Based on donation type
- **Date**: Current timestamp

## 6. Customize the Integration

### Add Custom Fields
To add custom fields to your Airtable records, modify the `donorRecord` and `donationRecord` objects in `api/airtable-integration.js`:

```javascript
const donorRecord = {
  'Name': name,
  'Email': email,
  // Add your custom fields here
  'Custom Field': 'Custom Value',
  // ... existing fields
};
```

### Add Email Integration
To automatically send tax receipts, uncomment this line in `api/webhook.js`:

```javascript
await sendTaxReceipt(result.donor.id, result.donation.id);
```

### Add Organization Tracking
If you want to track organizations, modify the `processDonationFromStripe` function to create organization records.

## 7. Production Deployment

When deploying to Vercel, add these environment variables:

```env
AIRTABLE_PERSONAL_ACCESS_TOKEN=pat_your_token_here
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

## 8. Monitoring and Maintenance

### Check Webhook Logs
Monitor your Vercel function logs to ensure donations are being processed:

```bash
vercel logs --follow
```

### Backup Your Data
Airtable automatically backs up your data, but consider:
- Exporting data periodically
- Setting up automated backups
- Monitoring API usage limits

## 9. Troubleshooting

### Common Issues

**Donations not appearing in Airtable:**
1. Check webhook logs in Vercel
2. Verify API key and base ID
3. Ensure table names match exactly

**API rate limits:**
- Airtable has rate limits (5 requests per second)
- The integration handles this automatically

**Missing donor information:**
- Check Stripe webhook payload
- Verify customer details are being collected

### Debug Mode
To enable debug logging, add this to your environment:

```env
DEBUG_AIRTABLE=true
```

## 10. Advanced Features

### Donor Segmentation
Use Airtable's filtering and grouping to:
- Identify high-value donors
- Track recurring vs one-time donors
- Analyze donation patterns

### Automated Workflows
Set up Airtable automations to:
- Send welcome emails to new donors
- Create follow-up tasks for large donations
- Generate monthly reports

### Integration with Other Tools
Connect Airtable to:
- Email marketing platforms (Mailchimp, ConvertKit)
- Accounting software (QuickBooks, Xero)
- CRM systems (Salesforce, HubSpot)

## Support

For Airtable-specific questions:
1. Check [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
2. Contact Airtable Support
3. Email: info@foundation-innovation.org 