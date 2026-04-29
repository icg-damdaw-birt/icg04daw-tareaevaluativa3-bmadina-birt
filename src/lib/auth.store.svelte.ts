/**
 * AUTH STORE - Gestión de autenticación (Svelte 5 Runes)
 * 
 * Mantiene el token JWT y lo persiste en localStorage.
 * Usa runes para reactividad moderna.
 */

import { browser } from '$app/environment';

const TOKEN_STORAGE_KEY = 'mivideoteca-token';

function getStorage(): Storage | null {
  if (!browser) return null;

  const storage = window.localStorage as Partial<Storage> | undefined;
  if (
    !storage ||
    typeof storage.getItem !== 'function' ||
    typeof storage.setItem !== 'function' ||
    typeof storage.removeItem !== 'function'
  ) {
    return null;
  }

  return storage as Storage;
}

// Persistencia: guarda el token en localStorage (solo en el navegador)
// SSR safety: no accede a localStorage durante server-side rendering
function persist(value: string | null) {
  const storage = getStorage();
  if (!storage) return;

  if (value) {
    storage.setItem(TOKEN_STORAGE_KEY, value);
  } else {
    storage.removeItem(TOKEN_STORAGE_KEY);
  }
}

// Recupera el token persistido para restaurar sesiones tras recargar
function readPersistedToken(): string | null {
  const storage = getStorage();
  if (!storage) return null;
  return storage.getItem(TOKEN_STORAGE_KEY);
}

// Estado reactivo global con Svelte 5 runes
let token = $state<string | null>(readPersistedToken());

// API pública del store
export const authToken = {
  // Getter reactivo - usar como: authToken.value
  get value() {
    return token;
  },

  // Setter con persistencia
  set(value: string | null) {
    token = value;
    persist(value);
  },

  // Limpia el token (logout)
  clear() {
    token = null;
    persist(null);
  },

  // Refresca desde localStorage (útil para sincronización entre pestañas)
  refreshFromStorage() {
    token = readPersistedToken();
  }
};
