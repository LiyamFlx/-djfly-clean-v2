import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthActions } from '@/store';

const AuthManager = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setSession } = useAuthActions();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setSession(data.session);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setSession]);

  return <>{children}</>;
};

export default AuthManager;
