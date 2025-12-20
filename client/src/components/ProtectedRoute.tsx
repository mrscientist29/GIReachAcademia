import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { isAuthenticated, getUserData } from '@/lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      console.log('ProtectedRoute: Checking authentication...');
      
      if (!isAuthenticated()) {
        console.log('ProtectedRoute: Not authenticated, redirecting to', redirectTo);
        setIsChecking(false);
        setLocation(redirectTo);
        return;
      }

      const userData = getUserData();
      if (!userData) {
        console.log('ProtectedRoute: No user data, redirecting to', redirectTo);
        setIsChecking(false);
        setLocation(redirectTo);
        return;
      }

      console.log('ProtectedRoute: User data found:', userData);

      // Check role if required
      if (requiredRole && userData.role !== requiredRole) {
        console.log('ProtectedRoute: Role mismatch. Required:', requiredRole, 'User role:', userData.role);
        setIsChecking(false);
        // Redirect based on user's actual role
        if (userData.role === 'admin') {
          setLocation('/admin/dashboard');
        } else {
          setLocation('/mentee/dashboard');
        }
        return;
      }

      console.log('ProtectedRoute: Access granted');
      setHasAccess(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [requiredRole, redirectTo, setLocation]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}