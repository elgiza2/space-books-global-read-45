
import { TonConnectButton, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useToast } from '@/hooks/use-toast';

const TON_RECIPIENT_ADDRESS = 'UQCMWS548CHXs9FXls34OiKAM5IbVSOr0Rwe-tTY7D14DUoq';

interface TonConnectProps {
  isConnected: boolean;
  onConnectionChange: (connected: boolean, address?: string) => void;
  children?: React.ReactNode;
}

export const TonConnect = ({ isConnected, children }: TonConnectProps) => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const handleConnect = async () => {
    if (!wallet) {
      try {
        await tonConnectUI.openModal();
      } catch (error) {
        console.error('Failed to open TON Connect modal:', error);
      }
    }
  };

  if (children && !wallet) {
    return (
      <div onClick={handleConnect} className="w-full cursor-pointer">
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {children ? (
        <div className="w-full" onClick={handleConnect}>
          {children}
        </div>
      ) : (
        <div className="ton-connect-wrapper">
          <TonConnectButton />
        </div>
      )}
      
      {!wallet ? (
        <p className="text-xs text-muted-foreground text-center leading-tight">
          Connect your TON wallet to purchase books
        </p>
      ) : (
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">Connected</span>
          </div>
          <p className="text-xs text-muted-foreground opacity-75">
            {wallet.account.address.slice(0, 6)}...{wallet.account.address.slice(-6)}
          </p>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{
        __html: `
        .ton-connect-wrapper tc-root {
          --tc-bg-color: hsl(var(--card));
          --tc-bg-color-hover: hsl(var(--accent));
          --tc-text-color: hsl(var(--foreground));
          --tc-border-color: hsl(var(--border));
          --tc-border-radius: 0.5rem;
          --tc-font-size: 0.75rem;
          --tc-height: 2rem;
          --tc-padding: 0.5rem 0.75rem;
          --tc-font-weight: 500;
        }
        
        .ton-connect-wrapper [data-tc-connect-button] {
          font-size: 0.75rem !important;
          height: 2rem !important;
          padding: 0 0.75rem !important;
          min-width: auto !important;
          border-radius: 0.5rem !important;
          font-weight: 500 !important;
          transition: all 0.2s ease !important;
        }
        
        .ton-connect-wrapper [data-tc-connect-button]:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        
        .ton-connect-wrapper [data-tc-connect-button]:active {
          transform: translateY(0) !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }
        `
      }} />
    </div>
  );
};

export const useTonPurchase = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const { toast } = useToast();

  const purchaseBook = async (bookPrice: number, bookId: string, bookTitle?: string, bookAuthor?: string): Promise<string | null> => {
    if (!wallet) {
      toast({
        title: "Error",
        description: "Please connect your TON wallet first",
        variant: "destructive",
      });
      return null;
    }

    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: TON_RECIPIENT_ADDRESS,
            amount: (bookPrice * 1000000000).toString(),
          },
        ],
      };

      console.log('Sending TON transaction');
      const result = await tonConnectUI.sendTransaction(transaction);
      
      if (result && result.boc) {
        toast({
          title: "Purchase Successful!",
          description: "Transaction sent successfully with book details",
        });
        return result.boc;
      }
      
      return null;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  return { 
    purchaseBook, 
    isConnected: !!wallet, 
    walletAddress: wallet?.account.address 
  };
};
