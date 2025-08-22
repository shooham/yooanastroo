import React, { useState } from 'react'
import { handleAstrologyFormSubmit, validateAstrologyForm } from '../utils/formHandler'

interface AstrologyFormProps {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

const AstrologyForm: React.FC<AstrologyFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    email: '',
    placeOfBirth: '',
    dateOfBirth: '',
    birthTime: '',
    birthTimeUnknown: false,
    questions: ['', '', '', '', '', '', '', '', '', ''],
    amount: 500 // Default amount
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...formData.questions]
    newQuestions[index] = value
    setFormData(prev => ({ ...prev, questions: newQuestions }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validateAstrologyForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      onError?.(validation.errors.join(', '))
      return
    }

    setLoading(true)
    setErrors([])

    try {
      const result = await handleAstrologyFormSubmit(formData)
      
      if (result.success) {
        onSuccess?.(result)
        // Reset form
        setFormData({
          fullName: '',
          whatsappNumber: '',
          email: '',
          placeOfBirth: '',
          dateOfBirth: '',
          birthTime: '',
          birthTimeUnknown: false,
          questions: ['', '', '', '', '', '', '', '', '', ''],
          amount: 500
        })
      } else {
        onError?.(result.message)
      }
    } catch (error) {
      onError?.(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
          <ul className="mt-2 text-sm text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
          WhatsApp Number *
        </label>
        <input
          type="tel"
          id="whatsappNumber"
          name="whatsappNumber"
          value={formData.whatsappNumber}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address (optional)
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700">
          Place of Birth *
        </label>
        <input
          type="text"
          id="placeOfBirth"
          name="placeOfBirth"
          value={formData.placeOfBirth}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
          Date of Birth *
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="birthTime" className="block text-sm font-medium text-gray-700">
          Birth Time
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="time"
            id="birthTime"
            name="birthTime"
            value={formData.birthTime}
            onChange={handleInputChange}
            disabled={formData.birthTimeUnknown}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              name="birthTimeUnknown"
              checked={formData.birthTimeUnknown}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-600">I don't know</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Your Questions (up to 10)
        </label>
        {[...Array(10)].map((_, index) => (
          <div key={index} className="mt-2">
            <label htmlFor={`question${index + 1}`} className="text-sm text-gray-600">
              Q{index + 1}
            </label>
            <textarea
              id={`question${index + 1}`}
              rows={2}
              value={formData.questions[index]}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder={`Question ${index + 1} (optional)`}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Submit Consultation'}
      </button>
    </form>
  )
}

export default AstrologyForm
