import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OfferFormData } from '@/types/offer';

// Generate a unique session ID for tracking
const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const additionalRandom = Math.random().toString(36).substring(2, 15);
  return `lead_${timestamp}_${randomPart}${additionalRandom}`;
};

// Get or create session ID from sessionStorage
const getSessionId = (): string => {
  const storageKey = 'projektanfrage_session_id';
  let sessionId = sessionStorage.getItem(storageKey);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(storageKey, sessionId);
  }
  return sessionId;
};

export const useLeadTracking = () => {
  const [sessionId] = useState<string>(() => getSessionId());
  const [leadId, setLeadId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastSavedData = useRef<string>('');

  // Create or update lead in database
  const saveLead = useCallback(async (
    formData: OfferFormData,
    currentStep: number,
    status: 'draft' | 'submitted' = 'draft'
  ) => {
    const dataString = JSON.stringify({ formData, currentStep, status });
    
    // Skip if data hasn't changed
    if (dataString === lastSavedData.current && status !== 'submitted') {
      return;
    }

    setIsSaving(true);

    try {
      const leadData = {
        session_id: sessionId,
        status,
        company_name: formData.company_name || null,
        industry: formData.industry || null,
        company_size: formData.company_size || null,
        customer_name: formData.contact_person || null,
        customer_email: formData.customer_email || null,
        customer_phone: formData.customer_phone || null,
        customer_address: formData.company_street || null,
        customer_city: formData.company_city || null,
        customer_postal_code: formData.company_zip || null,
        services_selected: formData.services_selected,
        website_type: formData.website_type || null,
        website_features: formData.website_features,
        social_platforms: formData.social_platforms,
        ai_use_cases: formData.ki_type ? `${formData.ki_type}: ${formData.ki_branche || ''}` : null,
        voicebot_use_cases: formData.voice_type ? `${formData.voice_type}: ${formData.voice_anwendung || ''}` : null,
        additional_notes: null,
        current_step: currentStep,
        last_activity_at: new Date().toISOString(),
        submitted_at: status === 'submitted' ? new Date().toISOString() : null,
      };

      if (leadId) {
        // Update existing lead
        const { error } = await supabase
          .from('project_leads')
          .update(leadData)
          .eq('id', leadId);

        if (error) {
          console.error('Error updating lead:', error);
        } else {
          lastSavedData.current = dataString;
        }
      } else {
        // Create new lead
        const { data, error } = await supabase
          .from('project_leads')
          .insert(leadData)
          .select('id')
          .single();

        if (error) {
          console.error('Error creating lead:', error);
        } else if (data) {
          setLeadId(data.id);
          lastSavedData.current = dataString;
        }
      }
    } catch (err) {
      console.error('Lead tracking error:', err);
    } finally {
      setIsSaving(false);
    }
  }, [sessionId, leadId]);

  // Debounced save for auto-save during form editing
  const debouncedSave = useCallback((
    formData: OfferFormData,
    currentStep: number
  ) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      saveLead(formData, currentStep, 'draft');
    }, 2000); // Save after 2 seconds of inactivity
  }, [saveLead]);

  // Submit lead (mark as submitted)
  const submitLead = useCallback(async (
    formData: OfferFormData,
    currentStep: number,
    estimatedSetup: number,
    estimatedMonthly: number
  ) => {
    // Clear any pending debounced save
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Save with submitted status
    await saveLead(formData, currentStep, 'submitted');

    // Update internal price estimates (these are only visible to staff)
    if (leadId) {
      try {
        await supabase
          .from('project_leads')
          .update({
            internal_price_estimate_setup: estimatedSetup,
            internal_price_estimate_monthly: estimatedMonthly,
          })
          .eq('id', leadId);
      } catch (err) {
        console.error('Error updating price estimates:', err);
      }
    }
  }, [saveLead, leadId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return {
    sessionId,
    leadId,
    isSaving,
    saveLead: debouncedSave,
    submitLead,
  };
};
