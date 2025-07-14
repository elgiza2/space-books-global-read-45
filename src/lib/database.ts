import { supabase } from '@/integrations/supabase/client';

export interface DatabaseBook {
  id: string;
  title: string;
  description: string;
  price: number;
  cover_image: string;
  file_url: string;
  author: string;
  category: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseUser {
  id: string;
  telegram_id: string;
  first_name: string;
  last_name?: string;
  profile_photo?: string;
  wallet_address?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabasePurchase {
  id: string;
  user_id: string;
  book_id: string;
  transaction_hash: string;
  purchase_date: string;
}

export interface DatabaseComment {
  id: string;
  book_id: string;
  user_id: string;
  comment: string;
  rating?: number;
  created_at: string;
  updated_at: string;
  user?: {
    first_name: string;
    last_name?: string;
  };
}

export const dbFunctions = {
  // Books
  getBooks: async (): Promise<DatabaseBook[]> => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  addBook: async (book: Omit<DatabaseBook, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseBook> => {
    // Validate input data
    const bookData = {
      title: String(book.title || '').trim(),
      description: String(book.description || '').trim(),
      price: Number(book.price) || 0,
      cover_image: String(book.cover_image || '').trim(),
      file_url: String(book.file_url || '').trim(),
      author: String(book.author || '').trim(),
      category: String(book.category || '').trim(),
      featured: Boolean(book.featured)
    };

    // Basic validation
    if (!bookData.title || !bookData.author || !bookData.category) {
      throw new Error('Title, author, and category are required');
    }

    const { data, error } = await supabase
      .from('books')
      .insert([bookData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateBook: async (id: string, updates: Partial<DatabaseBook>): Promise<DatabaseBook | null> => {
    if (!id) throw new Error('Book ID is required');

    // Clean and validate updates
    const cleanUpdates: any = {};
    
    if (updates.title !== undefined) cleanUpdates.title = String(updates.title).trim();
    if (updates.description !== undefined) cleanUpdates.description = String(updates.description).trim();
    if (updates.price !== undefined) cleanUpdates.price = Number(updates.price) || 0;
    if (updates.cover_image !== undefined) cleanUpdates.cover_image = String(updates.cover_image).trim();
    if (updates.file_url !== undefined) cleanUpdates.file_url = String(updates.file_url).trim();
    if (updates.author !== undefined) cleanUpdates.author = String(updates.author).trim();
    if (updates.category !== undefined) cleanUpdates.category = String(updates.category).trim();
    if (updates.featured !== undefined) cleanUpdates.featured = Boolean(updates.featured);

    const { data, error } = await supabase
      .from('books')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  deleteBook: async (id: string): Promise<boolean> => {
    if (!id) throw new Error('Book ID is required');
    
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);
    
    return !error;
  },

  // Users
  getUser: async (telegramId: string): Promise<DatabaseUser | null> => {
    if (!telegramId) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  createUser: async (userData: Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseUser> => {
    // Validate and clean user data
    const cleanUserData = {
      telegram_id: String(userData.telegram_id || '').trim(),
      first_name: String(userData.first_name || '').trim(),
      last_name: userData.last_name ? String(userData.last_name).trim() : null,
      profile_photo: userData.profile_photo ? String(userData.profile_photo).trim() : null,
      wallet_address: userData.wallet_address ? String(userData.wallet_address).trim() : null,
      is_admin: Boolean(userData.is_admin)
    };

    if (!cleanUserData.telegram_id) {
      throw new Error('Telegram ID is required');
    }

    const { data, error } = await supabase
      .from('users')
      .insert([cleanUserData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateUser: async (id: string, updates: Partial<DatabaseUser>): Promise<DatabaseUser | null> => {
    if (!id) throw new Error('User ID is required');

    // Clean updates
    const cleanUpdates: any = {};
    if (updates.first_name !== undefined) cleanUpdates.first_name = String(updates.first_name).trim();
    if (updates.last_name !== undefined) cleanUpdates.last_name = updates.last_name ? String(updates.last_name).trim() : null;
    if (updates.profile_photo !== undefined) cleanUpdates.profile_photo = updates.profile_photo ? String(updates.profile_photo).trim() : null;
    if (updates.wallet_address !== undefined) cleanUpdates.wallet_address = updates.wallet_address ? String(updates.wallet_address).trim() : null;
    if (updates.is_admin !== undefined) cleanUpdates.is_admin = Boolean(updates.is_admin);

    const { data, error } = await supabase
      .from('users')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Purchases
  getUserPurchases: async (userId: string): Promise<DatabasePurchase[]> => {
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  },

  createPurchase: async (purchaseData: Omit<DatabasePurchase, 'id'>): Promise<DatabasePurchase> => {
    // Validate and clean purchase data
    const cleanPurchaseData = {
      user_id: String(purchaseData.user_id || '').trim(),
      book_id: String(purchaseData.book_id || '').trim(),
      transaction_hash: String(purchaseData.transaction_hash || '').trim(),
      purchase_date: purchaseData.purchase_date || new Date().toISOString()
    };

    if (!cleanPurchaseData.user_id || !cleanPurchaseData.book_id || !cleanPurchaseData.transaction_hash) {
      throw new Error('User ID, Book ID, and Transaction hash are required');
    }

    const { data, error } = await supabase
      .from('purchases')
      .insert([cleanPurchaseData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Comments - Keep existing payment comment functionality
  getBookComments: async (bookId: string): Promise<DatabaseComment[]> => {
    if (!bookId) return [];
    
    const { data, error } = await supabase
      .from('book_comments')
      .select(`
        *,
        user:users(first_name, last_name)
      `)
      .eq('book_id', bookId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  addComment: async (commentData: Omit<DatabaseComment, 'id' | 'created_at' | 'updated_at' | 'user'>): Promise<DatabaseComment> => {
    // Validate and clean comment data
    const cleanCommentData = {
      book_id: String(commentData.book_id || '').trim(),
      user_id: String(commentData.user_id || '').trim(),
      comment: String(commentData.comment || '').trim(),
      rating: commentData.rating ? Number(commentData.rating) : null
    };

    if (!cleanCommentData.book_id || !cleanCommentData.user_id || !cleanCommentData.comment) {
      throw new Error('Book ID, User ID, and Comment are required');
    }

    const { data, error } = await supabase
      .from('book_comments')
      .insert([cleanCommentData])
      .select(`
        *,
        user:users(first_name, last_name)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  updateComment: async (id: string, updates: Partial<DatabaseComment>): Promise<DatabaseComment | null> => {
    if (!id) throw new Error('Comment ID is required');

    // Clean updates
    const cleanUpdates: any = {};
    if (updates.comment !== undefined) cleanUpdates.comment = String(updates.comment).trim();
    if (updates.rating !== undefined) cleanUpdates.rating = updates.rating ? Number(updates.rating) : null;

    const { data, error } = await supabase
      .from('book_comments')
      .update(cleanUpdates)
      .eq('id', id)
      .select(`
        *,
        user:users(first_name, last_name)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  deleteComment: async (id: string): Promise<boolean> => {
    if (!id) throw new Error('Comment ID is required');
    
    const { error } = await supabase
      .from('book_comments')
      .delete()
      .eq('id', id);
    
    return !error;
  },
};
