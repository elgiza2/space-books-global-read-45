
import { useState, useEffect } from 'react';
import { dbFunctions } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

export function usePurchases(userId: string | null) {
  const [purchasedBookIds, setPurchasedBookIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadPurchases();
    }
  }, [userId]);

  const loadPurchases = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      console.log('Loading purchases for user:', userId);
      const purchases = await dbFunctions.getUserPurchases(userId);
      console.log('Loaded purchases:', purchases);
      const bookIds = purchases.map(p => p.book_id);
      setPurchasedBookIds(bookIds);
    } catch (error) {
      console.error('Failed to load purchases:', error);
      // Fallback to localStorage for backward compatibility
      const storedPurchases = localStorage.getItem('purchasedBooks');
      if (storedPurchases) {
        setPurchasedBookIds(JSON.parse(storedPurchases));
      }
    } finally {
      setLoading(false);
    }
  };

  const addPurchase = async (bookId: string, transactionHash: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User is not authenticated",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Creating purchase:', { userId, bookId, transactionHash });
      await dbFunctions.createPurchase({
        user_id: userId,
        book_id: bookId,
        transaction_hash: transactionHash,
        purchase_date: new Date().toISOString()
      });

      setPurchasedBookIds(prev => [...prev, bookId]);
      
      // Also update localStorage for backward compatibility
      const updatedPurchases = [...purchasedBookIds, bookId];
      localStorage.setItem('purchasedBooks', JSON.stringify(updatedPurchases));
      
      console.log('Purchase created successfully');
      return true;
    } catch (error) {
      console.error('Failed to create purchase:', error);
      
      // Fallback to localStorage
      const updatedPurchases = [...purchasedBookIds, bookId];
      setPurchasedBookIds(updatedPurchases);
      localStorage.setItem('purchasedBooks', JSON.stringify(updatedPurchases));
      
      return true;
    }
  };

  return {
    purchasedBookIds,
    loading,
    addPurchase,
    refreshPurchases: loadPurchases
  };
}
