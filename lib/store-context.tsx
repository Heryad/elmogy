"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import type { Language } from './translations'

export interface CartItem {
  id: string
  name: string
  image: string
  price: number
  quantity: number
  simType: 'esim' | 'normal' | 'dual'
  grade: string
}

export interface User {
  id: string
  fullName: string
  phone: string
  countryCode: string
  creditAvailable: number
  totalOrders: number
  totalSpent: number
  status?: string
  creditMilestone: {
    current: number
    required: number
    threshold: number
  }
  orders: Order[]
}

export interface Order {
  id: string
  date: string
  items: {
    name: string
    quantity: number
    price: number
  }[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
}

interface StoreContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoggedIn: boolean
  login: (user: User) => void
  logout: () => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  selectedGrade: string | null
  setSelectedGrade: (grade: string | null) => void
  isLoading: boolean
  language: Language
  setLanguage: (lang: Language) => void
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateCartItemQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

const mockUser: User = {
  id: '1',
  fullName: 'User',
  phone: '',
  countryCode: '',
  creditAvailable: 0,
  totalOrders: 0,
  totalSpent: 0,
  status: 'pending',
  creditMilestone: { current: 0, required: 3, threshold: 30000 },
  orders: []
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)
  const [language, setLanguageState] = useState<Language>('en')
  const [isLoading, setIsLoading] = useState(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart from local storage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('elmougy_cart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (e) {
      console.error('Failed to parse cart', e)
    }
  }, [])

  // Save cart to local storage when it changes
  useEffect(() => {
    localStorage.setItem('elmougy_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === item.id)
      if (existingItem) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const updateCartItemQuantity = (id: string, quantity: number) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
  }

  const clearCart = () => setCartItems([])

  // Fetch real data on mount
  useEffect(() => {
    const initStore = async () => {
      try {
        const savedLanguage = localStorage.getItem('elmougy_language') as Language | null
        if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
          setLanguageState(savedLanguage)
        }

        const res = await fetch('/api/auth/me', {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        })
        if (res.ok) {
          const data = await res.json()
          if (data.user) {
            const formattedOrders = (data.user.orders || []).map((o: any) => ({
              id: o.id.split('-')[0], // show short id
              date: new Date(o.created_at).toLocaleDateString(),
              total: o.total_amount,
              status: o.status,
              items: (o.order_items || []).map((i: any) => ({
                name: i.product_name,
                quantity: i.quantity,
                price: i.price
              }))
            })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

            const totalOrders = formattedOrders.length
            const totalSpent = formattedOrders.reduce((acc: number, curr: any) => acc + Number(curr.total), 0)

            setUserState({
              id: data.user.id,
              fullName: data.user.full_name,
              phone: data.user.phone_number,
              countryCode: data.user.country_code,
              status: data.user.status,
              // If available_credit is 0 but they have a limit, show the limit. Otherwise 0.
              creditAvailable: data.user.available_credit || data.user.credit_limit || 0,
              totalOrders: totalOrders,
              totalSpent: totalSpent,
              creditMilestone: { current: 0, required: 3, threshold: 30000 },
              orders: formattedOrders
            })
          }
        }
      } catch (err) {
        console.error('Failed to fetch user', err)
      } finally {
        setIsLoading(false)
      }
    }

    initStore()
  }, [])

  const setUser = (userData: User | null) => {
    setUserState(userData)
  }

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = async () => {
    setUser(null)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      console.error('Failed to clear auth cookies')
    }
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('elmougy_language', lang)
  }

  return (
    <StoreContext.Provider value={{
      user,
      setUser,
      isLoggedIn: !!user,
      login,
      logout,
      selectedCategory,
      setSelectedCategory,
      selectedGrade,
      setSelectedGrade,
      language,
      setLanguage,
      isLoading,
      cartItems,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}

export { mockUser }
