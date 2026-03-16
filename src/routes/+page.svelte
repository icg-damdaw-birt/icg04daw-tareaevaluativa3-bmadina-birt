<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  import { authToken, moviesStore } from '$lib';
  import MovieCard from '$lib/components/MovieCard.svelte';
  import MovieForm from '$lib/components/MovieForm.svelte';
  import type { Movie, MovieFormSubmit, MoviePayload } from '$lib/types';

  // Estado local de la página (concerns de UI, no de negocio)
  let editingMovie = $state<Movie | null>(null);
  let feedbackMessage = $state<{ type: 'error' | 'info'; text: string } | null>(null);

  // Lifecycle: carga inicial solo en el navegador
  onMount(() => {
    if (!browser) return;

    // Guard de autenticación: redirige si no hay token
    if (!authToken.value) {
      goto('/login');
      return;
    }

    // Carga las películas del usuario a través del store
    moviesStore.loadMovies();
  });

  // Redirige automáticamente si se cierra sesión
  $effect(() => {
    if (browser && !authToken.value && !moviesStore.loading) {
      goto('/login');
    }
  });

  // Refleja errores del store en el feedback de la página
  $effect(() => {
    if (moviesStore.error) {
      feedbackMessage = { type: 'error', text: moviesStore.error };
    }
  });

  // Maneja el envío del formulario: decide si crear o actualizar película
  async function handleFormSubmit(data: MovieFormSubmit) {
    feedbackMessage = null;
    moviesStore.clearError();

    const { id, title, director, year, posterUrl } = data;
    const payload: MoviePayload = { title, director, year, posterUrl };

    if (id) {
      // Modo edición: actualiza película existente
      const ok = await moviesStore.updateMovie(id, payload);
      if (ok) {
        feedbackMessage = { type: 'info', text: 'Película actualizada correctamente.' };
        editingMovie = null;
      }
    } else {
      // Modo creación: añade nueva película
      const ok = await moviesStore.createMovie(payload);
      if (ok) {
        feedbackMessage = { type: 'info', text: 'Película guardada correctamente.' };
      }
    }
  }

  // Alterna favorito a través del store
  async function handleToggleFavorite(id: string) {
    moviesStore.clearError();
    await moviesStore.toggleFavorite(id);
  }

  // Elimina película a través del store
  async function handleDelete(id: string) {
    feedbackMessage = null;
    moviesStore.clearError();

    const ok = await moviesStore.deleteMovie(id);
    if (ok) {
      feedbackMessage = { type: 'info', text: 'Película eliminada.' };
    }
  }

  // Abre el modo edición con los datos de la tarjeta seleccionada.
  function handleEdit(movie: Movie) {
    editingMovie = movie;
  }

  // Limpia el formulario lateral y vuelve al modo de creación.
  function handleCancelEdit() {
    editingMovie = null;
  }
</script>

<section class="container mx-auto px-4 py-8">
  <div class="mb-8 max-w-3xl">
    <h1 class="text-3xl font-bold text-slate-900">Mi Videoteca</h1>
    <p class="text-slate-600">
      Gestiona tu colección personal de películas favoritas de forma rápida y sin fricción.
    </p>
  </div>

  {#if feedbackMessage}
    <div
      class={`mb-6 rounded border px-4 py-3 text-sm ${
        feedbackMessage.type === 'error'
          ? 'border-red-300 bg-red-50 text-red-700'
          : 'border-green-300 bg-green-50 text-green-700'
      }`}
    >
      {feedbackMessage.text}
    </div>
  {/if}

  <div class="grid gap-8 lg:grid-cols-[2fr_1fr]">
    <div>
      {#if moviesStore.loading}
        <div class="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          Cargando películas...
        </div>
      {:else if moviesStore.movies.length === 0}
        <div class="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 shadow-sm">
          Tu videoteca está vacía. Añade la primera película usando el formulario.
        </div>
      {:else}
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {#each moviesStore.movies as movie (movie.id)}
            <MovieCard {movie} ondelete={handleDelete} onedit={handleEdit} ontogglefavorite={handleToggleFavorite} />
          {/each}
        </div>
      {/if}
    </div>

    <aside class="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="mb-2 text-xl font-semibold text-slate-900">
        {editingMovie ? 'Editar película' : 'Nueva película'}
      </h2>
      <p class="mb-4 text-sm text-slate-500">
        {editingMovie
          ? 'Actualiza los datos y guarda los cambios cuando estés listo.'
          : 'Completa los datos y guárdalos para verlos en la lista.'}
      </p>
      <MovieForm
        isSubmitting={moviesStore.mutating}
        bind:initialMovie={editingMovie}
        submitLabel={editingMovie ? 'Guardar cambios' : 'Añadir película'}
        showCancel={Boolean(editingMovie)}
        onsubmit={handleFormSubmit}
        oncancel={handleCancelEdit}
      />
    </aside>
  </div>
</section>
