import { serve } from 'https://deno.land/std@0.168.0/server/http.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const overdueCharges = await supabase
      .from('charges')
      .select('*, customers(*)')
      .eq('status', 'pending')
      .lt('due_date', today.toISOString().split('T')[0])

    if (overdueCharges.error) {
      throw overdueCharges.error
    }

    await Promise.all(
      (overdueCharges.data || []).map(async (charge) => {
        await supabase
          .from('charges')
          .update({ status: 'overdue' })
          .eq('id', charge.id)
      })
    )

    return new Response(
      JSON.stringify({
        success: true,
        processed: overdueCharges.data?.length || 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
