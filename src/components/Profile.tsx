import { useState, useEffect } from 'react';
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
export function Profile({
  user,
  purchasedBooks,
  onDownload
}: ProfileProps) {
  const {
    t
  } = useLanguage();
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  useEffect(() => {
    // Load stored user data
    const storedUser = localStorage.getItem('telegramUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setTelegramUser(user);
      } catch (error) {
        console.error('Error parsing stored Telegram user:', error);
      }
    }

    // Function to get Telegram user data
    const getTelegramUserData = () => {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const webapp = (window as any).Telegram.WebApp;
        webapp.ready();

        // Check if user data is available
        const initData = webapp.initData;
        if (initData) {
          try {
            const urlParams = new URLSearchParams(initData);
            const userString = urlParams.get('user');
            if (userString) {
              const telegramUserData = JSON.parse(decodeURIComponent(userString));
              setTelegramUser(telegramUserData);
              localStorage.setItem('telegramUser', JSON.stringify(telegramUserData));
              console.log('Telegram user data loaded:', telegramUserData);
            }
          } catch (error) {
            console.error('Error parsing Telegram user data:', error);
          }
        }
      }
    };

    // Check if Telegram WebApp is already loaded
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      getTelegramUserData();
    } else {
      // Load Telegram Web App script if not already loaded
      const existingScript = document.querySelector('script[src="https://telegram.org/js/telegram-web-app.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-web-app.js';
        script.async = true;
        script.onload = getTelegramUserData;
        document.head.appendChild(script);
      }
    }
  }, []);
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <UserIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">{t('profile.connect_wallet_message')}</p>
          </CardContent>
        </Card>
      </div>;
  }
  const displayUser = telegramUser || user;
  const displayName = telegramUser ? `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim() : `${user.firstName} ${user.lastName}`;
  const displayPhoto = telegramUser?.photo_url || user.profilePhoto;

  // Debug logs
  console.log('Profile Debug Info:', {
    telegramUser,
    user,
    displayName,
    displayPhoto,
    isTelegramWebApp: typeof window !== 'undefined' && !!(window as any).Telegram?.WebApp,
    hasInitData: typeof window !== 'undefined' && !!(window as any).Telegram?.WebApp?.initData
  });
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
                {purchasedBooks.length} {purchasedBooks.length === 1 ? t('profile.book_singular') : t('profile.book_plural')} purchased
              </p>
              
              {/* Show information about Telegram integration */}
              {telegramUser ? <div className="flex items-center gap-2 text-sm text-primary">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  {t('common.connected_via_telegram')}
                </div> : <div className="text-sm text-muted-foreground mx-0 px-0 rounded-none bg-black">
                  {t('common.open_in_telegram')}
                </div>}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Purchased Books */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BookIcon className="w-6 h-6 text-primary" />
           <h2 className="text-2xl font-bold text-foreground">
             {t('profile.purchased_books')}
           </h2>
        </div>

        {purchasedBooks.length > 0 ? <BookGrid books={purchasedBooks} purchasedBookIds={purchasedBooks.map(book => book.id)} onPurchase={() => {}} // Not needed for profile view
      onDownload={onDownload} /> : <Card className="bg-transparent border-transparent shadow-none">
            <CardContent className="pt-6 text-center py-12 bg-transparent">
              <BookIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
               <h3 className="text-lg font-semibold mb-2 text-foreground">
                 {t('profile.no_books_title')}
               </h3>
               <p className="text-muted-foreground">
                 {t('profile.no_books_message')}
               </p>
            </CardContent>
          </Card>}
      </div>
    </div>;
}