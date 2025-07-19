-- Allow shop owners to read customer profiles for billing purposes
CREATE POLICY "Shop owners can view customer profiles for billing" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (
  -- Allow if the requesting user is a shop owner
  EXISTS (
    SELECT 1 FROM public.profiles AS shop_profile 
    WHERE shop_profile.user_id = auth.uid() 
    AND shop_profile.role = 'shop_owner'
  )
  -- And the target profile is a customer
  AND role = 'customer'
);