import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, data } = body

    if (!key) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const supabase = createAdminClient()

    switch (key) {
      case 'MESSAGE_SENT':
      case 'MESSAGE_DELIVERED': {
        const status = key === 'MESSAGE_DELIVERED' ? 'delivered' : 'sent'

        if (data?.key?.id) {
          await supabase
            .from('message_logs')
            .update({ 
              status,
              provider_message_id: data.key.id,
            })
            .eq('provider_message_id', data.key.id)
        }

        break
      }
      case 'MESSAGE_FAILED': {
        if (data?.key?.id) {
          await supabase
            .from('message_logs')
            .update({ 
              status: 'failed',
              error_message: 'Message delivery failed',
            })
            .eq('provider_message_id', data.key.id)
        }

        break
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Evolution webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
