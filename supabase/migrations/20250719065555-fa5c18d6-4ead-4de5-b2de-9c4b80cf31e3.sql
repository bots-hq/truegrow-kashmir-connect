-- Update existing profile to be shop owner
UPDATE public.profiles 
SET 
  role = 'shop_owner',
  business_name = 'Salik Agricultural Store',
  business_address = 'Kashmir Valley'
WHERE user_id = 'a6a9fc7d-fa43-45b1-8159-09089189bc2f';