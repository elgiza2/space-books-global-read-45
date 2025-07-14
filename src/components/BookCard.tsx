
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { Book, User } from '@/types/book';
import { Download, ShoppingCart, Star, MessageSquare, Wallet } from 'lucide-react';
import { BookDetails } from './BookDetails';
import { TonConnect } from './TonConnect';

interface BookCardProps {
  book: Book;
  isPurchased?: boolean;
  onPurchase?: (bookId: string) => void;
  onDownload?: (bookId: string) => void;
  user?: User | null;
  isWalletConnected?: boolean;
}

export function BookCard({
  book,
  isPurchased = false,
  onPurchase,
  onDownload,
  user,
  isWalletConnected = false
}: BookCardProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (!onPurchase) return;
    setIsLoading(true);
    try {
      await onPurchase(book.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!onDownload) return;
    setIsLoading(true);
    try {
      await onDownload(book.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:shadow-cosmic transition-all duration-300 hover:-translate-y-1">
      {book.featured}
      
      <div className="aspect-[3/4] overflow-hidden">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      
      <CardContent className="p-3 space-y-2">
        <div className="space-y-1">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-foreground">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {book.description}
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary">
              {book.price} TON
            </span>
          </div>
          
          <div className="flex gap-1">
            {isPurchased ? (
              <Button 
                onClick={handleDownload} 
                disabled={isLoading} 
                 size="sm" 
                 variant="purchase"
                 className="flex-1 text-xs h-8 px-2"
               >
                 <Download className="w-3 h-3 mr-1" />
                 Download
              </Button>
            ) : !isWalletConnected ? (
              <TonConnect 
                isConnected={isWalletConnected} 
                onConnectionChange={() => {}}
              >
                <Button 
                  disabled={isLoading} 
                   size="sm" 
                   variant="cosmic"
                   className="flex-1 text-xs h-8 px-2 min-w-0"
                 >
                   <Wallet className="w-3 h-3 mr-1 flex-shrink-0" />
                   <span className="truncate">Connect Wallet</span>
                </Button>
              </TonConnect>
            ) : (
              <Button 
                 onClick={handlePurchase} 
                 disabled={isLoading} 
                 size="sm" 
                 variant="purchase"
                 className="flex-1 text-xs h-8 px-2"
               >
                 <ShoppingCart className="w-3 h-3 mr-1" />
                 Buy Now
              </Button>
            )}
          </div>
          
          <BookDetails 
            book={book} 
            isPurchased={isPurchased} 
            onPurchase={onPurchase} 
            onDownload={onDownload} 
            user={user} 
            isWalletConnected={isWalletConnected} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
