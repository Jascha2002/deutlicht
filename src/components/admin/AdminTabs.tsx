import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Handshake, DollarSign, UserCheck, Receipt, Target, Building2,
  FolderOpen, FileText, BarChart3
} from "lucide-react";
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

interface AdminTabsProps {
  defaultTab?: string;
}

export function AdminTabs({ defaultTab = "leads" }: AdminTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 mb-6 h-auto gap-1">
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
        <TabsTrigger value="invoices" className="gap-1 px-2 py-2 text-xs">
          <Receipt className="w-4 h-4" />
          <span className="hidden sm:inline">Rechnungen</span>
        </TabsTrigger>
        <TabsTrigger value="reports" className="gap-1 px-2 py-2 text-xs">
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Berichte</span>
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

      <TabsContent value="invoices">
        <InvoiceManagement />
      </TabsContent>

      <TabsContent value="reports">
        <ReportManagement />
      </TabsContent>

      <TabsContent value="companies">
        <CompanyManagement />
      </TabsContent>

      <TabsContent value="users">
        <UserManagement />
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
    </Tabs>
  );
}
