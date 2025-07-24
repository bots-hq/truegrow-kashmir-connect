-- Fix the handle_new_user trigger function to work properly

-- Drop and recreate the trigger function with proper error handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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
    END::user_role,
    NEW.raw_user_meta_data ->> 'business_name',
    NEW.raw_user_meta_data ->> 'business_address',
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'role' = 'customer' OR NEW.raw_user_meta_data ->> 'role' IS NULL THEN generate_customer_id()
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

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();