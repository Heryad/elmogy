import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'elmougi-wholesale-super-secret-key')

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)

    if (!payload.phone) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user ID from the phone number
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('phone_number', payload.phone)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { items, total } = body

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: total,
        status: 'pending'
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('Order Error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Prepare order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_name: item.name,
      product_image: item.image,
      price: item.price,
      quantity: item.quantity,
      grade: item.grade,
      sim_type: item.simType
    }))

    // Insert order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order Items Error:', itemsError)
      return NextResponse.json({ error: 'Failed to add items' }, { status: 500 })
    }

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
