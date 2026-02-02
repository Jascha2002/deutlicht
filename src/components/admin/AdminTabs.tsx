import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Handshake, DollarSign, UserCheck, Receipt, Target, Building2 } from "lucide-react";
import { UserManagement } from "./UserManagement";
import { PartnerManagement } from "./PartnerManagement";
import { ReferralManagement } from "./ReferralManagement";
import { CommissionManagement } from "./CommissionManagement";
import { PartnerInvoiceManagement } from "./PartnerInvoiceManagement";
import { LeadManagement } from "./LeadManagement";
import { CompanyManagement } from "./CompanyManagement";

interface AdminTabsProps {
  defaultTab?: string;
}

export function AdminTabs({ defaultTab = "leads" }: AdminTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-7 mb-6">
        <TabsTrigger value="leads" className="gap-2">
          <Target className="w-4 h-4" />
          <span className="hidden sm:inline">Leads</span>
        </TabsTrigger>
        <TabsTrigger value="companies" className="gap-2">
          <Building2 className="w-4 h-4" />
          <span className="hidden sm:inline">Firmen</span>
        </TabsTrigger>
        <TabsTrigger value="users" className="gap-2">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Benutzer</span>
        </TabsTrigger>
        <TabsTrigger value="partners" className="gap-2">
          <Handshake className="w-4 h-4" />
          <span className="hidden sm:inline">Partner</span>
        </TabsTrigger>
        <TabsTrigger value="referrals" className="gap-2">
          <UserCheck className="w-4 h-4" />
          <span className="hidden sm:inline">Referrals</span>
        </TabsTrigger>
        <TabsTrigger value="commissions" className="gap-2">
          <DollarSign className="w-4 h-4" />
          <span className="hidden sm:inline">Provisionen</span>
        </TabsTrigger>
        <TabsTrigger value="invoices" className="gap-2">
          <Receipt className="w-4 h-4" />
          <span className="hidden sm:inline">Abrechnungen</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="leads">
        <LeadManagement />
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

      <TabsContent value="invoices">
        <PartnerInvoiceManagement />
      </TabsContent>
    </Tabs>
  );
}
