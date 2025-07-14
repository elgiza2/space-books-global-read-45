import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Book, User } from '@/types/book';
import { Download, ShoppingCart, Eye, Star, Wallet } from 'lucide-react';
import { BookComments } from './BookComments';
import { TonConnect } from './TonConnect';
interface BookDetailsProps {
  book: Book;
  isPurchased?: boolean;
  onPurchase?: (bookId: string) => void;
  onDownload?: (bookId: string) => void;
  user?: User | null;
  isWalletConnected?: boolean;
}
export const BookDetails = ({
  book,
  isPurchased = false,
  onPurchase,
  onDownload,
  user,
  isWalletConnected = false
}: BookDetailsProps) => {
  const [showFullDetails, setShowFullDetails] = useState(false);
  return <>
      <Dialog open={showFullDetails} onOpenChange={setShowFullDetails}>
        <DialogTrigger asChild>
          
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Book Cover */}
            <div className="space-y-4">
              <div className="aspect-[3/4] overflow-hidden rounded-lg">
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
              </div>
              
              {!isWalletConnected && !isPurchased && <div className="p-4 border rounded-lg bg-card/50">
                  <p className="text-sm text-muted-foreground mb-3 text-center">
                    Connect your TON wallet to purchase books
                  </p>
                  <TonConnect isConnected={isWalletConnected} onConnectionChange={() => {}} />
                </div>}
            </div>

            {/* Book Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h1 className="text-2xl font-bold">{book.title}</h1>
                  {book.featured && <Badge className="bg-gradient-gold">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>}
                </div>
                
                <div className="space-y-2">
                  <p className="text-muted-foreground">Author: {book.author}</p>
                  <Badge variant="secondary">{book.category}</Badge>
                </div>
                
                <p className="text-foreground leading-relaxed">
                  {book.description}
                </p>
                
                <div className="flex items-center justify-between py-4 border-t border-b">
                  <span className="text-2xl font-bold text-primary">
                    {book.price} TON
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isPurchased ? <Button onClick={() => onDownload?.(book.id)} className="w-full bg-gradient-space hover:opacity-90" size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    Download Book
                  </Button> : !isWalletConnected ? <TonConnect isConnected={isWalletConnected} onConnectionChange={() => {}}>
                    <Button className="w-full bg-gradient-cosmic hover:opacity-90" size="lg">
                      <Wallet className="w-5 h-5 mr-2" />
                      Connect Wallet to Purchase
                    </Button>
                  </TonConnect> : <Button onClick={() => onPurchase?.(book.id)} className="w-full bg-gradient-space hover:opacity-90" size="lg">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Buy Now
                  </Button>}
              </div>

              {/* Comments Section */}
              <div className="pt-6 border-t">
                <BookComments bookId={book.id} user={user} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>;
};