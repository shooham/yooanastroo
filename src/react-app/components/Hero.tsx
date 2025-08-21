import { useState, useEffect } from 'react';
import CityAutocomplete from './CityAutocomplete';
import QuestionsDropdown from './QuestionsDropdown';

export default function Hero() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsappNumber: '',
    dateOfBirth: '',
    placeOfBirth: '',
    birthTime: '',
    unknownBirthTime: false
  });
  const [questions, setQuestions] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const MAX_QUESTIONS = 10;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Please enter your full name.';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!formData.whatsappNumber.trim()) {
      errors.whatsappNumber = 'Enter a valid 10-digit WhatsApp number.';
    } else if (!/^\d{10}$/.test(formData.whatsappNumber.replace(/\D/g, ''))) {
      errors.whatsappNumber = 'Enter a valid 10-digit WhatsApp number.';
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Please select your date of birth.';
    }

    if (!formData.placeOfBirth.trim()) {
      errors.placeOfBirth = 'Please enter your birth city for accurate chart calculations.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const validQuestions = questions.filter(q => q.trim() !== '');

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          questions: validQuestions,
          amount: 39900 // ₹399 in paisa
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        alert(`Error: ${response.status} - ${errorText}`);
        setIsLoading(false);
        return;
      }

      const result = await response.json();

      console.log('Order creation response:', result);
      console.log('Order ID:', result.id);
      console.log('Razorpay Order ID:', result.razorpay_order_id);

      if (result.error) {
        alert('Error creating order: ' + result.error);
        setIsLoading(false);
        return;
      }

      const order = result;

      // Initialize Razorpay
      const options = {
        key: order.razorpay_key || 'rzp_test_NjWnGjHPeR8zzv', // Fallback key
        amount: order.amount,
        currency: order.currency,
        name: 'Yooanastro',
        description: 'Vedic Kundali & Personalized Guidance',
        order_id: order.razorpay_order_id,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            console.log('Razorpay payment response:', response);

            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order.id
              }),
            });

            console.log('Verify response status:', verifyResponse.status);
            const verifyResult = await verifyResponse.json();
            console.log('Verify result:', verifyResult);

            if (verifyResult.success) {
              // Show success modal
              const deliveryMessage = formData.email.trim()
                ? `Payment received — Thank you!\n\nThank you, ${formData.name}. Your personalized Vedic Kundali and answers to your questions will be delivered to your email and WhatsApp within 16 hours.`
                : `Payment received — Thank you!\n\nThank you, ${formData.name}. Your personalized Vedic Kundali and answers to your questions will be delivered to your WhatsApp within 16 hours.`;
              alert(deliveryMessage);

              // Reset form
              setFormData({
                name: '',
                email: '',
                whatsappNumber: '',
                dateOfBirth: '',
                placeOfBirth: '',
                birthTime: '',
                unknownBirthTime: false
              });
              setQuestions(['']);
            } else {
              alert('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.whatsappNumber,
        },
        theme: {
          color: '#A78BFA',
        },
      };

      // @ts-expect-error - Razorpay is loaded from external script
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section id="home" className="min-h-screen relative overflow-hidden pt-24 md:pt-28 lg:pt-32">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg)] via-purple-900/20 to-indigo-900/30" />
      <div className="absolute inset-0">
        {/* Enhanced Floating Orbs with Physics */}
        <div className="cosmic-orb cosmic-orb-1"></div>
        <div className="cosmic-orb cosmic-orb-2"></div>
        <div className="cosmic-orb cosmic-orb-3"></div>
        <div className="cosmic-orb cosmic-orb-4"></div>
        <div className="cosmic-orb cosmic-orb-5"></div>

        {/* Enhanced Shooting Stars */}
        <div className="shooting-star shooting-star-1"></div>
        <div className="shooting-star shooting-star-2"></div>
        <div className="shooting-star shooting-star-3"></div>
        <div className="shooting-star shooting-star-4"></div>
        <div className="shooting-star shooting-star-5"></div>
        <div className="shooting-star shooting-star-6"></div>

        {/* Cosmic Dust Particles */}
        <div className="cosmic-dust cosmic-dust-1"></div>
        <div className="cosmic-dust cosmic-dust-2"></div>
        <div className="cosmic-dust cosmic-dust-3"></div>
        <div className="cosmic-dust cosmic-dust-4"></div>
        <div className="cosmic-dust cosmic-dust-5"></div>
        <div className="cosmic-dust cosmic-dust-6"></div>
        <div className="cosmic-dust cosmic-dust-7"></div>
        <div className="cosmic-dust cosmic-dust-8"></div>
      </div>

      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 items-start max-w-6xl mx-auto">
          {/* Hero Content */}
          <div className="text-center lg:text-left pt-2">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[var(--accent)] via-[var(--gold)] to-[var(--accent-2)] bg-clip-text text-transparent leading-tight">
              Unlock Your Cosmic Journey
            </h1>
            <h2 className="text-lg md:text-xl lg:text-2xl text-[var(--muted)] mb-8 leading-relaxed">
              Personalized Vedic Kundali + clear answers to your 10 most important questions — handcrafted by certified Jyotish experts. Delivered in <span className="text-[var(--gold)] font-semibold">16 hours</span> for <span className="text-[var(--accent)] font-bold">₹399</span>.
            </h2>

            {/* Hero microtrust row */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-8 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[var(--gold)] rounded-full"></span>
                16-Hour Delivery
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                10 Questions
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Secure Payment (Razorpay)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Confidential
              </span>
            </div>

            {/* Removed left-side CTAs and caption to avoid duplicate CTAs. Single CTA remains on the form (right side). */}
          </div>

          {/* Form */}
          <div className="bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 shadow-[var(--shadow)]">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text)] mb-1">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-transparent border border-white/10 rounded-lg text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none transition-colors duration-300"
                  placeholder="Enter your full name"
                />
                {validationErrors.name && <p className="text-red-400 text-xs mt-1">{validationErrors.name}</p>}
              </div>

              <div className="col-span-1">
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-[var(--text)] mb-1">WhatsApp Number *</label>
                <input
                  type="tel"
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-transparent border border-white/10 rounded-lg text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none transition-colors duration-300"
                  placeholder="10-digit WhatsApp number e.g., 9876543210"
                />
                {validationErrors.whatsappNumber && <p className="text-red-400 text-xs mt-1">{validationErrors.whatsappNumber}</p>}
              </div>

              <div className="col-span-1">
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text)] mb-1">Email Address (optional)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-transparent border border-white/10 rounded-lg text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none transition-colors duration-300"
                  placeholder="your@email.com (optional)"
                />
                {validationErrors.email && <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>}
              </div>

              <div className="col-span-1">
                <label htmlFor="placeOfBirth" className="block text-sm font-medium text-[var(--text)] mb-1">Place of Birth *</label>
                <CityAutocomplete
                  value={formData.placeOfBirth}
                  onChange={(value) => setFormData({ ...formData, placeOfBirth: value })}
                  placeholder="Start typing your birth city..."
                  required
                />
                {validationErrors.placeOfBirth && <p className="text-red-400 text-xs mt-1">{validationErrors.placeOfBirth}</p>}
              </div>

              <div className="col-span-1">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-[var(--text)] mb-1">Date of Birth *</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-transparent border border-white/10 rounded-lg text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none transition-colors duration-300"
                />
                {validationErrors.dateOfBirth && <p className="text-red-400 text-xs mt-1">{validationErrors.dateOfBirth}</p>}
              </div>

              <div className="col-span-1">
                <label htmlFor="birthTime" className="block text-sm font-medium text-[var(--text)] mb-1">Birth Time</label>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    id="birthTime"
                    name="birthTime"
                    value={formData.birthTime}
                    onChange={handleInputChange}
                    disabled={formData.unknownBirthTime}
                    className="w-full px-4 py-2 bg-transparent border border-white/10 rounded-lg text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none transition-colors duration-300 disabled:opacity-50"
                    placeholder="--:-- --"
                  />
                  <label className="flex items-center gap-2 cursor-pointer m-0">
                    <input
                      type="checkbox"
                      name="unknownBirthTime"
                      checked={formData.unknownBirthTime}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[var(--accent)] bg-transparent border border-white/20 rounded focus:ring-[var(--accent)] focus:ring-2"
                    />
                    <span className="text-sm text-[var(--muted)] whitespace-nowrap">I don't know</span>
                  </label>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                {/* Questions Section */}
                <QuestionsDropdown
                  questions={questions}
                  setQuestions={setQuestions}
                  maxQuestions={MAX_QUESTIONS}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative overflow-hidden group cosmic-payment-btn"
                >
                  {/* Animated Background Layers */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] via-[var(--gold)] to-[var(--accent-2)] opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] opacity-0 group-hover:opacity-30 transition-opacity duration-700 animate-pulse-glow"></div>

                  {/* Floating Particles */}
                  <div className="absolute inset-0">
                    <div className="payment-particle payment-particle-1"></div>
                    <div className="payment-particle payment-particle-2"></div>
                    <div className="payment-particle payment-particle-3"></div>
                    <div className="payment-particle payment-particle-4"></div>
                    <div className="payment-particle payment-particle-5"></div>
                  </div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500"></div>

                  {/* Button Content */}
                  <div className="relative z-10 py-3 px-4 md:py-4 md:px-6 text-black font-bold text-base md:text-lg flex items-center justify-center space-x-2 md:space-x-3 group-hover:scale-105 transition-transform duration-300">
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="loading-spinner"></div>
                        <span>Processing Your Cosmic Journey...</span>
                      </div>
                    ) : (
                      <span>Pay 399</span>
                    )}
                  </div>

                  {/* Outer Glow Ring */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] via-[var(--gold)] to-[var(--accent-2)] rounded-lg opacity-30 group-hover:opacity-60 blur-lg animate-pulse-ring transition-opacity duration-500"></div>
                </button>
              </div>

              {/* Form Footer */}
              <div className="col-span-1 md:col-span-2 text-center space-y-1">
                <p className="text-xs text-[var(--muted)]">Payments securely processed by Razorpay. We keep your details confidential.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
