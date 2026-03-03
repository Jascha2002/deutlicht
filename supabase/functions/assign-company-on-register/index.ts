import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { user_id, invite_code, company_id } = await req.json();

    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    let assignedCompanyId: string | null = null;

    // Strategy 1: Invite code
    if (invite_code) {
      const { data: codeData, error: codeError } = await supabase
        .from("company_invite_codes")
        .select("id, company_id, max_uses, use_count, expires_at, is_active")
        .eq("code", invite_code.trim().toUpperCase())
        .eq("is_active", true)
        .single();

      if (codeError || !codeData) {
        return new Response(JSON.stringify({ error: "Ungültiger Einladungscode" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check expiry
      if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
        return new Response(JSON.stringify({ error: "Einladungscode abgelaufen" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check max uses
      if (codeData.max_uses && codeData.use_count >= codeData.max_uses) {
        return new Response(JSON.stringify({ error: "Einladungscode bereits vollständig eingelöst" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      assignedCompanyId = codeData.company_id;

      // Increment use count
      await supabase
        .from("company_invite_codes")
        .update({ use_count: codeData.use_count + 1 })
        .eq("id", codeData.id);
    }
    // Strategy 2: Manual company selection
    else if (company_id) {
      const { data: companyData } = await supabase
        .from("crm_companies")
        .select("id")
        .eq("id", company_id)
        .single();

      if (companyData) {
        assignedCompanyId = companyData.id;
      }
    }

    if (assignedCompanyId) {
      // Insert into user_company_assignments
      await supabase
        .from("user_company_assignments")
        .upsert({ user_id, company_id: assignedCompanyId }, { onConflict: "user_id,company_id" });

      // Also update profiles.company_id for backwards compat
      await supabase
        .from("profiles")
        .update({ company_id: assignedCompanyId })
        .eq("user_id", user_id);

      // Get company name for response
      const { data: company } = await supabase
        .from("crm_companies")
        .select("company_name")
        .eq("id", assignedCompanyId)
        .single();

      return new Response(JSON.stringify({ 
        success: true, 
        company_name: company?.company_name,
        company_id: assignedCompanyId 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, company_id: null }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("assign-company error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Fehler" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
