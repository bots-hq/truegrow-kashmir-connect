-- Fix the handle_new_user function to properly handle the user_role enum
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role, business_name, business_address, customer_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'role' = 'shop_owner' THEN 'shop_owner'::user_role
      WHEN NEW.raw_user_meta_data ->> 'role' = 'customer' THEN 'customer'::user_role
      ELSE 'customer'::user_role
    END,
    NEW.raw_user_meta_data ->> 'business_name',
    NEW.raw_user_meta_data ->> 'business_address',
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'role' = 'customer' THEN generate_customer_id()
      ELSE NULL
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$function$;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();