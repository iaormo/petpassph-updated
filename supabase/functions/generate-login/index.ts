
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface GenerateLoginRequest {
  ownerEmail: string;
  ownerName: string;
  petId: string;
  petName: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ownerEmail, ownerName, petId, petName }: GenerateLoginRequest = await req.json();
    
    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .auth
      .admin
      .listUsers();
    
    const userExists = existingUser?.users?.some(user => user.email === ownerEmail);
    
    let userId;
    
    if (userExists) {
      console.log(`User with email ${ownerEmail} already exists`);
      
      // Find the user ID
      const existingUserData = existingUser?.users?.find(user => user.email === ownerEmail);
      userId = existingUserData?.id;
      
      // Update user metadata
      await supabase.auth.admin.updateUserById(
        userId as string,
        { user_metadata: { name: ownerName, role: 'owner', petsOwned: [petId] } }
      );
      
      // Send password reset email
      await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: ownerEmail,
      });
    } else {
      // Create a new user
      const { data: newUser, error } = await supabase.auth.admin.createUser({
        email: ownerEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          name: ownerName,
          role: 'owner',
          petsOwned: [petId]
        }
      });
      
      if (error) {
        throw new Error(`Error creating user: ${error.message}`);
      }
      
      userId = newUser.user.id;
      
      // Send welcome email with login details (normally would use a proper email service)
      // For now, we'll send a password reset email which will let them set their own password
      await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: ownerEmail,
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Login generated and email sent successfully" 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error generating login:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
