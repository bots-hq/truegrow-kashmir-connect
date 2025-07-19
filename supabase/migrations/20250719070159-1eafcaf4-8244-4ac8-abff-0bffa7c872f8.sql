-- Update the RLS policy to allow shop owners to view any profile by customer_id for billing
DROP POLICY "Shop owners can view customer profiles for billing" ON public.profiles;

CREATE POLICY "Shop owners can view profiles by customer_id for billing" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (
  -- Allow if the requesting user is a shop owner
  public.is_shop_owner()
);