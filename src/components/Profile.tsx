
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookGrid } from './BookGrid';
import { useLanguage } from '@/hooks/useLanguage';
import { Book, User, TelegramUser } from '@/types/book';
import { User as UserIcon, Book as BookIcon } from 'lucide-react';

interface ProfileProps {
  user: User | null;
  purchasedBooks: Book[];
  onDownload: (bookId: string) => void;
}

export function Profile({ user, purchasedBooks, onDownload }: ProfileProps) {
  const { t } = useLanguage();
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <UserIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Please connect your wallet to view your profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayUser = telegramUser || user;
  const displayName = telegramUser 
    ? `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim()
    : `${user.firstName} ${user.lastName}`;
  const displayPhoto = telegramUser?.photo_url || user.profilePhoto;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <Card className="bg-transparent border-transparent shadow-none">
        <CardHeader className="bg-transparent">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage src={displayPhoto} alt={displayName} />
              <AvatarFallback className="bg-gradient-space text-white text-xl">
                {displayName.split(' ').map(n => n.charAt(0)).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center sm:text-left space-y-2 flex-1">
              <CardTitle className="text-2xl text-foreground">
                {displayName}
              </CardTitle>
              <p className="text-muted-foreground">
                {purchasedBooks.length} {purchasedBooks.length === 1 ? 'book' : 'books'} purchased
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Purchased Books */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BookIcon className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Purchased Books
          </h2>
        </div>

        {purchasedBooks.length > 0 ? (
          <BookGrid 
            books={purchasedBooks} 
            purchasedBookIds={purchasedBooks.map(book => book.id)} 
            onPurchase={() => {}} // Not needed for profile view
            onDownload={onDownload} 
          />
        ) : (
          <Card className="bg-transparent border-transparent shadow-none">
            <CardContent className="pt-6 text-center py-12 bg-transparent">
              <BookIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                No Books Yet
              </h3>
              <p className="text-muted-foreground">
                Browse our collection and start building your space library!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
