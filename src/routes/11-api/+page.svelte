<script lang="ts">
  import LessonLayout from '$lib/components/LessonLayout.svelte';
  import CodeExample from '$lib/components/CodeExample.svelte';
  import { getLang } from '$lib/i18n/language.svelte.js';

  let lang = $derived(getLang());

  let showSolution = $state(false);
  const solutionCode = `// src/lib/server/quotes.ts — shared store (in-memory)
export let quotes = [
  { id: 1, text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { id: 2, text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
];

export function setQuotes(next: typeof quotes) {
  quotes = next;
}

// src/routes/api/quotes/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { quotes, setQuotes } from '$lib/server/quotes';

export const GET: RequestHandler = async () => {
  return json(quotes);
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  // Spread body first so the server-generated id cannot be overridden by the client.
  const newQuote = { ...body, id: Date.now() };
  setQuotes([...quotes, newQuote]);
  return json(newQuote, { status: 201 });
};

// src/routes/api/quotes/[id]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { quotes, setQuotes } from '$lib/server/quotes';

export const GET: RequestHandler = async ({ params }) => {
  const quote = quotes.find(q => q.id === Number(params.id));
  if (!quote) return json({ error: 'Not found' }, { status: 404 });
  return json(quote);
};

export const DELETE: RequestHandler = async ({ params }) => {
  setQuotes(quotes.filter(q => q.id !== Number(params.id)));
  return json({ success: true });
};`;

  interface SimTask {
    id: number;
    title: string;
    done: boolean;
  }

  let tasks = $state<SimTask[]>([
    { id: 1, title: 'Learn SvelteKit', done: true },
    { id: 2, title: 'Build an API', done: false },
    { id: 3, title: 'Deploy to production', done: false }
  ]);
  let nextId = $state(4);
  let newTaskTitle = $state('');
  let loading = $state(false);
  let activeTab = $state<'explorer' | 'crud' | 'visualizer' | 'errors'>('explorer');

  interface LogEntry {
    method: string;
    path: string;
    status: number;
    statusText: string;
    reqBody?: string;
    resBody: string;
    timestamp: number;
    duration: number;
  }
  let networkLog = $state<LogEntry[]>([]);
  let selectedLog = $state<LogEntry | null>(null);

  let explorerMethod = $state<string>('GET');
  let explorerPath = $state<string>('/api/tasks');
  let explorerResStatus = $state(0);
  let explorerResBody = $state('');
  let explorerLoading = $state(false);
  let explorerReqBody = $state('');
  let showExplorerReqBody = $state(false);

  let errorType = $state<number>(0);
  let errorResStatus = $state(0);
  let errorResBody = $state('');
  let errorLoading = $state(false);

  function simulateApi(method: string, path: string, body?: object): Promise<{ status: number; body: object }> {
    return new Promise((resolve) => {
      const latency = 200 + Math.random() * 300;
      setTimeout(() => {
        if (path === '/api/tasks') {
          if (method === 'GET') {
            resolve({ status: 200, body: tasks });
          } else if (method === 'POST') {
            if (!body || !(body as Record<string, string>).title) {
              resolve({ status: 400, body: { error: 'Missing required field: title' } });
              return;
            }
            const newTask: SimTask = { id: nextId++, title: (body as Record<string, string>).title, done: false };
            tasks = [...tasks, newTask];
            resolve({ status: 201, body: newTask });
          } else {
            resolve({ status: 405, body: { error: 'Method not allowed' } });
          }
        } else if (path.startsWith('/api/tasks/')) {
          const id = parseInt(path.split('/').pop()!);
          const task = tasks.find((t) => t.id === id);
          if (!task) {
            resolve({ status: 404, body: { error: `Task with id ${id} not found` } });
            return;
          }
          if (method === 'GET') {
            resolve({ status: 200, body: task });
          } else if (method === 'PUT') {
            if (body) {
              const b = body as Record<string, unknown>;
              if (typeof b.title === 'string') task.title = b.title;
              if (typeof b.done === 'boolean') task.done = b.done;
            }
            tasks = [...tasks];
            resolve({ status: 200, body: task });
          } else if (method === 'DELETE') {
            tasks = tasks.filter((t) => t.id !== id);
            resolve({ status: 204, body: {} });
          } else {
            resolve({ status: 405, body: { error: 'Method not allowed' } });
          }
        } else {
          resolve({ status: 404, body: { error: 'Not found' } });
        }
      }, latency);
    });
  }

  async function runExplorerRequest() {
    explorerLoading = true;
    const start = performance.now();
    let reqBody: string | undefined;
    if (explorerMethod === 'POST' || explorerMethod === 'PUT') {
      try {
        const parsed = JSON.parse(explorerReqBody);
        reqBody = JSON.stringify(parsed, null, 2);
        const result = await simulateApi(explorerMethod, explorerPath, parsed);
        const duration = Math.round(performance.now() - start);
        explorerResStatus = result.status;
        explorerResBody = JSON.stringify(result.body, null, 2);
        networkLog = [
          { method: explorerMethod, path: explorerPath, status: result.status, statusText: getStatusText(result.status), reqBody, resBody: explorerResBody, timestamp: Date.now(), duration },
          ...networkLog
        ];
      } catch {
        explorerResStatus = 400;
        explorerResBody = JSON.stringify({ error: 'Invalid JSON body' }, null, 2);
      }
    } else {
      const result = await simulateApi(explorerMethod, explorerPath);
      const duration = Math.round(performance.now() - start);
      explorerResStatus = result.status;
      explorerResBody = JSON.stringify(result.body, null, 2);
      networkLog = [
        { method: explorerMethod, path: explorerPath, status: result.status, statusText: getStatusText(result.status), resBody: explorerResBody, timestamp: Date.now(), duration },
        ...networkLog
      ];
    }
    explorerLoading = false;
  }

  async function addCrudTask() {
    const title = newTaskTitle.trim();
    if (!title) return;
    loading = true;
    const start = performance.now();
    const result = await simulateApi('POST', '/api/tasks', { title });
    const duration = Math.round(performance.now() - start);
    networkLog = [
      { method: 'POST', path: '/api/tasks', status: result.status, statusText: getStatusText(result.status), reqBody: JSON.stringify({ title }, null, 2), resBody: JSON.stringify(result.body, null, 2), timestamp: Date.now(), duration },
      ...networkLog
    ];
    newTaskTitle = '';
    loading = false;
  }

  async function toggleCrudTask(id: number) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    loading = true;
    const start = performance.now();
    const result = await simulateApi('PUT', `/api/tasks/${id}`, { done: !task.done });
    const duration = Math.round(performance.now() - start);
    networkLog = [
      { method: 'PUT', path: `/api/tasks/${id}`, status: result.status, statusText: getStatusText(result.status), reqBody: JSON.stringify({ done: !task.done }, null, 2), resBody: JSON.stringify(result.body, null, 2), timestamp: Date.now(), duration },
      ...networkLog
    ];
    loading = false;
  }

  async function deleteCrudTask(id: number) {
    loading = true;
    const start = performance.now();
    const result = await simulateApi('DELETE', `/api/tasks/${id}`);
    const duration = Math.round(performance.now() - start);
    networkLog = [
      { method: 'DELETE', path: `/api/tasks/${id}`, status: result.status, statusText: getStatusText(result.status), resBody: result.status === 204 ? '(no content)' : JSON.stringify(result.body, null, 2), timestamp: Date.now(), duration },
      ...networkLog
    ];
    loading = false;
  }

  async function simulateError(statusCode: number) {
    errorLoading = true;
    const start = performance.now();
    const duration = Math.round(200 + Math.random() * 100);
    await new Promise((r) => setTimeout(r, duration));
    const bodies: Record<number, { error: string; details?: string }> = {
      400: { error: 'Bad Request', details: lang === 'en' ? 'The request body is missing required fields.' : 'El cuerpo de la solicitud carece de campos requeridos.' },
      404: { error: 'Not Found', details: lang === 'en' ? 'The requested resource does not exist.' : 'El recurso solicitado no existe.' },
      500: { error: 'Internal Server Error', details: lang === 'en' ? 'An unexpected error occurred on the server.' : 'Ocurrió un error inesperado en el servidor.' }
    };
    errorResStatus = statusCode;
    errorResBody = JSON.stringify(bodies[statusCode], null, 2);
    networkLog = [
      { method: 'GET', path: '/api/tasks/999', status: statusCode, statusText: getStatusText(statusCode), resBody: errorResBody, timestamp: Date.now(), duration: Math.round(performance.now() - start) },
      ...networkLog
    ];
    errorLoading = false;
  }

  function getStatusText(code: number): string {
    const map: Record<number, string> = { 200: 'OK', 201: 'Created', 204: 'No Content', 400: 'Bad Request', 404: 'Not Found', 405: 'Method Not Allowed', 500: 'Internal Server Error' };
    return map[code] || 'Unknown';
  }

  function statusColor(code: number): string {
    if (code >= 200 && code < 300) return 'var(--success)';
    if (code >= 400 && code < 500) return 'var(--warning)';
    return 'var(--error)';
  }

  let searchQuery = $state('');
  let filteredTasks = $derived(
    searchQuery.trim()
      ? tasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : tasks
  );
  let lastSearchLog = $state<LogEntry | null>(null);

  async function runSearch() {
    const query = searchQuery.trim();
    if (!query) return;
    const start = performance.now();
    await new Promise((r) => setTimeout(r, 100 + Math.random() * 150));
    const duration = Math.round(performance.now() - start);
    lastSearchLog = {
      method: 'GET',
      path: `/api/tasks?search=${encodeURIComponent(query)}`,
      status: 200,
      statusText: 'OK',
      resBody: JSON.stringify(filteredTasks, null, 2),
      timestamp: Date.now(),
      duration
    };
  }

  const text = {
    en: {
      title: 'API Routes',
      appFeature: 'REST API',
      topic1Title: 'Creating API Endpoints with +server.ts',
      topic1Desc: 'In SvelteKit, API routes are defined in +server.ts files. Each exported function named after an HTTP method (GET, POST, PUT, DELETE, PATCH) handles that method\'s requests. The function receives a RequestEvent and returns a Response object.',
      topic1Code: `// src/routes/api/tasks/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

let tasks = [
  { id: 1, title: 'Learn SvelteKit', done: true }
];

export const GET: RequestHandler = async () => {
  return json(tasks);
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const newTask = { id: tasks.length + 1, ...body };
  tasks.push(newTask);
  return json(newTask, { status: 201 });
};`,
      topic2Title: 'Request and Response Objects',
      topic2Desc: 'The RequestEvent provides access to the request body, URL parameters, query string parameters, headers, and cookies. Use these to build dynamic, data-driven APIs that respond to different inputs.',
      topic2Code: `// src/routes/api/tasks/[id]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url }) => {
  const id = Number(params.id);
  const task = tasks.find(t => t.id === id);

  // Access query params
  const includeMeta = url.searchParams.get('meta') === 'true';

  if (!task) {
    return json({ error: 'Not found' }, { status: 404 });
  }

  if (includeMeta) {
    return json({ data: task, meta: { requestedAt: new Date().toISOString() } });
  }

  return json(task);
};

export const PUT: RequestHandler = async ({ params, request }) => {
  const id = Number(params.id);
  const body = await request.json();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return json({ error: 'Not found' }, { status: 404 });
  }
  tasks[index] = { ...tasks[index], ...body };
  return json(tasks[index]);
};`,
      topic3Title: 'JSON Handling',
      topic3Desc: 'SvelteKit provides a json() helper that sets the correct Content-Type header and serializes your data. For reading request bodies, use the standard Web API request.json() method to parse incoming JSON payloads.',
      topic3Code: `import { json } from '@sveltejs/kit';

// Returning JSON responses
export const GET = async () => {
  return json({ message: 'Hello from the API!' });
};

// Returning with status codes
export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    if (!data.name) {
      return json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    return json({ success: true, data }, { status: 201 });
  } catch {
    return json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }
};`,
      topic4Title: 'CRUD Operations Pattern',
      topic4Desc: 'A full CRUD API maps Create (POST), Read (GET), Update (PUT), and Delete (DELETE) to HTTP methods. SvelteKit makes this clean by letting you export one function per method in the same +server.ts file.',
      topic4Code: `// src/routes/api/tasks/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

let tasks = [{ id: 1, title: 'First task', done: false }];
let nextId = 2;

export const GET: RequestHandler = async () => {
  return json(tasks);
};

export const POST: RequestHandler = async ({ request }) => {
  const { title } = await request.json();
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  return json(task, { status: 201 });
};

// src/routes/api/tasks/[id]/+server.ts
export const DELETE: RequestHandler = async ({ params }) => {
  const id = Number(params.id);
  tasks = tasks.filter(t => t.id !== id);
  return new Response(null, { status: 204 });
};`,
      topic5Title: 'Error Handling in API Routes',
      topic5Desc: 'Always return appropriate HTTP status codes: 200 for success, 201 for created, 204 for deleted, 400 for bad requests, 404 for not found, and 500 for server errors. Use the error() and json() helpers to send consistent error responses.',
      topic5Code: `import { json, error } from '@sveltejs/kit';

export const GET = async ({ params }) => {
  const id = Number(params.id);

  if (isNaN(id)) {
    throw error(400, { message: 'ID must be a number' });
  }

  const task = tasks.find(t => t.id === id);

  if (!task) {
    throw error(404, { message: \`Task \${id} not found\` });
  }

  return json(task);
};

// Or return errors manually:
export const POST = async ({ request }) => {
  const body = await request.json();

  if (!body.title || body.title.trim() === '') {
    return json(
      { error: 'Title is required', field: 'title' },
      { status: 400 }
    );
  }

  return json({ success: true });
};`,
      demo1Title: 'API Explorer',
      demo1Desc: 'Simulate API requests. Click a method/path combo and see the request/response cycle.',
      send: 'Send',
      request: 'Request',
      response: 'Response',
      status: 'Status',
      body: 'Body',
      loading: 'Loading...',
      reqBodyLabel: 'Request Body (JSON)',
      demo2Title: 'Task CRUD Manager',
      demo2Desc: 'Add, toggle, and delete tasks. Each action simulates an API call with fake latency.',
      addTask: 'Add',
      inputPlaceholder: 'New task title...',
      noTasks: 'No tasks yet!',
      demo3Title: 'HTTP Request/Response Visualizer',
      demo3Desc: 'See what an HTTP exchange looks like for a GET request to /api/tasks/1.',
      requestLabel: 'HTTP Request',
      responseLabel: 'HTTP Response',
      demo4Title: 'Error Scenarios',
      demo4Desc: 'Trigger different error responses and see how status codes and messages change.',
      trigger400: 'Trigger 400',
      trigger404: 'Trigger 404',
      trigger500: 'Trigger 500',
      errorButton: 'Trigger',
      networkLogTitle: 'Network Log',
      clearLog: 'Clear',
      method: 'Method',
      path: 'Path',
      duration: 'Duration',
      noLogs: 'No requests yet. Use the tools above to make API calls.',
      milliseconds: 'ms',
      mistakesTitle: 'Common Mistakes',
      mistake1Title: 'Missing JSON parsing of request body',
      mistake1Wrong: `export const POST = async ({ request }) => {
  // request is a Request object, not parsed JSON!
  const task = request; // WRONG!
  tasks.push(task);
  return json(task);
};`,
      mistake1Correct: `export const POST = async ({ request }) => {
  const task = await request.json(); // Parse first!
  tasks.push(task);
  return json(task, { status: 201 });
};`,
      mistake1Explain: 'The request parameter is a standard Web API Request object. You must call request.json() to parse the body. Without parsing, you\'re working with the raw Request object, not the data.',
      mistake2Title: 'Using wrong HTTP method names',
      mistake2Wrong: `// +server.ts
export const get = async () => { /* ... */ };
export const post = async () => { /* ... */ };
// lowercase! SvelteKit won't recognize these`,
      mistake2Correct: `// +server.ts
export const GET = async () => { /* ... */ };
export const POST = async () => { /* ... */ };
// UPPERCASE is required for HTTP method handlers`,
      mistake2Explain: 'SvelteKit requires uppercase HTTP method names (GET, POST, PUT, DELETE, PATCH). Lowercase exports are ignored — the framework won\'t route requests to them.',
      mistake3Title: 'Not returning error responses',
      mistake3Wrong: `export const GET = async ({ params }) => {
  const task = tasks.find(t => t.id === Number(params.id));
  if (!task) {
    return null; // Client gets a confusing response!
  }
  return json(task);
};`,
      mistake3Correct: `import { json, error } from '@sveltejs/kit';

export const GET = async ({ params }) => {
  const task = tasks.find(t => t.id === Number(params.id));
  if (!task) {
    throw error(404, { message: 'Task not found' });
  }
  return json(task);
};`,
      mistake3Explain: 'Always return a proper response for error cases. Returning null or undefined causes unexpected behavior. Use error() to throw HTTP errors or json() with a status option for custom error bodies.',
      mistake4Title: 'Missing CORS headers for cross-origin requests',
      mistake4Wrong: `// +server.ts
export const GET = async () => {
  return json({ data: 'hello' });
  // No CORS headers — browser blocks this
  // from any domain other than your app
};`,
      mistake4Correct: `// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  return response;
};`,
      mistake4Explain: 'If your API needs to be accessible from other domains (e.g., a separate frontend), configure CORS headers. Do this in hooks.server.ts to apply globally, or per-route using the response headers option.',
      challengeTitle: 'Challenge: Add Search/Filter Query Parameters',
      challengeDesc: 'Add a search input that filters tasks by title. The simulated API call uses query parameters like ?search=svelte. Try typing to see how query params work in API routes.',
      searchPlaceholder: 'Search tasks...',
      search: 'Search',
      searchResult: 'Results',
      searchHint: `// src/routes/api/tasks/+server.ts
export const GET: RequestHandler = async ({ url }) => {
  const search = url.searchParams.get('search');
  let result = tasks;

  if (search) {
    result = tasks.filter(t =>
      t.title.toLowerCase()
        .includes(search.toLowerCase())
    );
  }

  return json(result);
};

// Client calls:
// GET /api/tasks?search=svelte`
    },
    es: {
      title: 'Rutas API',
      appFeature: 'API REST',
      topic1Title: 'Crear Endpoints API con +server.ts',
      topic1Desc: 'En SvelteKit, las rutas API se definen en archivos +server.ts. Cada función exportada con el nombre de un método HTTP (GET, POST, PUT, DELETE, PATCH) maneja las solicitudes de ese método. La función recibe un RequestEvent y devuelve un objeto Response.',
      topic1Code: `// src/routes/api/tasks/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

let tasks = [
  { id: 1, title: 'Aprender SvelteKit', done: true }
];

export const GET: RequestHandler = async () => {
  return json(tasks);
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const newTask = { id: tasks.length + 1, ...body };
  tasks.push(newTask);
  return json(newTask, { status: 201 });
};`,
      topic2Title: 'Objetos Request y Response',
      topic2Desc: 'El RequestEvent da acceso al cuerpo de la solicitud, parámetros de URL, parámetros de query string, headers y cookies. Úsalos para construir APIs dinámicas que respondan a diferentes entradas.',
      topic2Code: `// src/routes/api/tasks/[id]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url }) => {
  const id = Number(params.id);
  const task = tasks.find(t => t.id === id);

  // Acceder a parámetros de query
  const incluirMeta = url.searchParams.get('meta') === 'true';

  if (!task) {
    return json({ error: 'No encontrado' }, { status: 404 });
  }

  if (incluirMeta) {
    return json({ data: task, meta: { solicitadoEn: new Date().toISOString() } });
  }

  return json(task);
};

export const PUT: RequestHandler = async ({ params, request }) => {
  const id = Number(params.id);
  const body = await request.json();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return json({ error: 'No encontrado' }, { status: 404 });
  }
  tasks[index] = { ...tasks[index], ...body };
  return json(tasks[index]);
};`,
      topic3Title: 'Manejo de JSON',
      topic3Desc: 'SvelteKit proporciona un helper json() que establece el header Content-Type correcto y serializa tus datos. Para leer cuerpos de solicitud, usa el método estándar request.json() de la Web API para parsear payloads JSON entrantes.',
      topic3Code: `import { json } from '@sveltejs/kit';

// Devolver respuestas JSON
export const GET = async () => {
  return json({ message: '¡Hola desde la API!' });
};

// Devolver con códigos de estado
export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    if (!data.name) {
      return json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      );
    }
    return json({ success: true, data }, { status: 201 });
  } catch {
    return json(
      { error: 'Cuerpo JSON inválido' },
      { status: 400 }
    );
  }
};`,
      topic4Title: 'Patrón de Operaciones CRUD',
      topic4Desc: 'Una API CRUD completa mapea Create (POST), Read (GET), Update (PUT) y Delete (DELETE) a métodos HTTP. SvelteKit permite esto limpiamente exportando una función por método en el mismo archivo +server.ts.',
      topic4Code: `// src/routes/api/tasks/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

let tasks = [{ id: 1, title: 'Primera tarea', done: false }];
let nextId = 2;

export const GET: RequestHandler = async () => {
  return json(tasks);
};

export const POST: RequestHandler = async ({ request }) => {
  const { title } = await request.json();
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  return json(task, { status: 201 });
};

// src/routes/api/tasks/[id]/+server.ts
export const DELETE: RequestHandler = async ({ params }) => {
  const id = Number(params.id);
  tasks = tasks.filter(t => t.id !== id);
  return new Response(null, { status: 204 });
};`,
      topic5Title: 'Manejo de Errores en Rutas API',
      topic5Desc: 'Siempre devuelve códigos de estado HTTP apropiados: 200 para éxito, 201 para creado, 204 para eliminado, 400 para solicitudes incorrectas, 404 para no encontrado y 500 para errores del servidor. Usa los helpers error() y json() para enviar respuestas de error consistentes.',
      topic5Code: `import { json, error } from '@sveltejs/kit';

export const GET = async ({ params }) => {
  const id = Number(params.id);

  if (isNaN(id)) {
    throw error(400, { message: 'El ID debe ser un número' });
  }

  const task = tasks.find(t => t.id === id);

  if (!task) {
    throw error(404, { message: \`Tarea \${id} no encontrada\` });
  }

  return json(task);
};

// O devolver errores manualmente:
export const POST = async ({ request }) => {
  const body = await request.json();

  if (!body.title || body.title.trim() === '') {
    return json(
      { error: 'El título es requerido', field: 'title' },
      { status: 400 }
    );
  }

  return json({ success: true });
};`,
      demo1Title: 'Explorador de API',
      demo1Desc: 'Simula solicitudes API. Haz clic en un método/ruta y ve el ciclo solicitud/respuesta.',
      send: 'Enviar',
      request: 'Solicitud',
      response: 'Respuesta',
      status: 'Estado',
      body: 'Cuerpo',
      loading: 'Cargando...',
      reqBodyLabel: 'Cuerpo de Solicitud (JSON)',
      demo2Title: 'Gestor CRUD de Tareas',
      demo2Desc: 'Agrega, alterna y elimina tareas. Cada acción simula una llamada API con latencia falsa.',
      addTask: 'Agregar',
      inputPlaceholder: 'Título de nueva tarea...',
      noTasks: '¡Sin tareas aún!',
      demo3Title: 'Visualizador HTTP Solicitud/Respuesta',
      demo3Desc: 'Ve cómo se ve un intercambio HTTP para una solicitud GET a /api/tasks/1.',
      requestLabel: 'Solicitud HTTP',
      responseLabel: 'Respuesta HTTP',
      demo4Title: 'Escenarios de Error',
      demo4Desc: 'Activa diferentes respuestas de error y ve cómo cambian los códigos de estado y mensajes.',
      trigger400: 'Activar 400',
      trigger404: 'Activar 404',
      trigger500: 'Activar 500',
      errorButton: 'Activar',
      networkLogTitle: 'Registro de Red',
      clearLog: 'Limpiar',
      method: 'Método',
      path: 'Ruta',
      duration: 'Duración',
      noLogs: 'Sin solicitudes aún. Usa las herramientas arriba para hacer llamadas API.',
      milliseconds: 'ms',
      mistakesTitle: 'Errores Comunes',
      mistake1Title: 'Olvidar parsear JSON del cuerpo de la solicitud',
      mistake1Wrong: `export const POST = async ({ request }) => {
  // request es un objeto Request, ¡no JSON parseado!
  const task = request; // ¡INCORRECTO!
  tasks.push(task);
  return json(task);
};`,
      mistake1Correct: `export const POST = async ({ request }) => {
  const task = await request.json(); // ¡Parsea primero!
  tasks.push(task);
  return json(task, { status: 201 });
};`,
      mistake1Explain: 'El parámetro request es un objeto Request estándar de la Web API. Debes llamar request.json() para parsear el cuerpo. Sin parsear, estás trabajando con el objeto Request crudo, no con los datos.',
      mistake2Title: 'Usar nombres incorrectos de métodos HTTP',
      mistake2Wrong: `// +server.ts
export const get = async () => { /* ... */ };
export const post = async () => { /* ... */ };
// ¡minúsculas! SvelteKit no los reconocerá`,
      mistake2Correct: `// +server.ts
export const GET = async () => { /* ... */ };
export const POST = async () => { /* ... */ };
// MAYÚSCULAS es requerido para los handlers de métodos HTTP`,
      mistake2Explain: 'SvelteKit requiere nombres de métodos HTTP en mayúsculas (GET, POST, PUT, DELETE, PATCH). Las exportaciones en minúsculas son ignoradas — el framework no enrutará solicitudes hacia ellas.',
      mistake3Title: 'No devolver respuestas de error',
      mistake3Wrong: `export const GET = async ({ params }) => {
  const task = tasks.find(t => t.id === Number(params.id));
  if (!task) {
    return null; // ¡El cliente recibe una respuesta confusa!
  }
  return json(task);
};`,
      mistake3Correct: `import { json, error } from '@sveltejs/kit';

export const GET = async ({ params }) => {
  const task = tasks.find(t => t.id === Number(params.id));
  if (!task) {
    throw error(404, { message: 'Tarea no encontrada' });
  }
  return json(task);
};`,
      mistake3Explain: 'Siempre devuelve una respuesta apropiada para los casos de error. Devolver null o undefined causa comportamiento inesperado. Usa error() para lanzar errores HTTP o json() con una opción de status para cuerpos de error personalizados.',
      mistake4Title: 'Falta de headers CORS para solicitudes cross-origin',
      mistake4Wrong: `// +server.ts
export const GET = async () => {
  return json({ data: 'hola' });
  // Sin headers CORS — el navegador bloquea esto
  // desde cualquier dominio que no sea tu app
};`,
      mistake4Correct: `// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  return response;
};`,
      mistake4Explain: 'Si tu API necesita ser accesible desde otros dominios (ej. un frontend separado), configura headers CORS. Hazlo en hooks.server.ts para aplicar globalmente, o por ruta usando la opción de headers de respuesta.',
      challengeTitle: 'Reto: Agregar Parámetros de Búsqueda/Filtro',
      challengeDesc: 'Agrega un input de búsqueda que filtre tareas por título. La llamada API simulada usa parámetros de query como ?search=svelte. Escribe para ver cómo funcionan los query params en rutas API.',
      searchPlaceholder: 'Buscar tareas...',
      search: 'Buscar',
      searchResult: 'Resultados',
      searchHint: `// src/routes/api/tasks/+server.ts
export const GET: RequestHandler = async ({ url }) => {
  const search = url.searchParams.get('search');
  let result = tasks;

  if (search) {
    result = tasks.filter(t =>
      t.title.toLowerCase()
        .includes(search.toLowerCase())
    );
  }

  return json(result);
};

// El cliente llama:
// GET /api/tasks?search=svelte`
    }
  };

  let t = $derived(text[lang]);
</script>

<LessonLayout lessonNum="11" title={t.title} appFeature={t.appFeature}>
  {#snippet theory()}
    <div class="topics">
      <section class="topic">
        <h3>1. {t.topic1Title}</h3>
        <p>{t.topic1Desc}</p>
        <CodeExample code={t.topic1Code} filename="src/routes/api/tasks/+server.ts" />
        <div class="interactive-box">
          <h4>{t.demo1Title}</h4>
          <p class="demo-desc">{t.demo1Desc}</p>
          <div class="explorer">
            <div class="explorer-bar">
              <select bind:value={explorerMethod} class="method-select">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
              <input type="text" class="path-input" bind:value={explorerPath} />
              <button class="btn primary send-btn" onclick={runExplorerRequest} disabled={explorerLoading}>
                {explorerLoading ? t.loading : t.send}
              </button>
            </div>
            {#if explorerMethod === 'POST' || explorerMethod === 'PUT'}
              <div class="explorer-body-section">
                <label class="body-label">{t.reqBodyLabel}:</label>
                <textarea
                  class="body-textarea"
                  bind:value={explorerReqBody}
                  placeholder={'{\n  "title": "My task"\n}'}
                  rows="3"
                ></textarea>
              </div>
            {/if}
            {#if explorerResStatus}
              <div class="explorer-response">
                <div class="res-header">
                  <span class="res-label">{t.response}</span>
                  <span class="res-status" style="background: {statusColor(explorerResStatus)}20; color: {statusColor(explorerResStatus)}">
                    {explorerResStatus} {getStatusText(explorerResStatus)}
                  </span>
                </div>
                <pre class="res-body"><code>{explorerResBody}</code></pre>
              </div>
            {/if}
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>2. {t.topic2Title}</h3>
        <p>{t.topic2Desc}</p>
        <CodeExample code={t.topic2Code} filename="src/routes/api/tasks/[id]/+server.ts" />
      </section>

      <section class="topic">
        <h3>3. {t.topic3Title}</h3>
        <p>{t.topic3Desc}</p>
        <CodeExample code={t.topic3Code} filename="+server.ts" />
      </section>

      <section class="topic">
        <h3>4. {t.topic4Title}</h3>
        <p>{t.topic4Desc}</p>
        <CodeExample code={t.topic4Code} filename="src/routes/api/tasks/+server.ts" />
        <div class="interactive-box">
          <h4>{t.demo2Title}</h4>
          <p class="demo-desc">{t.demo2Desc}</p>
          <div class="crud-app">
            <div class="add-task">
              <input type="text" placeholder={t.inputPlaceholder} bind:value={newTaskTitle} onkeydown={(e) => e.key === 'Enter' && addCrudTask()} />
              <button class="btn primary" onclick={addCrudTask} disabled={loading}>{t.addTask}</button>
            </div>
            <ul class="task-list">
              {#each tasks as task (task.id)}
                <li class:done={task.done}>
                  <span class="task-check" onclick={() => toggleCrudTask(task.id)}>
                    {task.done ? '✅' : '⬜'}
                  </span>
                  <span class="task-title">{task.title}</span>
                  <button class="delete-btn" onclick={() => deleteCrudTask(task.id)}>✕</button>
                </li>
              {:else}
                <li class="empty">{t.noTasks}</li>
              {/each}
            </ul>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>5. {t.topic5Title}</h3>
        <p>{t.topic5Desc}</p>
        <CodeExample code={t.topic5Code} filename="+server.ts" />
        <div class="interactive-box">
          <h4>{t.demo4Title}</h4>
          <p class="demo-desc">{t.demo4Desc}</p>
          <div class="error-demo">
            <div class="error-buttons">
              <button class="btn error-btn" onclick={() => simulateError(400)} disabled={errorLoading}>{t.trigger400}</button>
              <button class="btn error-btn" onclick={() => simulateError(404)} disabled={errorLoading}>{t.trigger404}</button>
              <button class="btn error-btn" onclick={() => simulateError(500)} disabled={errorLoading}>{t.trigger500}</button>
            </div>
            {#if errorResStatus}
              <div class="error-response">
                <div class="res-header">
                  <span class="res-label">{t.response}</span>
                  <span class="res-status" style="background: {statusColor(errorResStatus)}20; color: {statusColor(errorResStatus)}">
                    {errorResStatus} {getStatusText(errorResStatus)}
                  </span>
                </div>
                <pre class="res-body"><code>{errorResBody}</code></pre>
              </div>
            {/if}
          </div>
        </div>
      </section>
    </div>
  {/snippet}

  {#snippet example()}
    <div class="demo">
      <h3>{t.demo3Title}</h3>
      <p>{t.demo3Desc}</p>
      <div class="visualizer">
        <div class="viz-panel viz-request">
          <div class="viz-title">{t.requestLabel}</div>
          <pre class="viz-code"><code>GET /api/tasks/1 HTTP/1.1
Host: localhost:5173
Accept: application/json
Authorization: Bearer eyJhbGci...</code></pre>
        </div>
        <div class="viz-arrow">{'-->'}</div>
        <div class="viz-panel viz-response">
          <div class="viz-title">{t.responseLabel}</div>
          <pre class="viz-code"><code>HTTP/1.1 200 OK
Content-Type: application/json

{'{'} 
  "id": 1,
  "title": "Learn SvelteKit",
  "done": true
{'}'}</code></pre>
        </div>
      </div>

      <div class="network-log-section">
        <div class="log-header">
          <h4>{t.networkLogTitle}</h4>
          <button class="btn secondary clear-btn" onclick={() => { networkLog = []; selectedLog = null; }}>{t.clearLog}</button>
        </div>
        {#if networkLog.length === 0}
          <p class="no-logs">{t.noLogs}</p>
        {:else}
          <div class="log-table-wrapper">
            <table class="log-table">
              <thead>
                <tr>
                  <th>{t.method}</th>
                  <th>{t.path}</th>
                  <th>{t.status}</th>
                  <th>{t.duration}</th>
                </tr>
              </thead>
              <tbody>
                {#each networkLog as entry, i (entry.timestamp)}
                  <tr class="log-row" class:selected={selectedLog === entry} onclick={() => selectedLog = selectedLog === entry ? null : entry}>
                    <td><span class="method-badge" data-method={entry.method}>{entry.method}</span></td>
                    <td class="path-cell">{entry.path}</td>
                    <td><span class="status-badge" style="color: {statusColor(entry.status)}">{entry.status}</span></td>
                    <td class="duration-cell">{entry.duration}{t.milliseconds}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          {#if selectedLog}
            <div class="log-detail">
              {#if selectedLog.reqBody}
                <div class="log-detail-section">
                  <span class="detail-label">{t.request} {t.body}:</span>
                  <pre class="detail-code"><code>{selectedLog.reqBody}</code></pre>
                </div>
              {/if}
              <div class="log-detail-section">
                <span class="detail-label">{t.response} ({selectedLog.status} {selectedLog.statusText}):</span>
                <pre class="detail-code"><code>{selectedLog.resBody}</code></pre>
              </div>
            </div>
          {/if}
        {/if}
      </div>
    </div>
  {/snippet}

  {#snippet challenge()}
    <div class="challenge-content">
      <p>{t.challengeDesc}</p>
      <div class="search-demo">
        <div class="search-bar">
          <input type="text" placeholder={t.searchPlaceholder} bind:value={searchQuery} />
          <button class="btn primary" onclick={runSearch}>{t.search}</button>
        </div>
        <div class="search-results">
          <div class="results-header">
            <span>{t.searchResult}: {filteredTasks.length}</span>
            {#if searchQuery}
              <code class="query-display">GET /api/tasks?search={encodeURIComponent(searchQuery)}</code>
            {/if}
          </div>
          <ul class="task-list">
            {#each filteredTasks as task (task.id)}
              <li class:done={task.done}>
                <span class="task-check">{task.done ? '✅' : '⬜'}</span>
                <span class="task-title">{task.title}</span>
              </li>
            {:else}
              <li class="empty">{t.noTasks}</li>
            {/each}
          </ul>
        </div>
        {#if lastSearchLog}
          <div class="search-log">
            <span class="detail-label">{t.response} ({lastSearchLog.status} {lastSearchLog.statusText}):</span>
            <pre class="detail-code"><code>{lastSearchLog.resBody}</code></pre>
          </div>
        {/if}
      </div>
      <CodeExample code={t.searchHint} filename="src/routes/api/tasks/+server.ts" />
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
    <h2>✏️ {lang === 'en' ? 'Exercise' : 'Ejercicio'}: Build a Quotes API</h2>
    <div class="exercise-task">
      <p>{lang === 'en' ? 'Create a REST API for quotes:' : 'Crea una API REST para citas:'}</p>
      <ul>
        <li>{lang === 'en' ? 'Create `src/routes/api/quotes/+server.ts` with GET (list all) and POST (add new)' : 'Crea `src/routes/api/quotes/+server.ts` con GET (listar todas) y POST (agregar nueva)'}</li>
        <li>{lang === 'en' ? 'Create `src/routes/api/quotes/[id]/+server.ts` with GET (get one) and DELETE' : 'Crea `src/routes/api/quotes/[id]/+server.ts` con GET (obtener una) y DELETE'}</li>
        <li>{lang === 'en' ? 'Use `json()` from `@sveltejs/kit` for responses' : 'Usa `json()` de `@sveltejs/kit` para las respuestas'}</li>
        <li>{lang === 'en' ? 'Store quotes in a module-level array (in-memory)' : 'Almacena las citas en un array a nivel de módulo (en memoria)'}</li>
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
  .explorer {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .explorer-bar {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .method-select {
    padding: 8px 12px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.85rem;
    background: var(--bg);
    color: var(--primary);
    border: 1px solid var(--border);
    cursor: pointer;
    min-width: 80px;
  }
  .path-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.85rem;
    background: var(--bg);
    color: var(--text);
  }
  .path-input:focus {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
  .send-btn {
    white-space: nowrap;
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
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn.primary {
    background: var(--primary);
    color: white;
  }
  .btn.primary:hover:not(:disabled) {
    opacity: 0.9;
  }
  .btn.secondary {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
  }
  .btn.secondary:hover:not(:disabled) {
    background: var(--surface-hover);
  }
  .explorer-body-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .body-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
  }
  .body-textarea {
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.82rem;
    background: var(--bg);
    color: var(--text);
    resize: vertical;
    line-height: 1.5;
  }
  .body-textarea:focus {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
  .explorer-response,
  .error-response {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }
  .res-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }
  .res-label {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .res-status {
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
  }
  .res-body {
    padding: 1rem;
    margin: 0;
    overflow-x: auto;
  }
  .res-body code {
    color: #cdd6f4;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.82rem;
    line-height: 1.5;
    white-space: pre;
  }
  .add-task {
    display: flex;
    gap: 0.5rem;
  }
  .add-task input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.95rem;
    background: var(--bg);
    color: var(--text);
  }
  .add-task input:focus {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
  .task-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .task-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    transition: all 0.15s;
  }
  .task-list li.done .task-title {
    text-decoration: line-through;
    opacity: 0.5;
  }
  .task-check {
    cursor: pointer;
    font-size: 1.1rem;
    user-select: none;
  }
  .task-title {
    flex: 1;
    font-size: 0.92rem;
  }
  .delete-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.85rem;
    padding: 2px 6px;
    border-radius: 4px;
    transition: all 0.15s;
  }
  .delete-btn:hover {
    color: var(--error);
    background: #fef2f2;
  }
  .task-list li.empty {
    justify-content: center;
    color: var(--text-muted);
    font-style: italic;
    background: transparent;
    border-style: dashed;
  }
  .error-demo {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .error-buttons {
    display: flex;
    gap: 0.5rem;
  }
  .btn.error-btn {
    background: var(--error);
    color: white;
    font-size: 0.82rem;
  }
  .btn.error-btn:hover:not(:disabled) {
    opacity: 0.9;
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
  .visualizer {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  .viz-panel {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }
  .viz-title {
    padding: 8px 14px;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-muted);
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }
  .viz-code {
    padding: 1rem;
    margin: 0;
    overflow-x: auto;
  }
  .viz-code code {
    color: #cdd6f4;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.8rem;
    line-height: 1.6;
    white-space: pre;
  }
  .viz-arrow {
    font-size: 1.5rem;
    color: var(--primary);
    font-weight: 700;
    text-align: center;
  }
  .network-log-section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1rem;
  }
  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  .log-header h4 {
    font-size: 0.95rem;
    color: var(--text);
    margin: 0;
  }
  .clear-btn {
    padding: 4px 12px;
    font-size: 0.78rem;
  }
  .no-logs {
    text-align: center;
    color: var(--text-muted);
    font-style: italic;
    font-size: 0.9rem;
    padding: 1.5rem 0;
    margin: 0;
  }
  .log-table-wrapper {
    overflow-x: auto;
  }
  .log-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
  }
  .log-table th {
    text-align: left;
    padding: 6px 10px;
    color: var(--text-muted);
    font-size: 0.75rem;
    text-transform: uppercase;
    border-bottom: 1px solid var(--border);
    font-weight: 600;
  }
  .log-table td {
    padding: 6px 10px;
    border-bottom: 1px solid var(--border);
  }
  .log-row {
    cursor: pointer;
    transition: background 0.15s;
  }
  .log-row:hover {
    background: var(--surface-hover);
  }
  .log-row.selected {
    background: var(--primary);
  }
  .log-row.selected td {
    color: white;
  }
  .log-row.selected .method-badge,
  .log-row.selected .status-badge {
    color: white !important;
  }
  .method-badge {
    font-weight: 700;
    font-size: 0.78rem;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
  }
  .method-badge[data-method="GET"] { color: var(--success); }
  .method-badge[data-method="POST"] { color: var(--info); }
  .method-badge[data-method="PUT"] { color: var(--warning); }
  .method-badge[data-method="DELETE"] { color: var(--error); }
  .path-cell {
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.78rem;
  }
  .status-badge {
    font-weight: 700;
    font-size: 0.78rem;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
  }
  .duration-cell {
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    color: var(--text-muted);
    font-size: 0.78rem;
  }
  .log-row.selected .duration-cell {
    color: rgba(255, 255, 255, 0.8);
  }
  .log-detail {
    margin-top: 0.75rem;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.75rem;
  }
  .log-detail-section {
    margin-bottom: 0.5rem;
  }
  .log-detail-section:last-child {
    margin-bottom: 0;
  }
  .detail-label {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-muted);
    display: block;
    margin-bottom: 0.4rem;
  }
  .detail-code {
    margin: 0;
    overflow-x: auto;
  }
  .detail-code code {
    color: #cdd6f4;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.78rem;
    line-height: 1.5;
    white-space: pre;
  }
  .challenge-content p {
    line-height: 1.7;
    margin-bottom: 1rem;
  }
  .search-demo {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .search-bar {
    display: flex;
    gap: 0.5rem;
  }
  .search-bar input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.95rem;
    background: var(--bg);
    color: var(--text);
  }
  .search-bar input:focus {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  .query-display {
    font-size: 0.75rem;
    background: var(--code-bg);
    padding: 3px 10px;
    border-radius: 6px;
    color: #89b4fa;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
  }
  .search-log {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.75rem;
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
    .visualizer {
      grid-template-columns: 1fr;
    }
    .viz-arrow {
      transform: rotate(90deg);
    }
    .code-compare {
      grid-template-columns: 1fr;
    }
    .explorer-bar {
      flex-wrap: wrap;
    }
    .path-input {
      min-width: 100%;
      order: 3;
    }
    .error-buttons {
      flex-wrap: wrap;
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
