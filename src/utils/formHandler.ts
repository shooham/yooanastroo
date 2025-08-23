import { saveConsultation } from '../lib/supabase'

export interface AstrologyFormData {
  fullName: string
  whatsappNumber: string
  email?: string
  placeOfBirth: string
  dateOfBirth: string
  birthTime?: string
  birthTimeUnknown: boolean
  questions: string[]
  amount: number
  paymentMethod?: string
}

export const handleAstrologyFormSubmit = async (formData: AstrologyFormData) => {
  try {
    // Prepare customer data for astrology_customers table
    const customerData = {
      full_name: formData.fullName,
      email: formData.email || null,
      whatsapp_number: formData.whatsappNumber,
      date_of_birth: formData.dateOfBirth,
      time_of_birth: formData.birthTime || null,
      place_of_birth: formData.placeOfBirth,
      unknown_birth_time: formData.birthTimeUnknown || false,
    }

    // Prepare order data for astrology_orders table
    const orderData = {
      questions: formData.questions.filter(q => q.trim() !== ''),
      amount: formData.amount * 100, // Convert to paise 
      payment_status: 'pending',
      report_delivered: false
    }

    // Save to astrology tables
    const result = await saveConsultation(customerData, orderData)
    
    return {
      success: true,
      customer: result.customer,
      order: result.order,
      message: 'Consultation saved successfully!'
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to save consultation. Please try again.'
    }
  }
}

// Utility function to validate form data
export const validateAstrologyForm = (formData: Partial<AstrologyFormData>) => {
  const errors: string[] = []

  if (!formData.fullName?.trim()) {
    errors.push('Full name is required')
  }

  if (!formData.whatsappNumber?.trim()) {
    errors.push('WhatsApp number is required')
  }

  if (!formData.placeOfBirth?.trim()) {
    errors.push('Place of birth is required')
  }

  if (!formData.dateOfBirth) {
    errors.push('Date of birth is required')
  }

  if (!formData.amount || formData.amount <= 0) {
    errors.push('Valid amount is required')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
