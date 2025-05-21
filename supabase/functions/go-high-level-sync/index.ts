
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface SyncPetRequest {
  petId: string;
  petName: string;
  species: string;
  breed: string;
  age: number;
  ownerName: string;
  ownerEmail: string;
  ownerContact: string;
}

async function getGoHighLevelConfig() {
  const { data, error } = await supabase
    .from('go_high_level_config')
    .select('api_key, location_id, company_id')
    .single();
  
  if (error) throw new Error(`Error fetching Go High Level config: ${error.message}`);
  return data;
}

async function syncPetToGoHighLevel(config: any, petData: SyncPetRequest) {
  // Prepare the contact data for Go High Level
  const contactData = {
    email: petData.ownerEmail,
    phone: petData.ownerContact,
    firstName: petData.ownerName.split(' ')[0],
    lastName: petData.ownerName.split(' ').slice(1).join(' '),
    customField: {
      'pet_name': petData.petName,
      'pet_species': petData.species,
      'pet_breed': petData.breed,
      'pet_age': petData.age,
      'pet_id': petData.petId
    }
  };

  // Create or update contact in Go High Level
  try {
    const response = await fetch(`https://services.leadconnectorhq.com/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.api_key}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(contactData)
    });

    const result = await response.json();
    console.log('Go High Level sync response:', result);
    return result;
  } catch (error) {
    console.error('Error syncing with Go High Level:', error);
    throw error;
  }
}

async function createAppointmentInGoHighLevel(config: any, appointmentData: any) {
  try {
    const payload = {
      title: `Pet Appointment: ${appointmentData.petName}`,
      description: appointmentData.notes || '',
      startTime: new Date(appointmentData.appointmentDate).toISOString(),
      endTime: new Date(new Date(appointmentData.appointmentDate).getTime() + appointmentData.duration * 60000).toISOString(),
      contactId: appointmentData.ghlContactId,
    };

    const response = await fetch(`https://services.leadconnectorhq.com/appointments/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.api_key}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('Go High Level appointment creation response:', result);
    return result;
  } catch (error) {
    console.error('Error creating appointment in Go High Level:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const config = await getGoHighLevelConfig();
    
    // Route for syncing pet data
    if (url.pathname.endsWith('/sync-pet') && req.method === 'POST') {
      const petData: SyncPetRequest = await req.json();
      const result = await syncPetToGoHighLevel(config, petData);
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Route for creating appointments
    if (url.pathname.endsWith('/create-appointment') && req.method === 'POST') {
      const appointmentData = await req.json();
      const result = await createAppointmentInGoHighLevel(config, appointmentData);
      
      // Store the appointment in our database with the GHL ID
      if (result && result.id) {
        const { data, error } = await supabase
          .from('appointments')
          .update({ ghl_appointment_id: result.id })
          .eq('id', appointmentData.id);
          
        if (error) {
          console.error('Error updating appointment with GHL ID:', error);
        }
      }
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error in Go High Level sync function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
