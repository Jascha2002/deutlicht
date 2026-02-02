import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Search, Package, Globe, Server, TrendingUp, Bot, Phone, 
  MessageSquare, Users, Settings, Briefcase
} from 'lucide-react';

type ProductCategory = 'website' | 'hosting' | 'seo' | 'ki_agent' | 'voicebot' | 'social_media' | 'beratung' | 'prozess' | 'branchenloesung' | 'service';

interface CrmProduct {
  id: string;
  product_code: string | null;
  name: string;
  description: string | null;
  category: ProductCategory;
  price_setup: number;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  target_group: string | null;
  implementation_weeks: number | null;
  is_active: boolean;
  sort_order: number;
  source: string | null;
}

const categoryConfig: Record<ProductCategory, { label: string; icon: typeof Package; className: string }> = {
  website: { label: 'Website', icon: Globe, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  hosting: { label: 'Hosting', icon: Server, className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  seo: { label: 'SEO', icon: TrendingUp, className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  ki_agent: { label: 'KI-Agent', icon: Bot, className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  voicebot: { label: 'Voicebot', icon: Phone, className: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
  social_media: { label: 'Social Media', icon: MessageSquare, className: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' },
  beratung: { label: 'Beratung', icon: Users, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  prozess: { label: 'Prozess', icon: Settings, className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
  branchenloesung: { label: 'Branchenlösung', icon: Briefcase, className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' },
  service: { label: 'Service', icon: Settings, className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' }
};

export function ProductManagement() {
  const { toast } = useToast();
  const [products, setProducts] = useState<CrmProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_products')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      
      // Parse features from JSON and cast to proper type
      const parsed: CrmProduct[] = (data || []).map(p => ({
        ...p,
        features: Array.isArray(p.features) ? (p.features as unknown as string[]) : []
      }));
      
      setProducts(parsed);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: 'Fehler',
        description: 'Produkte konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount: number) => {
    if (!amount || amount === 0) return '-';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Stats by category
  const categoryStats = Object.entries(categoryConfig).map(([key, config]) => ({
    category: key as ProductCategory,
    ...config,
    count: products.filter(p => p.category === key).length
  })).filter(s => s.count > 0);

  return (
    <div className="space-y-6">
      {/* Category Stats */}
      <div className="flex flex-wrap gap-2">
        {categoryStats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.category} 
              className={`cursor-pointer transition-all ${categoryFilter === stat.category ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setCategoryFilter(categoryFilter === stat.category ? 'all' : stat.category)}
            >
              <CardContent className="p-3 flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="font-medium">{stat.label}</span>
                <Badge variant="secondary">{stat.count}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Produkte suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {categoryFilter !== 'all' && (
          <Button variant="ghost" onClick={() => setCategoryFilter('all')}>
            Filter zurücksetzen
          </Button>
        )}
      </div>

      {/* Products Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Code</TableHead>
              <TableHead>Produkt</TableHead>
              <TableHead>Kategorie</TableHead>
              <TableHead className="text-right">Einmalig</TableHead>
              <TableHead className="text-right">Monatlich</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Keine Produkte gefunden
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const config = categoryConfig[product.category];
                const Icon = config?.icon || Package;
                
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {product.product_code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={config?.className}>
                        <Icon className="h-3 w-3 mr-1" />
                        {config?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(product.price_setup)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.price_monthly)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={product.is_active ? 'default' : 'secondary'}>
                        {product.is_active ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        {filteredProducts.length} von {products.length} Produkten
      </div>
    </div>
  );
}
