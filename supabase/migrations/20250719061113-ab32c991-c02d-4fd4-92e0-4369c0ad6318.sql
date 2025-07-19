-- Add customer_id to profiles table for unique customer identification
ALTER TABLE public.profiles 
ADD COLUMN customer_id TEXT UNIQUE;

-- Create function to generate customer ID
CREATE OR REPLACE FUNCTION generate_customer_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    id_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate a 6-digit customer ID with prefix 'CU'
        new_id := 'CU' || LPAD(floor(random() * 999999)::text, 6, '0');
        
        -- Check if this ID already exists
        SELECT EXISTS(SELECT 1 FROM public.profiles WHERE customer_id = new_id) INTO id_exists;
        
        -- If ID doesn't exist, break the loop
        IF NOT id_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Update existing profiles to have customer IDs
UPDATE public.profiles 
SET customer_id = generate_customer_id() 
WHERE customer_id IS NULL;

-- Make customer_id NOT NULL after updating existing records
ALTER TABLE public.profiles 
ALTER COLUMN customer_id SET NOT NULL;

-- Create sales table
CREATE TABLE public.sales (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    shop_owner_id UUID NOT NULL REFERENCES public.profiles(user_id),
    customer_id TEXT NOT NULL REFERENCES public.profiles(customer_id),
    invoice_number TEXT UNIQUE NOT NULL,
    items JSONB NOT NULL DEFAULT '[]',
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue')),
    sale_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sales table
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Create policies for sales table
CREATE POLICY "Shop owners can view their own sales" 
ON public.sales 
FOR SELECT 
USING (auth.uid() = shop_owner_id);

CREATE POLICY "Shop owners can create sales" 
ON public.sales 
FOR INSERT 
WITH CHECK (auth.uid() = shop_owner_id);

CREATE POLICY "Shop owners can update their own sales" 
ON public.sales 
FOR UPDATE 
USING (auth.uid() = shop_owner_id);

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    new_invoice TEXT;
    invoice_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate invoice number with format INV-YYYYMMDD-XXXX
        new_invoice := 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(floor(random() * 9999)::text, 4, '0');
        
        -- Check if this invoice number already exists
        SELECT EXISTS(SELECT 1 FROM public.sales WHERE invoice_number = new_invoice) INTO invoice_exists;
        
        -- If invoice number doesn't exist, break the loop
        IF NOT invoice_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_invoice;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to auto-generate invoice number
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := generate_invoice_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_invoice_number_trigger
    BEFORE INSERT ON public.sales
    FOR EACH ROW
    EXECUTE FUNCTION set_invoice_number();

-- Add trigger for updated_at
CREATE TRIGGER update_sales_updated_at
BEFORE UPDATE ON public.sales
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update the handle_new_user function to generate customer_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role, business_name, business_address, customer_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'customer'::user_role),
    NEW.raw_user_meta_data ->> 'business_name',
    NEW.raw_user_meta_data ->> 'business_address',
    generate_customer_id()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;