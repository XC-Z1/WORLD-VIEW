import React, { useEffect, useState } from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
  fallbackRedirect?: () => void;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children, fallbackRedirect }) => {
  const verifyAuthToken = (): boolean => {
    const sessionAuth = sessionStorage.getItem('admin_authenticated') === 'true' || !!sessionStorage.getItem('admin_token');
    const localAuth = localStorage.getItem('admin_authenticated') === 'true' || !!localStorage.getItem('admin_token');
    return sessionAuth || localAuth;
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => verifyAuthToken());

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = verifyAuthToken();
      if (!isAuth) {
        setIsAuthenticated(false);
        if (fallbackRedirect) {
          fallbackRedirect();
        } else {
          if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/';
          } else if (window.location.hash.startsWith('#/admin')) {
            window.location.hash = '#/';
          }
        }
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [fallbackRedirect]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AdminGuard;
