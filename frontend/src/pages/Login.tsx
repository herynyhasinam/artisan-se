import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Field from '../components/Field';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={onSubmit}>
        <h1>Connexion</h1>
        <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Mot de passe" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p role="alert" className="error">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>
        <p className="alt">Pas encore de compte ? <Link to="/inscription">S'inscrire</Link></p>
      </form>
    </AuthLayout>
  );
}
