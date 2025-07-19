-- Add rating column to sales table
ALTER TABLE public.sales 
ADD COLUMN customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
ADD COLUMN rating_comment TEXT;

-- Add comment to explain the rating column
COMMENT ON COLUMN public.sales.customer_rating IS 'Rating given by shop owner to customer (1-5 stars)';
COMMENT ON COLUMN public.sales.rating_comment IS 'Optional comment about the customer rating';