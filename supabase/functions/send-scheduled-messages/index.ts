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

    const now = new Date()
    const scheduledMessages = await supabase
      .from('message_logs')
      .select('*, charges(*), charges(customers(*))')
      .eq('status', 'scheduled')
      .lte('scheduled_for', now.toISOString())
      .limit(50)

    if (scheduledMessages.error) {
      throw scheduledMessages.error
    }

    const results = await Promise.allSettled(
      (scheduledMessages.data || []).map(async (log) => {
        const charge = log.charges as Record<string, unknown>
        const customer = charge?.customers as Record<string, unknown>

        if (!customer) return

        const userId = charge?.user_id
        if (!userId) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('evolution_api_url, evolution_api_key, evolution_instance')
          .eq('id', userId)
          .single()

        if (!profile?.evolution_api_url || !profile?.evolution_api_key || !profile?.evolution_instance) {
          return
        }

        const evolutionUrl = `${profile.evolution_api_url}/messages/sendText`
        const response = await fetch(evolutionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': profile.evolution_api_key,
          },
          body: JSON.stringify({
            number: formatPhone(customer.phone as string),
            text: log.template_type,
          }),
        })

        if (response.ok) {
          await supabase
            .from('message_logs')
            .update({
              status: 'sent',
              sent_at: now.toISOString(),
            })
            .eq('id', log.id)
        } else {
          await supabase
            .from('message_logs')
            .update({
              status: 'failed',
              error_message: 'Failed to send message',
            })
            .eq('id', log.id)
        }
      })
    )

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
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

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('55')) {
    return cleaned
  }
  if (cleaned.length === 11) {
    return `55${cleaned}`
  }
  return `55${cleaned}`
}
