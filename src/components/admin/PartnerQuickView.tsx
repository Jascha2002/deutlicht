import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PartnerQuickViewProps {
  partner: {
    id: string;
    partner_number: string | null;
    company_name: string;
    legal_form: string | null;
    tax_id: string | null;
    website: string | null;
    street: string | null;
    postal_code: string | null;
    city: string | null;
    country: string | null;
    contact_first_name: string;
    contact_last_name: string;
    contact_email: string;
    contact_phone: string | null;
    contact_position: string | null;
    partner_type: string;
    status: string;
    commission_rate: number | null;
    created_at: string;
    contract_status: string | null;
    website_check_status: string | null;
    website_check_at: string | null;
    website_check_result: Record<string, unknown> | null;
  };
  onOpenDetails: () => void;
  onUpdate: () => void;
}

const partnerTypeLabels: Record<string, string> = {
  steuerberater: 'Steuerberater / Kanzlei',
  marketing_agentur: 'Marketing-Agentur',
  webdesigner: 'Webdesigner / Developer',
  it_dienstleister: 'IT-Dienstleister / Systemhaus',
  unternehmensberater: 'Unternehmensberater',
  sonstige: 'Sonstige',
};

export function PartnerQuickView({ partner, onOpenDetails, onUpdate }: PartnerQuickViewProps) {
  const { toast } = useToast();
  const [isCheckingWebsite, setIsCheckingWebsite] = useState(false);

  const handleCheckWebsite = async () => {
    if (!partner.website) {
      toast({
        title: 'Keine Website',
        description: 'Der Partner hat keine Website angegeben.',
        variant: 'destructive',
      });
      return;
    }

    setIsCheckingWebsite(true);
    try {
      const response = await fetch(partner.website, {
        method: 'HEAD',
        mode: 'no-cors',
      });

      // Due to no-cors, we can only detect if the request doesn't throw
      const checkResult = {
        reachable: true,
        checkedAt: new Date().toISOString(),
        url: partner.website,
      };

      const { error } = await supabase
        .from('partners')
        .update({
          website_check_status: 'reachable',
          website_check_at: new Date().toISOString(),
          website_check_result: checkResult,
        })
        .eq('id', partner.id);

      if (error) throw error;

      toast({
        title: 'Website erreichbar',
        description: `Die Website ${partner.website} ist erreichbar.`,
      });
      onUpdate();
    } catch (error) {
      console.error('Website check failed:', error);

      const checkResult = {
        reachable: false,
        checkedAt: new Date().toISOString(),
        url: partner.website,
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      await supabase
        .from('partners')
        .update({
          website_check_status: 'unreachable',
          website_check_at: new Date().toISOString(),
          website_check_result: checkResult,
        })
        .eq('id', partner.id);

      toast({
        title: 'Website-Prüfung',
        description: 'Konnte die Website nicht prüfen. Möglicherweise nicht erreichbar oder CORS-geschützt.',
        variant: 'destructive',
      });
      onUpdate();
    } finally {
      setIsCheckingWebsite(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Genehmigt
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="w-3 h-3 mr-1" />
            Prüfung
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Abgelehnt
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getWebsiteStatusIcon = () => {
    if (!partner.website_check_status) return null;

    if (partner.website_check_status === 'reachable') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (partner.website_check_status === 'unreachable') {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card className="border-accent/20 hover:border-accent/40 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg">{partner.company_name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                {partner.partner_number && (
                  <span className="font-mono text-accent text-xs">{partner.partner_number}</span>
                )}
                <span>•</span>
                <span className="text-xs">{partnerTypeLabels[partner.partner_type] || partner.partner_type}</span>
              </CardDescription>
            </div>
          </div>
          {getStatusBadge(partner.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Contact */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ansprechpartner</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {partner.contact_first_name} {partner.contact_last_name}
                </span>
              </div>
              {partner.contact_position && (
                <p className="text-xs text-muted-foreground pl-5">{partner.contact_position}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Adresse</h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-3 h-3 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                {partner.street && <p>{partner.street}</p>}
                <p>
                  {partner.postal_code} {partner.city}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Info */}
        <div className="flex flex-wrap gap-4">
          <a
            href={`mailto:${partner.contact_email}`}
            className="flex items-center gap-2 text-sm text-accent hover:underline"
          >
            <Mail className="w-3 h-3" />
            {partner.contact_email}
          </a>
          {partner.contact_phone && (
            <a
              href={`tel:${partner.contact_phone}`}
              className="flex items-center gap-2 text-sm text-accent hover:underline"
            >
              <Phone className="w-3 h-3" />
              {partner.contact_phone}
            </a>
          )}
        </div>

        {/* Website with Check */}
        {partner.website && (
          <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline flex items-center gap-1"
              >
                {partner.website.replace(/^https?:\/\//, '')}
                <ExternalLink className="w-3 h-3" />
              </a>
              {getWebsiteStatusIcon()}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCheckWebsite}
              disabled={isCheckingWebsite}
              className="h-7 text-xs"
            >
              {isCheckingWebsite ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              <span className="ml-1">Prüfen</span>
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Angemeldet: {formatDate(partner.created_at)}
          </span>
          <span className="font-medium text-accent">
            Provision: {partner.commission_rate || 15}%
          </span>
        </div>

        {/* Actions */}
        <Button onClick={onOpenDetails} className="w-full gap-2">
          <FileText className="w-4 h-4" />
          Details & Vertrag
        </Button>
      </CardContent>
    </Card>
  );
}
