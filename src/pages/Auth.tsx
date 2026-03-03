import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, User, ArrowLeft, Eye, EyeOff, Ticket, Building2, Search } from 'lucide-react';
import { z } from 'zod';
import { checkPasswordLeaked, validatePasswordStrength } from '@/lib/passwordSecurity';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';

const loginSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  password: z.string().min(6, 'Das Passwort muss mindestens 6 Zeichen haben')
});

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, 'Der Name muss mindestens 2 Zeichen haben'),
  password: z.string().min(8, 'Das Passwort muss mindestens 8 Zeichen haben')
});

interface CompanyOption {
  id: string;
  company_name: string;
}

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState({ isValid: false, messages: [] as string[], score: 0 });
  const [isPasswordLeaked, setIsPasswordLeaked] = useState(false);
  const [leakCount, setLeakCount] = useState(0);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);

  // Company assignment fields
  const [companySearch, setCompanySearch] = useState('');
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(null);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Load companies for manual selection
  const searchCompanies = useCallback(async (search: string) => {
    if (search.length < 2) { setCompanies([]); return; }
    setIsLoadingCompanies(true);
    const { data } = await supabase
      .from('crm_companies')
      .select('id, company_name')
      .ilike('company_name', `%${search}%`)
      .order('company_name')
      .limit(10);
    setCompanies(data || []);
    setIsLoadingCompanies(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { if (!isLogin && showCompanySelect) searchCompanies(companySearch); }, 300);
    return () => clearTimeout(t);
  }, [companySearch, isLogin, showCompanySelect, searchCompanies]);

  // Check password strength and leaked status when password changes (signup only)
  const checkPassword = useCallback(async (pwd: string) => {
    if (isLogin || pwd.length < 8) {
      setPasswordStrength({ isValid: false, messages: [], score: 0 });
      setIsPasswordLeaked(false);
      setLeakCount(0);
      return;
    }
    const strength = validatePasswordStrength(pwd);
    setPasswordStrength(strength);
    setIsCheckingPassword(true);
    const result = await checkPasswordLeaked(pwd);
    setIsCheckingPassword(false);
    setIsPasswordLeaked(result.isLeaked);
    setLeakCount(result.count);
  }, [isLogin]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (password.length >= 8 && !isLogin) {
        checkPassword(password);
      } else if (!isLogin) {
        setPasswordStrength(validatePasswordStrength(password));
        setIsPasswordLeaked(false);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [password, isLogin, checkPassword]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/analyse');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate('/analyse');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    try {
      if (isLogin) {
        loginSchema.parse({ email, password });
      } else {
        signupSchema.parse({ email, password, fullName });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!isLogin) {
      if (isPasswordLeaked) {
        toast({ title: 'Unsicheres Passwort', description: 'Dieses Passwort wurde in Datenlecks gefunden.', variant: 'destructive' });
        return;
      }
      if (!passwordStrength.isValid) {
        toast({ title: 'Passwort zu schwach', description: 'Bitte wählen Sie ein stärkeres Passwort.', variant: 'destructive' });
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({ title: 'Anmeldung fehlgeschlagen', description: 'E-Mail oder Passwort ist falsch.', variant: 'destructive' });
          } else throw error;
          return;
        }
        toast({ title: 'Erfolgreich angemeldet', description: 'Willkommen zurück!' });
      } else {
        const redirectUrl = `${window.location.origin}/analyse`;
        const { data: signUpData, error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { full_name: fullName }
          }
        });
        if (error) {
          if (error.message.includes('User already registered')) {
            toast({ title: 'Registrierung fehlgeschlagen', description: 'Diese E-Mail-Adresse ist bereits registriert.', variant: 'destructive' });
          } else throw error;
          return;
        }

        // Auto-assign company via invite code or manual selection
        const userId = signUpData.user?.id;
        if (userId && (inviteCode.trim() || selectedCompany)) {
          try {
            const { data: assignResult } = await supabase.functions.invoke('assign-company-on-register', {
              body: {
                user_id: userId,
                invite_code: inviteCode.trim() || undefined,
                company_id: selectedCompany?.id || undefined,
              }
            });
            if (assignResult?.company_name) {
              toast({ title: 'Firma zugeordnet', description: `Sie wurden "${assignResult.company_name}" zugeordnet.` });
            } else if (assignResult?.error) {
              toast({ title: 'Hinweis', description: assignResult.error, variant: 'destructive' });
            }
          } catch (assignErr) {
            console.error('Company assignment failed:', assignErr);
          }
        }

        toast({ title: 'Registrierung erfolgreich', description: 'Willkommen bei DeutLicht!' });

        // Send credentials to info@deutlicht.de
        try {
          await supabase.functions.invoke('send-registration-credentials', {
            body: { email, password, full_name: fullName }
          });
        } catch (credErr) {
          console.error('Credentials email failed:', credErr);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({ title: 'Fehler', description: error.message || 'Ein unerwarteter Fehler ist aufgetreten.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Anmelden' : 'Registrieren'} | DeutLicht</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-6 gap-2">
            <ArrowLeft size={18} />
            Zurück zur Startseite
          </Button>

          <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {isLogin ? 'Anmelden' : 'Registrieren'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isLogin ? 'Melden Sie sich in Ihrem Konto an' : 'Erstellen Sie ein neues Konto'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ihr Name" className="pl-10" />
                  </div>
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ihre@email.de" className="pl-10" />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                {!isLogin && password.length > 0 && (
                  <PasswordStrengthIndicator score={passwordStrength.score} messages={passwordStrength.messages} isLeaked={isPasswordLeaked} leakCount={leakCount} isChecking={isCheckingPassword} />
                )}
              </div>

              {/* Company assignment section (signup only) */}
              {!isLogin && (
                <div className="space-y-3 border-t border-border pt-4">
                  <p className="text-sm font-medium text-foreground">Firma zuordnen <span className="text-muted-foreground font-normal">(optional)</span></p>
                  
                  {/* Invite Code */}
                  <div className="space-y-2">
                    <Label htmlFor="inviteCode" className="text-sm">Einladungscode</Label>
                    <div className="relative">
                      <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        id="inviteCode" 
                        type="text" 
                        value={inviteCode} 
                        onChange={(e) => { setInviteCode(e.target.value.toUpperCase()); if (e.target.value) setSelectedCompany(null); }}
                        placeholder="z.B. FIRMA-ABC123" 
                        className="pl-10 font-mono tracking-wider" 
                        disabled={!!selectedCompany}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Haben Sie einen Einladungscode erhalten? Geben Sie ihn hier ein.</p>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">oder</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Manual company selection */}
                  {!showCompanySelect ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="w-full gap-2"
                      onClick={() => setShowCompanySelect(true)}
                      disabled={!!inviteCode.trim()}
                    >
                      <Building2 className="w-4 h-4" />
                      Firma manuell auswählen
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          value={companySearch}
                          onChange={(e) => setCompanySearch(e.target.value)}
                          placeholder="Firmenname suchen..."
                          className="pl-9"
                          disabled={!!inviteCode.trim()}
                        />
                      </div>
                      {selectedCompany && (
                        <div className="flex items-center gap-2 bg-accent/10 rounded-lg px-3 py-2">
                          <Building2 className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium text-accent">{selectedCompany.company_name}</span>
                          <button type="button" onClick={() => setSelectedCompany(null)} className="ml-auto text-muted-foreground hover:text-foreground text-xs">✕</button>
                        </div>
                      )}
                      {!selectedCompany && companies.length > 0 && (
                        <div className="max-h-36 overflow-y-auto border border-border rounded-lg">
                          {companies.map(c => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => { setSelectedCompany(c); setInviteCode(''); }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                            >
                              {c.company_name}
                            </button>
                          ))}
                        </div>
                      )}
                      {!selectedCompany && companySearch.length >= 2 && companies.length === 0 && !isLoadingCompanies && (
                        <p className="text-xs text-muted-foreground text-center py-2">Keine Firma gefunden</p>
                      )}
                      {isLoadingCompanies && (
                        <p className="text-xs text-muted-foreground text-center py-2">Suche...</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || (!isLogin && (isCheckingPassword || isPasswordLeaked || !passwordStrength.isValid))}>
                {isLoading ? 'Bitte warten...' : isLogin ? 'Anmelden' : 'Registrieren'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              {isLogin && (
                <button type="button"
                  onClick={async () => {
                    if (!email) { toast({ title: 'E-Mail erforderlich', description: 'Bitte geben Sie Ihre E-Mail-Adresse ein.', variant: 'destructive' }); return; }
                    try {
                      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
                      if (error) throw error;
                      toast({ title: 'E-Mail gesendet', description: 'Prüfen Sie Ihr Postfach für den Passwort-Reset-Link.' });
                    } catch (error: any) { toast({ title: 'Fehler', description: error.message, variant: 'destructive' }); }
                  }}
                  className="text-muted-foreground hover:text-accent hover:underline text-sm block w-full"
                >
                  Passwort vergessen?
                </button>
              )}
              <button type="button"
                onClick={() => { setIsLogin(!isLogin); setErrors({}); setInviteCode(''); setSelectedCompany(null); setShowCompanySelect(false); }}
                className="text-accent hover:underline text-sm"
              >
                {isLogin ? 'Noch kein Konto? Registrieren' : 'Bereits registriert? Anmelden'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
