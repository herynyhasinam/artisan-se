export interface Artisan {
  id: number;
  name: string;
  trade: string;
  neighborhood: string;
  city: string;
  phone: string;
  description?: string | null;
  recommendations: number;
}

export type NewArtisan = Omit<Artisan, 'id' | 'recommendations'> & { consent: boolean };

const BASE = '/api';

export async function fetchArtisans(trade = '', neighborhood = ''): Promise<Artisan[]> {
  const params = new URLSearchParams();
  if (trade) params.set('trade', trade);
  if (neighborhood) params.set('neighborhood', neighborhood);
  const res = await fetch(`${BASE}/artisans?${params}`);
  if (!res.ok) throw new Error('Erreur de chargement');
  return res.json();
}

export async function createArtisan(data: NewArtisan): Promise<Artisan> {
  const res = await fetch(`${BASE}/artisans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Impossible d’ajouter la fiche');
  return res.json();
}

export async function recommendArtisan(id: number): Promise<Artisan> {
  const res = await fetch(`${BASE}/artisans/${id}/recommend`, { method: 'POST' });
  if (!res.ok) throw new Error('Erreur');
  return res.json();
}
