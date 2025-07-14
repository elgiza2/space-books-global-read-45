import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dbFunctions, type DatabaseComment } from '@/lib/database';
import { User } from '@/types/book';

interface BookCommentsProps {
  bookId: string;
  user: User | null;
}

export const BookComments = ({ bookId, user }: BookCommentsProps) => {
  const [comments, setComments] = useState<DatabaseComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
  }, [bookId]);

  const loadComments = async () => {
    try {
      const commentsData = await dbFunctions.getBookComments(bookId);
      setComments(commentsData);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب تسجيل الدخول لإضافة تعليق",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please write a comment",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const commentData = {
        book_id: bookId,
        user_id: user.id,
        comment: newComment.trim(),
        rating: rating > 0 ? rating : undefined,
      };

      const newCommentData = await dbFunctions.addComment(commentData);
      setComments(prev => [newCommentData, ...prev]);
      setNewComment('');
      setRating(0);
      
      toast({
        title: "Comment Added",
        description: "Thank you for your comment",
      });
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= currentRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">التعليقات والتقييمات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <div className="space-y-4 p-4 border rounded-lg bg-card/50">
              <div className="space-y-2">
                <label className="text-sm font-medium">إضافة تقييم (اختياري)</label>
                {renderStars(rating, true)}
              </div>
              
              <Textarea
                placeholder="اكتب تعليقك هنا..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              
              <Button 
                onClick={handleSubmitComment}
                disabled={isLoading || !newComment.trim()}
                className="w-full"
              >
                {isLoading ? 'جاري الإضافة...' : 'إضافة تعليق'}
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                لا توجد تعليقات بعد. كن أول من يضيف تعليقاً!
              </p>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="bg-card/30">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            {comment.user?.first_name} {comment.user?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString('ar', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        {comment.rating && (
                          <div className="flex items-center gap-2">
                            {renderStars(comment.rating)}
                            <Badge variant="secondary">{comment.rating}/5</Badge>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-foreground leading-relaxed">
                        {comment.comment}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};