
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import AppContent from '@/components/AppContent';

const Index = () => {
  return (
    <TonConnectUIProvider 
      manifestUrl="https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json"
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/your_bot_name'
      }}
    >
      <AppContent />
    </TonConnectUIProvider>
  );
};

export default Index;
