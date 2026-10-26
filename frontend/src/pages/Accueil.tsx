import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Artisan, fetchArtisans, fetchMyArtisan, MyArtisan } from '../api';
import { useAuth } from '../auth/AuthContext';
import ArtisanCard from '../components/ArtisanCard';

export default function Accueil() {
  const { user } = useAuth();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [mine, setMine] = useState<MyArtisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArtisans()
      .then(setArtisans)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    if (user?.role === 'ARTISAN') fetchMyArtisan().then(setMine).catch(() => undefined);
  }, [user?.role]);

  // Métiers les plus représentés
  const counts = artisans.reduce<Record<string, number>>((acc, a) => {
    const k = a.trade.trim().toLowerCase();
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
  const trades = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([t]) => t);

  // Mieux recommandés (la liste arrive déjà triée) et nouveaux arrivants
  const best = artisans.filter((a) => a.recommendations > 0).slice(0, 3);
  const bestIds = new Set(best.map((a) => a.id));
  const recent = [...artisans]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .filter((a) => !bestIds.has(a.id))
    .slice(0, 3);

  const firstName = user?.name.split(' ')[0];

  return (
    <>
      <h1>Bonjour, {firstName}</h1>

      {mine && (
        <div className="card">
          <h2>Votre fiche</h2>
          <p>{mine.trade} · {mine.neighborhood}</p>
          <p>👍 {mine.recommendations} recommandation{mine.recommendations > 1 ? 's' : ''}</p>
          <Link className="btn btn-ghost" to="/ma-fiche">Modifier ma fiche</Link>
        </div>
      )}

      {error && <p role="alert" className="error">{error}</p>}
      {loading && <p className="muted">Chargement…</p>}
      {!loading && artisans.length === 0 && !error && <p>Aucun artisan pour le moment.</p>}

      {trades.length > 0 && (
        <>
          <h2>Métiers</h2>
          <div className="chips">
            {trades.map((t) => (
              <Link key={t} className="chip" to={`/explorer?trade=${encodeURIComponent(t)}`}>{t}</Link>
            ))}
          </div>
        </>
      )}

      {best.length > 0 && (
        <>
          <h2>Les mieux recommandés</h2>
          {best.map((a) => <ArtisanCard key={a.id} artisan={a} />)}
        </>
      )}

      {recent.length > 0 && (
        <>
          <h2>Nouveaux</h2>
          {recent.map((a) => <ArtisanCard key={a.id} artisan={a} />)}
        </>
      )}

      {artisans.length > 0 && <p><Link to="/explorer">Voir tous les artisans</Link></p>}
    </>
  );
}
