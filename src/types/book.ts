export interface Book {
  id: string;
  title: string;
  description: string;
  price: number; // in TON
  coverImage: string;
  fileUrl: string;
  author: string;
  category: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchasedBook {
  bookId: string;
  userId: string;
  purchaseDate: Date;
  transactionHash: string;
  book: Book;
}

export interface User {
  id: string;
  telegramId?: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  walletAddress?: string;
  isAdmin: boolean;
  purchasedBooks: string[]; // book IDs
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface PaymentData {
  bookId: string;
  amount: number;
  walletAddress: string;
}