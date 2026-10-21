import { useEffect, useState } from 'react';
import { fetchMyArtisan, MyArtisan as Mine, updateMyArtisan } from '../api';
import ArtisanForm from '../components/ArtisanForm';

export default function MyArtisan() {
  const [mine, setMine] = useState<Mine | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyArtisan()
      .then(setMine)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="center">Chargement…</p>;
  if (!mine) return <p role="alert" className="error">{error || 'Fiche introuvable.'}</p>;

  return (
    <div className="card">
      <h1>Ma fiche</h1>
      <p className="muted">Voici ce que les habitants voient de vous.</p>
      {notice && <p role="status" className="notice">{notice}</p>}
      <ArtisanForm
        initial={mine}
        submitLabel="Enregistrer"
        onSubmit={async (values) => {
          setNotice('');
          setMine(await updateMyArtisan(values));
          setNotice('Modifications enregistrées.');
        }}
      />
    </div>
  );
}
