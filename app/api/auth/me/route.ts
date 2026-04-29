import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'elmougi-wholesale-super-secret-key')

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)

    if (!payload.phone) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        orders (
          id,
          created_at,
          total_amount,
          status,
          order_items (
            product_name,
            quantity,
            price
          )
        )
      `)
      .eq('phone_number', payload.phone)
      .single()

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
