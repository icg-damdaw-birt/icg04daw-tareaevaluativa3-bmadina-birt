[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Jmq0oH4g)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=23036287&assignment_repo_type=AssignmentRepo)
# 🌐 MiVideoteca - Web App (SvelteKit)

Aplicación web progresiva para gestionar tu colección de películas.

## 🏗️ Arquitectura

```
src/
├── lib/
│   ├── api.service.ts          # Comunicación con la API (fetch wrapper)
│   ├── api.service.test.ts     # Tests del servicio API
│   ├── auth.store.svelte.ts    # Store de autenticación (token JWT)
│   ├── auth.store.test.ts      # Tests del auth store
│   ├── movies.store.svelte.ts  # Store de películas (CRUD)
│   ├── movies.store.test.ts    # Tests del movies store
│   ├── types.ts                # Interfaces y tipos TypeScript
│   ├── index.ts                # Re-exportaciones centrales
│   └── components/
│       ├── Header.svelte       # Cabecera con navegación y logout
│       ├── MovieCard.svelte    # Tarjeta de película reutilizable
│       └── MovieForm.svelte    # Formulario de creación/edición
├── routes/
│   ├── +layout.svelte          # Layout global (Header + Footer)
│   ├── +page.svelte            # Página principal (CRUD de películas)
│   ├── login/+page.svelte      # Pantalla de login
│   └── register/+page.svelte   # Pantalla de registro
└── app.html                    # Template HTML
```

## 🚀 Características

- ✅ **Autenticación**: Login y registro con JWT
- ✅ **CRUD de películas**: Crear, leer, actualizar y eliminar
- ✅ **Persistencia de sesión**: Token guardado en localStorage
- ✅ **Gestión de estado**: Svelte 5 Runes (`$state`, `$derived`, `$effect`)
- ✅ **Tests de Auth**: Store y servicio API testeados
- ✅ **Tests de Movies**: CRUD completo testeado
- ✅ **Routing**: Sistema de rutas de SvelteKit
- ✅ **UI responsiva**: Tailwind CSS con diseño adaptable
- 🔜 **Favoritos**: Implementar + tests (UD4 - video)
- 🔜 **Rating**: Implementar + tests (UD4 - ejercicio)

---

## 🎓 Para el curso

### **UD4: Frontend Web (SvelteKit)**
**Público: DAW (obligatorio) + DAM (opcional)**

#### **Estado actual:**
- ✅ App funcionando con CRUD completo
- ✅ `auth.store.svelte.ts` testeado
- ✅ `api.service.ts` testeado (auth + peticiones autenticadas)
- ✅ `movies.store.svelte.ts` implementado y testeado
- ⏸️ Favoritos y Rating pendientes

#### **🎬 En el video harás:**
1. **Implementar Favoritos**
   - Método `toggleFavorite(id)` en store
   - UI para marcar favoritos
   - Tests de favoritos

#### **📝 Tu ejercicio:**
Implementar **Rating** (0-5 estrellas) usando IA:
- Método `rateMovie(id, rating)` en store
- UI con selector de estrellas
- Tests completos (válido e inválido)

---

## 📋 Requisitos previos

- Node.js 20 o superior
- npm 9 o superior
- VS Code con extensiones de Svelte (recomendado)
- **Backend funcionando** (complétalo primero en UD3)

---

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd mivideoteca-web
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Crea el archivo .env en la raíz del proyecto
cp .env.example .env
```

Edita `.env` con la URL de tu backend:
```env
# UD4: Desarrollo local
PUBLIC_API_URL=http://localhost:3000

# UD5: Producción
# PUBLIC_API_URL=https://tu-api.onrender.com
```

---

## ▶️ Ejecutar la aplicación

### Desarrollo (conecta a backend local)
```bash
# Modo desarrollo con hot reload
npm run dev

# Con host específico (para acceder desde otros dispositivos)
npm run dev -- --host

# La app estará disponible en: http://localhost:5173
```

### Preview (simula producción)
```bash
# Build + preview
npm run build
npm run preview
```

---

## 🧪 Testing

### Ejecutar todos los tests
```bash
# Modo watch (re-ejecuta automáticamente)
npm test

# Ejecutar una vez
npm run test:run

# Con interfaz visual (recomendado para debugging)
npm run test:ui
```

### Ejecutar tests específicos
```bash
# Solo tests de api.service
npm test -- api.service

# Solo tests de auth.store
npm test -- auth.store

# Solo tests de movies.store
npm test -- movies.store

# Tests con verbose
npm test -- --reporter=verbose
```

### Estado actual de tests
```bash
npm test

# ✅ auth.store.test.ts    (3 tests) - Token: set, clear, refreshFromStorage
# ✅ api.service.test.ts   (7 tests) - Login, registro, auth headers, errores HTTP
# ✅ movies.store.test.ts (12 tests) - loadMovies, createMovie, updateMovie, deleteMovie
```

### Interfaz visual de tests
```bash
# Abre una UI web interactiva
npm run test:ui

# Navega a: http://localhost:51204/__vitest__/
```

---

## 🏗️ Build para producción (UD5)

### Generar build estático
```bash
# Build optimizado para producción
npm run build

# Los archivos estarán en: build/
```

### Previsualizar build de producción
```bash
npm run preview
```

---

## 📚 Estructura del proyecto

### Stores (Gestión de Estado con Svelte 5 Runes)
- **[`authToken`](src/lib/auth.store.svelte.ts)**: Maneja el token JWT y su persistencia en localStorage
- **[`moviesStore`](src/lib/movies.store.svelte.ts)**: Gestión centralizada de películas (CRUD)

### Services
- **[`api`](src/lib/api.service.ts)**: Wrapper sobre `fetch` con auth automática, manejo de errores y serialización JSON

### Componentes
- **[`Header`](src/lib/components/Header.svelte)**: Navegación con estado de autenticación
- **[`MovieCard`](src/lib/components/MovieCard.svelte)**: Tarjeta reutilizable con acciones de editar/eliminar
- **[`MovieForm`](src/lib/components/MovieForm.svelte)**: Formulario para crear y editar películas

### Tipos
- **[`types.ts`](src/lib/types.ts)**: Interfaces compartidas (`Movie`, `MoviePayload`, `Credentials`, etc.)

### Arquitectura de datos

Ejemplo en un componente con Svelte 5 Runes:
```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { moviesStore } from '$lib';

  onMount(() => {
    moviesStore.loadMovies();
  });
</script>

{#if moviesStore.loading}
  <p>Cargando...</p>
{:else}
  {#each moviesStore.movies as movie}
    <div>{movie.title}</div>
  {/each}
{/if}
```

### Routing
SvelteKit usa **file-based routing**:
- `/` → `src/routes/+page.svelte` (página principal con CRUD)
- `/login` → `src/routes/login/+page.svelte`
- `/register` → `src/routes/register/+page.svelte`

### Layouts
- **`+layout.svelte`**: Layout global con Header y Footer

---

## 🔄 Flujo de datos

```
UI (Svelte Components)
    ↓ Lee/Modifica stores
Stores (authToken, moviesStore)  ← Svelte 5 Runes ($state, $derived)
    ↓ Llama funciones
Services (api)
    ↓ fetch() HTTP Request
Backend API (Express)
    ↓ Respuesta
Service → Store → UI (reactividad automática)
```

---

## 🆚 Equivalencia entre proyectos

| Componente | SvelteKit | Flutter | Express |
|------------|-----------|---------|---------|
| **Auth** | `auth.store.svelte.ts` | `auth_provider.dart` | `authController.js` |
| **Auth Tests** | ✅ Implementado | ✅ Implementado | ✅ Implementado |
| **Movies** | `movies.store.svelte.ts` | `movie_provider.dart` | `movieController.js` |
| **Movies Tests** | ✅ Implementado | ⏸️ UD4 (video) | ⏸️ UD3 (video) |
| **Favoritos** | ⏸️ UD4 (video) | ⏸️ UD4 (video) | ⏸️ UD3 (video) |
| **Rating** | ⏸️ UD4 (ejercicio) | ⏸️ UD4 (ejercicio) | ⏸️ UD3 (ejercicio) |

**Mismo patrón, diferentes tecnologías** ✅

---

## 🌐 Plataformas soportadas

- ✅ **Navegadores modernos** (Chrome, Firefox, Safari, Edge)
- ✅ **Mobile web** (responsive design con Tailwind CSS)
- ✅ **PWA** (instalable como app)
- ✅ **SSR/SSG** (Server-Side Rendering opcional)

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"
```bash
# Verifica que el backend esté corriendo
curl http://localhost:3000/api/movies

# Verifica la variable de entorno
echo $PUBLIC_API_URL
# o en Windows:
echo %PUBLIC_API_URL%

# Asegúrate de que empiece con PUBLIC_ para que sea visible en el cliente
```

### Error: "Cannot read properties of undefined (reading 'get')"
```bash
# En tests, asegúrate de mockear fetch correctamente:
globalThis.fetch = vi.fn() as any;

# Y que la respuesta tenga headers:
{
  ok: true,
  headers: {
    get: (name: string) => name === 'content-type' ? 'application/json' : null
  },
  json: async () => ({ ... })
}
```

### Tests fallan con "browser is not defined"
```bash
# Verifica que el mock esté configurado:
vi.mock('$app/environment', () => ({ browser: true }));

# Y que localStorage esté mockeado antes de importar los stores
```

### Hot reload no funciona
```bash
# Reinicia el servidor de desarrollo
# Ctrl+C para detener
npm run dev
```

### CORS errors en desarrollo
```bash
# El backend debe permitir http://localhost:5173
# Ver configuración CORS en mivideoteca-api
```

---

## 📦 Dependencias principales

```json
{
  "devDependencies": {
    "@sveltejs/adapter-auto": "^6.0.0",
    "@sveltejs/kit": "^2.22.0",
    "svelte": "^5.0.0",
    "typescript": "^5.0.0",
    "vite": "^7.0.4",
    "vitest": "^3.2.4",
    "@vitest/ui": "^3.2.4",
    "jsdom": "^27.0.0",
    "tailwindcss": "^3.4.13"
  }
}
```

### Librerías clave
- **SvelteKit 2.x**: Framework web full-stack
- **Svelte 5.x**: UI con Runes (`$state`, `$derived`, `$effect`)
- **Vite 7.x**: Build tool ultra-rápido
- **Vitest 3.x**: Testing framework (compatible con Vite)
- **Tailwind CSS 3.x**: Estilos utility-first
- **TypeScript 5.x**: Tipado estático

---

## 🎨 Estilos

Este proyecto usa **Tailwind CSS** para los estilos:

```svelte
<!-- Ejemplo de componente con Tailwind -->
<button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
  Guardar
</button>
```

---

## 🔗 Enlaces útiles

- [Svelte 5 Runes](https://svelte.dev/docs/svelte/$state)
- [Documentación de SvelteKit](https://svelte.dev/docs/kit)
- [Vitest Documentation](https://vitest.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Backend del proyecto](../mivideoteca-api/README.md)

---

## 👥 Autor

Proyecto educativo - Curso "De Cero a Deploy"

## 📄 Licencia

Este proyecto es material educativo. Ver [LICENSE](LICENSE).

---

## 🎯 Próximos pasos

1. ✅ Completa la **UD3** (Backend) primero
2. ✅ Instala las dependencias: `npm install`
3. ✅ Configura el `.env` con la URL de tu backend local
4. ✅ Ejecuta los tests: `npm run test:run`
5. ✅ Corre la app: `npm run dev`
6. 🎬 Sigue el video de UD4 para implementar Favoritos
7. 📝 Implementa el ejercicio de Rating

**¡Listo para UD4!** 🚀

---

## 📝 Notas adicionales

### Diferencias con el proyecto Flutter

Este proyecto tiene **la misma funcionalidad** que `mivideoteca-app` pero implementado con **tecnologías web**:

- **Mismo backend**: Ambos consumen la misma API REST
- **Misma lógica**: Login, CRUD, favoritos, rating
- **Diferentes tecnologías**: Web vs Mobile nativo
- **Misma arquitectura**: Stores vs Providers (mismo concepto)
- **Mismos tests conceptuales**: Diferentes frameworks pero mismo objetivo

### Svelte 5 Runes vs Svelte 4 Stores

Este proyecto usa **Svelte 5 Runes** en lugar de los stores clásicos:

| Svelte 4 | Svelte 5 |
|-----------|----------|
| `writable()` | `$state()` |
| `derived()` | `$derived()` |
| `$store` (auto-subscribe) | `store.value` (getter) |
| `.set()` / `.update()` | Asignación directa |

### ¿Por qué dos frontends?

Este curso enseña **desarrollo full-stack completo**:
- **Backend**: Express + SQLite (UD3) → PostgreSQL (UD5)
- **Web**: SvelteKit (UD4 - DAW obligatorio)
- **Mobile**: Flutter (UD4 - DAM obligatorio)

Aprenderás a construir aplicaciones que funcionan **en cualquier plataforma**. 🌍📱
