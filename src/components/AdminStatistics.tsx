
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, ShoppingCart, Star } from 'lucide-react';
import { statisticsService, type AppStatistics } from '@/lib/statistics';
import { useLanguage } from '@/hooks/useLanguage';

export function AdminStatistics() {
  const { t } = useLanguage();
  const [statistics, setStatistics] = useState<AppStatistics>({
    totalUsers: 0,
    totalBooks: 0,
    totalPurchases: 0,
    featuredBooks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const stats = await statisticsService.getAppStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: statistics.totalUsers,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Total Books',
      value: statistics.totalBooks,
      icon: BookOpen,
      color: 'text-green-500'
    },
    {
      title: 'Total Purchases',
      value: statistics.totalPurchases,
      icon: ShoppingCart,
      color: 'text-purple-500'
    },
    {
      title: 'Featured Books',
      value: statistics.featuredBooks,
      icon: Star,
      color: 'text-yellow-500'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-8 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
