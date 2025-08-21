
ALTER TABLE orders ADD COLUMN mobile TEXT;
ALTER TABLE orders ADD COLUMN whatsapp_number TEXT;
ALTER TABLE orders ADD COLUMN whatsapp_optin BOOLEAN DEFAULT 0;
ALTER TABLE orders ADD COLUMN unknown_birth_time BOOLEAN DEFAULT 0;
