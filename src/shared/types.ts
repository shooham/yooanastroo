import { z } from 'zod';

export const CreateOrderSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  whatsappNumber: z.string().min(10, 'A valid WhatsApp number is required'),
  email: z.string().email('A valid email is required').optional().or(z.literal('')),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'), // Assuming YYYY-MM-DD
  birthTime: z.string().optional(), // Assuming HH:MM
  unknownBirthTime: z.boolean().default(false),
  questions: z.array(z.string()).max(10, 'You can ask up to 10 questions.'),
  amount: z.number().positive('Amount must be a positive number')
});

export const VerifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  order_id: z.string(),
});

export type CreateOrderData = z.infer<typeof CreateOrderSchema>;
export type VerifyPaymentData = z.infer<typeof VerifyPaymentSchema>;
