import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Customer data interface
export interface CustomerData {
  full_name: string
  email?: string
  whatsapp_number: string
  date_of_birth: string
  time_of_birth?: string
  place_of_birth: string
  unknown_birth_time: boolean
}

// Order data interface
export interface OrderData {
  customer_id: string
  order_number: string
  questions: string[]
  amount: number
  payment_status: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  payment_completed_at?: string
  report_delivered: boolean
  report_delivered_at?: string
  admin_notes?: string
}

// Generate unique order number
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 7)
  return `ORD-${timestamp}-${random}`.toUpperCase()
}

// Save customer data
export const saveCustomer = async (customerData: CustomerData) => {
  const { data, error } = await supabase
    .from('astrology_customers')
    .insert(customerData)
    .select()
    .single()

  if (error) {
    console.error('Error saving customer:', error)
    throw error
  }

  return data
}

// Save order data
export const saveOrder = async (orderData: OrderData) => {
  const { data, error } = await supabase
    .from('astrology_orders')
    .insert(orderData)
    .select()
    .single()

  if (error) {
    console.error('Error saving order:', error)
    throw error
  }

  return data
}

// Save complete consultation data
export const saveConsultation = async (
  customerData: CustomerData,
  orderData: Omit<OrderData, 'customer_id' | 'order_number'>
) => {
  try {
    // First save customer
    const customer = await saveCustomer(customerData)
    
    // Then save order
    const order = await saveOrder({
      ...orderData,
      customer_id: customer.id,
      order_number: generateOrderNumber()
    })

    return { customer, order }
  } catch (error) {
    console.error('Error saving consultation:', error)
    throw error
  }
}
