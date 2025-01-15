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
    
    // Get the MTN API key from environment variables
    const mtnApiKey = Deno.env.get('MTN_PRIMARY_KEY');
    if (!mtnApiKey) {
      throw new Error('MTN API key not configured');
    }

    // MTN Mobile Money API endpoint (replace with actual endpoint)
    const mtnEndpoint = 'https://api.mtn.com/collection/v1/requests';

    // Call MTN Mobile Money API
    const response = await fetch(mtnEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mtnApiKey}`,
        ...corsHeaders
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: 'SSP',
        externalId: reference,
        payerMessage: 'Donation to Mabior Agau',
        payeeNote: 'Cybersecurity Research Support',
        payer: {
          partyIdType: 'MSISDN',
          partyId: '+211924827611'
        }
      })
    });

    const data = await response.json();
    console.log('MTN API response:', data);

    return new Response(
      JSON.stringify(data),
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
      JSON.stringify({ error: error.message }),
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