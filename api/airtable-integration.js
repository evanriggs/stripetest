import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

// Table names - update these to match your Airtable base
const TABLES = {
  DONORS: 'Donors',
  DONATIONS: 'Donations',
  ORGANIZATIONS: 'Organizations'
};

/**
 * Create or update donor record in Airtable
 */
export async function createOrUpdateDonor(donorData) {
  try {
    const { name, email, phone, address, organization } = donorData;
    
    // Check if donor already exists
    const existingDonors = await base(TABLES.DONORS)
      .select({
        filterByFormula: `{Email} = '${email}'`
      })
      .firstPage();

    const donorRecord = {
      'Name': name,
      'Email': email,
      'Phone': phone || '',
      'Address': address || '',
      'Organization': organization || '',
      'Last Donation Date': new Date().toISOString(),
      'Donor Since': existingDonors.length > 0 ? existingDonors[0].fields['Donor Since'] : new Date().toISOString(),
      'Total Donations': existingDonors.length > 0 ? (existingDonors[0].fields['Total Donations'] || 0) : 0,
      'Status': 'Active'
    };

    if (existingDonors.length > 0) {
      // Update existing donor
      const updatedRecord = await base(TABLES.DONORS)
        .update(existingDonors[0].id, donorRecord);
      return updatedRecord;
    } else {
      // Create new donor
      const newRecord = await base(TABLES.DONORS)
        .create([{ fields: donorRecord }]);
      return newRecord[0];
    }
  } catch (error) {
    console.error('Error creating/updating donor:', error);
    throw error;
  }
}

/**
 * Create donation record in Airtable
 */
export async function createDonationRecord(donationData) {
  try {
    const {
      donorId,
      amount,
      donationType,
      paymentMethod,
      stripeSessionId,
      recurring,
      taxReceiptSent,
      notes
    } = donationData;

    const donationRecord = {
      'Donor ID': donorId,
      'Amount': amount,
      'Donation Type': donationType || 'Online',
      'Payment Method': paymentMethod || 'Stripe',
      'Stripe Session ID': stripeSessionId,
      'Recurring': recurring || false,
      'Date': new Date().toISOString(),
      'Tax Receipt Sent': taxReceiptSent || false,
      'Notes': notes || '',
      'Status': 'Completed'
    };

    const newRecord = await base(TABLES.DONATIONS)
      .create([{ fields: donationRecord }]);
    
    return newRecord[0];
  } catch (error) {
    console.error('Error creating donation record:', error);
    throw error;
  }
}

/**
 * Update donor's total donation amount
 */
export async function updateDonorTotal(donorId, newAmount) {
  try {
    const donor = await base(TABLES.DONORS)
      .find(donorId);
    
    const currentTotal = donor.fields['Total Donations'] || 0;
    const newTotal = currentTotal + newAmount;
    
    await base(TABLES.DONORS)
      .update(donorId, {
        'Total Donations': newTotal,
        'Last Donation Date': new Date().toISOString()
      });
  } catch (error) {
    console.error('Error updating donor total:', error);
    throw error;
  }
}

/**
 * Get donor by email
 */
export async function getDonorByEmail(email) {
  try {
    const records = await base(TABLES.DONORS)
      .select({
        filterByFormula: `{Email} = '${email}'`
      })
      .firstPage();
    
    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error('Error getting donor by email:', error);
    throw error;
  }
}

/**
 * Get donation history for a donor
 */
export async function getDonorHistory(donorId) {
  try {
    const records = await base(TABLES.DONATIONS)
      .select({
        filterByFormula: `{Donor ID} = '${donorId}'`,
        sort: [{ field: 'Date', direction: 'desc' }]
      })
      .all();
    
    return records;
  } catch (error) {
    console.error('Error getting donor history:', error);
    throw error;
  }
}

/**
 * Process donation data from Stripe webhook
 */
export async function processDonationFromStripe(session) {
  try {
    const {
      customer_details,
      amount_total,
      metadata,
      id: sessionId
    } = session;

    // Extract donor information
    const donorData = {
      name: customer_details?.name || metadata?.donor_name || 'Anonymous',
      email: customer_details?.email || '',
      phone: customer_details?.phone || '',
      address: customer_details?.address ? 
        `${customer_details.address.line1}, ${customer_details.address.city}, ${customer_details.address.state} ${customer_details.address.postal_code}` : '',
      organization: metadata?.organization || ''
    };

    // Create or update donor
    const donor = await createOrUpdateDonor(donorData);

    // Create donation record
    const donationData = {
      donorId: donor.id,
      amount: amount_total / 100, // Convert from cents
      donationType: 'Online',
      paymentMethod: 'Stripe',
      stripeSessionId: sessionId,
      recurring: metadata?.donation_type === 'recurring',
      taxReceiptSent: false,
      notes: `Donation via Stripe. Session: ${sessionId}`
    };

    const donation = await createDonationRecord(donationData);

    // Update donor's total
    await updateDonorTotal(donor.id, donationData.amount);

    return {
      donor,
      donation,
      success: true
    };
  } catch (error) {
    console.error('Error processing donation from Stripe:', error);
    throw error;
  }
}

/**
 * Send tax receipt (placeholder for email integration)
 */
export async function sendTaxReceipt(donorId, donationId) {
  try {
    // Update donation record to mark receipt as sent
    await base(TABLES.DONATIONS)
      .update(donationId, {
        'Tax Receipt Sent': true,
        'Receipt Sent Date': new Date().toISOString()
      });

    // Here you would integrate with your email service
    // For now, we'll just log it
    console.log(`Tax receipt sent for donation ${donationId} to donor ${donorId}`);
    
    return true;
  } catch (error) {
    console.error('Error sending tax receipt:', error);
    throw error;
  }
} 