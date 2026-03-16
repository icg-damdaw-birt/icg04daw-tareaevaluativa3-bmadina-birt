// Tipos compartidos entre componentes Svelte y servicios API.
export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends Credentials {
  confirmPassword?: string;
}

export interface Movie {
  id: string;
  title: string;
  director: string;
  posterUrl?: string | null;
  year?: number | null;
  isFavorite?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  // TODO (UD4 - Ejercicio): añadir rating?: number
}

export interface MoviePayload {
  title: string;
  director: string;
  posterUrl?: string;
  year: number;
}

export interface MovieFormSubmit extends MoviePayload {
  id?: string;
}

export interface LoginResponse {
  token: string;
}

export interface ApiErrorPayload {
  error?: string;
  message?: string;
  [key: string]: unknown;
}
