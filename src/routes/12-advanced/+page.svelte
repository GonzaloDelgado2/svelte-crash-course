<script lang="ts">
  import { getLang } from '$lib/i18n/language.svelte.js';

  let lang = $derived(getLang());

  let activeSection = $state<'hooks' | 'errors' | 'redirects' | 'fail' | 'ssr'>('hooks');
  let simulatingHook = $state(false);
  let hookLog = $state<string[]>([]);
  let errorType = $state<number | null>(null);
  let showingRedirect = $state(false);

  let showSolution = $state(false);

  const solutionCode = [
    '// src/app.d.ts — declare the shape of event.locals so TypeScript is happy',
    'declare global {',
    '  namespace App {',
    '    interface Locals {',
    '      user?: { id: number; name: string };',
    '    }',
    '  }',
    '}',
    'export {};',
    '',
    '// src/hooks.server.ts',
    "import { redirect } from '@sveltejs/kit';",
    "import type { Handle } from '@sveltejs/kit';",
    '',
    'export const handle: Handle = async ({ event, resolve }) => {',
    '  // Check authentication',
    "  const session = event.cookies.get('session');",
    '',
    '  // Protect dashboard routes',
    "  if (event.url.pathname.startsWith('/dashboard') && !session) {",
    "    throw redirect(303, '/login');",
    '  }',
    '',
    '  // Add user to locals if authenticated',
    '  if (session) {',
    "    event.locals.user = { id: 1, name: 'Ana' };",
    '  }',
    '',
    '  const response = await resolve(event);',
    '',
    '  // Add custom header',
    '  response.headers.set(',
    "    'x-processed-at',",
    '    new Date().toISOString()',
    '  );',
    '',
    '  return response;',
    '};'
  ].join('\n');

  const hookCode = `// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // BEFORE: runs before every request
  console.log(\`Request: \${event.url.pathname}\`);

  // You can check auth, add headers, etc.
  // event.locals.user = await getUser(event);

  const result = await resolve(event);

  // AFTER: runs after the response is ready
  result.headers.set('x-custom', 'hello');
  return result;
};`;

  const hookClientCode = `// src/hooks.client.ts
import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = async ({
  error,
  event,
  status,
  message
}) => {
  // Log client-side errors
  console.error('Client error:', error);
  return { message: 'Something went wrong' };
};`;

  const errorCode = `// Throwing errors in load or actions
import { error } from '@sveltejs/kit';

// In +page.ts or +page.server.ts
export const load = async ({ params }) => {
  const task = await getTask(params.id);

  if (!task) {
    throw error(404, 'Task not found');
  }

  return { task };
};`;

  const errorPageCode = [
    '<!-- src/routes/+error.svelte -->',
    '<script lang="ts">',
    "  import { page } from '$app/stores';",
    '<\/script>',
    '',
    '<div class="error-page">',
    '  <h1>{$page.status}</h1>',
    '  <p>{$page.error?.message}</p>',
    '  <a href="/">Go home</a>',
    '</div>'
  ].join('\n');

  const redirectCode = `// Redirecting in load or actions
import { redirect } from '@sveltejs/kit';

// In +page.server.ts load
export const load = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }
};

// In a form action
export const actions = {
  create: async ({ request }) => {
    // ... save data ...
    throw redirect(303, '/tasks');
  }
};`;

  const failCode = `// Using fail() in form actions
import { fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title')?.toString();

    if (!title) {
      return fail(400, {
        error: 'Title is required',
        values: { title: '' }
      });
    }

    // Validate length
    if (title.length < 3) {
      return fail(400, {
        error: 'Title must be at least 3 characters',
        values: { title }
      });
    }

    // Success
    return { success: true };
  }
};`;

  function simulateHook() {
    simulatingHook = true;
    hookLog = [];
    const steps = [
      '→ Incoming request: GET /tasks',
      '→ hooks.server.ts: handle() starts',
      '→ Checking authentication...',
      '→ User authenticated ✓',
      '→ resolve(event) called',
      '→ +page.server.ts: load() runs',
      '→ Data fetched successfully',
      '→ Page component renders',
      '→ hooks.server.ts: setting headers',
      '→ Response sent to client (200 OK)'
    ];
    steps.forEach((step, i) => {
      setTimeout(() => {
        hookLog = [...hookLog, step];
        if (i === steps.length - 1) {
          simulatingHook = false;
        }
      }, (i + 1) * 400);
    });
  }

  function showError(code: number) {
    errorType = code;
  }

  function simulateRedirect() {
    showingRedirect = true;
    setTimeout(() => { showingRedirect = false; }, 2000);
  }
</script>

<div class="lesson">
  <div class="lesson-header">
    <span class="lesson-badge">Lesson 12</span>
    <h1>{lang === 'en' ? 'Advanced SvelteKit' : 'SvelteKit Avanzado'}</h1>
    <div class="app-feature">
      <span>🛠️ {lang === 'en' ? 'App Feature: Production Polish' : 'Funcionalidad: Pulido Final'}</span>
    </div>
  </div>

  <div class="lesson-content">

    <section class="intro-section">
      <p class="intro-text">
        {lang === 'en'
          ? 'This lesson covers the finishing touches that make a SvelteKit app production-ready: hooks, error handling, redirects, and understanding SSR vs CSR.'
          : 'Esta lección cubre los toques finales que hacen que una app SvelteKit esté lista para producción: hooks, manejo de errores, redirecciones y comprensión de SSR vs CSR.'}
      </p>
    </section>

    <div class="tabs">
      <button class="tab" class:active={activeSection === 'hooks'} onclick={() => activeSection = 'hooks'}>🪝 Hooks</button>
      <button class="tab" class:active={activeSection === 'errors'} onclick={() => activeSection = 'errors'}>❌ Errors</button>
      <button class="tab" class:active={activeSection === 'redirects'} onclick={() => activeSection = 'redirects'}>↪️ Redirects</button>
      <button class="tab" class:active={activeSection === 'fail'} onclick={() => activeSection = 'fail'}>📝 fail()</button>
      <button class="tab" class:active={activeSection === 'ssr'} onclick={() => activeSection = 'ssr'}>🖥️ SSR vs CSR</button>
    </div>

    {#if activeSection === 'hooks'}
      <section class="section">
        <h2>🪝 {lang === 'en' ? 'Hooks' : 'Hooks'}</h2>
        <div class="theory-block">
          <p>{lang === 'en'
            ? 'Hooks are functions that run for every request. They let you intercept and modify requests and responses. The main hook is <strong>handle</strong> in hooks.server.ts.'
            : 'Los hooks son funciones que se ejecutan para cada solicitud. Te permiten interceptar y modificar solicitudes y respuestas. El hook principal es <strong>handle</strong> en hooks.server.ts.'}</p>
          <ul>
            <li><strong>handle</strong> — {lang === 'en' ? 'Runs on every request (server). Use for auth, logging, custom headers.' : 'Se ejecuta en cada solicitud (servidor). Úsalo para auth, logging, headers personalizados.'}</li>
            <li><strong>handleError</strong> — {lang === 'en' ? 'Runs when an error is thrown. Use for error logging/reporting.' : 'Se ejecuta cuando se lanza un error. Úsalo para logging/reportes de errores.'}</li>
          </ul>
        </div>

        <div class="code-cols">
          <div>
            <div class="code-label">hooks.server.ts</div>
            <pre class="code-block"><code>{hookCode}</code></pre>
          </div>
          <div>
            <div class="code-label">hooks.client.ts</div>
            <pre class="code-block"><code>{hookClientCode}</code></pre>
          </div>
        </div>

        <h3>🎮 {lang === 'en' ? 'Hook Flow Simulator' : 'Simulador de Flujo de Hooks'}</h3>
        <div class="demo-box">
          <button class="btn primary" onclick={simulateHook} disabled={simulatingHook}>
            {simulatingHook ? '⏳ Running...' : '▶️ Simulate Request'}
          </button>
          <div class="log-area">
            {#each hookLog as entry, i}
              <div class="log-entry" style="animation-delay: {i * 50}ms">{entry}</div>
            {/each}
            {#if hookLog.length === 0 && !simulatingHook}
              <div class="empty-state">{lang === 'en' ? 'Click "Simulate Request" to see the hook flow' : 'Haz clic en "Simulate Request" para ver el flujo de hooks'}</div>
            {/if}
          </div>
        </div>
      </section>
    {/if}

    {#if activeSection === 'errors'}
      <section class="section">
        <h2>❌ {lang === 'en' ? 'Error Handling' : 'Manejo de Errores'}</h2>
        <div class="theory-block">
          <p>{lang === 'en'
            ? 'SvelteKit uses the <strong>error()</strong> function to throw HTTP errors. When an error is thrown, SvelteKit renders the nearest <strong>+error.svelte</strong> page.'
            : 'SvelteKit usa la función <strong>error()</strong> para lanzar errores HTTP. Cuando se lanza un error, SvelteKit renderiza la página <strong>+error.svelte</strong> más cercana.'}</p>
        </div>

        <pre class="code-block"><code>{errorCode}</code></pre>
        <pre class="code-block"><code>{errorPageCode}</code></pre>

        <h3>🎮 {lang === 'en' ? 'Error Status Simulator' : 'Simulador de Estados de Error'}</h3>
        <div class="demo-box">
          <div class="error-buttons">
            <button class="btn error-btn" onclick={() => showError(400)}>400 Bad Request</button>
            <button class="btn error-btn" onclick={() => showError(401)}>401 Unauthorized</button>
            <button class="btn error-btn" onclick={() => showError(403)}>403 Forbidden</button>
            <button class="btn error-btn" onclick={() => showError(404)}>404 Not Found</button>
            <button class="btn error-btn" onclick={() => showError(500)}>500 Server Error</button>
            <button class="btn clear-btn" onclick={() => errorType = null}>✓ Clear</button>
          </div>

          {#if errorType !== null}
            <div class="error-display error-{errorType}">
              <div class="error-code">{errorType}</div>
              <div class="error-message">
                {#if errorType === 400}
                  {lang === 'en' ? 'Bad Request — The server could not understand the request' : 'Solicitud incorrecta — El servidor no pudo entender la solicitud'}
                {:else if errorType === 401}
                  {lang === 'en' ? 'Unauthorized — Authentication is required' : 'No autorizado — Se requiere autenticación'}
                {:else if errorType === 403}
                  {lang === 'en' ? 'Forbidden — You don\'t have permission' : 'Prohibido — No tienes permiso'}
                {:else if errorType === 404}
                  {lang === 'en' ? 'Not Found — The resource doesn\'t exist' : 'No encontrado — El recurso no existe'}
                {:else if errorType === 500}
                  {lang === 'en' ? 'Internal Server Error — Something went wrong on the server' : 'Error interno del servidor — Algo salió mal en el servidor'}
                {/if}
              </div>
              <pre class="code-block"><code>throw error({errorType}, '{errorType === 404 ? (lang === 'en' ? 'Not found' : 'No encontrado') : (lang === 'en' ? 'Error message' : 'Mensaje de error')}');</code></pre>
            </div>
          {/if}
        </div>
      </section>
    {/if}

    {#if activeSection === 'redirects'}
      <section class="section">
        <h2>↪️ {lang === 'en' ? 'Redirects' : 'Redirecciones'}</h2>
        <div class="theory-block">
          <p>{lang === 'en'
            ? 'Use <strong>redirect()</strong> to send users to a different URL. Commonly used after login, after form submission, or when a page requires authentication.'
            : 'Usa <strong>redirect()</strong> para enviar usuarios a una URL diferente. Comúnmente usado después de login, después de enviar un formulario, o cuando una página requiere autenticación.'}</p>
          <p>{lang === 'en' ? 'Common status codes:' : 'Códigos de estado comunes:'}</p>
          <ul>
            <li><strong>303</strong> — {lang === 'en' ? 'After form submission (See Other)' : 'Después de enviar formulario (See Other)'}</li>
            <li><strong>302</strong> — {lang === 'en' ? 'Temporary redirect' : 'Redirección temporal'}</li>
            <li><strong>301</strong> — {lang === 'en' ? 'Permanent redirect' : 'Redirección permanente'}</li>
          </ul>
        </div>

        <pre class="code-block"><code>{redirectCode}</code></pre>

        <h3>🎮 {lang === 'en' ? 'Redirect Simulator' : 'Simulador de Redirección'}</h3>
        <div class="demo-box">
          <button class="btn primary" onclick={simulateRedirect} disabled={showingRedirect}>
            {lang === 'en' ? '↪️ Simulate Redirect' : '↪️ Simular Redirección'}
          </button>
          {#if showingRedirect}
            <div class="redirect-animation">
              <div class="redirect-step">/login</div>
              <div class="redirect-arrow">→ throw redirect(303, '/dashboard')</div>
              <div class="redirect-step">/dashboard ✓</div>
            </div>
          {/if}
        </div>
      </section>
    {/if}

    {#if activeSection === 'fail'}
      <section class="section">
        <h2>📝 fail() {lang === 'en' ? 'for Form Validation' : 'para Validación de Formularios'}</h2>
        <div class="theory-block">
          <p>{lang === 'en'
            ? 'The <strong>fail()</strong> function returns validation errors from form actions. The form stays on the same page and can display error messages to the user.'
            : 'La función <strong>fail()</strong> retorna errores de validación desde acciones de formulario. El formulario se queda en la misma página y puede mostrar mensajes de error al usuario.'}</p>
        </div>

        <pre class="code-block"><code>{failCode}</code></pre>

        <div class="key-points">
          <div class="point">
            <strong>{lang === 'en' ? 'fail() returns data' : 'fail() retorna datos'}</strong>
            <p>{lang === 'en' ? 'The returned object is available in the page as form.error, form.values, etc.' : 'El objeto retornado está disponible en la página como form.error, form.values, etc.'}</p>
          </div>
          <div class="point">
            <strong>{lang === 'en' ? 'Page stays rendered' : 'La página permanece renderizada'}</strong>
            <p>{lang === 'en' ? 'Unlike redirect(), the user stays on the same page and sees the errors.' : 'A diferencia de redirect(), el usuario se queda en la misma página y ve los errores.'}</p>
          </div>
          <div class="point">
            <strong>{lang === 'en' ? 'Use form.password safely' : 'Usa form.password de forma segura'}</strong>
            <p>{lang === 'en' ? 'SvelteKit automatically excludes sensitive fields from the returned data.' : 'SvelteKit excluye automáticamente campos sensibles de los datos retornados.'}</p>
          </div>
        </div>
      </section>
    {/if}

    {#if activeSection === 'ssr'}
      <section class="section">
        <h2>🖥️ SSR vs CSR</h2>
        <div class="theory-block">
          <p>{lang === 'en'
            ? 'SvelteKit supports multiple rendering modes. Understanding them helps you choose the right approach for each page.'
            : 'SvelteKit soporta múltiples modos de renderizado. Entenderlos te ayuda a elegir el enfoque correcto para cada página.'}</p>
        </div>

        <div class="render-cards">
          <div class="render-card ssr">
            <div class="render-title">SSR <span class="badge">Default</span></div>
            <p class="render-desc">{lang === 'en' ? 'Server-Side Rendering: HTML is generated on the server for every request.' : 'Renderizado del Lado del Servidor: El HTML se genera en el servidor para cada solicitud.'}</p>
            <div class="render-pros">
              <div>✅ {lang === 'en' ? 'Great for SEO' : 'Excelente para SEO'}</div>
              <div>✅ {lang === 'en' ? 'Fast initial page load' : 'Carga inicial rápida'}</div>
              <div>✅ {lang === 'en' ? 'Works without JavaScript' : 'Funciona sin JavaScript'}</div>
              <div>✅ {lang === 'en' ? 'Best for content pages' : 'Ideal para páginas de contenido'}</div>
            </div>
            <pre class="code-block"><code>// +page.ts (default, no config needed)
// Every page uses SSR by default</code></pre>
          </div>

          <div class="render-card csr">
            <div class="render-title">CSR</div>
            <p class="render-desc">{lang === 'en' ? 'Client-Side Rendering: HTML is generated in the browser.' : 'Renderizado del Lado del Cliente: El HTML se genera en el navegador.'}</p>
            <div class="render-pros">
              <div>✅ {lang === 'en' ? 'No server load' : 'Sin carga del servidor'}</div>
              <div>✅ {lang === 'en' ? 'Good for dashboards' : 'Bueno para dashboards'}</div>
              <div>✅ {lang === 'en' ? 'Rich interactivity' : 'Alta interactividad'}</div>
              <div>⚠️ {lang === 'en' ? 'Worse SEO' : 'SEO peor'}</div>
            </div>
            <pre class="code-block"><code>// +page.ts
export const ssr = false; // Disable SSR
export const prerender = false;</code></pre>
          </div>

          <div class="render-card prerender">
            <div class="render-title">Prerender</div>
            <p class="render-desc">{lang === 'en' ? 'Static HTML is generated at build time.' : 'HTML estático se genera al momento de compilar.'}</p>
            <div class="render-pros">
              <div>✅ {lang === 'en' ? 'Fastest possible' : 'Lo más rápido posible'}</div>
              <div>✅ {lang === 'en' ? 'Can host on CDN' : 'Se puede alojar en CDN'}</div>
              <div>✅ {lang === 'en' ? 'Best SEO' : 'Mejor SEO'}</div>
              <div>⚠️ {lang === 'en' ? 'No dynamic data' : 'Sin datos dinámicos'}</div>
            </div>
            <pre class="code-block"><code>// +page.ts
export const prerender = true;
// Static HTML at build time</code></pre>
          </div>
        </div>

        <div class="when-to-use">
          <h3>{lang === 'en' ? 'When to use each?' : '¿Cuándo usar cada uno?'}</h3>
          <table>
            <thead>
              <tr>
                <th>{lang === 'en' ? 'Scenario' : 'Escenario'}</th>
                <th>{lang === 'en' ? 'Best Choice' : 'Mejor Opción'}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>{lang === 'en' ? 'Blog, marketing site' : 'Blog, sitio de marketing'}</td><td>Prerender</td></tr>
              <tr><td>{lang === 'en' ? 'E-commerce, news' : 'E-commerce, noticias'}</td><td>SSR</td></tr>
              <tr><td>{lang === 'en' ? 'Admin dashboard' : 'Panel de administración'}</td><td>CSR (ssr = false)</td></tr>
              <tr><td>{lang === 'en' ? 'Web app (logged in users)' : 'App web (usuarios logueados)'}</td><td>SSR + CSR hybrid</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    {/if}

    <section class="section">
      <h2>⚠️ {lang === 'en' ? 'Common Mistakes' : 'Errores Comunes'}</h2>
      <div class="mistakes-list">
        <div class="mistake">
          <div class="mistake-wrong">❌</div>
          <div>
            <strong>{lang === 'en' ? 'Using return redirect() instead of throw redirect()' : 'Usar return redirect() en lugar de throw redirect()'}</strong>
            <p>{lang === 'en' ? 'redirect() must be thrown, not returned: throw redirect(303, \'/tasks\')' : 'redirect() debe lanzarse, no retornarse: throw redirect(303, \'/tasks\')'}</p>
          </div>
        </div>
        <div class="mistake">
          <div class="mistake-wrong">❌</div>
          <div>
            <strong>{lang === 'en' ? 'Using error() for validation errors' : 'Usar error() para errores de validación'}</strong>
            <p>{lang === 'en' ? 'Use fail() for form validation. error() shows an error page; fail() keeps the user on the form.' : 'Usa fail() para validación de formularios. error() muestra una página de error; fail() mantiene al usuario en el formulario.'}</p>
          </div>
        </div>
        <div class="mistake">
          <div class="mistake-wrong">❌</div>
          <div>
            <strong>{lang === 'en' ? 'Disabling SSR for the entire app' : 'Deshabilitar SSR para toda la app'}</strong>
            <p>{lang === 'en' ? 'Only disable SSR for specific pages that need it (like dashboards). SSR is better for most pages.' : 'Solo deshabilita SSR para páginas específicas que lo necesiten (como dashboards). SSR es mejor para la mayoría de páginas.'}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="exercise-section">
      <h2>✏️ {lang === 'en' ? 'Exercise' : 'Ejercicio'}: Auth Guard Hook</h2>
      <div class="exercise-task">
        <p>{lang === 'en' ? 'Create a server hook that protects routes:' : 'Crea un hook de servidor que proteja rutas:'}</p>
        <ul>
          <li>{lang === 'en' ? 'Create <code>src/hooks.server.ts</code> with a <code>handle</code> function' : 'Crea <code>src/hooks.server.ts</code> con una función <code>handle</code>'}</li>
          <li>{lang === 'en' ? 'Check if the user is authenticated (check a cookie)' : 'Verifica si el usuario está autenticado (revisa una cookie)'}</li>
          <li>{lang === 'en' ? 'If not authenticated and trying to access <code>/dashboard</code>, redirect to <code>/login</code>' : 'Si no está autenticado e intenta acceder a <code>/dashboard</code>, redirige a <code>/login</code>'}</li>
          <li>{lang === 'en' ? 'Add a custom header <code>x-processed-at</code> with the timestamp to all responses' : 'Agrega un header personalizado <code>x-processed-at</code> con el timestamp a todas las respuestas'}</li>
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

  </div>

  <div class="lesson-nav">
    <a class="nav-btn prev" href="/11-api">← {lang === 'en' ? 'Previous' : 'Anterior'}</a>
    <a class="nav-btn next" href="/13-final-project">{lang === 'en' ? 'Next' : 'Siguiente'} →</a>
  </div>
</div>

<style>
  .lesson {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }
  .lesson-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--border);
  }
  .lesson-badge {
    background: var(--primary);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  h1 { margin: 0.75rem 0 0.5rem; font-size: 2rem; }
  h2 { font-size: 1.3rem; margin-bottom: 1rem; }
  h3 { font-size: 1.1rem; margin: 1.5rem 0 0.75rem; }
  .app-feature { color: var(--primary); font-weight: 500; font-size: 0.95rem; margin-top: 0.5rem; }
  .section { margin-bottom: 2.5rem; }
  .intro-section { background: var(--surface); padding: 1.5rem; border-radius: 12px; border-left: 4px solid var(--primary); margin-bottom: 2rem; }
  .intro-text { line-height: 1.7; }
  .theory-block { line-height: 1.7; }
  .theory-block ul { margin: 1rem 0; padding-left: 1.5rem; }
  .theory-block li { margin-bottom: 0.5rem; }

  .tabs { display: flex; gap: 4px; margin-bottom: 2rem; flex-wrap: wrap; }
  .tab { padding: 8px 18px; border: 1px solid var(--border); background: var(--surface); border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.15s; }
  .tab.active { background: var(--primary); color: white; border-color: var(--primary); }
  .tab:hover:not(.active) { background: var(--surface-hover); }

  .code-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0; }
  .code-label { color: #89b4fa; font-family: monospace; font-size: 0.8rem; margin-bottom: 0.5rem; }
  .code-block { background: #1e1e2e; border-radius: 12px; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
  .code-block code { color: #cdd6f4; font-family: 'Fira Code', 'Consolas', monospace; font-size: 0.85rem; line-height: 1.6; white-space: pre; }

  .demo-box { background: var(--surface); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border); margin-top: 1rem; }
  .btn { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.15s; }
  .btn.primary { background: var(--primary); color: white; }
  .btn.primary:hover { opacity: 0.9; }
  .btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .log-area { margin-top: 1rem; font-family: monospace; }
  .log-entry { padding: 6px 12px; background: #1e1e2e; color: #a6e3a1; border-radius: 4px; margin-bottom: 4px; font-size: 0.85rem; animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
  .empty-state { color: var(--text-muted); text-align: center; padding: 1rem; font-family: inherit; }

  .error-buttons { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
  .error-btn { padding: 8px 16px; border-radius: 8px; border: 1px solid #fecaca; background: #fef2f2; cursor: pointer; font-weight: 600; font-size: 0.85rem; color: #dc2626; }
  .error-btn:hover { background: #fecaca; }
  .clear-btn { padding: 8px 16px; border-radius: 8px; border: 1px solid #dcfce7; background: #f0fdf4; cursor: pointer; font-weight: 600; font-size: 0.85rem; color: #16a34a; }
  .clear-btn:hover { background: #dcfce7; }

  .error-display { padding: 1.5rem; border-radius: 12px; text-align: center; margin-top: 1rem; }
  .error-display.error-400, .error-display.error-401 { background: #fef3c7; border: 2px solid #f59e0b; }
  .error-display.error-403 { background: #fce7f3; border: 2px solid #ec4899; }
  .error-display.error-404 { background: #dbeafe; border: 2px solid #3b82f6; }
  .error-display.error-500 { background: #fef2f2; border: 2px solid #ef4444; }
  .error-code { font-size: 3rem; font-weight: 700; opacity: 0.8; }
  .error-message { font-size: 1rem; margin: 0.5rem 0 1rem; }

  .redirect-animation { display: flex; align-items: center; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; justify-content: center; }
  .redirect-step { padding: 8px 20px; background: var(--primary); color: white; border-radius: 8px; font-weight: 600; }
  .redirect-arrow { color: var(--text-muted); font-family: monospace; font-size: 0.85rem; }

  .key-points { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
  .point { background: var(--surface); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border); }
  .point strong { display: block; margin-bottom: 0.5rem; color: var(--primary); }
  .point p { font-size: 0.9rem; color: var(--text-muted); }

  .render-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
  .render-card { background: var(--surface); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border); }
  .render-card.ssr { border-top: 4px solid var(--success); }
  .render-card.csr { border-top: 4px solid var(--info); }
  .render-card.prerender { border-top: 4px solid var(--warning); }
  .render-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px; }
  .badge { font-size: 0.7rem; background: var(--success); color: white; padding: 2px 8px; border-radius: 10px; }
  .render-desc { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem; }
  .render-pros { font-size: 0.9rem; }
  .render-pros div { padding: 4px 0; }

  .when-to-use { margin-top: 2rem; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--border); }
  th { background: var(--surface); font-weight: 600; }

  .mistakes-list { display: flex; flex-direction: column; gap: 1rem; }
  .mistake { display: flex; gap: 0.75rem; padding: 1rem; background: #fef2f2; border-radius: 10px; border: 1px solid #fecaca; }
  .mistake-wrong { font-size: 1.2rem; flex-shrink: 0; }
  .mistake p { font-size: 0.9rem; color: var(--text-muted); margin-top: 0.25rem; }

  .lesson-nav { display: flex; justify-content: space-between; margin-top: 3rem; padding-top: 1.5rem; border-top: 2px solid var(--border); }
  .nav-btn { padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.2s; }
  .nav-btn.prev { background: var(--surface); color: var(--text); border: 1px solid var(--border); }
  .nav-btn.prev:hover { background: var(--surface-hover); text-decoration: none; }
  .nav-btn.next { background: var(--primary); color: white; }
  .nav-btn.next:hover { opacity: 0.9; text-decoration: none; }

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

  @media (max-width: 768px) {
    .code-cols { grid-template-columns: 1fr; }
    .render-cards { grid-template-columns: 1fr; }
  }
</style>
