-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(225) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    full_name VARCHAR(255), 
    customer_id VARCHAR(255) UNIQUE,
    price_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'inactive' 
);

-- PDF Summaries Table
CREATE TABLE pdf_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL, 
    original_file_url TEXT NOT NULL,
    summary_text TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'completed', 
    title TEXT,
    file_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    stripe_payment_id VARCHAR(255) UNIQUE NOT NULL,
    price_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL REFERENCES users(email), 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to Update `updated_at` Column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN  
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for Users Table
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users 
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for PDF Summaries Table
CREATE TRIGGER update_pdf_summaries_updated_at 
BEFORE UPDATE ON pdf_summaries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for Payments Table
CREATE TRIGGER update_payments_updated_at 
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
