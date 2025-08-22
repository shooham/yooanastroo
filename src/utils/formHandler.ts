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
    // Prepare customer data
    const customerData = {
      full_name: formData.fullName,
      whatsapp_number: formData.whatsappNumber,
      email_address: formData.email,
      place_of_birth: formData.placeOfBirth,
      date_of_birth: formData.dateOfBirth,
      birth_time: formData.birthTime,
      birth_time_unknown: formData.birthTimeUnknown,
      question_1: formData.questions[0] || '',
      question_2: formData.questions[1] || '',
      question_3: formData.questions[2] || '',
      question_4: formData.questions[3] || '',
      question_5: formData.questions[4] || '',
      question_6: formData.questions[5] || '',
      question_7: formData.questions[6] || '',
      question_8: formData.questions[7] || '',
      question_9: formData.questions[8] || '',
      question_10: formData.questions[9] || '',
    }

    // Prepare order data
    const orderData = {
      total_amount: formData.amount,
      payment_method: formData.paymentMethod || 'online',
      service_type: 'astrology_consultation',
      consultation_details: {
        service_name: 'Astrology Consultation',
        questions_count: formData.questions.filter(q => q.trim() !== '').length,
        birth_details: {
          date: formData.dateOfBirth,
          time: formData.birthTime,
          place: formData.placeOfBirth,
          time_unknown: formData.birthTimeUnknown
        }
      },
      items: [{
        name: 'Astrology Consultation',
        quantity: 1,
        price: formData.amount
      }]
    }

    // Save to Supabase
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
