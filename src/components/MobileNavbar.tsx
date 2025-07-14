import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { Menu, Wallet, Globe } from 'lucide-react';
interface MobileNavbarProps {
  currentSection: string;
  isWalletConnected: boolean;
  onConnectWallet: () => void;
  onProfileClick: () => void;
  profileClickCount: number;
}
export function MobileNavbar({
  currentSection,
  isWalletConnected,
  onConnectWallet,
  onProfileClick,
  profileClickCount
}: MobileNavbarProps) {
  const {
    t,
    currentLanguage,
    setLanguage
  } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold bg-gradient-space bg-clip-text text-transparent">
              {t('home.title')}
            </h1>
          </div>

          {/* Right side menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-8">
                {/* Language Selector */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Language</span>
                  </div>
                  <Select value={currentLanguage} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {SUPPORTED_LANGUAGES.map(lang => <SelectItem key={lang.code} value={lang.code} className="text-sm">
                          {lang.name}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Wallet Connection */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Wallet</span>
                  </div>
                  <Button onClick={() => {
                  onConnectWallet();
                  setIsMenuOpen(false);
                }} variant={isWalletConnected ? 'secondary' : 'space'} className="w-full h-9 text-sm px-3">
                    <Wallet className="w-3 h-3 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {isWalletConnected ? t('common.wallet_connected') : t('common.connect_wallet')}
                    </span>
                  </Button>
                </div>

                {/* Admin Access Hint */}
                {profileClickCount > 0 && <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-xs text-primary">
                      Admin access: {profileClickCount}/5 clicks
                    </p>
                  </div>}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>;
}