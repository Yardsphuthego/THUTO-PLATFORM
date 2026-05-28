import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SuperAdminDashboard } from './SuperAdminDashboard';

export function AdminDashboard(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'super_admin') {
      navigate('/super-admin', { replace: true });
      return;
    }

    if (user?.role === 'student') {
      navigate('/elections', { replace: true });
    }
  }, [navigate, user?.role]);

  return <SuperAdminDashboard />;
}
