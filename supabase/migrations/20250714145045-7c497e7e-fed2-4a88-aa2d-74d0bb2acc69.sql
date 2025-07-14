-- Create books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  cover_image TEXT,
  file_url TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create users table
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  profile_photo TEXT,
  wallet_address TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchases table
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  transaction_hash TEXT NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Create comments table for books
CREATE TABLE public.book_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for books (public read, admin write)
CREATE POLICY "Anyone can view books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Only admins can insert books" ON public.books FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Only admins can update books" ON public.books FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Only admins can delete books" ON public.books FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- Create policies for users
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Create policies for purchases
CREATE POLICY "Users can view their own purchases" ON public.purchases FOR SELECT USING (
  user_id IN (SELECT id FROM public.users WHERE telegram_id = current_setting('app.telegram_id', true))
);
CREATE POLICY "Users can create their own purchases" ON public.purchases FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM public.users WHERE telegram_id = current_setting('app.telegram_id', true))
);

-- Create policies for comments
CREATE POLICY "Anyone can view comments" ON public.book_comments FOR SELECT USING (true);
CREATE POLICY "Users can create their own comments" ON public.book_comments FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM public.users WHERE telegram_id = current_setting('app.telegram_id', true))
);
CREATE POLICY "Users can update their own comments" ON public.book_comments FOR UPDATE USING (
  user_id IN (SELECT id FROM public.users WHERE telegram_id = current_setting('app.telegram_id', true))
);
CREATE POLICY "Users can delete their own comments" ON public.book_comments FOR DELETE USING (
  user_id IN (SELECT id FROM public.users WHERE telegram_id = current_setting('app.telegram_id', true))
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_book_comments_updated_at
  BEFORE UPDATE ON public.book_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample books
INSERT INTO public.books (title, description, price, cover_image, file_url, author, category, featured) VALUES
('كتاب الفضاء الأول', 'دليل شامل لاستكشاف الفضاء والتكنولوجيا المتقدمة', 29.99, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400', 'https://example.com/book1.pdf', 'د. أحمد محمد', 'علوم', true),
('رحلة إلى النجوم', 'قصص مثيرة عن السفر عبر المجرات', 24.99, 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400', 'https://example.com/book2.pdf', 'سارة أحمد', 'خيال علمي', true),
('تقنيات المستقبل', 'نظرة على التقنيات التي ستغير العالم', 34.99, 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400', 'https://example.com/book3.pdf', 'محمد علي', 'تكنولوجيا', false),
('أسرار الكون', 'اكتشاف أسرار الفضاء السحيق', 27.99, 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400', 'https://example.com/book4.pdf', 'فاطمة حسن', 'علوم', false);