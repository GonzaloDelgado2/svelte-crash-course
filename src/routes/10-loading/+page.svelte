<script lang="ts">
  import { getLang } from '$lib/i18n/language.svelte.js';

  let lang = $derived(getLang());

  let showSolution = $state(false);
  const solutionCode = `// src/routes/profile/+page.server.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  // Simulate database fetch
  return {
    user: {
      name: 'Ana García',
      email: 'ana@example.com',
      posts: [
        { id: 1, title: 'My First Post', date: '2024-01-15' },
        { id: 2, title: 'Learning Svelte', date: '2024-02-20' },
      ]
    }
  };
};

<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
  let { data } = $props();
<\/script>

<h1>{data.user.name}</h1>
<p>Email: {data.user.email}</p>
<h2>Posts:</h2>
<ul>
  {#each data.user.posts as post (post.id)}
    <li>{post.title} - {post.date}</li>
  {/each}
</ul>`;

  let isLoading = $state(false);
  let tasks = $state<Array<{ id: number; text: string; done: boolean; priority: string }>>([]);
  let loaded = $state(false);
  let newTask = $state('');
  let newPriority = $state('medium');
  let submitting = $state(false);
  let submitResult = $state<{ success: boolean; message: string } | null>(null);
  let loadError = $state(false);
  let activeTab = $state<'load' | 'actions'>('load');

  const fakeTasks = [
    { id: 1, text: 'Learn Svelte basics', done: true, priority: 'high' },
    { id: 2, text: 'Understand templating', done: true, priority: 'medium' },
    { id: 3, text: 'Master data loading', done: false, priority: 'high' },
    { id: 4, text: 'Build a real project', done: false, priority: 'low' },
    { id: 5, text: 'Deploy to production', done: false, priority: 'medium' }
  ];

  const codePageTs = `// src/routes/tasks/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch('/api/tasks');
  const tasks = await response.json();
  return { tasks };
};`;

  const codePageSvelte = `<script lang="ts">
  // Data from load is available via $props()
  let { data } = $props();
<\/script>

{#each data.tasks as task}
  <p>{task.text}</p>
{/each}`;

  const codeServerTs = `// src/routes/tasks/+page.server.ts
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title')?.toString();

    if (!title || title.trim() === '') {
      return fail(400, { error: 'Title is required' });
    }

    // Save to database...
    return { success: true, message: 'Task created!' };
  }
};`;

  const codeLoadingState = `// This is what load() is doing:
const response = await fetch('/api/tasks');
// Waiting for response...`;

  const codeError = `// Error thrown in load():
import { error } from '@sveltejs/kit';
throw error(500, 'Failed to fetch tasks');`;

  function simulateLoad() {
    isLoading = true;
    loaded = false;
    loadError = false;
    setTimeout(() => {
      if (Math.random() > 0.2) {
        tasks = [...fakeTasks];
        loaded = true;
      } else {
        loadError = true;
      }
      isLoading = false;
    }, 1500);
  }

  function simulateError() {
    isLoading = true;
    loaded = false;
    loadError = false;
    setTimeout(() => {
      loadError = true;
      isLoading = false;
    }, 1500);
  }

  function simulateSubmit() {
    if (!newTask.trim()) return;
    submitting = true;
    submitResult = null;
    setTimeout(() => {
      tasks = [...tasks, { id: Date.now(), text: newTask, done: false, priority: newPriority }];
      submitResult = { success: true, message: lang === 'en' ? `Task "${newTask}" added!` : `Tarea "${newTask}" agregada!` };
      newTask = '';
      submitting = false;
    }, 1000);
  }

  function resetDemo() {
    tasks = [];
    loaded = false;
    isLoading = false;
    loadError = false;
    submitResult = null;
  }
</script>

<div class="lesson">
  <div class="lesson-header">
    <span class="lesson-badge">Lesson 10</span>
    <h1>{lang === 'en' ? 'Data Loading' : 'Carga de Datos'}</h1>
    <div class="app-feature">
      <span>🛠️ {lang === 'en' ? 'App Feature: Server Data' : 'Funcionalidad: Datos del Servidor'}</span>
    </div>
  </div>

  <div class="lesson-content">

    <section class="intro-section">
      <p class="intro-text">
        {lang === 'en'
          ? 'SvelteKit provides powerful data loading capabilities. Before your page even renders, you can fetch data from APIs, databases, or files. This lesson covers the load function, server-side data, and form actions.'
          : 'SvelteKit proporciona potentes capacidades de carga de datos. Antes de que tu página se renderice, puedes obtener datos de APIs, bases de datos o archivos. Esta lección cubre la función load, datos del servidor y acciones de formulario.'}
      </p>
    </section>

    <section class="section">
      <h2>📖 {lang === 'en' ? 'What is Data Loading?' : '¿Qué es la Carga de Datos?'}</h2>
      <div class="theory-block">
        <p>{lang === 'en'
          ? 'In SvelteKit, each page can have a load function that runs before the component renders. This function fetches data and passes it as props to your page component.'
          : 'En SvelteKit, cada página puede tener una función load que se ejecuta antes de que el componente se renderice. Esta función obtiene datos y los pasa como props a tu componente de página.'}</p>
        <p>{lang === 'en' ? 'There are two types of load functions:' : 'Hay dos tipos de funciones load:'}</p>
        <ul>
          <li><strong>+page.ts</strong> — {lang === 'en' ? 'Runs in the browser (client load). Can use fetch().' : 'Se ejecuta en el navegador (carga del cliente). Puede usar fetch().'}</li>
          <li><strong>+page.server.ts</strong> — {lang === 'en' ? 'Runs on the server only. Can access databases, cookies, environment variables.' : 'Se ejecuta solo en el servidor. Puede acceder a bases de datos, cookies, variables de entorno.'}</li>
        </ul>
      </div>
    </section>

    <section class="section">
      <h2>💻 {lang === 'en' ? 'How +page.ts Works' : 'Cómo Funciona +page.ts'}</h2>
      <div class="code-comparison">
        <div class="code-side">
          <div class="code-label">src/routes/tasks/+page.ts</div>
          <pre class="code-block"><code>{codePageTs}</code></pre>
        </div>
        <div class="code-side">
          <div class="code-label">src/routes/tasks/+page.svelte</div>
          <pre class="code-block"><code>{codePageSvelte}</code></pre>
        </div>
      </div>
      <div class="flow-diagram">
        <div class="flow-step">
          <div class="flow-icon">1</div>
          <div>{lang === 'en' ? 'User visits /tasks' : 'Usuario visita /tasks'}</div>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <div class="flow-icon">2</div>
          <div>{lang === 'en' ? 'load() runs' : 'load() se ejecuta'}</div>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <div class="flow-icon">3</div>
          <div>{lang === 'en' ? 'Data fetched' : 'Datos obtenidos'}</div>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <div class="flow-icon">4</div>
          <div>{lang === 'en' ? 'Page renders with data' : 'Página se renderiza'}</div>
        </div>
      </div>
    </section>

    <section class="section">
      <h2>📖 {lang === 'en' ? '+page.server.ts vs +page.ts' : '+page.server.ts vs +page.ts'}</h2>
      <div class="comparison-table">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>+page.ts <span class="tag client">Client</span></th>
              <th>+page.server.ts <span class="tag server">Server</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{lang === 'en' ? 'Runs where?' : '¿Dónde se ejecuta?'}</td>
              <td>{lang === 'en' ? 'Browser + Server (SSR)' : 'Navegador + Servidor (SSR)'}</td>
              <td>{lang === 'en' ? 'Server only' : 'Solo servidor'}</td>
            </tr>
            <tr>
              <td>{lang === 'en' ? 'Can access DB?' : '¿Acceso a BD?'}</td>
              <td>{lang === 'en' ? 'No' : 'No'}</td>
              <td>{lang === 'en' ? 'Yes' : 'Sí'}</td>
            </tr>
            <tr>
              <td>{lang === 'en' ? 'Can use secrets?' : '¿Puede usar secretos?'}</td>
              <td>{lang === 'en' ? 'No (exposed to client)' : 'No (expuesto al cliente)'}</td>
              <td>{lang === 'en' ? 'Yes' : 'Sí'}</td>
            </tr>
            <tr>
              <td>{lang === 'en' ? 'Can use fetch()?' : '¿Puede usar fetch()?'}</td>
              <td>{lang === 'en' ? 'Yes' : 'Sí'}</td>
              <td>{lang === 'en' ? 'Yes' : 'Sí'}</td>
            </tr>
            <tr>
              <td>{lang === 'en' ? 'Use case' : 'Caso de uso'}</td>
              <td>{lang === 'en' ? 'Fetch from external APIs' : 'Obtener de APIs externas'}</td>
              <td>{lang === 'en' ? 'Database queries, auth checks' : 'Consultas a BD, verificación de auth'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="section">
      <h2>📖 {lang === 'en' ? 'Form Actions' : 'Acciones de Formulario'}</h2>
      <div class="theory-block">
        <p>{lang === 'en'
          ? 'Form actions let you handle form submissions on the server. Define them in +page.server.ts:'
          : 'Las acciones de formulario te permiten manejar envíos de formularios en el servidor. Defínelas en +page.server.ts:'}</p>
      </div>
      <pre class="code-block"><code>{codeServerTs}</code></pre>
    </section>

    <section class="section">
      <h2>🎮 {lang === 'en' ? 'Interactive Demo: Data Loading Simulator' : 'Demo Interactiva: Simulador de Carga'}</h2>

      <div class="demo-tabs">
        <button class="tab" class:active={activeTab === 'load'} onclick={() => { activeTab = 'load'; resetDemo(); }}>
          {lang === 'en' ? 'Load Data' : 'Cargar Datos'}
        </button>
        <button class="tab" class:active={activeTab === 'actions'} onclick={() => { activeTab = 'actions'; resetDemo(); }}>
          {lang === 'en' ? 'Form Action' : 'Acción de Formulario'}
        </button>
      </div>

      {#if activeTab === 'load'}
        <div class="demo-box">
          <div class="demo-controls">
            <button class="btn primary" onclick={simulateLoad} disabled={isLoading}>
              {isLoading ? '⏳ Loading...' : '📡 Fetch /api/tasks'}
            </button>
            <button class="btn danger" onclick={simulateError} disabled={isLoading}>
              {lang === 'en' ? '💥 Simulate Error' : '💥 Simular Error'}
            </button>
            <button class="btn secondary" onclick={resetDemo}>
              {lang === 'en' ? '🔄 Reset' : '🔄 Reiniciar'}
            </button>
          </div>

          <div class="result-area">
            {#if isLoading}
              <div class="loading-state">
                <div class="spinner"></div>
                <p>{lang === 'en' ? 'Fetching data from server...' : 'Obteniendo datos del servidor...'}</p>
                <pre class="code-block"><code>{codeLoadingState}</code></pre>
              </div>
            {:else if loadError}
              <div class="error-state">
                <p class="error-title">❌ {lang === 'en' ? 'Load Failed!' : '¡Error al cargar!'}</p>
                <pre class="code-block"><code>{codeError}</code></pre>
              </div>
            {:else if loaded}
              <div class="success-state">
                <p class="success-title">✅ {lang === 'en' ? 'Data loaded!' : '¡Datos cargados!'}</p>
                <div class="task-list">
                  {#each tasks as task}
                    <div class="task-item">
                      <span class="task-priority {task.priority}">{task.priority}</span>
                      <span class={task.done ? 'done' : ''}>{task.text}</span>
                      {#if task.done}
                        <span class="badge done-badge">✓</span>
                      {/if}
                    </div>
                  {/each}
                </div>
                <p class="result-note">
                  {lang === 'en' ? 'This data came from the simulated load function' : 'Estos datos vienen de la función load simulada'}
                </p>
              </div>
            {:else}
              <div class="empty-state">
                <p>{lang === 'en' ? 'Click "Fetch" to simulate loading data' : 'Haz clic en "Fetch" para simular la carga de datos'}</p>
              </div>
            {/if}
          </div>
        </div>
      {/if}

      {#if activeTab === 'actions'}
        <div class="demo-box">
          <div class="demo-controls">
            <form class="action-form" onsubmit={(e) => { e.preventDefault(); simulateSubmit(); }}>
              <input type="text" bind:value={newTask} placeholder={lang === 'en' ? 'Task title...' : 'Título de la tarea...'} />
              <select bind:value={newPriority}>
                <option value="high">{lang === 'en' ? '🔴 High' : '🔴 Alta'}</option>
                <option value="medium">{lang === 'en' ? '🟡 Medium' : '🟡 Media'}</option>
                <option value="low">{lang === 'en' ? '🟢 Low' : '🟢 Baja'}</option>
              </select>
              <button type="submit" class="btn primary" disabled={submitting || !newTask.trim()}>
                {submitting ? '⏳ Submitting...' : '📝 Submit'}
              </button>
            </form>
          </div>

          <div class="result-area">
            {#if submitting}
              <div class="loading-state">
                <div class="spinner"></div>
                <p>{lang === 'en' ? 'Processing form action...' : 'Procesando acción del formulario...'}</p>
              </div>
            {:else if submitResult}
              <div class="success-state">
                <p class={submitResult.success ? 'success-title' : 'error-title'}>
                  {submitResult.success ? '✅' : '❌'} {submitResult.message}
                </p>
              </div>
            {/if}

            {#if tasks.length > 0}
              <div class="task-list">
                {#each tasks as task}
                  <div class="task-item">
                    <span class="task-priority {task.priority}">{task.priority}</span>
                    <span>{task.text}</span>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="empty-state">
                <p>{lang === 'en' ? 'Add a task using the form above' : 'Agrega una tarea usando el formulario arriba'}</p>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </section>

    <section class="section">
      <h2>⚠️ {lang === 'en' ? 'Common Mistakes' : 'Errores Comunes'}</h2>
      <div class="mistakes-list">
        <div class="mistake">
          <div class="mistake-wrong">❌</div>
          <div>
            <strong>{lang === 'en' ? 'Using onMount for initial data fetching' : 'Usar onMount para obtener datos iniciales'}</strong>
            <p>{lang === 'en' ? 'Use the load function instead. It runs before the page renders, avoiding loading flicker.' : 'Usa la función load en su lugar. Se ejecuta antes de que la página se renderice, evitando parpadeos de carga.'}</p>
          </div>
        </div>
        <div class="mistake">
          <div class="mistake-wrong">❌</div>
          <div>
            <strong>{lang === 'en' ? 'Putting secrets in +page.ts' : 'Poner secretos en +page.ts'}</strong>
            <p>{lang === 'en' ? '+page.ts code is sent to the browser! Use +page.server.ts for API keys and database access.' : '¡El código de +page.ts se envía al navegador! Usa +page.server.ts para claves API y acceso a bases de datos.'}</p>
          </div>
        </div>
        <div class="mistake">
          <div class="mistake-wrong">❌</div>
          <div>
            <strong>{lang === 'en' ? 'Forgetting to return data from load' : 'Olvidar retornar datos de load'}</strong>
            <p>{lang === 'en' ? 'The load function must return an object. That object becomes available as data in your page component.' : 'La función load debe retornar un objeto. Ese objeto queda disponible como data en tu componente de página.'}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="exercise-section">
      <h2>✏️ {lang === 'en' ? 'Exercise' : 'Ejercicio'}: Load User Data</h2>
      <div class="exercise-task">
        <p>{lang === 'en' ? 'Create a page that loads user data from the server:' : 'Crea una página que cargue datos de usuario desde el servidor:'}</p>
        <ul>
          <li>{lang === 'en' ? 'Create `+page.server.ts` with a load function that returns fake user data' : 'Crea `+page.server.ts` con una función load que retorne datos falsos de usuario'}</li>
          <li>{lang === 'en' ? 'In `+page.svelte`, receive the data via `$props()`' : 'En `+page.svelte`, recibe los datos via `$props()`'}</li>
          <li>{lang === 'en' ? 'Display the user\'s name, email, and a list of their posts' : 'Muestra el nombre del usuario, email y una lista de sus posts'}</li>
          <li>{lang === 'en' ? 'Show a loading state while data is being fetched' : 'Muestra un estado de carga mientras se obtienen los datos'}</li>
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
    <a class="nav-btn prev" href="/09-routing">← {lang === 'en' ? 'Previous' : 'Anterior'}</a>
    <a class="nav-btn next" href="/11-api">{lang === 'en' ? 'Next' : 'Siguiente'} →</a>
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
  .app-feature { color: var(--primary); font-weight: 500; font-size: 0.95rem; margin-top: 0.5rem; }
  .section { margin-bottom: 2.5rem; }
  .intro-section { background: var(--surface); padding: 1.5rem; border-radius: 12px; border-left: 4px solid var(--primary); margin-bottom: 2rem; }
  .intro-text { line-height: 1.7; }
  .theory-block { line-height: 1.7; }
  .theory-block ul { margin: 1rem 0; padding-left: 1.5rem; }
  .theory-block li { margin-bottom: 0.5rem; }

  .code-comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0; }
  .code-label { color: #89b4fa; font-family: monospace; font-size: 0.8rem; margin-bottom: 0.5rem; }
  .code-side { background: #1e1e2e; border-radius: 12px; padding: 1rem; overflow-x: auto; }
  .code-block { background: #1e1e2e; border-radius: 12px; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
  .code-block code, .code-side code { color: #cdd6f4; font-family: 'Fira Code', 'Consolas', monospace; font-size: 0.85rem; line-height: 1.6; white-space: pre; }

  .flow-diagram { display: flex; align-items: center; gap: 0.75rem; margin: 1.5rem 0; flex-wrap: wrap; }
  .flow-step { display: flex; align-items: center; gap: 0.5rem; background: var(--surface); padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.9rem; }
  .flow-icon { background: var(--primary); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }
  .flow-arrow { color: var(--text-muted); font-size: 1.2rem; }

  .comparison-table { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--border); }
  th { background: var(--surface); font-weight: 600; }
  .tag { font-size: 0.7rem; padding: 2px 8px; border-radius: 10px; font-weight: 600; }
  .tag.client { background: #dbeafe; color: #1d4ed8; }
  .tag.server { background: #dcfce7; color: #16a34a; }

  .demo-tabs { display: flex; gap: 4px; margin-bottom: 1rem; }
  .tab { padding: 8px 20px; border: 1px solid var(--border); background: var(--surface); border-radius: 8px; cursor: pointer; font-weight: 500; }
  .tab.active { background: var(--primary); color: white; border-color: var(--primary); }

  .demo-box { background: var(--surface); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border); }
  .demo-controls { display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
  .action-form { display: flex; gap: 0.5rem; flex-wrap: wrap; width: 100%; }
  .action-form input { flex: 1; min-width: 200px; padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.9rem; }
  .action-form select { padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; }
  .btn { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; font-size: 0.9rem; }
  .btn.primary { background: var(--primary); color: white; }
  .btn.primary:hover { opacity: 0.9; }
  .btn.danger { background: #ef4444; color: white; }
  .btn.secondary { background: var(--border); color: var(--text); }

  .result-area { min-height: 150px; }
  .loading-state { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 2rem; }
  .spinner { width: 40px; height: 40px; border: 4px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .success-state { padding: 1rem; }
  .success-title { color: var(--success); font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem; }
  .error-state { padding: 1rem; }
  .error-title { color: var(--error); font-weight: 600; font-size: 1.1rem; }
  .empty-state { text-align: center; padding: 2rem; color: var(--text-muted); }
  .result-note { font-size: 0.85rem; color: var(--text-muted); margin-top: 1rem; font-style: italic; }

  .task-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .task-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; background: white; border-radius: 8px; border: 1px solid var(--border); }
  .task-priority { font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
  .task-priority.high { background: #fecaca; color: #dc2626; }
  .task-priority.medium { background: #fef3c7; color: #d97706; }
  .task-priority.low { background: #dcfce7; color: #16a34a; }
  .done { text-decoration: line-through; color: var(--text-muted); }
  .badge { font-size: 0.8rem; }
  .done-badge { color: var(--success); }

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

  @media (max-width: 768px) {
    .code-comparison { grid-template-columns: 1fr; }
    .flow-diagram { flex-direction: column; }
    .flow-arrow { transform: rotate(90deg); }
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
