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

export interface ArtisanInput {
  name: string;
  trade: string;
  neighborhood: string;
  city: string;
  phone: string;
  description?: string;
}

export type MyArtisan = ArtisanInput & {
  id: number;
  recommendations: number;
};

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  accountType: 'USER' | 'ARTISAN';
  // champs de la fiche (comptes ARTISAN uniquement)
  trade?: string;
  neighborhood?: string;
  city?: string;
  phone?: string;
  description?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ARTISAN';
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

const BASE = '/api';
const TOKEN_KEY = 'artisanse_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string | null) =>
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    let message = 'Une erreur est survenue';
    try {
      const body = await res.json();
      message = Array.isArray(body.message) ? body.message.join(', ') : body.message ?? message;
    } catch {
      /* réponse sans JSON */
    }
    throw new ApiError(message, res.status);
  }
  const text = await res.text(); // le corps est vide quand le serveur renvoie null
  return (text ? JSON.parse(text) : null) as T;
}

const json = (method: string, data?: unknown): RequestInit => ({
  method,
  body: data === undefined ? undefined : JSON.stringify(data),
});

// --- Auth ---
export const registerRequest = (data: RegisterInput) =>
  request<AuthResponse>('/auth/register', json('POST', data));

export const loginRequest = (data: { email: string; password: string }) =>
  request<AuthResponse>('/auth/login', json('POST', data));

export const fetchMe = () => request<AuthUser>('/auth/me');

// --- Annuaire ---
export function fetchArtisans(trade = '', neighborhood = ''): Promise<Artisan[]> {
  const params = new URLSearchParams();
  if (trade) params.set('trade', trade);
  if (neighborhood) params.set('neighborhood', neighborhood);
  return request<Artisan[]>(`/artisans?${params}`);
}

export const recommendArtisan = (id: number) =>
  request<Artisan>(`/artisans/${id}/recommend`, json('POST'));

// --- Ma fiche (comptes ARTISAN) ---
export const fetchMyArtisan = () => request<MyArtisan>('/artisans/me');
export const updateMyArtisan = (data: Partial<ArtisanInput>) =>
  request<MyArtisan>('/artisans/me', json('PATCH', data));
