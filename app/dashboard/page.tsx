"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Lock, 
  ShieldCheck, 
  Loader2, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  MoreVertical,
  LogOut,
  CreditCard,
  Users,
  ShoppingCart,
  Package,
  Truck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState(false)
  
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  
  // Tabs & Orders State
  const [activeTab, setActiveTab] = useState<'users' | 'orders'>('users')
  const [orders, setOrders] = useState<any[]>([])

  // Edit Financials Modal State
  const [editingFinancials, setEditingFinancials] = useState<any | null>(null)
  const [newLimit, setNewLimit] = useState("")
  const [newSpent, setNewSpent] = useState("")

  // Check session storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("elmogy_admin_auth")
      if (isAuth === "true") {
        setIsAuthenticated(true)
        fetchUsers()
        fetchOrders()
      }
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "elmogy@2025") {
      sessionStorage.setItem("elmogy_admin_auth", "true")
      setIsAuthenticated(true)
      fetchUsers()
      fetchOrders()
      setAuthError(false)
    } else {
      setAuthError(true)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("elmogy_admin_auth")
    setIsAuthenticated(false)
    setUsers([])
    setOrders([])
    setPassword("")
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      alert("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', id)
      
      if (error) throw error

      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u))
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status")
    } finally {
      setUpdatingId(null)
    }
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users (
            full_name,
            phone_number
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      alert("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id)
      
      if (error) throw error

      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Failed to update order status")
    } finally {
      setUpdatingId(null)
    }
  }

  const updateFinancials = async (id: string) => {
    setUpdatingId(id)
    try {
      const limit = parseFloat(newLimit) || 0
      const spent = parseFloat(newSpent) || 0

      const { error } = await supabase
        .from('users')
        .update({ 
          credit_limit: limit,
          total_spent: spent
        })
        .eq('id', id)
      
      if (error) throw error

      setUsers(users.map(u => u.id === id ? { ...u, credit_limit: limit, total_spent: spent } : u))
      setEditingFinancials(null)
    } catch (error) {
      console.error("Error updating financials:", error)
      alert("Failed to update financials")
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.phone_number?.includes(searchQuery) ||
    u.country?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredOrders = orders.filter(o => 
    o.id?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.users?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.users?.phone_number?.includes(searchQuery)
  )

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
      case 'delivered':
        return <Badge variant="default" className="bg-success/20 text-success hover:bg-success/30 border-none gap-1"><CheckCircle2 className="h-3 w-3"/> {status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30 border-none gap-1"><Clock className="h-3 w-3"/> {status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
      case 'rejected':
      case 'cancelled':
        return <Badge variant="destructive" className="bg-destructive/20 text-destructive hover:bg-destructive/30 border-none gap-1"><XCircle className="h-3 w-3"/> {status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
      case 'processing':
      case 'shipped':
        return <Badge variant="default" className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 border-none gap-1"><Package className="h-3 w-3"/> {status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm rounded-2xl border border-border/50 bg-card p-8 shadow-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center text-foreground mb-2">Admin Portal</h1>
          <p className="text-sm text-center text-muted-foreground mb-8">Enter the master password to continue</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pl-10 h-12 bg-secondary/30 border-border/50 ${authError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
            </div>
            {authError && <p className="text-xs text-destructive text-center font-bold">Incorrect password</p>}
            <Button type="submit" className="w-full h-12 font-bold text-base shadow-lg shadow-primary/20">
              Access Dashboard
            </Button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Admin Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-black tracking-tight">Elmougy<span className="text-primary font-light">Admin</span></h1>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4 mr-2" />
            Exit Portal
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-secondary/30 rounded-xl w-full sm:w-fit mb-8">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Users className="h-4 w-4" />
            Users
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <ShoppingCart className="h-4 w-4" />
            Orders
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {activeTab === 'users' ? 'User Management' : 'Order Management'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === 'users' ? 'Review registrations, set credit limits, and update purchases.' : 'Track, update, and manage incoming orders.'}
            </p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={activeTab === 'users' ? "Search by name, phone..." : "Search orders by ID, name..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-card border-border/50 w-full rounded-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-bold tracking-wider">
                {activeTab === 'users' ? (
                  <tr>
                    <th className="px-6 py-4">Applicant</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Financials</th>
                    <th className="px-6 py-4">Documents</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-6 py-4">Order ID & Date</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">Loading {activeTab}...</p>
                    </td>
                  </tr>
                ) : activeTab === 'users' && filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-medium">
                      No users found.
                    </td>
                  </tr>
                ) : activeTab === 'orders' && filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-medium">
                      No orders found.
                    </td>
                  </tr>
                ) : activeTab === 'users' ? (
                  filteredUsers.map((user) => (
                    <motion.tr 
                      key={user.id} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="hover:bg-secondary/10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{user.full_name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Joined {new Date(user.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{user.phone_number}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{user.country}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-xs">Limit: {(user.credit_limit || 0).toLocaleString()} AED</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 font-bold uppercase">Spent: {(user.total_spent || 0).toLocaleString()} AED</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {user.trade_license_url ? (
                            <a href={user.trade_license_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-secondary text-primary hover:bg-primary/10 transition-colors tooltip" title="View License">
                              <FileText className="h-4 w-4" />
                            </a>
                          ) : (
                            <span className="h-8 w-8 rounded-md bg-secondary/30 flex items-center justify-center text-muted-foreground/30"><FileText className="h-4 w-4" /></span>
                          )}
                          
                          {user.passport_url ? (
                            <a href={user.passport_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-secondary text-primary hover:bg-primary/10 transition-colors" title="View ID/Passport">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          ) : (
                            <span className="h-8 w-8 rounded-md bg-secondary/30 flex items-center justify-center text-muted-foreground/30"><ExternalLink className="h-4 w-4" /></span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {updatingId === user.id ? (
                          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Updating...
                          </div>
                        ) : (
                          getStatusBadge(user.status)
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={updatingId === user.id}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setEditingFinancials(user)
                                setNewLimit(user.credit_limit?.toString() || "0")
                                setNewSpent(user.total_spent?.toString() || "0")
                              }} 
                              className="text-primary font-medium cursor-pointer"
                            >
                              <CreditCard className="h-4 w-4 mr-2" /> Edit Financials
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateStatus(user.id, 'active')} className="text-success font-medium cursor-pointer">
                              <CheckCircle2 className="h-4 w-4 mr-2" /> Mark as Active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(user.id, 'pending')} className="text-amber-600 font-medium cursor-pointer">
                              <Clock className="h-4 w-4 mr-2" /> Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(user.id, 'rejected')} className="text-destructive font-medium cursor-pointer">
                              <XCircle className="h-4 w-4 mr-2" /> Reject Application
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  filteredOrders.map((order) => (
                    <motion.tr 
                      key={order.id} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="hover:bg-secondary/10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{order.id}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{new Date(order.created_at).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold">{order.users?.full_name || 'Unknown User'}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{order.users?.phone_number || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-foreground">{order.total_amount?.toLocaleString()} AED</div>
                      </td>
                      <td className="px-6 py-4">
                        {updatingId === order.id ? (
                          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Updating...
                          </div>
                        ) : (
                          getStatusBadge(order.status)
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={updatingId === order.id}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Manage Order</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'processing')} className="text-blue-600 font-medium cursor-pointer">
                              <Package className="h-4 w-4 mr-2" /> Mark Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'shipped')} className="text-primary font-medium cursor-pointer">
                              <Truck className="h-4 w-4 mr-2" /> Mark Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'delivered')} className="text-success font-medium cursor-pointer">
                              <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Delivered
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'cancelled')} className="text-destructive font-medium cursor-pointer">
                              <XCircle className="h-4 w-4 mr-2" /> Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Financials Modal Overlay */}
        <AnimatePresence>
          {editingFinancials && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-sm bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden"
              >
                <div className="p-6 border-b border-border/50 bg-secondary/10">
                  <h3 className="text-lg font-bold text-foreground">Update Financials</h3>
                  <p className="text-sm text-muted-foreground mt-1">For {editingFinancials.full_name}</p>
                </div>
                
                <div className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Credit Limit (AED)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-bold">AED</span>
                      <Input 
                        type="number"
                        value={newLimit}
                        onChange={(e) => setNewLimit(e.target.value)}
                        className="pl-12 h-11 bg-secondary/30 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Total Purchases (AED)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-bold">AED</span>
                      <Input 
                        type="number"
                        value={newSpent}
                        onChange={(e) => setNewSpent(e.target.value)}
                        className="pl-12 h-11 bg-secondary/30 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-secondary/30 flex justify-end gap-3 border-t border-border/50">
                  <Button variant="ghost" onClick={() => setEditingFinancials(null)} className="rounded-xl font-bold">
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => updateFinancials(editingFinancials.id)}
                    className="bg-primary text-primary-foreground font-bold rounded-xl"
                    disabled={updatingId === editingFinancials.id}
                  >
                    {updatingId === editingFinancials.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
