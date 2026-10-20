import { useEffect, useState } from 'react';
import { Artisan, createArtisan, fetchArtisans, recommendArtisan } from './api';

const emptyForm = {
  name: '', trade: '', neighborhood: '', city: '', phone: '', description: '', consent: false,
};

export default function App() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [trade, setTrade] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = () =>
    fetchArtisans(trade, neighborhood).then(setArtisans).catch((e) => setError(e.message));

  useEffect(() => { load(); }, []);

  const onSearch = (e: React.FormEvent) => { e.preventDefault(); load(); };

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createArtisan(form);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const onRecommend = async (id: number) => {
    const updated = await recommendArtisan(id);
    setArtisans((list) => list.map((a) => (a.id === id ? updated : a)));
  };

  const set = (k: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value });

  return (
    <main>
      <h1>Annuaire des artisans</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={onSearch} className="row">
        <input placeholder="Métier (ex: soudeur)" value={trade} onChange={(e) => setTrade(e.target.value)} />
        <input placeholder="Quartier" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
        <button type="submit">Rechercher</button>
      </form>

      <section>
        {artisans.length === 0 && <p>Aucun artisan trouvé.</p>}
        {artisans.map((a) => (
          <article key={a.id} className="card">
            <h3>{a.name} <small>· {a.trade}</small></h3>
            <p>{a.neighborhood}, {a.city}</p>
            {a.description && <p>{a.description}</p>}
            <div className="row">
              <a href={`tel:${a.phone}`}>Appeler</a>
              <button onClick={() => onRecommend(a.id)}>👍 Je recommande ({a.recommendations})</button>
            </div>
          </article>
        ))}
      </section>

      <h2>Ajouter un artisan</h2>
      <form onSubmit={onAdd} className="col">
        <input required placeholder="Nom" value={form.name} onChange={set('name')} />
        <input required placeholder="Métier" value={form.trade} onChange={set('trade')} />
        <input required placeholder="Quartier" value={form.neighborhood} onChange={set('neighborhood')} />
        <input required placeholder="Ville" value={form.city} onChange={set('city')} />
        <input required placeholder="Téléphone" value={form.phone} onChange={set('phone')} />
        <textarea placeholder="Description (facultatif)" value={form.description} onChange={set('description')} />
        <label>
          <input type="checkbox" checked={form.consent} onChange={set('consent')} /> L’artisan est d’accord pour être publié
        </label>
        <button type="submit" disabled={!form.consent}>Ajouter</button>
      </form>
    </main>
  );
}
