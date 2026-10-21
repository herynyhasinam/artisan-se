import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthUser, fetchMe, getToken, loginRequest, registerRequest, RegisterInput, setToken } from '../api';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Au chargement : si un token existe, on récupère l'utilisateur
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then(setUser)
      .catch(() => setToken(null)) // token expiré ou invalide
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginRequest({ email, password });
    setToken(res.accessToken);
    setUser(res.user);
  };

  const register = async (data: RegisterInput) => {
    const res = await registerRequest(data);
    setToken(res.accessToken);
    setUser(res.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
}
