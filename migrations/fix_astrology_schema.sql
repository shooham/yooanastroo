-- Migration: Fix database schema for astrology consultation app
-- This replaces the e-commerce orders table with astrology-specific tables

-- Drop existing orders table and recreate for astrology consultations
DROP TABLE IF EXISTS orders CASCADE;

-- Create orders table for astrology consultations
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT,
    date_of_birth DATE NOT NULL,
    time_of_birth TIME,
    place_of_birth TEXT NOT NULL,
    questions TEXT,
    amount INTEGER NOT NULL,
    amount_display TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    order_status TEXT DEFAULT 'received',
    payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consultation_forms table
CREATE TABLE consultation_forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    email TEXT,
    place_of_birth TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    time_of_birth TIME,
    unknown_birth_time BOOLEAN DEFAULT false,
    questions_json JSONB,
    q1 TEXT,
    q2 TEXT,
    q3 TEXT,
    q4 TEXT,
    q5 TEXT,
    q6 TEXT,
    q7 TEXT,
    q8 TEXT,
    q9 TEXT,
    q10 TEXT,
    order_id UUID REFERENCES orders(id),
    payment_info TEXT DEFAULT '₹399 PENDING ⏳',
    delivery_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_forms ENABLE ROW LEVEL SECURITY;

-- Create policies to allow service role access
CREATE POLICY "Allow service role full access" ON orders
    FOR ALL USING (true);

CREATE POLICY "Allow service role full access" ON consultation_forms
    FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_consultation_forms_order_id ON consultation_forms(order_id);
CREATE INDEX idx_consultation_forms_whatsapp ON consultation_forms(whatsapp_number);