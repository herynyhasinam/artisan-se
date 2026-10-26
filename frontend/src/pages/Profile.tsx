import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { changePassword, fetchProfile, Profile as ProfileData, updateProfile, UpdateProfileInput } from '../api';
import { useAuth } from '../auth/AuthContext';
import Field from '../components/Field';

const ROLE_LABEL = { USER: 'Utilisateur', ARTISAN: 'Artisan' };

export default function Profile() {
  const { updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile().then(setProfile).catch((e) => setError(e.message));
  }, []);

  if (!profile) {
    return error ? <p role="alert" className="error">{error}</p> : <p className="center">Chargement…</p>;
  }

  return (
    <>
      <h1>Mon profil</h1>
      <InfoCard
        profile={profile}
        onSaved={(p) => {
          setProfile(p);
          updateUser({ id: p.id, name: p.name, email: p.email, role: p.role });
        }}
      />
      <PasswordCard />
      {profile.artisan && <ArtisanCard artisan={profile.artisan} />}
      <button
        className="btn btn-ghost"
        onClick={() => {
          logout();
          navigate('/connexion', { replace: true });
        }}
      >
        Se déconnecter
      </button>
    </>
  );
}

/* ---------- Informations du compte ---------- */
function InfoCard({ profile, onSaved }: { profile: ProfileData; onSaved: (p: ProfileData) => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const emailChanged = email.trim().toLowerCase() !== profile.email;

  const startEditing = () => {
    setName(profile.name);
    setEmail(profile.email);
    setCurrentPassword('');
    setError('');
    setNotice('');
    setEditing(true);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const payload: UpdateProfileInput = {};
      if (name.trim() !== profile.name) payload.name = name.trim();
      if (emailChanged) {
        payload.email = email.trim();
        payload.currentPassword = currentPassword;
      }
      if (Object.keys(payload).length === 0) {
        setEditing(false);
        return;
      }
      onSaved(await updateProfile(payload));
      setEditing(false);
      setNotice('Profil mis à jour.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <h2>Informations</h2>
      {notice && <p role="status" className="notice">{notice}</p>}

      {!editing ? (
        <>
          <dl className="profile-list">
            <dt>Nom</dt><dd>{profile.name}</dd>
            <dt>Email</dt><dd>{profile.email}</dd>
            <dt>Compte</dt><dd>{ROLE_LABEL[profile.role]}</dd>
            <dt>Membre depuis</dt>
            <dd>{new Date(profile.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</dd>
          </dl>
          <button className="btn btn-ghost" onClick={startEditing}>Modifier</button>
        </>
      ) : (
        <form onSubmit={submit}>
          <Field label="Nom" required minLength={2} maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
          <Field label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          {emailChanged && (
            <Field label="Mot de passe actuel" type="password" autoComplete="current-password" required
              hint="Demandé pour changer d'email" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          )}
          {error && <p role="alert" className="error">{error}</p>}
          <div className="actions">
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</button>
            <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)}>Annuler</button>
          </div>
        </form>
      )}
    </section>
  );
}

/* ---------- Mot de passe ---------- */
function PasswordCard() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const close = () => {
    setOpen(false);
    setCurrent('');
    setNext('');
    setConfirm('');
    setError('');
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (next !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setBusy(true);
    try {
      await changePassword({ currentPassword: current, newPassword: next });
      close();
      setNotice('Mot de passe modifié.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <h2>Mot de passe</h2>
      {notice && <p role="status" className="notice">{notice}</p>}
      {!open ? (
        <button className="btn btn-ghost" onClick={() => { setNotice(''); setOpen(true); }}>Changer le mot de passe</button>
      ) : (
        <form onSubmit={submit}>
          <Field label="Mot de passe actuel" type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
          <Field label="Nouveau mot de passe" type="password" autoComplete="new-password" required minLength={8} maxLength={72} hint="8 caractères minimum" value={next} onChange={(e) => setNext(e.target.value)} />
          <Field label="Confirmer le nouveau mot de passe" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          {error && <p role="alert" className="error">{error}</p>}
          <div className="actions">
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Modification…' : 'Modifier'}</button>
            <button className="btn btn-ghost" type="button" onClick={close}>Annuler</button>
          </div>
        </form>
      )}
    </section>
  );
}

/* ---------- Résumé de la fiche (comptes ARTISAN) ---------- */
function ArtisanCard({ artisan }: { artisan: NonNullable<ProfileData['artisan']> }) {
  return (
    <section className="card">
      <h2>Ma fiche artisan</h2>
      <dl className="profile-list">
        <dt>Nom affiché</dt><dd>{artisan.name}</dd>
        <dt>Métier</dt><dd>{artisan.trade}</dd>
        <dt>Lieu</dt><dd>{artisan.neighborhood}, {artisan.city}</dd>
        <dt>Téléphone</dt><dd>{artisan.phone}</dd>
        <dt>Recommandations</dt><dd>{artisan.recommendations}</dd>
      </dl>
      <Link to="/ma-fiche" className="btn btn-ghost">Modifier ma fiche</Link>
    </section>
  );
}
