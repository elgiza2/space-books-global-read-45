import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookGrid } from './BookGrid';
import { useLanguage } from '@/hooks/useLanguage';
import { Book, User } from '@/types/book';
import { Search, Star, Sparkles } from 'lucide-react';
interface HomeProps {
  featuredBooks: Book[];
  allBooks: Book[];
  purchasedBookIds: string[];
  onPurchase: (bookId: string) => void;
  onDownload: (bookId: string) => void;
  user?: User | null;
  isWalletConnected?: boolean;
}
export function Home({
  featuredBooks,
  allBooks,
  purchasedBookIds,
  onPurchase,
  onDownload,
  user,
  isWalletConnected = false
}: HomeProps) {
  const {
    t
  } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredBooks = allBooks.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase()) || book.description.toLowerCase().includes(searchQuery.toLowerCase()));
  return <div className="px-4 sm:px-6 space-y-8 py-0">
      {/* Hero Section - Mobile Optimized */}
      <div className="text-center space-y-4 py-0">
        <div className="relative">
          
          <Sparkles className="absolute -top-1 -right-4 sm:-top-2 sm:-right-8 w-6 h-6 sm:w-8 sm:h-8 text-accent animate-pulse" />
        </div>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto px-4 text-slate-50 font-bold">
          {t('home.subtitle')}
        </p>
        
        {/* Search Bar - Mobile Optimized */}
        
      </div>

      {/* Featured Books - Mobile Optimized */}
      {!searchQuery && featuredBooks.length > 0 && <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            
            <h2 className="text-xl font-bold text-foreground">
              {t('home.featured_books')}
            </h2>
          </div>
          
          <Card className="bg-gradient-cosmic border-border shadow-card p-4">
            <BookGrid books={featuredBooks} purchasedBookIds={purchasedBookIds} onPurchase={onPurchase} onDownload={onDownload} user={user} isWalletConnected={isWalletConnected} />
          </Card>
        </section>}

      {/* All Books - Mobile Optimized */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold text-foreground">
            {searchQuery ? `Results (${filteredBooks.length})` : t('home.all_books')}
          </h2>
        </div>
        
        {filteredBooks.length > 0 ? <BookGrid books={filteredBooks} purchasedBookIds={purchasedBookIds} onPurchase={onPurchase} onDownload={onDownload} user={user} isWalletConnected={isWalletConnected} /> : <Card className="bg-card/50">
            <CardContent className="pt-6 text-center py-8">
              <Search className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                No books found
              </h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search terms
              </p>
            </CardContent>
          </Card>}
      </section>
    </div>;
}