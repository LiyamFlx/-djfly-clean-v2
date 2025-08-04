import { useAuthState, useAuthActions } from '@/store';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthState();
  const { setUser, setSession } = useAuthActions();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    navigate(ROUTES.LOGIN);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold gradient-text mb-8">Profile</h1>
        <div className="glass-card p-8 rounded-xl">
          <p className="text-lg">
            <span className="font-bold">Email:</span> {user.email}
          </p>
          <Button onClick={handleSignOut} className="mt-4">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
