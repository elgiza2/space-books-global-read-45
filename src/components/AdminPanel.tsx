import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import { Book } from '@/types/book';
import { Plus, Edit, Trash2, Shield, RefreshCw } from 'lucide-react';
import { AdminStatistics } from './AdminStatistics';

interface AdminPanelProps {
  books: Book[];
  onAddBook: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditBook: (id: string, book: Partial<Book>) => void;
  onDeleteBook: (id: string) => void;
}

interface BookFormData {
  title: string;
  description: string;
  price: number;
  coverImage: string;
  fileUrl: string;
  author: string;
  category: string;
  featured: boolean;
}

export function AdminPanel({ books, onAddBook, onEditBook, onDeleteBook }: AdminPanelProps) {
  const { t } = useLanguage();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    description: '',
    price: 0,
    coverImage: '',
    fileUrl: '',
    author: '',
    category: '',
    featured: false,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      coverImage: '',
      fileUrl: '',
      author: '',
      category: '',
      featured: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBook) {
      onEditBook(editingBook.id, formData);
      setEditingBook(null);
    } else {
      onAddBook(formData);
      setIsAddDialogOpen(false);
    }
    
    resetForm();
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      description: book.description,
      price: book.price,
      coverImage: book.coverImage,
      fileUrl: book.fileUrl,
      author: book.author,
      category: book.category,
      featured: book.featured,
    });
  };

  const handleRefreshStats = () => {
    setRefreshKey(prev => prev + 1);
  };

  const BookForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">{t('admin.book_name')}</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">{t('admin.book_price')} (TON)</Label>
          <Input
            id="price"
            type="number"
            step="0.1"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t('admin.book_description')}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">{t('admin.upload_cover')} (URL)</Label>
        <Input
          id="coverImage"
          value={formData.coverImage}
          onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
          placeholder="https://example.com/cover.jpg"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fileUrl">{t('admin.upload_file')} (URL)</Label>
        <Input
          id="fileUrl"
          value={formData.fileUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, fileUrl: e.target.value }))}
          placeholder="https://example.com/book.pdf"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
        />
        <Label htmlFor="featured">Featured Book</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsAddDialogOpen(false);
            setEditingBook(null);
            resetForm();
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button type="submit" className="bg-gradient-space">
          {t('common.save')}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            {t('admin.title')}
          </h1>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefreshStats}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Stats
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-space shadow-glow">
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.add_book')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('admin.add_book')}</DialogTitle>
              </DialogHeader>
              <BookForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <AdminStatistics key={refreshKey} />

      {/* Books Management */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Books ({books.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-card/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <p className="text-sm text-accent font-medium">{book.price} TON</p>
                    {book.featured && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-gradient-gold text-accent-foreground rounded">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(book)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteBook(book.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editingBook !== null} onOpenChange={(open) => !open && setEditingBook(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.edit_book')}</DialogTitle>
          </DialogHeader>
          <BookForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
