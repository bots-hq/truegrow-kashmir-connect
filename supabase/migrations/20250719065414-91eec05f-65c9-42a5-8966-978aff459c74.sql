-- Drop the problematic policy first
DROP POLICY IF EXISTS "Shop owners can view customer profiles for billing" ON public.profiles;

-- Create a security definer function to check if current user is a shop owner
CREATE OR REPLACE FUNCTION public.is_shop_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'shop_owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create a safer policy using the function
CREATE POLICY "Shop owners can view customer profiles for billing" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (
  -- Allow if the requesting user is a shop owner and target is a customer
  public.is_shop_owner() AND role = 'customer'
);