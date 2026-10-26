import { useState } from 'react';
import { Artisan, recommendArtisan } from '../api';

export default function ArtisanCard({ artisan: a }: { artisan: Artisan }) {
  const [count, setCount] = useState(a.recommendations);
  const [error, setError] = useState('');

  const recommend = async () => {
    setError('');
    try {
      const updated = await recommendArtisan(a.id);
      setCount(updated.recommendations);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <article className="card">
      <h3>{a.name} <small>· {a.trade}</small></h3>
      <p>{a.neighborhood}, {a.city}</p>
      {a.description && <p>{a.description}</p>}
      {error && <p role="alert" className="error">{error}</p>}
      <div className="row">
        <a className="btn btn-primary" href={`tel:${a.phone}`}>Appeler</a>
        <button className="btn btn-ghost" onClick={recommend}>👍 Je recommande ({count})</button>
      </div>
    </article>
  );
}
