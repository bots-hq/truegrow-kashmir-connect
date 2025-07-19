-- Make customer_id nullable since shop owners don't need customer IDs
ALTER TABLE public.profiles ALTER COLUMN customer_id DROP NOT NULL;