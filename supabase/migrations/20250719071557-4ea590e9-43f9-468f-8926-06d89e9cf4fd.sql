-- Create RLS policy for customers to view their own sales
CREATE POLICY "Customers can view their own sales" 
ON public.sales 
FOR SELECT 
TO authenticated 
USING (
  -- Allow if the requesting user has a customer profile with matching customer_id
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND customer_id = sales.customer_id
  )
);