
-- Update RLS policies to allow admin operations without authentication
-- First, drop the existing admin policies for books
DROP POLICY IF EXISTS "Only admins can insert books" ON public.books;
DROP POLICY IF EXISTS "Only admins can update books" ON public.books;
DROP POLICY IF EXISTS "Only admins can delete books" ON public.books;

-- Create new policies that work with the current app structure
-- Allow insert for books (temporarily remove admin restriction)
CREATE POLICY "Allow book insertion" 
ON public.books 
FOR INSERT 
WITH CHECK (true);

-- Allow update for books (temporarily remove admin restriction)  
CREATE POLICY "Allow book updates"
ON public.books 
FOR UPDATE 
USING (true);

-- Allow delete for books (temporarily remove admin restriction)
CREATE POLICY "Allow book deletion"
ON public.books 
FOR DELETE 
USING (true);

-- Update purchase policies to work with mock user ids
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.purchases;
DROP POLICY IF EXISTS "Users can create their own purchases" ON public.purchases;

-- Create new purchase policies that are more flexible
CREATE POLICY "Allow purchase viewing" 
ON public.purchases 
FOR SELECT 
USING (true);

CREATE POLICY "Allow purchase creation"
ON public.purchases 
FOR INSERT 
WITH CHECK (true);
