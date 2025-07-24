-- Fix search path security for all functions

-- Update handle_new_user function with secure search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Log the attempt
  RAISE LOG 'handle_new_user triggered for user %', NEW.id;
  
  INSERT INTO public.profiles (user_id, full_name, role, business_name, business_address, customer_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'role' = 'shop_owner' THEN 'shop_owner'
      WHEN NEW.raw_user_meta_data ->> 'role' = 'customer' THEN 'customer'
      ELSE 'customer'
    END::public.user_role,
    NEW.raw_user_meta_data ->> 'business_name',
    NEW.raw_user_meta_data ->> 'business_address',
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'role' = 'customer' OR NEW.raw_user_meta_data ->> 'role' IS NULL THEN public.generate_customer_id()
      ELSE NULL
    END
  );
  
  RAISE LOG 'Profile created successfully for user %', NEW.id;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the detailed error
    RAISE LOG 'Error in handle_new_user for user %: % - %', NEW.id, SQLERRM, SQLSTATE;
    -- Still return NEW to not block user creation
    RETURN NEW;
END;
$$;

-- Update other functions with secure search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_customer_id()
RETURNS text
LANGUAGE plpgsql
SET search_path = ''
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
SET search_path = ''
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := public.generate_invoice_number();
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_shop_owner()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'shop_owner'
  );
END;
$$;