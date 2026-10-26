import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Artisan, fetchArtisans } from '../api';
import ArtisanCard from '../components/ArtisanCard';

export default function Explorer() {
  const [params, setParams] = useSearchParams();
  const [trade, setTrade] = useState(params.get('trade') ?? '');
  const [neighborhood, setNeighborhood] = useState(params.get('neighborhood') ?? '');
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = (t: string, n: string) => {
    setLoading(true);
    setError('');
    fetchArtisans(t, n)
      .then(setArtisans)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(trade, neighborhood); }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (trade) next.trade = trade;
    if (neighborhood) next.neighborhood = neighborhood;
    setParams(next);
    load(trade, neighborhood);
  };

  return (
    <>
      <h1>Explorer</h1>
      <form onSubmit={onSearch} className="row search">
        <input aria-label="Métier" placeholder="Métier (ex : soudeur)" value={trade} onChange={(e) => setTrade(e.target.value)} />
        <input aria-label="Quartier" placeholder="Quartier" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
        <button className="btn btn-primary" type="submit">Rechercher</button>
      </form>
      {error && <p role="alert" className="error">{error}</p>}
      {loading && <p className="muted">Chargement…</p>}
      {!loading && artisans.length === 0 && !error && <p>Aucun artisan trouvé.</p>}
      {artisans.map((a) => <ArtisanCard key={a.id} artisan={a} />)}
    </>
  );
}
