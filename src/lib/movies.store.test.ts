/**
 * TESTS DEL MOVIES STORE (Svelte 5 Runes)
 * 
 * Tests para las operaciones CRUD de películas.
 * El store consume api.service para las llamadas HTTP.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock de $app/environment ANTES de importar el store
vi.mock('$app/environment', () => ({ browser: true }));

// Mock del api.service — mockeamos los métodos que usa el store
vi.mock('./api.service', () => ({
  api: {
    getMovies: vi.fn(),
    createMovie: vi.fn(),
    updateMovie: vi.fn(),
    deleteMovie: vi.fn(),
    toggleFavorite: vi.fn(),
  }
}));

// Mock de localStorage (requerido por auth.store.svelte que importa api.service)
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Importar DESPUÉS de configurar los mocks
import { moviesStore } from './movies.store.svelte';
import { api } from './api.service';
import type { Movie, MoviePayload } from './types';

// ── Datos de prueba ──────────────────────────────────────────────
const mockMovies: Movie[] = [
  { id: '1', title: 'Inception', director: 'Christopher Nolan', year: 2010 },
  { id: '2', title: 'The Matrix', director: 'Wachowski Sisters', year: 1999 },
  { id: '3', title: 'Pulp Fiction', director: 'Quentin Tarantino', year: 1994 },
];

const newPayload: MoviePayload = {
  title: 'Interstellar',
  director: 'Christopher Nolan',
  year: 2014,
};
const createdMovie: Movie = { id: '4', ...newPayload };

const updatePayload: MoviePayload = {
  title: "Inception (Director's Cut)",
  director: 'Christopher Nolan',
  year: 2010,
};
const updatedMovie: Movie = { id: '1', ...updatePayload };

// ── Tests ────────────────────────────────────────────────────────
describe('Movies Store (Svelte 5 Runes)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    moviesStore.reset();
  });

  // ─── loadMovies ────────────────────────────────────────────────
  describe('loadMovies()', () => {
    it('debería cargar las películas desde la API', async () => {
      // ARRANGE
      vi.mocked(api.getMovies).mockResolvedValue(mockMovies);

      // ACT
      await moviesStore.loadMovies();

      // ASSERT
      expect(api.getMovies).toHaveBeenCalledOnce();
      expect(moviesStore.movies).toEqual(mockMovies);
    });

    it('debería poner loading=false y error=null al terminar con éxito', async () => {
      vi.mocked(api.getMovies).mockResolvedValue(mockMovies);

      await moviesStore.loadMovies();

      expect(moviesStore.loading).toBe(false);
      expect(moviesStore.error).toBeNull();
    });

    it('debería manejar error al cargar películas', async () => {
      vi.mocked(api.getMovies).mockRejectedValue(new Error('Network error'));

      await moviesStore.loadMovies();

      expect(moviesStore.error).toBe('Network error');
      expect(moviesStore.loading).toBe(false);
      expect(moviesStore.movies).toEqual([]);
    });

    it('debería devolver lista vacía si no hay películas', async () => {
      vi.mocked(api.getMovies).mockResolvedValue([]);

      await moviesStore.loadMovies();

      expect(moviesStore.movies).toEqual([]);
      expect(moviesStore.loading).toBe(false);
    });
  });

  // ─── createMovie ──────────────────────────────────────────────
  describe('createMovie()', () => {
    it('debería crear una película y agregarla al store', async () => {
      // Cargamos estado inicial
      vi.mocked(api.getMovies).mockResolvedValue([...mockMovies]);
      await moviesStore.loadMovies();

      vi.mocked(api.createMovie).mockResolvedValue(createdMovie);

      const ok = await moviesStore.createMovie(newPayload);

      expect(api.createMovie).toHaveBeenCalledWith(newPayload);
      expect(ok).toBe(true);
      expect(moviesStore.movies).toContainEqual(createdMovie);
    });

    it('debería incrementar el número de películas al crear una nueva', async () => {
      vi.mocked(api.getMovies).mockResolvedValue([...mockMovies]);
      await moviesStore.loadMovies();
      const initialCount = moviesStore.movies.length;

      vi.mocked(api.createMovie).mockResolvedValue(createdMovie);
      await moviesStore.createMovie(newPayload);

      expect(moviesStore.movies.length).toBe(initialCount + 1);
    });

    it('debería manejar error al crear una película', async () => {
      vi.mocked(api.createMovie).mockRejectedValue(new Error('Validation error'));

      const ok = await moviesStore.createMovie(newPayload);

      expect(ok).toBe(false);
      expect(moviesStore.error).toBe('Validation error');
      expect(moviesStore.mutating).toBe(false);
    });
  });

  // ─── updateMovie ──────────────────────────────────────────────
  describe('updateMovie()', () => {
    it('debería actualizar una película existente en el store', async () => {
      vi.mocked(api.getMovies).mockResolvedValue([...mockMovies]);
      await moviesStore.loadMovies();

      vi.mocked(api.updateMovie).mockResolvedValue(updatedMovie);

      const ok = await moviesStore.updateMovie('1', updatePayload);

      expect(api.updateMovie).toHaveBeenCalledWith('1', updatePayload);
      expect(ok).toBe(true);

      const movie = moviesStore.movies.find(m => m.id === '1');
      expect(movie?.title).toBe("Inception (Director's Cut)");
    });

    it('no debería cambiar el número de películas al actualizar', async () => {
      vi.mocked(api.getMovies).mockResolvedValue([...mockMovies]);
      await moviesStore.loadMovies();
      const initialCount = moviesStore.movies.length;

      vi.mocked(api.updateMovie).mockResolvedValue(updatedMovie);
      await moviesStore.updateMovie('1', updatePayload);

      expect(moviesStore.movies.length).toBe(initialCount);
    });

    it('debería manejar error al actualizar una película', async () => {
      vi.mocked(api.updateMovie).mockRejectedValue(new Error('Not found'));

      const ok = await moviesStore.updateMovie('999', updatePayload);

      expect(ok).toBe(false);
      expect(moviesStore.error).toBe('Not found');
      expect(moviesStore.mutating).toBe(false);
    });
  });

  // ─── deleteMovie ──────────────────────────────────────────────
  describe('deleteMovie()', () => {
    it('debería eliminar una película del store', async () => {
      vi.mocked(api.getMovies).mockResolvedValue([...mockMovies]);
      await moviesStore.loadMovies();

      vi.mocked(api.deleteMovie).mockResolvedValue(undefined);

      const ok = await moviesStore.deleteMovie('1');

      expect(api.deleteMovie).toHaveBeenCalledWith('1');
      expect(ok).toBe(true);
      expect(moviesStore.movies.find(m => m.id === '1')).toBeUndefined();
    });

    it('debería decrementar el número de películas al eliminar', async () => {
      vi.mocked(api.getMovies).mockResolvedValue([...mockMovies]);
      await moviesStore.loadMovies();
      const initialCount = moviesStore.movies.length;

      vi.mocked(api.deleteMovie).mockResolvedValue(undefined);
      await moviesStore.deleteMovie('2');

      expect(moviesStore.movies.length).toBe(initialCount - 1);
    });

    it('debería manejar error al eliminar una película', async () => {
      vi.mocked(api.deleteMovie).mockRejectedValue(new Error('Forbidden'));

      const ok = await moviesStore.deleteMovie('999');

      expect(ok).toBe(false);
      expect(moviesStore.error).toBe('Forbidden');
      expect(moviesStore.mutating).toBe(false);
    });
  });

  // ─── toggleFavorite ───────────────────────────────────────────
  describe('toggleFavorite()', () => {
    it('debería marcar como favorita una película que no lo es', async () => {
      // ARRANGE
      const moviesWithFav: Movie[] = [
        { id: '1', title: 'Inception', director: 'Christopher Nolan', year: 2010, isFavorite: false },
        { id: '2', title: 'The Matrix', director: 'Wachowski Sisters', year: 1999 },
      ];
      vi.mocked(api.getMovies).mockResolvedValue([...moviesWithFav]);
      await moviesStore.loadMovies();

      const toggled: Movie = { ...moviesWithFav[0], isFavorite: true };
      vi.mocked(api.toggleFavorite).mockResolvedValue(toggled);

      // ACT
      const ok = await moviesStore.toggleFavorite('1');

      // ASSERT
      expect(api.toggleFavorite).toHaveBeenCalledWith('1');
      expect(ok).toBe(true);
      expect(moviesStore.movies.find(m => m.id === '1')?.isFavorite).toBe(true);
    });

    it('debería desmarcar como favorita una película que ya lo es', async () => {
      // ARRANGE
      const moviesWithFav: Movie[] = [
        { id: '1', title: 'Inception', director: 'Christopher Nolan', year: 2010, isFavorite: true },
      ];
      vi.mocked(api.getMovies).mockResolvedValue([...moviesWithFav]);
      await moviesStore.loadMovies();

      const toggled: Movie = { ...moviesWithFav[0], isFavorite: false };
      vi.mocked(api.toggleFavorite).mockResolvedValue(toggled);

      // ACT
      const ok = await moviesStore.toggleFavorite('1');

      // ASSERT
      expect(ok).toBe(true);
      expect(moviesStore.movies.find(m => m.id === '1')?.isFavorite).toBe(false);
    });

    it('no debería cambiar el número de películas al alternar favorito', async () => {
      // ARRANGE
      vi.mocked(api.getMovies).mockResolvedValue([...mockMovies]);
      await moviesStore.loadMovies();
      const initialCount = moviesStore.movies.length;

      const toggled: Movie = { ...mockMovies[0], isFavorite: true };
      vi.mocked(api.toggleFavorite).mockResolvedValue(toggled);

      // ACT
      await moviesStore.toggleFavorite('1');

      // ASSERT
      expect(moviesStore.movies.length).toBe(initialCount);
    });

    it('debería manejar error al alternar favorito', async () => {
      // ARRANGE
      vi.mocked(api.toggleFavorite).mockRejectedValue(new Error('Not found'));

      // ACT
      const ok = await moviesStore.toggleFavorite('999');

      // ASSERT
      expect(ok).toBe(false);
      expect(moviesStore.error).toBe('Not found');
      expect(moviesStore.mutating).toBe(false);
    });
  });
});

/**
 * NOTAS PARA ESTUDIANTES (Svelte 5):
 * 
 * 1. Mock de api (no apiService)
 *    - El store importa { api } de './api.service'
 *    - Mockeamos cada método: getMovies, createMovie, updateMovie, deleteMovie
 * 
 * 2. IDs son strings
 *    - La interfaz Movie usa id: string (viene del backend MongoDB/UUID)
 * 
 * 3. moviesStore.reset()
 *    - Limpia movies, loading, mutating y error entre tests
 * 
 * 4. Retorno booleano en create/update/delete
 *    - true = operación exitosa
 *    - false = hubo un error (revisar moviesStore.error)
 * 
 * 5. mutating vs loading
 *    - loading: se usa en loadMovies (lectura)
 *    - mutating: se usa en create/update/delete (escritura)
 */
