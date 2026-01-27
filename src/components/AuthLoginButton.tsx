import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Lock, LogOut, User, Shield, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const AuthLoginButton = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          checkAdminRole(session.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      setIsAdmin(data?.some(r => r.role === 'admin') || false);
    } catch (error) {
      console.error('Error checking admin role:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Abgemeldet',
        description: 'Sie wurden erfolgreich abgemeldet.'
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-9 h-9 rounded-lg bg-muted animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        to="/auth"
        className="p-2 rounded-lg text-foreground/80 hover:text-accent hover:bg-accent/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        aria-label="Anmelden"
        title="Anmelden"
      >
        <Lock className="w-5 h-5" />
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          aria-label="Benutzermenü"
        >
          <User className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2 border-b border-border">
          <p className="text-sm font-medium text-foreground truncate">
            {user.email}
          </p>
          <p className="text-xs text-muted-foreground">
            {isAdmin ? 'Administrator' : 'Benutzer'}
          </p>
        </div>
        
        <DropdownMenuItem onClick={() => navigate('/analyse')} className="cursor-pointer gap-2">
          <BarChart3 className="w-4 h-4" />
          Analyse Dashboard
        </DropdownMenuItem>
        
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer gap-2">
            <Shield className="w-4 h-4" />
            Admin Dashboard
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4" />
          Abmelden
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthLoginButton;
