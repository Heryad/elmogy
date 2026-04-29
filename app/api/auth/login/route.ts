import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { supabase } from '@/lib/supabase'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'elmougi-wholesale-super-secret-key')

export async function POST(request: Request) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    // Verify user exists in the database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', phone)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 means zero rows returned
        return NextResponse.json({ error: 'Account not found. Please sign up first.' }, { status: 404 })
      }
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // User exists, generate JWT
    const token = await new SignJWT({ phone, userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(JWT_SECRET)

    const response = NextResponse.json({ success: true, user })

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })

    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
