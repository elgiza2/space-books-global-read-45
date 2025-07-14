import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, LogOut } from 'lucide-react';
import { TelegramUser } from '@/types/book';
interface TelegramAuthProps {
  onUserChange: (user: TelegramUser | null) => void;
}
declare global {
  interface Window {
    Telegram: any;
  }
}
export const TelegramAuth = ({
  onUserChange
}: TelegramAuthProps) => {
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  useEffect(() => {
    // Load stored user data
    const storedUser = localStorage.getItem('telegramUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setTelegramUser(user);
      onUserChange(user);
    }

    // Load Telegram Web App script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    script.onload = () => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();

        // Check if user data is available
        const initData = window.Telegram.WebApp.initData;
        if (initData) {
          try {
            const urlParams = new URLSearchParams(initData);
            const userString = urlParams.get('user');
            if (userString) {
              const user = JSON.parse(decodeURIComponent(userString));
              setTelegramUser(user);
              onUserChange(user);
              localStorage.setItem('telegramUser', JSON.stringify(user));
            }
          } catch (error) {
            console.error('Error parsing Telegram user data:', error);
          }
        }
      }
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [onUserChange]);
  const connectTelegram = async () => {
    setIsLoading(true);
    try {
      if (window.Telegram?.WebApp) {
        const webapp = window.Telegram.WebApp;
        webapp.expand();
        toast({
          title: "Telegram Integration",
          description: "Please use this app through Telegram to connect your account"
        });
      } else {
        // Fallback: redirect to Telegram bot
        const botUsername = 'YOUR_BOT_USERNAME'; // Replace with your actual bot username
        const telegramUrl = `https://t.me/${botUsername}?start=auth`;
        window.open(telegramUrl, '_blank');
        toast({
          title: "Telegram Authentication",
          description: "Please connect through our Telegram bot to link your account"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to Telegram. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const disconnectTelegram = () => {
    setTelegramUser(null);
    onUserChange(null);
    localStorage.removeItem('telegramUser');
    toast({
      title: "Disconnected",
      description: "Telegram account has been disconnected"
    });
  };
  if (telegramUser) {
    return <Card className="bg-transparent border-transparent shadow-none">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            Telegram Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={telegramUser.photo_url} alt={telegramUser.first_name} />
              <AvatarFallback className="bg-blue-500 text-white">
                {telegramUser.first_name.charAt(0)}
                {telegramUser.last_name?.charAt(0) || ''}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-foreground">
                {telegramUser.first_name} {telegramUser.last_name || ''}
              </h3>
              {telegramUser.username && <p className="text-sm text-muted-foreground">
                  @{telegramUser.username}
                </p>}
              <p className="text-xs text-muted-foreground">
                Connected via Telegram
              </p>
            </div>
          </div>
          
          <Button onClick={disconnectTelegram} variant="outline" size="sm" className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect Telegram
          </Button>
        </CardContent>
      </Card>;
  }
  return <Card className="bg-transparent border-transparent shadow-none">
      
      
    </Card>;
};