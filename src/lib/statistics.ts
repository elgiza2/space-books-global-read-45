
import { supabase } from '@/integrations/supabase/client';

export interface AppStatistics {
  totalUsers: number;
  totalBooks: number;
  totalPurchases: number;
  featuredBooks: number;
}

export const statisticsService = {
  async getAppStatistics(): Promise<AppStatistics> {
    try {
      // Get total users count
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get total books count
      const { count: totalBooks } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true });

      // Get total purchases count
      const { count: totalPurchases } = await supabase
        .from('purchases')
        .select('*', { count: 'exact', head: true });

      // Get featured books count
      const { count: featuredBooks } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .eq('featured', true);

      return {
        totalUsers: totalUsers || 0,
        totalBooks: totalBooks || 0,
        totalPurchases: totalPurchases || 0,
        featuredBooks: featuredBooks || 0
      };
    } catch (error) {
      console.error('Failed to get statistics:', error);
      return {
        totalUsers: 0,
        totalBooks: 0,
        totalPurchases: 0,
        featuredBooks: 0
      };
    }
  }
};
