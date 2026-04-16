<script lang="ts">
  import LessonLayout from '$lib/components/LessonLayout.svelte';
  import CodeExample from '$lib/components/CodeExample.svelte';
  import { getLang } from '$lib/i18n/language.svelte.js';

  let lang = $derived(getLang());

  let showSolution = $state(false);
  const solutionCode = `\x3C!-- src/routes/blog/+page.svelte -->
\x3Ch1>Blog\x3C/h1>
\x3Cul>
  \x3Cli>\x3Ca href="/blog/hello-world">Hello World\x3C/a>\x3C/li>
  \x3Cli>\x3Ca href="/blog/svelte-guide">Svelte Guide\x3C/a>\x3C/li>
\x3C/ul>

\x3C!-- src/routes/blog/[slug]/+page.svelte -->
\x3Cscript lang="ts">
  let { data } = $props();
\x3C/script>

\x3Ch1>{data.title}\x3C/h1>
\x3Cp>Slug: {data.slug}\x3C/p>

\x3C!-- src/routes/blog/[slug]/+page.ts -->
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  return {
    slug: params.slug,
    title: params.slug
      .split('-')
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join(' ')
  };
};`;

  let selectedFile = $state<string | null>(null);
  let activeDemoPage = $state<'home' | 'about' | 'tasks'>('home');
  let dynamicId = $state('42');
  let challengeInput = $state('');
  let challengeRoutes = $state<{ path: string; component: string }[]>([]);

  const routeFiles = [
    { file: 'src/routes/+page.svelte', url: '/', label: 'Home' },
    { file: 'src/routes/about/+page.svelte', url: '/about', label: 'About' },
    { file: 'src/routes/tasks/+page.svelte', url: '/tasks', label: 'Tasks List' },
    { file: 'src/routes/tasks/[id]/+page.svelte', url: '/tasks/:id', label: 'Task Detail' },
    { file: 'src/routes/+layout.svelte', url: '(all routes)', label: 'Layout' }
  ];

  let selectedRoute = $derived(
    routeFiles.find((r) => r.file === selectedFile) ?? null
  );

  const sampleTasks = [
    { id: 1, title: 'Learn SvelteKit', done: true },
    { id: 2, title: 'Build a project', done: false },
    { id: 3, title: 'Deploy to production', done: false }
  ];

  function addChallengeRoute() {
    const raw = challengeInput.trim();
    if (!raw) return;
    challengeRoutes.push({ path: raw, component: '+page.svelte' });
    challengeInput = '';
  }

  const text = {
    en: {
      title: 'SvelteKit Routing',
      appFeature: 'Multiple Pages',
      topic1Title: 'File-Based Routing Convention',
      topic1Desc: 'SvelteKit uses a file-based routing system. The directory structure inside src/routes/ determines your app\'s URLs. A +page.svelte file in a folder creates a route at that path.',
      topic1Code: `src/routes/
  +page.svelte          -> /
  about/+page.svelte    -> /about
  tasks/+page.svelte    -> /tasks
  tasks/[id]/+page.svelte -> /tasks/:id`,
      demo1Title: 'Interactive Route Explorer',
      demo1Desc: 'Click on any file in the tree to see which URL it maps to.',
      fileLabel: 'File',
      urlLabel: 'Maps to URL',
      topic2Title: 'Dynamic Routes with [params]',
      topic2Desc: 'Square brackets in folder names create dynamic route parameters. The value is accessible via $page.params in your component or the page store from $app/stores.',
      topic2Code: `\x3Cscript lang="ts">
  import { page } from '$app/stores';
  // In Svelte 5 runes style:
  // Access via $page.params.id in template
\x3C/script>

\x3Ch1>Task {\$page.params.id}\x3C/h1>

<!-- File: src/routes/tasks/[id]/+page.svelte -->
<!-- URL /tasks/42 -> params.id === "42" -->`,
      demo2Title: 'Dynamic Route Explorer',
      demo2Desc: 'Enter a task ID to see how the [id] parameter works in dynamic routes.',
      enterId: 'Enter Task ID:',
      simulatedUrl: 'Simulated URL:',
      paramValue: 'Param value:',
      routeFile: 'Route file:',
      topic3Title: 'Nested Layouts',
      topic3Desc: 'A +layout.svelte file wraps all child routes in that directory (and subdirectories). This lets you share navigation, headers, footers, or sidebars across multiple pages.',
      topic3Code: `\x3C!-- src/routes/+layout.svelte -->
\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
\x3C/script>

<nav>
  \x3Ca href="/">Home\x3C/a>
  \x3Ca href="/about">About\x3C/a>
  \x3Ca href="/tasks">Tasks\x3C/a>
\x3C/nav>

<main>
  {@render children()}
\x3C/main>`,
      demo3Title: 'Layout Nesting Diagram',
      demo3Desc: 'See how layouts wrap child routes. Each nested layout.svelte wraps all pages inside its directory.',
      layoutRoot: 'Root Layout',
      layoutTasks: 'Tasks Layout',
      pageHome: 'Home Page',
      pageAbout: 'About Page',
      pageTasks: 'Tasks List',
      pageTaskId: 'Task Detail',
      wraps: 'wraps',
      topic4Title: 'Navigation: Links, goto(), and $page',
      topic4Desc: 'Use regular <a> tags for declarative navigation. For programmatic navigation (after form submit, etc.), use goto() from $app/navigation. The $page store gives you the current URL and params.',
      topic4Code: `\x3Cscript lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
\x3C/script>

\x3C!-- Declarative navigation -->
\x3Ca href="/tasks">View Tasks\x3C/a>

\x3C!-- Programmatic navigation -->
\x3Cbutton onclick={() => goto('/tasks')}>
  Go to Tasks
\x3C/button>

\x3C!-- Current URL info -->
\x3Cp>Current path: {\$page.url.pathname}\x3C/p>`,
      topic5Title: 'Route Params and Loading Data',
      topic5Desc: 'For data loading before the page renders, use +page.ts (or +page.server.ts for server-side). The load function receives params and returns data available via $props().data in the page component.',
      topic5Code: `// src/routes/tasks/[id]/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const task = await getTask(params.id);
  return { task };
};

// src/routes/tasks/[id]/+page.svelte
\x3Cscript lang="ts">
  let { data }: { data: PageData } = $props();
\x3C/script>

\x3Ch1>{data.task.title}\x3C/h1>`,
      demoTitle: 'Full Demo: Mini Task App',
      demoDesc: 'A simulated multi-page task app demonstrating routing concepts. Click the nav tabs to "navigate" between pages.',
      home: 'Home',
      about: 'About',
      tasks: 'Tasks',
      homeContent: 'Welcome to the Task App! This simulates how SvelteKit routing works with multiple pages.',
      aboutContent: 'This is the About page. In a real app, each tab would be a separate route loaded by SvelteKit\'s file-based router.',
      taskListTitle: 'All Tasks',
      viewDetail: 'View',
      taskDetailTitle: 'Task Detail',
      backToList: 'Back to list',
      statusDone: 'Completed',
      statusPending: 'Pending',
      mistakesTitle: 'Common Mistakes',
      mistake1Title: 'Wrong file naming',
      mistake1Wrong: `src/routes/
  page.svelte          <- Wrong!
  about/page.svelte    <- Wrong!
  about/+page.tsx      <- Wrong!`,
      mistake1Correct: `src/routes/
  +page.svelte         <- Correct!
  about/+page.svelte   <- Correct!
  about/+page.ts       <- Correct (for data)`,
      mistake1Explain: 'SvelteKit requires the + prefix for special files. The file must be +page.svelte, not page.svelte. TypeScript files for data loading are +page.ts.',
      mistake2Title: 'Confusing +page and +layout',
      mistake2Wrong: `\x3C!-- Using +layout.svelte for a single route -->
\x3C!-- src/routes/about/+layout.svelte -->
\x3Ch1>About Us\x3C/h1>`,
      mistake2Correct: `\x3C!-- Use +page.svelte for page content -->
\x3C!-- src/routes/about/+page.svelte -->
\x3Ch1>About Us\x3C/h1>

\x3C!-- Use +layout.svelte for shared UI -->
\x3C!-- src/routes/+layout.svelte -->
\x3Cnav>...</nav>
{@render children()}`,
      mistake2Explain: '+page.svelte is for page-specific content. +layout.svelte is for shared UI that wraps multiple child routes. Don\'t put page content in a layout.',
      mistake3Title: 'Client-side only navigation with full reloads',
      mistake3Wrong: `\x3C!-- Forces full page reload! -->
\x3Ca href="/tasks" data-sveltekit-reload>
  Tasks
\x3C/a>
\x3C!-- or using window.location -->
\x3Cbutton onclick={() => window.location.href = '/tasks'}>
  Tasks
\x3C/button>`,
      mistake3Correct: `\x3C!-- SvelteKit intercepts this for SPA navigation -->
\x3Ca href="/tasks">Tasks\x3C/a>

\x3C!-- For programmatic navigation -->
\x3Cscript lang="ts">
  import { goto } from '$app/navigation';
\x3C/script>
\x3Cbutton onclick={() => goto('/tasks')}>
  Tasks
\x3C/button>`,
      mistake3Explain: 'Regular <a href> tags are automatically intercepted by SvelteKit for client-side navigation. Only use data-sveltekit-reload when you intentionally need a full page reload.',
      mistake4Title: 'Forgetting +page.ts for data loading',
      mistake4Wrong: `\x3C!-- src/routes/tasks/+page.svelte -->
\x3Cscript lang="ts">
  // Fetching directly in component
  let data = $state(null);
  $effect(async () => {
    const res = await fetch('/api/tasks');
    data = await res.json();
  });
\x3C/script>`,
      mistake4Correct: `// src/routes/tasks/+page.ts
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/api/tasks');
  return { tasks: await res.json() };
};

// src/routes/tasks/+page.svelte
\x3Cscript lang="ts">
  let { data } = $props();
\x3C/script>
{#each data.tasks as task}
  {task.title}
{/each}`,
      mistake4Explain: 'Use +page.ts load functions for data fetching. This ensures data is available before rendering, enables SSR, and provides better loading states with streaming.',
      challengeTitle: 'Challenge: Design a Blog Route Structure',
      challengeDesc: 'Design a route structure for a blog with categories. Enter route paths one at a time (e.g., /blog, /blog/[slug], /blog/category/[category]). The goal is to cover: blog listing, individual posts, category pages, and an admin section.',
      challengeHint: 'Try adding these routes:\n/blog\n/blog/[slug]\n/blog/category/[category]\n/admin\n/admin/posts\n/admin/posts/[id]/edit',
      addRoute: 'Add Route',
      routePath: 'Route path (e.g., /blog/[slug])',
      clearAll: 'Clear All',
      yourRoutes: 'Your Routes',
      noRoutes: 'No routes added yet. Start designing!',
      fileStructure: 'File Structure',
      challengeCode: `// Blog route structure solution:
// src/routes/
//   blog/+page.svelte           -> /blog
//   blog/[slug]/+page.svelte    -> /blog/my-first-post
//   blog/category/[category]/+page.svelte
//                                -> /blog/category/svelte
//   admin/+page.svelte          -> /admin
//   admin/+layout.svelte        -> wraps all admin pages
//   admin/posts/+page.svelte    -> /admin/posts
//   admin/posts/[id]/edit/+page.svelte
//                                -> /admin/posts/42/edit

// Data loading for a blog post:
// src/routes/blog/[slug]/+page.ts
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ params }) => {
  const post = await getPostBySlug(params.slug);
  return { post };
};`
    },
    es: {
      title: 'Rutas en SvelteKit',
      appFeature: 'Múltiples Páginas',
      topic1Title: 'Convención de Rutas Basadas en Archivos',
      topic1Desc: 'SvelteKit usa un sistema de rutas basado en archivos. La estructura de directorios dentro de src/routes/ determina las URLs de tu app. Un archivo +page.svelte en una carpeta crea una ruta en esa ruta.',
      topic1Code: `src/routes/
  +page.svelte          -> /
  about/+page.svelte    -> /about
  tasks/+page.svelte    -> /tasks
  tasks/[id]/+page.svelte -> /tasks/:id`,
      demo1Title: 'Explorador de Rutas Interactivo',
      demo1Desc: 'Haz clic en cualquier archivo del árbol para ver a qué URL corresponde.',
      fileLabel: 'Archivo',
      urlLabel: 'Corresponde a URL',
      topic2Title: 'Rutas Dinámicas con [params]',
      topic2Desc: 'Los corchetes en los nombres de carpetas crean parámetros de ruta dinámicos. El valor es accesible via $page.params en tu componente o el store page desde $app/stores.',
      topic2Code: `\x3Cscript lang="ts">
  import { page } from '$app/stores';
  // En estilo runes de Svelte 5:
  // Acceder via $page.params.id en la plantilla
\x3C/script>

\x3Ch1>Tarea {\$page.params.id}\x3C/h1>

\x3C!-- Archivo: src/routes/tasks/[id]/+page.svelte -->
\x3C!-- URL /tasks/42 -> params.id === "42" -->`,
      demo2Title: 'Explorador de Rutas Dinámicas',
      demo2Desc: 'Ingresa un ID de tarea para ver cómo funciona el parámetro [id] en rutas dinámicas.',
      enterId: 'Ingresa ID de tarea:',
      simulatedUrl: 'URL simulada:',
      paramValue: 'Valor del param:',
      routeFile: 'Archivo de ruta:',
      topic3Title: 'Layouts Anidados',
      topic3Desc: 'Un archivo +layout.svelte envuelve todas las rutas hijas en ese directorio (y subdirectorios). Esto te permite compartir navegación, encabezados, pies de página o sidebars entre múltiples páginas.',
      topic3Code: `\x3C!-- src/routes/+layout.svelte -->
\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
\x3C/script>

<nav>
  \x3Ca href="/">Inicio\x3C/a>
  \x3Ca href="/about">Acerca\x3C/a>
  \x3Ca href="/tasks">Tareas\x3C/a>
\x3C/nav>

<main>
  {@render children()}
\x3C/main>`,
      demo3Title: 'Diagrama de Anidamiento de Layouts',
      demo3Desc: 'Mira cómo los layouts envuelven las rutas hijas. Cada layout.svelte anidado envuelve todas las páginas dentro de su directorio.',
      layoutRoot: 'Layout Raíz',
      layoutTasks: 'Layout de Tareas',
      pageHome: 'Página Inicio',
      pageAbout: 'Página Acerca',
      pageTasks: 'Lista de Tareas',
      pageTaskId: 'Detalle de Tarea',
      wraps: 'envuelve',
      topic4Title: 'Navegación: Links, goto(), y $page',
      topic4Desc: 'Usa etiquetas <a> normales para navegación declarativa. Para navegación programática (después de enviar un formulario, etc.), usa goto() desde $app/navigation. El store $page te da la URL y params actuales.',
      topic4Code: `\x3Cscript lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
\x3C/script>

\x3C!-- Navegación declarativa -->
\x3Ca href="/tasks">Ver Tareas\x3C/a>

\x3C!-- Navegación programática -->
\x3Cbutton onclick={() => goto('/tasks')}>
  Ir a Tareas
\x3C/button>

\x3C!-- Info de URL actual -->
\x3Cp>Ruta actual: {\$page.url.pathname}\x3C/p>`,
      topic5Title: 'Params de Ruta y Carga de Datos',
      topic5Desc: 'Para cargar datos antes de que la página se renderice, usa +page.ts (o +page.server.ts para el lado del servidor). La función load recibe los params y devuelve datos disponibles via $props().data en el componente de página.',
      topic5Code: `// src/routes/tasks/[id]/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const task = await getTask(params.id);
  return { task };
};

// src/routes/tasks/[id]/+page.svelte
\x3Cscript lang="ts">
  let { data }: { data: PageData } = $props();
\x3C/script>

\x3Ch1>{data.task.title}\x3C/h1>`,
      demoTitle: 'Demo Completa: Mini App de Tareas',
      demoDesc: 'Una app de tareas simulada multi-página que demuestra conceptos de rutas. Haz clic en las pestañas de navegación para "navegar" entre páginas.',
      home: 'Inicio',
      about: 'Acerca',
      tasks: 'Tareas',
      homeContent: '¡Bienvenido a la App de Tareas! Esto simula cómo funciona el ruteo de SvelteKit con múltiples páginas.',
      aboutContent: 'Esta es la página Acerca. En una app real, cada pestaña sería una ruta separada cargada por el router basado en archivos de SvelteKit.',
      taskListTitle: 'Todas las Tareas',
      viewDetail: 'Ver',
      taskDetailTitle: 'Detalle de Tarea',
      backToList: 'Volver a la lista',
      statusDone: 'Completada',
      statusPending: 'Pendiente',
      mistakesTitle: 'Errores Comunes',
      mistake1Title: 'Nombres de archivo incorrectos',
      mistake1Wrong: `src/routes/
  page.svelte          <- ¡Incorrecto!
  about/page.svelte    <- ¡Incorrecto!
  about/+page.tsx      <- ¡Incorrecto!`,
      mistake1Correct: `src/routes/
  +page.svelte         <- ¡Correcto!
  about/+page.svelte   <- ¡Correcto!
  about/+page.ts       <- ¡Correcto (para datos)!`,
      mistake1Explain: 'SvelteKit requiere el prefijo + para archivos especiales. El archivo debe ser +page.svelte, no page.svelte. Los archivos TypeScript para carga de datos son +page.ts.',
      mistake2Title: 'Confundir +page y +layout',
      mistake2Wrong: `\x3C!-- Usando +layout.svelte para una sola ruta -->
\x3C!-- src/routes/about/+layout.svelte -->
\x3Ch1>Acerca de Nosotros\x3C/h1>`,
      mistake2Correct: `\x3C!-- Usa +page.svelte para contenido de página -->
\x3C!-- src/routes/about/+page.svelte -->
\x3Ch1>Acerca de Nosotros\x3C/h1>

\x3C!-- Usa +layout.svelte para UI compartida -->
\x3C!-- src/routes/+layout.svelte -->
\x3Cnav>...</nav>
{@render children()}`,
      mistake2Explain: '+page.svelte es para contenido específico de la página. +layout.svelte es para UI compartida que envuelve múltiples rutas hijas. No pongas contenido de página en un layout.',
      mistake3Title: 'Navegación solo del cliente con recargas completas',
      mistake3Wrong: `\x3C!-- ¡Fuerza recarga completa de página! -->
\x3Ca href="/tasks" data-sveltekit-reload>
  Tareas
\x3C/a>
\x3C!-- o usando window.location -->
\x3Cbutton onclick={() => window.location.href = '/tasks'}>
  Tareas
\x3C/button>`,
      mistake3Correct: `\x3C!-- SvelteKit intercepta esto para navegación SPA -->
\x3Ca href="/tasks">Tareas\x3C/a>

\x3C!-- Para navegación programática -->
\x3Cscript lang="ts">
  import { goto } from '$app/navigation';
\x3C/script>
\x3Cbutton onclick={() => goto('/tasks')}>
  Tareas
\x3C/button>`,
      mistake3Explain: 'Las etiquetas <a href> normales son interceptadas automáticamente por SvelteKit para navegación del lado del cliente. Solo usa data-sveltekit-reload cuando intencionalmente necesites una recarga completa.',
      mistake4Title: 'Olvidar +page.ts para carga de datos',
      mistake4Wrong: `\x3C!-- src/routes/tasks/+page.svelte -->
\x3Cscript lang="ts">
  // Fetch directamente en el componente
  let data = $state(null);
  $effect(async () => {
    const res = await fetch('/api/tasks');
    data = await res.json();
  });
\x3C/script>`,
      mistake4Correct: `// src/routes/tasks/+page.ts
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/api/tasks');
  return { tasks: await res.json() };
};

// src/routes/tasks/+page.svelte
\x3Cscript lang="ts">
  let { data } = $props();
\x3C/script>
{#each data.tasks as task}
  {task.title}
{/each}`,
      mistake4Explain: 'Usa funciones load en +page.ts para obtener datos. Esto asegura que los datos estén disponibles antes del renderizado, habilita SSR, y proporciona mejores estados de carga con streaming.',
      challengeTitle: 'Reto: Diseña una Estructura de Rutas para un Blog',
      challengeDesc: 'Diseña una estructura de rutas para un blog con categorías. Ingresa las rutas una por una (ej: /blog, /blog/[slug], /blog/categoria/[categoria]). El objetivo es cubrir: listado del blog, posts individuales, páginas de categoría y una sección admin.',
      challengeHint: 'Intenta agregar estas rutas:\n/blog\n/blog/[slug]\n/blog/categoria/[categoria]\n/admin\n/admin/posts\n/admin/posts/[id]/edit',
      addRoute: 'Agregar Ruta',
      routePath: 'Ruta (ej: /blog/[slug])',
      clearAll: 'Limpiar Todo',
      yourRoutes: 'Tus Rutas',
      noRoutes: '¡Sin rutas aún. Empieza a diseñar!',
      fileStructure: 'Estructura de Archivos',
      challengeCode: `// Solución de estructura de rutas para blog:
// src/routes/
//   blog/+page.svelte           -> /blog
//   blog/[slug]/+page.svelte    -> /blog/mi-primer-post
//   blog/categoria/[category]/+page.svelte
//                                -> /blog/categoria/svelte
//   admin/+page.svelte          -> /admin
//   admin/+layout.svelte        -> envuelve todas las páginas admin
//   admin/posts/+page.svelte    -> /admin/posts
//   admin/posts/[id]/edit/+page.svelte
//                                -> /admin/posts/42/edit

// Carga de datos para un post del blog:
// src/routes/blog/[slug]/+page.ts
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ params }) => {
  const post = await getPostBySlug(params.slug);
  return { post };
};`
    }
  };

  let t = $derived(text[lang]);
</script>

<LessonLayout lessonNum="09" title={t.title} appFeature={t.appFeature}>
  {#snippet theory()}
    <div class="topics">
      <section class="topic">
        <h3>1. {t.topic1Title}</h3>
        <p>{t.topic1Desc}</p>
        <CodeExample code={t.topic1Code} filename="src/routes/" />
        <div class="interactive-box">
          <h4>{t.demo1Title}</h4>
          <p class="demo-desc">{t.demo1Desc}</p>
          <div class="route-tree">
            <div class="tree-files">
              {#each routeFiles as rf}
                <button
                  class="tree-file"
                  class:selected={selectedFile === rf.file}
                  onclick={() => selectedFile = selectedFile === rf.file ? null : rf.file}
                >
                  <span class="file-icon">{rf.file.includes('[id]') ? '📄' : rf.file.includes('layout') ? '📦' : '📑'}</span>
                  <span class="file-path">{rf.file}</span>
                  <span class="file-label">{rf.label}</span>
                </button>
              {/each}
            </div>
            {#if selectedRoute}
              <div class="route-result">
                <div class="result-row">
                  <span class="result-label">{t.fileLabel}:</span>
                  <code class="result-value">{selectedRoute.file}</code>
                </div>
                <div class="result-arrow">{'-->'}</div>
                <div class="result-row">
                  <span class="result-label">{t.urlLabel}:</span>
                  <code class="result-value url">{selectedRoute.url}</code>
                </div>
              </div>
            {:else}
              <div class="route-result placeholder">
                <span class="placeholder-text">{lang === 'en' ? 'Click a file above' : 'Haz clic en un archivo arriba'}</span>
              </div>
            {/if}
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>2. {t.topic2Title}</h3>
        <p>{t.topic2Desc}</p>
        <CodeExample code={t.topic2Code} filename="src/routes/tasks/[id]/+page.svelte" />
        <div class="interactive-box">
          <h4>{t.demo2Title}</h4>
          <p class="demo-desc">{t.demo2Desc}</p>
          <div class="dynamic-explorer">
            <div class="input-row">
              <label>{t.enterId}</label>
              <input type="text" bind:value={dynamicId} placeholder="42" class="id-input" />
            </div>
            <div class="dynamic-results">
              <div class="result-card">
                <span class="result-card-label">{t.simulatedUrl}</span>
                <code class="result-card-value">/tasks/{dynamicId || ':id'}</code>
              </div>
              <div class="result-card">
                <span class="result-card-label">{t.paramValue}</span>
                <code class="result-card-value">id = "{dynamicId || 'undefined'}"</code>
              </div>
              <div class="result-card">
                <span class="result-card-label">{t.routeFile}</span>
                <code class="result-card-value">src/routes/tasks/[id]/+page.svelte</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>3. {t.topic3Title}</h3>
        <p>{t.topic3Desc}</p>
        <CodeExample code={t.topic3Code} filename="src/routes/+layout.svelte" />
        <div class="interactive-box">
          <h4>{t.demo3Title}</h4>
          <p class="demo-desc">{t.demo3Desc}</p>
          <div class="layout-diagram">
            <div class="layout-box root-layout">
              <div class="layout-label">{t.layoutRoot}</div>
              <div class="layout-label-sub">+layout.svelte</div>
              <div class="layout-children">
                <div class="layout-box page-box">
                  <div class="layout-label">{t.pageHome}</div>
                  <code>+page.svelte</code>
                </div>
                <div class="layout-box page-box">
                  <div class="layout-label">{t.pageAbout}</div>
                  <code>about/+page.svelte</code>
                </div>
                <div class="layout-box nested-layout">
                  <div class="layout-label">{t.layoutTasks}</div>
                  <div class="layout-label-sub">tasks/+layout.svelte</div>
                  <div class="layout-children">
                    <div class="layout-box page-box">
                      <div class="layout-label">{t.pageTasks}</div>
                      <code>tasks/+page.svelte</code>
                    </div>
                    <div class="layout-box page-box">
                      <div class="layout-label">{t.pageTaskId}</div>
                      <code>tasks/[id]/+page.svelte</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="diagram-legend-row">
              <span class="legend-item legend-root">{t.layoutRoot}</span>
              <span class="legend-item legend-nested">{t.layoutTasks}</span>
              <span class="legend-item legend-page">{lang === 'en' ? 'Pages' : 'Páginas'}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>4. {t.topic4Title}</h3>
        <p>{t.topic4Desc}</p>
        <CodeExample code={t.topic4Code} filename="NavigationExamples.svelte" />
      </section>

      <section class="topic">
        <h3>5. {t.topic5Title}</h3>
        <p>{t.topic5Desc}</p>
        <CodeExample code={t.topic5Code} filename="src/routes/tasks/[id]/+page.ts" />
      </section>
    </div>
  {/snippet}

  {#snippet example()}
    <div class="demo">
      <h3>{t.demoTitle}</h3>
      <p>{t.demoDesc}</p>
      <div class="simulated-app">
        <div class="sim-url-bar">
          <div class="sim-url-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="sim-url-input">
            https://my-app.com{activeDemoPage === 'home' ? '/' : activeDemoPage === 'tasks' ? '/tasks' : '/about'}
          </div>
        </div>
        <nav class="sim-nav">
          <button class="sim-nav-btn" class:active={activeDemoPage === 'home'} onclick={() => activeDemoPage = 'home'}>{t.home}</button>
          <button class="sim-nav-btn" class:active={activeDemoPage === 'about'} onclick={() => activeDemoPage = 'about'}>{t.about}</button>
          <button class="sim-nav-btn" class:active={activeDemoPage === 'tasks'} onclick={() => activeDemoPage = 'tasks'}>{t.tasks}</button>
        </nav>
        <div class="sim-page">
          {#if activeDemoPage === 'home'}
            <div class="sim-page-content">
              <h2>{t.home}</h2>
              <p>{t.homeContent}</p>
              <div class="sim-file-hint">
                <code>src/routes/+page.svelte</code>
              </div>
            </div>
          {:else if activeDemoPage === 'about'}
            <div class="sim-page-content">
              <h2>{t.about}</h2>
              <p>{t.aboutContent}</p>
              <div class="sim-file-hint">
                <code>src/routes/about/+page.svelte</code>
              </div>
            </div>
          {:else}
            <div class="sim-page-content">
              <h2>{t.taskListTitle}</h2>
              <div class="sim-file-hint">
                <code>src/routes/tasks/+page.svelte</code>
              </div>
              <ul class="sim-task-list">
                {#each sampleTasks as task (task.id)}
                  <li class="sim-task" class:task-done={task.done}>
                    <span class="sim-task-status">{task.done ? '✅' : '⬜'}</span>
                    <span class="sim-task-title">{task.title}</span>
                    <span class="sim-task-status-label">
                      {task.done ? t.statusDone : t.statusPending}
                    </span>
                    <button class="sim-task-link" onclick={() => activeDemoPage = 'tasks'}>
                      {t.viewDetail}
                    </button>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/snippet}

  {#snippet challenge()}
    <div class="challenge-content">
      <p>{t.challengeDesc}</p>
      <p class="challenge-hint">{t.challengeHint}</p>
      <div class="route-builder">
        <div class="route-input-row">
          <input
            type="text"
            placeholder={t.routePath}
            bind:value={challengeInput}
            onkeydown={(e) => e.key === 'Enter' && addChallengeRoute()}
          />
          <button class="btn primary" onclick={addChallengeRoute}>{t.addRoute}</button>
          <button class="btn secondary" onclick={() => challengeRoutes = []}>{t.clearAll}</button>
        </div>
        <div class="route-builder-panels">
          <div class="route-builder-panel">
            <h4>{t.yourRoutes}</h4>
            {#if challengeRoutes.length > 0}
              <ul class="route-list">
                {#each challengeRoutes as cr, i}
                  <li>
                    <code>{cr.path}</code>
                    <span class="route-arrow">{'-->'}</span>
                    <span class="route-file">src/routes{cr.path === '/' ? '' : cr.path}/+page.svelte</span>
                    <button class="route-remove" onclick={() => challengeRoutes.splice(i, 1)}>✕</button>
                  </li>
                {/each}
              </ul>
            {:else}
              <p class="empty-routes">{t.noRoutes}</p>
            {/if}
          </div>
          <div class="route-builder-panel">
            <h4>{t.fileStructure}</h4>
            <CodeExample code={t.challengeCode} filename="Blog Route Solution" />
          </div>
        </div>
      </div>
    </div>
  {/snippet}

  <section class="mistakes">
    <h2>{t.mistakesTitle}</h2>
    <div class="mistake-cards">
      {#each [
        { title: t.mistake1Title, wrong: t.mistake1Wrong, correct: t.mistake1Correct, explain: t.mistake1Explain },
        { title: t.mistake2Title, wrong: t.mistake2Wrong, correct: t.mistake2Correct, explain: t.mistake2Explain },
        { title: t.mistake3Title, wrong: t.mistake3Wrong, correct: t.mistake3Correct, explain: t.mistake3Explain },
        { title: t.mistake4Title, wrong: t.mistake4Wrong, correct: t.mistake4Correct, explain: t.mistake4Explain }
      ] as mistake}
        <div class="mistake-card">
          <h3>{mistake.title}</h3>
          <div class="code-compare">
            <div class="wrong">
              <span class="badge wrong-badge">{lang === 'en' ? 'Wrong' : 'Incorrecto'}</span>
              <pre><code>{mistake.wrong}</code></pre>
            </div>
            <div class="correct">
              <span class="badge correct-badge">{lang === 'en' ? 'Correct' : 'Correcto'}</span>
              <pre><code>{mistake.correct}</code></pre>
            </div>
          </div>
          <p class="explain">{mistake.explain}</p>
        </div>
      {/each}
    </div>
  </section>

  <section class="exercise-section">
    <h2>✏️ {lang === 'en' ? 'Exercise' : 'Ejercicio'}: Blog with Dynamic Routes</h2>
    <div class="exercise-task">
      <p>{lang === 'en' ? 'Create a blog with SvelteKit routing:' : 'Crea un blog con rutas de SvelteKit:'}</p>
      <ul>
        <li>{lang === 'en' ? 'Create `src/routes/blog/+page.svelte` that lists blog posts' : 'Crea `src/routes/blog/+page.svelte` que liste los posts del blog'}</li>
        <li>{lang === 'en' ? 'Create `src/routes/blog/[slug]/+page.svelte` for individual posts' : 'Crea `src/routes/blog/[slug]/+page.svelte` para posts individuales'}</li>
        <li>{lang === 'en' ? 'Use the `load` function to get the slug from params' : 'Usa la función `load` para obtener el slug de los params'}</li>
        <li>{lang === 'en' ? 'Show the post title based on the slug' : 'Muestra el título del post basado en el slug'}</li>
      </ul>
    </div>
    <button class="solution-toggle" onclick={() => showSolution = !showSolution}>
      {showSolution
        ? (lang === 'en' ? '🔓 Hide Solution' : '🔓 Ocultar Solución')
        : (lang === 'en' ? '🔐 Show Solution' : '🔐 Mostrar Solución')}
    </button>
    {#if showSolution}
      <div class="solution-box">
        <div class="solution-header">{lang === 'en' ? '✅ Solution' : '✅ Solución'}</div>
        <pre class="code-block"><code>{solutionCode}</code></pre>
      </div>
    {/if}
  </section>
</LessonLayout>

<style>
  .topics {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }
  .topic h3 {
    font-size: 1.2rem;
    color: var(--primary);
    margin-bottom: 0.75rem;
  }
  .topic p {
    line-height: 1.7;
    color: var(--text);
    margin-bottom: 1rem;
  }
  .interactive-box {
    background: var(--surface);
    border-radius: 12px;
    padding: 1.25rem;
    margin-top: 1rem;
    border: 1px solid var(--border);
  }
  .interactive-box h4 {
    font-size: 0.95rem;
    color: var(--text);
    margin-bottom: 0.5rem;
  }
  .demo-desc {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 1rem;
  }
  .route-tree {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .tree-files {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .tree-file {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 8px 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.88rem;
    transition: all 0.15s;
    text-align: left;
    color: var(--text);
  }
  .tree-file:hover {
    background: var(--surface-hover);
    border-color: var(--primary);
  }
  .tree-file.selected {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  .tree-file.selected .file-label {
    color: rgba(255, 255, 255, 0.8);
  }
  .file-icon {
    font-size: 1rem;
    flex-shrink: 0;
  }
  .file-path {
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.82rem;
    flex: 1;
  }
  .file-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
  }
  .route-result {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--bg);
    border: 2px solid var(--primary);
    border-radius: 10px;
  }
  .route-result.placeholder {
    justify-content: center;
    border-style: dashed;
    border-color: var(--border);
    background: transparent;
  }
  .placeholder-text {
    color: var(--text-muted);
    font-style: italic;
    font-size: 0.9rem;
  }
  .result-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .result-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
    white-space: nowrap;
  }
  .result-value {
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.88rem;
    color: var(--text);
    background: var(--surface);
    padding: 4px 10px;
    border-radius: 6px;
  }
  .result-value.url {
    color: var(--primary);
    font-weight: 600;
  }
  .result-arrow {
    color: var(--primary);
    font-weight: 700;
    font-size: 1.2rem;
  }
  .dynamic-explorer {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .input-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .input-row label {
    font-size: 0.9rem;
    font-weight: 600;
    white-space: nowrap;
  }
  .id-input {
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.95rem;
    background: var(--bg);
    color: var(--text);
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    width: 120px;
  }
  .id-input:focus {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
  .dynamic-results {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .result-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 8px 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
  }
  .result-card-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
    white-space: nowrap;
    min-width: 100px;
  }
  .result-card-value {
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.85rem;
    color: var(--primary);
  }
  .layout-diagram {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .layout-box {
    border: 2px solid var(--border);
    border-radius: 10px;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .root-layout {
    border-color: var(--primary);
    background: rgba(255, 62, 0, 0.04);
    width: 100%;
  }
  .nested-layout {
    border-color: #8b5cf6;
    background: rgba(139, 92, 246, 0.04);
  }
  .page-box {
    background: var(--bg);
    border-color: #22c55e;
    padding: 0.5rem 0.75rem;
  }
  .page-box code {
    font-size: 0.72rem;
    color: var(--text-muted);
  }
  .layout-label {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text);
  }
  .layout-label-sub {
    font-size: 0.72rem;
    color: var(--text-muted);
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
  }
  .root-layout > .layout-label {
    color: var(--primary);
  }
  .nested-layout > .layout-label {
    color: #8b5cf6;
  }
  .layout-children {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-left: 0.75rem;
    border-left: 2px dashed var(--border);
    margin-left: 0.5rem;
  }
  .diagram-legend-row {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .legend-item {
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  .legend-root {
    background: rgba(255, 62, 0, 0.1);
    color: var(--primary);
    border: 1px solid var(--primary);
  }
  .legend-nested {
    background: rgba(139, 92, 246, 0.1);
    color: #8b5cf6;
    border: 1px solid #8b5cf6;
  }
  .legend-page {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
    border: 1px solid #22c55e;
  }
  .demo h3 {
    font-size: 1.2rem;
    color: var(--text);
    margin-bottom: 0.5rem;
  }
  .demo p {
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  .simulated-app {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }
  .sim-url-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 8px 12px;
    background: #2a2a3e;
    border-bottom: 1px solid #3a3a4e;
  }
  .sim-url-dots {
    display: flex;
    gap: 6px;
  }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .dot.red { background: #ff5f57; }
  .dot.yellow { background: #ffbd2e; }
  .dot.green { background: #28c840; }
  .sim-url-input {
    flex: 1;
    background: #1e1e2e;
    padding: 6px 12px;
    border-radius: 6px;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.8rem;
    color: #89b4fa;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sim-nav {
    display: flex;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }
  .sim-nav-btn {
    flex: 1;
    padding: 10px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-muted);
    transition: all 0.2s;
  }
  .sim-nav-btn:hover {
    background: var(--surface-hover);
  }
  .sim-nav-btn.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
    background: rgba(255, 62, 0, 0.05);
  }
  .sim-page {
    padding: 1.25rem;
    min-height: 200px;
  }
  .sim-page-content h2 {
    font-size: 1.1rem;
    color: var(--text);
    margin-bottom: 0.75rem;
  }
  .sim-page-content p {
    line-height: 1.6;
    color: var(--text);
    margin-bottom: 1rem;
  }
  .sim-file-hint {
    margin-bottom: 1rem;
  }
  .sim-file-hint code {
    font-size: 0.8rem;
    background: var(--code-bg);
    color: #89b4fa;
    padding: 4px 10px;
    border-radius: 6px;
  }
  .sim-task-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .sim-task {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
  }
  .sim-task.task-done {
    opacity: 0.7;
  }
  .sim-task.task-done .sim-task-title {
    text-decoration: line-through;
  }
  .sim-task-status {
    font-size: 1rem;
  }
  .sim-task-title {
    flex: 1;
    font-size: 0.9rem;
  }
  .sim-task-status-label {
    font-size: 0.75rem;
    padding: 3px 8px;
    border-radius: 12px;
    font-weight: 600;
    background: rgba(255, 62, 0, 0.1);
    color: var(--primary);
  }
  .task-done .sim-task-status-label {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
  }
  .sim-task-link {
    background: var(--primary);
    color: white;
    border: none;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.78rem;
    cursor: pointer;
    font-weight: 600;
  }
  .sim-task-link:hover {
    opacity: 0.9;
  }
  .challenge-content p {
    line-height: 1.7;
    margin-bottom: 1rem;
  }
  .challenge-hint {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    white-space: pre-line;
    background: var(--surface);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border);
  }
  .route-builder {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .route-input-row {
    display: flex;
    gap: 0.5rem;
  }
  .route-input-row input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.95rem;
    background: var(--bg);
    color: var(--text);
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
  }
  .route-input-row input:focus {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
  .btn {
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }
  .btn.primary {
    background: var(--primary);
    color: white;
  }
  .btn.primary:hover {
    opacity: 0.9;
  }
  .btn.secondary {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
  }
  .btn.secondary:hover {
    background: var(--surface-hover);
  }
  .route-builder-panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .route-builder-panel {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem;
  }
  .route-builder-panel h4 {
    font-size: 0.9rem;
    color: var(--text);
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }
  .route-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .route-list li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 6px 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 0.82rem;
  }
  .route-list li code {
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.82rem;
    color: var(--primary);
    font-weight: 600;
  }
  .route-arrow {
    color: var(--text-muted);
    font-weight: 700;
  }
  .route-file {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .route-remove {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.8rem;
    padding: 2px 6px;
    border-radius: 4px;
    flex-shrink: 0;
  }
  .route-remove:hover {
    color: var(--error);
    background: #fef2f2;
  }
  .empty-routes {
    color: var(--text-muted);
    font-style: italic;
    font-size: 0.88rem;
    text-align: center;
  }
  .mistakes {
    margin-top: 2rem;
  }
  .mistakes h2 {
    font-size: 1.3rem;
    color: var(--text);
    margin-bottom: 1.5rem;
  }
  .mistake-cards {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .mistake-card {
    background: var(--surface);
    border-radius: 12px;
    padding: 1.25rem;
    border: 1px solid var(--border);
  }
  .mistake-card h3 {
    font-size: 1rem;
    color: var(--error);
    margin-bottom: 1rem;
  }
  .code-compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .wrong pre,
  .correct pre {
    margin: 0;
    background: var(--code-bg);
    padding: 0.75rem 1rem;
    border-radius: 0 8px 8px 8px;
  }
  .wrong code,
  .correct code {
    color: #cdd6f4;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.82rem;
    line-height: 1.5;
    white-space: pre;
  }
  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 6px 6px 0 0;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
  }
  .wrong-badge {
    background: #fecaca;
    color: #991b1b;
  }
  .correct-badge {
    background: #bbf7d0;
    color: #166534;
  }
  .explain {
    color: var(--text-muted);
    font-size: 0.9rem;
    line-height: 1.6;
    font-style: italic;
  }
  @media (max-width: 768px) {
    .route-result {
      flex-direction: column;
      align-items: flex-start;
    }
    .route-builder-panels {
      grid-template-columns: 1fr;
    }
    .code-compare {
      grid-template-columns: 1fr;
    }
    .sim-url-input {
      font-size: 0.7rem;
    }
  }
  .exercise-section { margin: 2.5rem 0; background: linear-gradient(135deg, #fef3c7, #fef9c3); border-radius: 16px; padding: 1.5rem; border: 2px solid #f59e0b; }
  .exercise-section h2 { font-size: 1.3rem; margin-bottom: 1rem; color: #92400e; }
  .exercise-task { background: white; border-radius: 10px; padding: 1.25rem; margin-bottom: 1rem; line-height: 1.7; }
  .exercise-task ul { margin: 0.75rem 0; padding-left: 1.5rem; }
  .exercise-task li { margin-bottom: 0.4rem; }
  .solution-toggle { width: 100%; padding: 12px; border: 2px dashed #f59e0b; border-radius: 10px; background: white; cursor: pointer; font-size: 1rem; font-weight: 600; color: #92400e; transition: all 0.2s; }
  .solution-toggle:hover { background: #fef3c7; }
  .solution-box { margin-top: 1rem; border-radius: 12px; overflow: hidden; }
  .solution-header { background: #22c55e; color: white; padding: 8px 16px; font-weight: 600; }
  .solution-box pre { background: #1e1e2e; padding: 1rem; margin: 0; overflow-x: auto; }
  .solution-box code { color: #cdd6f4; font-family: 'Fira Code', 'Consolas', monospace; font-size: 0.85rem; line-height: 1.6; white-space: pre; }
</style>
