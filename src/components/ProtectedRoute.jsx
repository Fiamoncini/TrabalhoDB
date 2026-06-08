import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Bloqueia acesso a rotas que exigem login
export default function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
