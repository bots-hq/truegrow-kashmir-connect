-- Drop and recreate the trigger function with better error handling and logging
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Log the attempt
  RAISE LOG 'handle_new_user triggered for user %', NEW.id;
  
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
$function$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- For existing users without profiles, create them manually
INSERT INTO public.profiles (user_id, full_name, role, customer_id)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data ->> 'full_name', ''),
  'customer'::user_role,
  generate_customer_id()
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL;