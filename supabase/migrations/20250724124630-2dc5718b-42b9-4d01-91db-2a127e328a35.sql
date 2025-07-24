-- Fix the trigger function and create missing profiles

-- First, let's create profiles for users who don't have them
INSERT INTO public.profiles (user_id, full_name, role, business_name, business_address, customer_id)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data ->> 'full_name', ''),
  CASE 
    WHEN u.raw_user_meta_data ->> 'role' = 'shop_owner' THEN 'shop_owner'::user_role
    WHEN u.raw_user_meta_data ->> 'role' = 'customer' THEN 'customer'::user_role
    ELSE 'customer'::user_role
  END,
  u.raw_user_meta_data ->> 'business_name',
  u.raw_user_meta_data ->> 'business_address',
  CASE 
    WHEN u.raw_user_meta_data ->> 'role' = 'customer' OR u.raw_user_meta_data ->> 'role' IS NULL THEN generate_customer_id()
    ELSE NULL
  END
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL;

-- Fix existing profiles that have wrong roles
UPDATE public.profiles 
SET 
  role = CASE 
    WHEN u.raw_user_meta_data ->> 'role' = 'shop_owner' THEN 'shop_owner'::user_role
    WHEN u.raw_user_meta_data ->> 'role' = 'customer' THEN 'customer'::user_role
    ELSE 'customer'::user_role
  END,
  business_name = u.raw_user_meta_data ->> 'business_name',
  business_address = u.raw_user_meta_data ->> 'business_address',
  customer_id = CASE 
    WHEN u.raw_user_meta_data ->> 'role' = 'shop_owner' THEN NULL
    ELSE customer_id
  END
FROM auth.users u
WHERE profiles.user_id = u.id
  AND profiles.role != CASE 
    WHEN u.raw_user_meta_data ->> 'role' = 'shop_owner' THEN 'shop_owner'::user_role
    WHEN u.raw_user_meta_data ->> 'role' = 'customer' THEN 'customer'::user_role
    ELSE 'customer'::user_role
  END;