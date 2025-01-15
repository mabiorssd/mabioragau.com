import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, reference } = await req.json();
    
    // Get the MTN API keys from environment variables
    const mtnPrimaryKey = Deno.env.get('MTN_PRIMARY_KEY');
    const mtnSecondaryKey = Deno.env.get('MTN_SECONDARY_KEY');
    
    if (!mtnPrimaryKey || !mtnSecondaryKey) {
      throw new Error('MTN API keys not configured');
    }

    // MTN Mobile Money API endpoint (sandbox for testing)
    const mtnEndpoint = 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay';

    // Generate X-Reference-Id for MTN API
    const xReferenceId = crypto.randomUUID();

    // Create request headers with API key
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${mtnPrimaryKey}`,
      'X-Reference-Id': xReferenceId,
      'X-Target-Environment': 'sandbox',
      'Ocp-Apim-Subscription-Key': mtnSecondaryKey,
      ...corsHeaders
    };

    // Call MTN Mobile Money API
    const response = await fetch(mtnEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount: amount.toString(),
        currency: 'SSP',
        externalId: reference,
        payer: {
          partyIdType: 'MSISDN',
          partyId: '256774290781' // Replace with actual phone number in production
        },
        payerMessage: 'Donation to Mabior Agau',
        payeeNote: 'Cybersecurity Research Support'
      })
    });

    console.log('MTN API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    const data = await response.json();
    console.log('MTN API Response data:', data);

    return new Response(
      JSON.stringify({
        success: true,
        reference: xReferenceId,
        data
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );

  } catch (error) {
    console.error('Error processing donation:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});