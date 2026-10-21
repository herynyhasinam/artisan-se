import { FormEvent, useState } from 'react';
import { ArtisanInput } from '../api';
import Field from './Field';

interface Props {
  initial?: Partial<ArtisanInput>;
  submitLabel: string;
  onSubmit: (values: ArtisanInput) => Promise<void>;
}

export default function ArtisanForm({ initial, submitLabel, onSubmit }: Props) {
  const [v, setV] = useState({
    name: initial?.name ?? '',
    trade: initial?.trade ?? '',
    neighborhood: initial?.neighborhood ?? '',
    city: initial?.city ?? '',
    phone: initial?.phone ?? '',
    description: initial?.description ?? '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const bind = (k: keyof typeof v) => ({
    value: v[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value }),
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onSubmit({ ...v, description: v.description.trim() || undefined });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <Field label="Nom" required {...bind('name')} />
      <Field label="Métier" required {...bind('trade')} />
      <Field label="Quartier" required {...bind('neighborhood')} />
      <Field label="Ville" required {...bind('city')} />
      <Field label="Téléphone" type="tel" required hint="Ex : 034 12 345 67" {...bind('phone')} />
      <div className="field">
        <label htmlFor="desc">Description (facultatif)</label>
        <textarea id="desc" maxLength={300} value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} />
      </div>
      {error && <p role="alert" className="error">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? 'Envoi…' : submitLabel}
      </button>
    </form>
  );
}
