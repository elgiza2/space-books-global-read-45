import { BookCard } from './BookCard';
import { Book, User } from '@/types/book';

interface BookGridProps {
  books: Book[];
  purchasedBookIds: string[];
  onPurchase: (bookId: string) => void;
  onDownload: (bookId: string) => void;
  user?: User | null;
  isWalletConnected?: boolean;
}

export function BookGrid({ books, purchasedBookIds, onPurchase, onDownload, user, isWalletConnected = false }: BookGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isPurchased={purchasedBookIds.includes(book.id)}
              onPurchase={onPurchase}
              onDownload={onDownload}
              user={user}
              isWalletConnected={isWalletConnected}
            />
      ))}
    </div>
  );
}