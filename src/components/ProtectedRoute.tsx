import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'shop_owner' | 'customer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
    
    if (!loading && user && requiredRole) {
      // Wait a bit for profile to load if it's not loaded yet
      const checkProfile = () => {
        if (profile) {
          if (profile.role !== requiredRole) {
            // Redirect users to their appropriate dashboard based on their role
            if (profile.role === 'shop_owner') {
              navigate('/dashboard/shop-owner');
            } else if (profile.role === 'customer') {
              navigate('/dashboard/customer');
            } else {
              navigate('/');
            }
          }
        } else if (!loading) {
          // Profile failed to load, redirect to auth
          console.error('Profile failed to load for authenticated user');
          navigate('/auth');
        }
      };

      // If profile is already loaded, check immediately
      if (profile) {
        checkProfile();
      } else {
        // Wait a bit for profile to load
        const timeout = setTimeout(checkProfile, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [user, profile, loading, navigate, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && profile && profile.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;