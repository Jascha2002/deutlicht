import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Handshake, DollarSign, UserCheck, Receipt, Target, Building2,
  FolderOpen, FileText, BarChart3, Package, CalendarDays, Bell,
  ClipboardList, Folder, ClipboardCheck, LayoutGrid, Monitor
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UserManagement } from "./UserManagement";
import { PartnerManagement } from "./PartnerManagement";
import { ReferralManagement } from "./ReferralManagement";
import { CommissionManagement } from "./CommissionManagement";
import { PartnerInvoiceManagement } from "./PartnerInvoiceManagement";
import { LeadManagement } from "./LeadManagement";
import { CompanyManagement } from "./CompanyManagement";
import { ProjectManagement } from "./ProjectManagement";
import { OfferManagement } from "./OfferManagement";
import { InvoiceManagement } from "./InvoiceManagement";
import { ReportManagement } from "./ReportManagement";
import { ProductManagement } from "./ProductManagement";
import { FollowupManagement } from "./FollowupManagement";
import { CalendarManagement } from "./CalendarManagement";
import { OrderManagement } from "./OrderManagement";
import { DocumentManagement } from "./DocumentManagement";
import { AcceptanceProtocolManagement } from "./AcceptanceProtocolManagement";
import { TemplateManagement } from "./TemplateManagement";
import { DemosManagement } from "./DemosManagement";

interface AdminTabsProps {
  defaultTab?: string;
}

export function AdminTabs({ defaultTab = "leads" }: AdminTabsProps) {
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'mitarbeiter' | 'kunde' | 'partner' | 'produktion'>('admin');

  useEffect(() => {
    const loadUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (roles?.some(r => r.role === 'admin')) {
        setCurrentUserRole('admin');
      } else if (roles?.some(r => r.role === 'mitarbeiter')) {
        setCurrentUserRole('mitarbeiter');
      } else if (roles?.some(r => r.role === 'produktion')) {
        setCurrentUserRole('produktion');
      } else if (roles?.some(r => r.role === 'partner')) {
        setCurrentUserRole('partner');
      } else {
        setCurrentUserRole('kunde');
      }
    };

    loadUserRole();
  }, []);

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="flex flex-wrap justify-start mb-6 h-auto gap-1">
        <TabsTrigger value="leads" className="gap-1 px-2 py-2 text-xs">
          <Target className="w-4 h-4" />
          <span className="hidden sm:inline">Leads</span>
        </TabsTrigger>
        <TabsTrigger value="projects" className="gap-1 px-2 py-2 text-xs">
          <FolderOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Projekte</span>
        </TabsTrigger>
        <TabsTrigger value="offers" className="gap-1 px-2 py-2 text-xs">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Angebote</span>
        </TabsTrigger>
        <TabsTrigger value="orders" className="gap-1 px-2 py-2 text-xs">
          <ClipboardList className="w-4 h-4" />
          <span className="hidden sm:inline">Aufträge</span>
        </TabsTrigger>
        <TabsTrigger value="invoices" className="gap-1 px-2 py-2 text-xs">
          <Receipt className="w-4 h-4" />
          <span className="hidden sm:inline">Rechnungen</span>
        </TabsTrigger>
        <TabsTrigger value="acceptance" className="gap-1 px-2 py-2 text-xs">
          <ClipboardCheck className="w-4 h-4" />
          <span className="hidden sm:inline">Abnahmen</span>
        </TabsTrigger>
        <TabsTrigger value="documents" className="gap-1 px-2 py-2 text-xs">
          <Folder className="w-4 h-4" />
          <span className="hidden sm:inline">Dokumente</span>
        </TabsTrigger>
        <TabsTrigger value="followups" className="gap-1 px-2 py-2 text-xs">
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">Wiedervorlagen</span>
        </TabsTrigger>
        <TabsTrigger value="calendar" className="gap-1 px-2 py-2 text-xs">
          <CalendarDays className="w-4 h-4" />
          <span className="hidden sm:inline">Kalender</span>
        </TabsTrigger>
        <TabsTrigger value="reports" className="gap-1 px-2 py-2 text-xs">
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Berichte</span>
        </TabsTrigger>
        <TabsTrigger value="products" className="gap-1 px-2 py-2 text-xs">
          <Package className="w-4 h-4" />
          <span className="hidden sm:inline">Produkte</span>
        </TabsTrigger>
        <TabsTrigger value="companies" className="gap-1 px-2 py-2 text-xs">
          <Building2 className="w-4 h-4" />
          <span className="hidden sm:inline">Firmen</span>
        </TabsTrigger>
        <TabsTrigger value="users" className="gap-1 px-2 py-2 text-xs">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Benutzer</span>
        </TabsTrigger>
        <TabsTrigger value="partners" className="gap-1 px-2 py-2 text-xs">
          <Handshake className="w-4 h-4" />
          <span className="hidden sm:inline">Partner</span>
        </TabsTrigger>
        <TabsTrigger value="referrals" className="gap-1 px-2 py-2 text-xs">
          <UserCheck className="w-4 h-4" />
          <span className="hidden sm:inline">Referrals</span>
        </TabsTrigger>
        <TabsTrigger value="commissions" className="gap-1 px-2 py-2 text-xs">
          <DollarSign className="w-4 h-4" />
          <span className="hidden sm:inline">Provisionen</span>
        </TabsTrigger>
        <TabsTrigger value="templates" className="gap-1 px-2 py-2 text-xs">
          <LayoutGrid className="w-4 h-4" />
          <span className="hidden sm:inline">Vorlagen</span>
        </TabsTrigger>
        <TabsTrigger value="demos" className="gap-1 px-2 py-2 text-xs">
          <Monitor className="w-4 h-4" />
          <span className="hidden sm:inline">Demos & Referenzen</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="leads">
        <LeadManagement />
      </TabsContent>

      <TabsContent value="projects">
        <ProjectManagement />
      </TabsContent>

      <TabsContent value="offers">
        <OfferManagement />
      </TabsContent>

      <TabsContent value="orders">
        <OrderManagement />
      </TabsContent>

      <TabsContent value="invoices">
        <InvoiceManagement />
      </TabsContent>

      <TabsContent value="acceptance">
        <AcceptanceProtocolManagement />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentManagement />
      </TabsContent>

      <TabsContent value="followups">
        <FollowupManagement />
      </TabsContent>

      <TabsContent value="calendar">
        <CalendarManagement />
      </TabsContent>

      <TabsContent value="reports">
        <ReportManagement />
      </TabsContent>

      <TabsContent value="products">
        <ProductManagement />
      </TabsContent>

      <TabsContent value="companies">
        <CompanyManagement />
      </TabsContent>

      <TabsContent value="users">
        <UserManagement currentUserRole={currentUserRole} />
      </TabsContent>

      <TabsContent value="partners">
        <PartnerManagement />
      </TabsContent>

      <TabsContent value="referrals">
        <ReferralManagement />
      </TabsContent>

      <TabsContent value="commissions">
        <CommissionManagement />
      </TabsContent>

      <TabsContent value="templates">
        <TemplateManagement />
      </TabsContent>

      <TabsContent value="demos">
        <DemosManagement />
      </TabsContent>
    </Tabs>
  );
}
