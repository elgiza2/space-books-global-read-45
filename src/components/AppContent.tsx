import { useState, useEffect } from 'react';
import { LanguageProvider } from '@/components/LanguageProvider';
import { MobileNavbar } from '@/components/MobileNavbar';
import { Home } from '@/components/Home';
import { Profile } from '@/components/Profile';
import { AdminPanel } from '@/components/AdminPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { dbFunctions, type DatabaseBook, type DatabaseUser } from '@/lib/database';
import { Book, User } from '@/types/book';
import { TonConnect, useTonPurchase } from '@/components/TonConnect';
import { useTonWallet } from '@tonconnect/ui-react';
import { usePurchases } from '@/hooks/usePurchases';

const AppContent = () => {
  const { toast } = useToast();
  const wallet = useTonWallet();
  const { purchaseBook, isConnected: isTonConnected, walletAddress: tonWalletAddress } = useTonPurchase();
  
  const [currentSection, setCurrentSection] = useState('home');
  const [books, setBooks] = useState<Book[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [profileClickCount, setProfileClickCount] = useState(0);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminCode, setAdminCode] = useState('');

  // Use a proper UUID for the mock user
  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';
  
  // Use the new purchases hook
  const { purchasedBookIds, addPurchase, refreshPurchases } = usePurchases(mockUserId);

  // Convert database book to app book format with validation
  const convertDbBookToBook = (dbBook: DatabaseBook): Book => {
    try {
      return {
        id: dbBook.id,
        title: dbBook.title || '',
        description: dbBook.description || '',
        price: Number(dbBook.price) || 0,
        coverImage: dbBook.cover_image || '',
        fileUrl: dbBook.file_url || '',
        author: dbBook.author || '',
        category: dbBook.category || '',
        featured: Boolean(dbBook.featured),
        createdAt: new Date(dbBook.created_at),
        updatedAt: new Date(dbBook.updated_at)
      };
    } catch (error) {
      console.error('Error converting database book:', error, dbBook);
      throw new Error('Invalid book data format');
    }
  };

  // Convert database user to app user format with validation
  const convertDbUserToUser = (dbUser: DatabaseUser): User => {
    try {
      return {
        id: dbUser.id,
        telegramId: dbUser.telegram_id,
        firstName: dbUser.first_name || '',
        lastName: dbUser.last_name || '',
        profilePhoto: dbUser.profile_photo || null,
        walletAddress: dbUser.wallet_address || null,
        isAdmin: Boolean(dbUser.is_admin),
        purchasedBooks: []
      };
    } catch (error) {
      console.error('Error converting database user:', error, dbUser);
      throw new Error('Invalid user data format');
    }
  };

  // Load initial data
  useEffect(() => {
    loadBooks();
    initializeUser();
  }, []);

  const loadBooks = async () => {
    try {
      console.log('Loading books from database...');
      const dbBooks = await dbFunctions.getBooks();
      console.log('Loaded books:', dbBooks);
      
      // Validate and convert books
      const validBooks = dbBooks.filter(book => {
        if (!book.id || !book.title || !book.author || !book.category) {
          console.warn('Skipping invalid book:', book);
          return false;
        }
        return true;
      });
      
      setBooks(validBooks.map(convertDbBookToBook));
    } catch (error) {
      console.error('Failed to load books:', error);
      toast({
        title: "Error",
        description: "Failed to load books. Please refresh the page.",
        variant: "destructive"
      });
    }
  };

  const initializeUser = async () => {
    // Create a mock user with proper UUID
    const mockUser: User = {
      id: mockUserId,
      telegramId: '123456789',
      firstName: 'John',
      lastName: 'Doe',
      profilePhoto: null,
      walletAddress: null,
      isAdmin: false,
      purchasedBooks: []
    };
    setUser(mockUser);
  };

  const handleProfileClick = () => {
    const newCount = profileClickCount + 1;
    console.log(`Profile clicked ${newCount} times`);
    setProfileClickCount(newCount);
    
    if (newCount === 5) {
      setShowAdminInput(true);
      setProfileClickCount(0);
      toast({
        title: "Admin Access",
        description: "Enter admin code to continue"
      });
    } else if (newCount < 5) {
      toast({
        title: "Admin Access",
        description: `Click ${5 - newCount} more times to access admin panel`
      });
      // Reset counter after 5 seconds if not completed
      setTimeout(() => {
        setProfileClickCount(0);
      }, 5000);
    }
  };

  // Update user wallet address when TON wallet connects
  useEffect(() => {
    if (isTonConnected && tonWalletAddress && user && user.walletAddress !== tonWalletAddress) {
      setUser(prev => prev ? { ...prev, walletAddress: tonWalletAddress } : null);
    }
  }, [isTonConnected, tonWalletAddress, user]);

  const handlePurchase = async (bookId: string) => {
    if (!isTonConnected || !user) {
      toast({
        title: "Wallet Required",
        description: "Please connect TON wallet to purchase books",
        variant: "destructive"
      });
      return;
    }

    const book = books.find(b => b.id === bookId);
    if (!book) return;

    try {
      toast({
        title: "Processing Payment",
        description: "Please approve the transaction in your wallet"
      });

      console.log('Starting TON purchase for book:', book.title, 'Price:', book.price);

      const result = await purchaseBook(book.price, bookId, book.title, book.author);
      
      console.log('TON purchase result:', result);

      if (result) {
        // Handle different types of transaction results
        let transactionHash: string;
        
        if (typeof result === 'string') {
          transactionHash = result;
        } else if (result && typeof result === 'object') {
          // Check for common transaction hash properties
          transactionHash = (result as any).boc || 
                           (result as any).hash || 
                           (result as any).txHash || 
                           (result as any).transactionHash ||
                           JSON.stringify(result);
        } else {
          // Fallback to a mock hash for development
          transactionHash = `ton_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        console.log('Using transaction hash:', transactionHash);

        const success = await addPurchase(bookId, transactionHash);
        
        if (success) {
          toast({
            title: "Purchase Successful!",
            description: "You can now download your book"
          });
        } else {
          console.warn('Purchase recorded locally but database update failed');
          toast({
            title: "Purchase Successful!",
            description: "Purchase saved locally, you can download the book"
          });
        }
      } else {
        throw new Error('No transaction result received');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      toast({
        title: "Purchase Failed",
        description: "Payment failed. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async (bookId: string) => {
    try {
      const book = books.find(b => b.id === bookId);
      if (!book) return;

      toast({
        title: "Starting Download",
        description: `Downloading ${book.title}...`
      });

      // Mock download
      window.open(book.fileUrl, '_blank');
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download book. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddBook = async (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Adding book:', bookData);
      
      // Validate required fields
      if (!bookData.title?.trim() || !bookData.author?.trim() || !bookData.category?.trim()) {
        toast({
          title: "Data Error",
          description: "Title, author, and category are required",
          variant: "destructive"
        });
        return;
      }

      const dbBook = await dbFunctions.addBook({
        title: bookData.title.trim(),
        description: bookData.description?.trim() || '',
        price: Number(bookData.price) || 0,
        cover_image: bookData.coverImage?.trim() || '',
        file_url: bookData.fileUrl?.trim() || '',
        author: bookData.author.trim(),
        category: bookData.category.trim(),
        featured: Boolean(bookData.featured)
      });
      
      console.log('Book added successfully:', dbBook);
      const newBook = convertDbBookToBook(dbBook);
      setBooks(prev => [newBook, ...prev]);
      
      toast({
        title: "Book Added",
        description: "New book added successfully"
      });
    } catch (error) {
      console.error('Failed to add book:', error);
      toast({
        title: "Error",
        description: "Failed to add book: " + (error instanceof Error ? error.message : 'Unknown error'),
        variant: "destructive"
      });
    }
  };

  const handleEditBook = async (id: string, updates: Partial<Book>) => {
    try {
      console.log('Updating book:', id, updates);
      
      if (!id) {
        throw new Error('Book ID is required');
      }

      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = String(updates.title).trim();
      if (updates.description !== undefined) dbUpdates.description = String(updates.description).trim();
      if (updates.price !== undefined) dbUpdates.price = Number(updates.price) || 0;
      if (updates.coverImage !== undefined) dbUpdates.cover_image = String(updates.coverImage).trim();
      if (updates.fileUrl !== undefined) dbUpdates.file_url = String(updates.fileUrl).trim();
      if (updates.author !== undefined) dbUpdates.author = String(updates.author).trim();
      if (updates.category !== undefined) dbUpdates.category = String(updates.category).trim();
      if (updates.featured !== undefined) dbUpdates.featured = Boolean(updates.featured);

      const updatedDbBook = await dbFunctions.updateBook(id, dbUpdates);
      
      if (updatedDbBook) {
        console.log('Book updated successfully:', updatedDbBook);
        const updatedBook = convertDbBookToBook(updatedDbBook);
        setBooks(prev => prev.map(book => book.id === id ? updatedBook : book));
        
        toast({
          title: "Book Updated",
          description: "Book updated successfully"
        });
      }
    } catch (error) {
      console.error('Failed to update book:', error);
      toast({
        title: "Error",
        description: "Failed to update book: " + (error instanceof Error ? error.message : 'Unknown error'),
        variant: "destructive"
      });
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      console.log('Deleting book:', id);
      
      if (!id) {
        throw new Error('Book ID is required');
      }

      const success = await dbFunctions.deleteBook(id);
      
      if (success) {
        console.log('Book deleted successfully');
        setBooks(prev => prev.filter(book => book.id !== id));
        
        toast({
          title: "Book Deleted",
          description: "Book deleted successfully"
        });
      }
    } catch (error) {
      console.error('Failed to delete book:', error);
      toast({
        title: "Error",
        description: "Failed to delete book: " + (error instanceof Error ? error.message : 'Unknown error'),
        variant: "destructive"
      });
    }
  };

  const handleAdminCodeSubmit = async () => {
    console.log('Admin code submitted:', adminCode);
    const correctCode = 'SPACE2024';
    
    if (adminCode.trim() === correctCode && user) {
      console.log('Admin code is correct, granting access');
      setUser(prev => prev ? { ...prev, isAdmin: true } : null);
      setCurrentSection('admin');
      setShowAdminInput(false);
      setAdminCode('');
      
      toast({
        title: "Admin Access Granted",
        description: "Welcome to admin panel"
      });
    } else {
      console.log('Admin code is incorrect:', adminCode.trim(), 'vs', correctCode);
      toast({
        title: "Wrong Code",
        description: "Please enter the correct admin code",
        variant: "destructive"
      });
      setAdminCode('');
    }
  };

  const featuredBooks = books.filter(book => book.featured);
  const purchasedBooks = books.filter(book => purchasedBookIds.includes(book.id));

  const renderContent = () => {
    switch (currentSection) {
      case 'profile':
        return (
          <Profile 
            user={user} 
            purchasedBooks={purchasedBooks} 
            onDownload={handleDownload} 
          />
        );
      case 'admin':
        return user?.isAdmin ? (
          <AdminPanel 
            books={books} 
            onAddBook={handleAddBook} 
            onEditBook={handleEditBook} 
            onDeleteBook={handleDeleteBook} 
          />
        ) : null;
      default:
        return (
          <div className="space-y-6">
            <Home 
              featuredBooks={featuredBooks} 
              allBooks={books} 
              purchasedBookIds={purchasedBookIds} 
              onPurchase={handlePurchase} 
              onDownload={handleDownload} 
              user={user} 
              isWalletConnected={isTonConnected} 
            />
          </div>
        );
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <MobileNavbar 
          currentSection={currentSection} 
          isWalletConnected={isTonConnected} 
          onConnectWallet={() => {}} 
          onProfileClick={() => {}} 
          profileClickCount={profileClickCount} 
        />
        
        <main className="pb-20 bg-black">
          {renderContent()}
        </main>

        {/* Bottom Navigation for mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50">
          <div className="flex items-center justify-around h-16 px-4">
            <Button 
              variant={currentSection === 'home' ? 'space' : 'ghost'} 
              size="sm" 
              onClick={() => setCurrentSection('home')} 
              className="flex-1 mx-1"
            >
              Home
            </Button>
            
            <Button 
              variant={currentSection === 'profile' ? 'space' : 'ghost'} 
              size="sm" 
              onClick={() => {
                setCurrentSection('profile');
                handleProfileClick();
              }} 
              className="flex-1 mx-1 relative"
            >
              Profile
              {profileClickCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {profileClickCount}
                </span>
              )}
            </Button>
            
            {user?.isAdmin && (
              <Button 
                variant={currentSection === 'admin' ? 'space' : 'ghost'} 
                size="sm" 
                onClick={() => setCurrentSection('admin')} 
                className="flex-1 mx-1"
              >
                Admin
              </Button>
            )}
          </div>
        </div>

        {/* Admin Code Dialog */}
        <Dialog open={showAdminInput} onOpenChange={setShowAdminInput}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Admin Access</DialogTitle>
              <DialogDescription>
                Enter admin code to access admin panel.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-code">Enter Admin Code</Label>
                <Input 
                  id="admin-code" 
                  type="password" 
                  value={adminCode} 
                  onChange={e => setAdminCode(e.target.value)} 
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleAdminCodeSubmit();
                    }
                  }} 
                  placeholder="Admin code..." 
                  autoFocus 
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAdminInput(false);
                    setAdminCode('');
                    setProfileClickCount(0);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAdminCodeSubmit} className="bg-gradient-space">
                  Admin Access
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </LanguageProvider>
  );
};

export default AppContent;
