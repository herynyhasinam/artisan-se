import { FormEvent, useEffect, useState } from 'react';
import { Artisan, fetchArtisans, recommendArtisan } from '../api';

export default function Home() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [trade, setTrade] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [error, setError] = useState('');

  const load = () =>
    fetchArtisans(trade, neighborhood).then(setArtisans).catch((e) => setError(e.message));

  useEffect(() => { load(); }, []);

  const onSearch = (e: FormEvent) => { e.preventDefault(); setError(''); load(); };

  const onRecommend = async (id: number) => {
    const updated = await recommendArtisan(id);
    setArtisans((list) => list.map((a) => (a.id === id ? updated : a)));
  };

  return (
    <>
      <h1>Trouver un artisan</h1>
      <form onSubmit={onSearch} className="row search">
        <input aria-label="Métier" placeholder="Métier (ex : soudeur)" value={trade} onChange={(e) => setTrade(e.target.value)} />
        <input aria-label="Quartier" placeholder="Quartier" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
        <button className="btn btn-primary" type="submit">Rechercher</button>
      </form>
      {error && <p role="alert" className="error">{error}</p>}
      {artisans.length === 0 && <p>Aucun artisan trouvé.</p>}
      {artisans.map((a) => (
        <article key={a.id} className="card">
          <h3>{a.name} <small>· {a.trade}</small></h3>
          <p>{a.neighborhood}, {a.city}</p>
          {a.description && <p>{a.description}</p>}
          <div className="row">
            <a className="btn btn-primary" href={`tel:${a.phone}`}>Appeler</a>
            <button className="btn btn-ghost" onClick={() => onRecommend(a.id)}>
              👍 Je recommande ({a.recommendations})
            </button>
          </div>
        </article>
      ))}
    </>
  );
}
