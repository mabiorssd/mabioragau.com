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
    console.log('Received donation request:', { amount, reference });
    
    // Get the MTN API keys from environment variables
    const mtnPrimaryKey = Deno.env.get('MTN_PRIMARY_KEY');
    const mtnSecondaryKey = Deno.env.get('MTN_SECONDARY_KEY');
    
    if (!mtnPrimaryKey || !mtnSecondaryKey) {
      console.error('MTN API keys missing');
      throw new Error('MTN API keys not configured');
    }

    // First, get the access token
    console.log('Getting MTN API access token...');
    
    // Create Basic Auth token - MTN requires the Primary Key as username with empty password
    const basicAuthToken = btoa(`${mtnPrimaryKey}:`);
    console.log('Using Basic Auth token for authentication');

    const tokenResponse = await fetch(
      'https://sandbox.momodeveloper.mtn.com/collection/token/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuthToken}`,
          'Ocp-Apim-Subscription-Key': mtnSecondaryKey,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Token response status:', tokenResponse.status);
    const tokenResponseText = await tokenResponse.text();
    console.log('Token response body:', tokenResponseText);

    if (!tokenResponse.ok) {
      console.error('MTN Token Error:', tokenResponseText);
      throw new Error(`Failed to get MTN access token: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }

    let access_token;
    try {
      const tokenData = JSON.parse(tokenResponseText);
      access_token = tokenData.access_token;
      console.log('Successfully parsed access token');
    } catch (error) {
      console.error('Error parsing token response:', error);
      throw new Error('Invalid token response format');
    }

    // Generate X-Reference-Id for MTN API
    const xReferenceId = crypto.randomUUID();
    console.log('Generated X-Reference-Id:', xReferenceId);

    // MTN Mobile Money API endpoint (sandbox for testing)
    const mtnEndpoint = 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay';

    // Create request headers with the obtained access token
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`,
      'X-Reference-Id': xReferenceId,
      'X-Target-Environment': 'sandbox',
      'Ocp-Apim-Subscription-Key': mtnSecondaryKey,
      ...corsHeaders
    };

    console.log('Making request to MTN API with headers:', {
      'X-Reference-Id': xReferenceId,
      'X-Target-Environment': 'sandbox',
      'Content-Type': 'application/json',
      // Don't log Authorization header for security
    });
    
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MTN API Error:', errorText);
      throw new Error(`MTN API Error: ${response.status} ${response.statusText}`);
    }

    console.log('Payment request successful');

    return new Response(
      JSON.stringify({
        success: true,
        reference: xReferenceId
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