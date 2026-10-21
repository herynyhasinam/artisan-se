import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthUser } from '../api';
import { useAuth } from './AuthContext';

interface Props {
  children: ReactNode;
  role?: AuthUser['role']; // si renseigné, seul ce type de compte peut entrer
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="center">Chargement…</p>;
  if (!user) return <Navigate to="/connexion" state={{ from: location.pathname }} replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}
