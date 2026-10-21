import { FormEvent, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { RegisterInput } from '../api';
import { useAuth } from '../auth/AuthContext';
import Field from '../components/Field';
import AuthLayout from '../components/AuthLayout';

type AccountType = 'USER' | 'ARTISAN';

export default function Register() {
  const { user, register } = useAuth();
  const [accountType, setAccountType] = useState<AccountType>('USER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [trade, setTrade] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={user.role === 'ARTISAN' ? '/ma-fiche' : '/'} replace />;

  const isArtisan = accountType === 'ARTISAN';

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    const data: RegisterInput = { name, email, password, accountType };
    if (isArtisan) {
      Object.assign(data, { trade, neighborhood, city, phone, description: description.trim() || undefined });
    }
    setBusy(true);
    try {
      await register(data);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  const choice = (type: AccountType, label: string) => (
    <label className={accountType === type ? 'selected' : ''}>
      <input type="radio" name="accountType" checked={accountType === type} onChange={() => setAccountType(type)} />
      {label}
    </label>
  );

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={onSubmit}>
        <h1>Créer un compte</h1>

        <fieldset className="choice">
          <legend>Type de compte</legend>
          {choice('USER', 'Je cherche un artisan')}
          {choice('ARTISAN', 'Je suis artisan')}
        </fieldset>

        <Field label="Nom" autoComplete="name" required minLength={2} maxLength={100}
          hint={isArtisan ? 'Ce nom sera affiché sur votre fiche' : undefined}
          value={name} onChange={(e) => setName(e.target.value)} />
        <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Mot de passe" type="password" autoComplete="new-password" required minLength={8} maxLength={72} hint="8 caractères minimum" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Field label="Confirmer le mot de passe" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />

        {isArtisan && (
          <>
            <h2>Votre activité</h2>
            <Field label="Métier" required value={trade} onChange={(e) => setTrade(e.target.value)} />
            <Field label="Quartier" required value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
            <Field label="Ville" required value={city} onChange={(e) => setCity(e.target.value)} />
            <Field label="Téléphone" type="tel" required hint="Ex : 034 12 345 67" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <div className="field">
              <label htmlFor="desc">Description (facultatif)</label>
              <textarea id="desc" maxLength={300} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </>
        )}

        {error && <p role="alert" className="error">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? 'Création…' : isArtisan ? 'Créer mon compte artisan' : "S'inscrire"}
        </button>
        <p className="alt">Déjà un compte ? <Link to="/connexion">Se connecter</Link></p>
      </form>
    </AuthLayout>
  );
}
