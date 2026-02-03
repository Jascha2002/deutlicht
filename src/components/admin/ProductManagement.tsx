import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Search, Package, Globe, Server, TrendingUp, Bot, Phone, 
  MessageSquare, Users, Settings, Briefcase, Plus, Pencil, Trash2, AlertTriangle
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

const emptyProduct: Omit<CrmProduct, 'id'> = {
  product_code: '',
  name: '',
  description: '',
  category: 'website',
  price_setup: 0,
  price_monthly: 0,
  price_yearly: 0,
  features: [],
  target_group: '',
  implementation_weeks: null,
  is_active: true,
  sort_order: 0,
  source: 'manual'
};

export function ProductManagement() {
  const { toast } = useToast();
  const [products, setProducts] = useState<CrmProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<CrmProduct | null>(null);
  const [formData, setFormData] = useState<Omit<CrmProduct, 'id'>>(emptyProduct);
  const [featuresText, setFeaturesText] = useState('');

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

  const handleCreateProduct = async () => {
    try {
      const features = featuresText.split('\n').filter(f => f.trim());
      const { error } = await supabase.from('crm_products').insert([{
        ...formData,
        features,
        sort_order: products.length + 1
      }]);

      if (error) throw error;

      toast({ title: 'Produkt erstellt', description: `${formData.name} wurde angelegt.` });
      setCreateDialogOpen(false);
      setFormData(emptyProduct);
      setFeaturesText('');
      loadProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({ title: 'Fehler', description: 'Produkt konnte nicht erstellt werden.', variant: 'destructive' });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editProduct) return;
    try {
      const features = featuresText.split('\n').filter(f => f.trim());
      const { error } = await supabase.from('crm_products').update({
        ...formData,
        features
      }).eq('id', editProduct.id);

      if (error) throw error;

      toast({ title: 'Produkt aktualisiert', description: `${formData.name} wurde gespeichert.` });
      setEditDialogOpen(false);
      setEditProduct(null);
      setFormData(emptyProduct);
      setFeaturesText('');
      loadProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({ title: 'Fehler', description: 'Produkt konnte nicht aktualisiert werden.', variant: 'destructive' });
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProductId) return;
    try {
      const { error } = await supabase.from('crm_products').delete().eq('id', deleteProductId);
      if (error) throw error;

      toast({ title: 'Produkt gelöscht', description: 'Das Produkt wurde entfernt.' });
      setDeleteProductId(null);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({ title: 'Fehler', description: 'Produkt konnte nicht gelöscht werden.', variant: 'destructive' });
    }
  };

  const openEditDialog = (product: CrmProduct) => {
    setEditProduct(product);
    setFormData({
      product_code: product.product_code,
      name: product.name,
      description: product.description,
      category: product.category,
      price_setup: product.price_setup,
      price_monthly: product.price_monthly,
      price_yearly: product.price_yearly,
      features: product.features,
      target_group: product.target_group,
      implementation_weeks: product.implementation_weeks,
      is_active: product.is_active,
      sort_order: product.sort_order,
      source: product.source
    });
    setFeaturesText(product.features.join('\n'));
    setEditDialogOpen(true);
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

  const categoryStats = Object.entries(categoryConfig).map(([key, config]) => ({
    category: key as ProductCategory,
    ...config,
    count: products.filter(p => p.category === key).length
  })).filter(s => s.count > 0);

  const ProductFormFields = () => (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Produkt-Code</Label>
          <Input
            value={formData.product_code || ''}
            onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
            placeholder="z.B. WEB-BASIC"
          />
        </div>
        <div className="space-y-2">
          <Label>Kategorie</Label>
          <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as ProductCategory })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Name *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Produktname"
        />
      </div>

      <div className="space-y-2">
        <Label>Beschreibung</Label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Kurze Produktbeschreibung..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Einmalpreis (€)</Label>
          <Input
            type="number"
            value={formData.price_setup || ''}
            onChange={(e) => setFormData({ ...formData, price_setup: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label>Monatlich (€)</Label>
          <Input
            type="number"
            value={formData.price_monthly || ''}
            onChange={(e) => setFormData({ ...formData, price_monthly: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label>Jährlich (€)</Label>
          <Input
            type="number"
            value={formData.price_yearly || ''}
            onChange={(e) => setFormData({ ...formData, price_yearly: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Features (eine Zeile pro Feature)</Label>
        <Textarea
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Zielgruppe</Label>
          <Input
            value={formData.target_group || ''}
            onChange={(e) => setFormData({ ...formData, target_group: e.target.value })}
            placeholder="z.B. KMU, Handwerk"
          />
        </div>
        <div className="space-y-2">
          <Label>Implementierung (Wochen)</Label>
          <Input
            type="number"
            value={formData.implementation_weeks || ''}
            onChange={(e) => setFormData({ ...formData, implementation_weeks: parseInt(e.target.value) || null })}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label>Produkt aktiv</Label>
      </div>
    </div>
  );

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
      <div className="flex gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
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
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => { setFormData(emptyProduct); setFeaturesText(''); }}>
              <Plus className="h-4 w-4" />
              Produkt anlegen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Neues Produkt anlegen</DialogTitle>
            </DialogHeader>
            <ProductFormFields />
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Abbrechen</Button>
              <Button onClick={handleCreateProduct} disabled={!formData.name}>Anlegen</Button>
            </div>
          </DialogContent>
        </Dialog>
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
              <TableHead className="w-[100px]">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
                        {product.product_code || '-'}
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
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteProductId(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Produkt bearbeiten</DialogTitle>
          </DialogHeader>
          <ProductFormFields />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleUpdateProduct} disabled={!formData.name}>Speichern</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProductId} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Produkt löschen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Das Produkt wird unwiderruflich gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Endgültig löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
