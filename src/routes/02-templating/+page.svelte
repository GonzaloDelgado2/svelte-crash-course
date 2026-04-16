<script lang="ts">
  import LessonLayout from '$lib/components/LessonLayout.svelte';
  import CodeExample from '$lib/components/CodeExample.svelte';
  import { getLang } from '$lib/i18n/language.svelte.js';

  let lang = $derived(getLang());

  let showSolution = $state(false);
  const exerciseSolution = `\x3Cscript lang="ts">
  let tasks = $state([
    { id: 1, text: 'Learn Svelte', done: true },
    { id: 2, text: 'Build an app', done: false },
    { id: 3, text: 'Deploy', done: false }
  ]);

  let allDone = $derived(tasks.every(t => t.done));
\x3C/script>

{#if allDone}
  \x3Cp>All done! \u{1F389}\x3C/p>
{:else}
  \x3Cul>
    {#each tasks as task (task.id)}
      \x3Cli class:completed={task.done}>
        \x3Cbutton onclick={() => {
          tasks = tasks.map(t =>
            t.id === task.id ? { ...t, done: !t.done } : t
          );
        }}>
          {task.done ? '\u2705' : '\u2B1C'}
        \x3C/button>
        {task.text}
      \x3C/li>
    {/each}
  \x3C/ul>
{/if}`;

  let tasks = $state<{ id: number; title: string; done: boolean; priority: 'low' | 'medium' | 'high' }[]>([
    { id: 1, title: lang === 'en' ? 'Learn Svelte' : 'Aprender Svelte', done: false, priority: 'high' },
    { id: 2, title: lang === 'en' ? 'Build a task app' : 'Construir app de tareas', done: false, priority: 'medium' },
    { id: 3, title: lang === 'en' ? 'Deploy to production' : 'Desplegar a producción', done: true, priority: 'low' }
  ]);
  let nextId = $state(4);
  let newTask = $state('');
  let filter = $state<'all' | 'active' | 'done'>('all');
  let filteredTasks = $derived(
    filter === 'all' ? tasks
    : filter === 'active' ? tasks.filter(t => !t.done)
    : tasks.filter(t => t.done)
  );
  let taskCount = $derived(tasks.length);
  let activeCount = $derived(tasks.filter(t => !t.done).length);
  let doneCount = $derived(tasks.filter(t => t.done).length);

  function addTask() {
    const title = newTask.trim();
    if (!title) return;
    tasks.push({ id: nextId++, title, done: false, priority: 'medium' });
    newTask = '';
  }

  function removeTask(id: number) {
    tasks = tasks.filter(t => t.id !== id);
  }

  function toggleTask(id: number) {
    const task = tasks.find(t => t.id === id);
    if (task) task.done = !task.done;
  }

  let htmlInput = $state('<strong>Bold</strong> and <em>italic</em> text');
  let htmlOutput = $derived(htmlInput);

  let asyncStatus = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
  let asyncData = $state<string[]>([]);
  let asyncPromise = $state<Promise<string[]> | null>(null);

  function loadAsync() {
    asyncStatus = 'loading';
    asyncPromise = new Promise<string[]>((resolve) => {
      setTimeout(() => {
        const data = lang === 'en'
          ? ['Loaded from server', 'Dynamic data!', 'Async works!']
          : ['Cargado del servidor', '¡Datos dinámicos!', '¡Async funciona!'];
        resolve(data);
      }, 2000);
    });
    asyncPromise.then((data) => {
      asyncData = data;
      asyncStatus = 'success';
    });
  }

  const text = {
    en: {
      title: 'Templating',
      appFeature: 'Task List Rendering',
      topic1Title: 'Conditional Rendering: {#if}',
      topic1Desc: 'Use {#if} to conditionally show or hide elements. You can chain with {:else if} and {:else} for multiple conditions.',
      topic1Code: `\x3Cscript lang="ts">
  let score = $state(85);
\x3C/script>

{#if score >= 90}
  <p>Excellent!</p>
{:else if score >= 70}
  <p>Good job!</p>
{:else}
  <p>Keep practicing!</p>
{/if}`,
      topic2Title: 'List Rendering: {#each}',
      topic2Desc: 'Use {#each} to render lists from arrays. Always provide a unique key for efficient updates. Use {:else} to show content when the list is empty.',
      topic2Code: `\x3Cscript lang="ts">
  let tasks = $state([
    { id: 1, title: "Learn Svelte", done: false },
    { id: 2, title: "Build app", done: true }
  ]);
\x3C/script>

<ul>
  {#each tasks as task (task.id)}
    <li class:done={task.done}>
      {task.title}
    </li>
  {:else}
    <li>No tasks yet!</li>
  {/each}
</ul>

<p>Total: {tasks.length} tasks</p>`,
      topic2Interactive: 'Interactive Task List',
      topic2Empty: 'No tasks yet! Add one above.',
      topic2InputPlaceholder: 'Add a task...',
      topic2Add: 'Add',
      topic3Title: 'Filtering with {#if} + {#each}',
      topic3Desc: 'Combine conditional and list rendering to filter displayed items. This pattern is extremely common in real apps.',
      topic3Code: `let filter = $state('all');

let filtered = $derived(
  filter === 'all' ? tasks
  : filter === 'active' ? tasks.filter(t => !t.done)
  : tasks.filter(t => t.done)
);

{#each filtered as task (task.id)}
  <div>{task.title}</div>
{/each}`,
      topic3Interactive: 'Task Filter Demo',
      topic3All: 'All',
      topic3Active: 'Active',
      topic3Done: 'Done',
      topic3Count: 'tasks',
      topic3ActiveCount: 'active',
      topic3DoneCount: 'done',
      topic4Title: 'Async Rendering: {#await}',
      topic4Desc: 'Use {#await} to handle Promises directly in your template. Show loading states, success results, and errors without manual state management.',
      topic4Code: `{#await fetchData()}
  <p>Loading...</p>
{:then data}
  <ul>
    {#each data as item}
      <li>{item}</li>
    {/each}
  </ul>
{:catch error}
  <p>Error: {error.message}</p>
{/await}`,
      topic4Interactive: 'Async Data Demo',
      topic4Load: 'Fetch Data',
      topic4Reset: 'Reset',
      topic5Title: 'Raw HTML: {@html}',
      topic5Desc: 'Use {@html} to render raw HTML strings. WARNING: Only use with trusted content. Never use with user input — it creates XSS vulnerabilities.',
      topic5Code: `let content = '<strong>Bold</strong> and <em>italic</em>';

<!-- Renders as actual HTML -->
<p>{@html content}</p>

<!-- Renders as text (escaped) -->
<p>{content}</p>
<!-- Output: <strong>Bold</strong> and <em>italic</em> -->`,
      topic5Interactive: '{@html playground',
      topic5Input: 'Enter HTML...',
      topic5Rendered: 'Rendered output:',
      topic5Raw: 'Raw (escaped):',
      topic5Warning: 'Security: Never use {@html} with untrusted user input!',
      demoTitle: 'Full Demo: Task List with Templating',
      demoDesc: 'This demo combines {#if}, {#each}, and event handling to create a fully interactive task list — the core of our growing Task Manager app.',
      demoEmpty: 'No tasks match this filter.',
      mistakesTitle: 'Common Mistakes',
      mistake1Title: 'Missing key in {#each}',
      mistake1Wrong: `{#each tasks as task}
  <li>{task.title}</li>
{/each}`,
      mistake1Correct: `{#each tasks as task (task.id)}
  <li>{task.title}</li>
{/each}`,
      mistake1Explain: 'Without a key, Svelte uses array index. When items are added/removed, this causes incorrect DOM updates and bugs.',
      mistake2Title: 'Using {#if} instead of CSS for visual states',
      mistake2Wrong: `{#if task.done}
  <span class="done">{task.title}</span>
{:else}
  <span>{task.title}</span>
{/if}`,
      mistake2Correct: `<span class:done={task.done}>
  {task.title}
</span>

<style>
  .done { text-decoration: line-through; opacity: 0.6; }
</style>`,
      mistake2Explain: 'Use class: directives for visual changes. Reserve {#if} for when elements should be added/removed from the DOM entirely.',
      mistake3Title: 'Not handling empty arrays in {#each}',
      mistake3Wrong: `{#each tasks as task}
  <li>{task.title}</li>
{/each}
<!-- Nothing shows when tasks is empty! -->`,
      mistake3Correct: `{#each tasks as task (task.id)}
  <li>{task.title}</li>
{:else}
  <li class="empty">No tasks yet!</li>
{/each}`,
      mistake3Explain: 'Use the {:else} clause of {#each} to show a message when the array is empty. Better UX than a blank screen.',
      mistake4Title: 'Using {@html} with user input',
      mistake4Wrong: `let userInput = $state('');
<p>{@html userInput}</p> <!-- XSS vulnerability! -->`,
      mistake4Correct: `let userInput = $state('');
<p>{userInput}</p> <!-- Safe: auto-escaped -->`,
      mistake4Explain: '{@html} bypasses XSS protection. Only use it with trusted, sanitized content — never with raw user input.'
    },
    es: {
      title: 'Plantillas',
      appFeature: 'Renderizar Lista de Tareas',
      topic1Title: 'Renderizado Condicional: {#if}',
      topic1Desc: 'Usa {#if} para mostrar u ocultar elementos condicionalmente. Puedes encadenar con {:else if} y {:else} para múltiples condiciones.',
      topic1Code: `\x3Cscript lang="ts">
  let puntaje = $state(85);
\x3C/script>

{#if puntaje >= 90}
  <p>¡Excelente!</p>
{:else if puntaje >= 70}
  <p>¡Buen trabajo!</p>
{:else}
  <p>¡Sigue practicando!</p>
{/if}`,
      topic2Title: 'Renderizado de Listas: {#each}',
      topic2Desc: 'Usa {#each} para renderizar listas desde arreglos. Siempre proporciona una key única para actualizaciones eficientes. Usa {:else} para mostrar contenido cuando la lista está vacía.',
      topic2Code: `\x3Cscript lang="ts">
  let tareas = $state([
    { id: 1, title: "Aprender Svelte", done: false },
    { id: 2, title: "Construir app", done: true }
  ]);
\x3C/script>

<ul>
  {#each tareas as tarea (tarea.id)}
    <li class:done={tarea.done}>
      {tarea.title}
    </li>
  {:else}
    <li>¡Aún no hay tareas!</li>
  {/each}
</ul>

<p>Total: {tareas.length} tareas</p>`,
      topic2Interactive: 'Lista de Tareas Interactiva',
      topic2Empty: '¡Aún no hay tareas! Agrega una arriba.',
      topic2InputPlaceholder: 'Agregar tarea...',
      topic2Add: 'Agregar',
      topic3Title: 'Filtrado con {#if} + {#each}',
      topic3Desc: 'Combina renderizado condicional y de listas para filtrar elementos mostrados. Este patrón es extremadamente común en apps reales.',
      topic3Code: `let filtro = $state('todos');

let filtrados = $derived(
  filtro === 'todos' ? tareas
  : filtro === 'activos' ? tareas.filter(t => !t.done)
  : tareas.filter(t => t.done)
);

{#each filtrados as tarea (tarea.id)}
  <div>{tarea.title}</div>
{/each}`,
      topic3Interactive: 'Demo de Filtrado de Tareas',
      topic3All: 'Todos',
      topic3Active: 'Activos',
      topic3Done: 'Hechos',
      topic3Count: 'tareas',
      topic3ActiveCount: 'activas',
      topic3DoneCount: 'hechas',
      topic4Title: 'Renderizado Asíncrono: {#await}',
      topic4Desc: 'Usa {#await} para manejar Promesas directamente en tu plantilla. Muestra estados de carga, resultados exitosos y errores sin gestión manual de estado.',
      topic4Code: `{#await obtenerDatos()}
  <p>Cargando...</p>
{:then datos}
  <ul>
    {#each datos as item}
      <li>{item}</li>
    {/each}
  </ul>
{:catch error}
  <p>Error: {error.message}</p>
{/await}`,
      topic4Interactive: 'Demo de Datos Asíncronos',
      topic4Load: 'Obtener Datos',
      topic4Reset: 'Reiniciar',
      topic5Title: 'HTML Crudo: {@html}',
      topic5Desc: 'Usa {@html} para renderizar cadenas HTML directamente. ADVERTENCIA: Solo úsalo con contenido confiable. Nunca lo uses con entrada del usuario — crea vulnerabilidades XSS.',
      topic5Code: `let contenido = '<strong>Negrita</strong> y <em>cursiva</em>';

<!-- Se renderiza como HTML real -->
<p>{@html contenido}</p>

<!-- Se renderiza como texto (escapado) -->
<p>{contenido}</p>
<!-- Salida: <strong>Negrita</strong> y <em>cursiva</em> -->`,
      topic5Interactive: 'Playground {@html}',
      topic5Input: 'Ingresa HTML...',
      topic5Rendered: 'Salida renderizada:',
      topic5Raw: 'Sin procesar (escapado):',
      topic5Warning: 'Seguridad: ¡Nunca uses {@html} con entrada de usuario no confiable!',
      demoTitle: 'Demo Completa: Lista de Tareas con Plantillas',
      demoDesc: 'Esta demo combina {#if}, {#each} y manejo de eventos para crear una lista de tareas completamente interactiva — el núcleo de nuestra app de Tareas.',
      demoEmpty: 'No hay tareas que coincidan con este filtro.',
      mistakesTitle: 'Errores Comunes',
      mistake1Title: 'Falta key en {#each}',
      mistake1Wrong: `{#each tareas as tarea}
  <li>{tarea.title}</li>
{/each}`,
      mistake1Correct: `{#each tareas as tarea (tarea.id)}
  <li>{tarea.title}</li>
{/each}`,
      mistake1Explain: 'Sin key, Svelte usa el índice del arreglo. Cuando se agregan/eliminan elementos, esto causa actualizaciones incorrectas del DOM y bugs.',
      mistake2Title: 'Usar {#if} en lugar de CSS para estados visuales',
      mistake2Wrong: `{#if tarea.done}
  <span class="done">{tarea.title}</span>
{:else}
  <span>{tarea.title}</span>
{/if}`,
      mistake2Correct: `<span class:done={tarea.done}>
  {tarea.title}
</span>

<style>
  .done { text-decoration: line-through; opacity: 0.6; }
</style>`,
      mistake2Explain: 'Usa directivas class: para cambios visuales. Reserva {#if} para cuando los elementos deban ser agregados/eliminados del DOM.',
      mistake3Title: 'No manejar arreglos vacíos en {#each}',
      mistake3Wrong: `{#each tareas as tarea}
  <li>{tarea.title}</li>
{/each}
<!-- ¡No se muestra nada cuando tareas está vacío! -->`,
      mistake3Correct: `{#each tareas as tarea (tarea.id)}
  <li>{tarea.title}</li>
{:else}
  <li class="empty">¡Aún no hay tareas!</li>
{/each}`,
      mistake3Explain: 'Usa la cláusula {:else} de {#each} para mostrar un mensaje cuando el arreglo está vacío. Mejor UX que una pantalla en blanco.',
      mistake4Title: 'Usar {@html} con entrada del usuario',
      mistake4Wrong: `let entradaUsuario = $state('');
<p>{@html entradaUsuario}</p> <!-- ¡Vulnerabilidad XSS! -->`,
      mistake4Correct: `let entradaUsuario = $state('');
<p>{entradaUsuario}</p> <!-- Seguro: auto-escapado -->`,
      mistake4Explain: '{@html} omite la protección XSS. Solo úsalo con contenido confiable y sanitizado — nunca con entrada cruda del usuario.'
    }
  };
</script>

<LessonLayout lessonNum="02" title={text[lang].title} appFeature={text[lang].appFeature}>
  {#snippet theory()}
    <div class="topics">
      <section class="topic">
        <h3>1. {text[lang].topic1Title}</h3>
        <p>{text[lang].topic1Desc}</p>
        <CodeExample code={text[lang].topic1Code} filename="Conditional.svelte" />
      </section>

      <section class="topic">
        <h3>2. {text[lang].topic2Title}</h3>
        <p>{text[lang].topic2Desc}</p>
        <CodeExample code={text[lang].topic2Code} filename="EachLoop.svelte" />
        <div class="interactive-box">
          <h4>{text[lang].topic2Interactive}</h4>
          <div class="add-task">
            <input type="text" placeholder={text[lang].topic2InputPlaceholder} bind:value={newTask} onkeydown={(e) => e.key === 'Enter' && addTask()} />
            <button class="btn primary" onclick={addTask}>{text[lang].topic2Add}</button>
          </div>
          <ul class="task-list">
            {#each tasks as task (task.id)}
              <li class:done={task.done}>
                <span class="task-check" onclick={() => toggleTask(task.id)}>
                  {task.done ? '✅' : '⬜'}
                </span>
                <span class="task-title">{task.title}</span>
                <button class="delete-btn" onclick={() => removeTask(task.id)}>✕</button>
              </li>
            {:else}
              <li class="empty">{text[lang].topic2Empty}</li>
            {/each}
          </ul>
          <div class="stats">
            <span>{taskCount} {text[lang].topic3Count}</span>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>3. {text[lang].topic3Title}</h3>
        <p>{text[lang].topic3Desc}</p>
        <CodeExample code={text[lang].topic3Code} filename="Filter.svelte" />
        <div class="interactive-box">
          <h4>{text[lang].topic3Interactive}</h4>
          <div class="filter-bar">
            <button class="btn filter-btn" class:active={filter === 'all'} onclick={() => filter = 'all'}>{text[lang].topic3All} ({taskCount})</button>
            <button class="btn filter-btn" class:active={filter === 'active'} onclick={() => filter = 'active'}>{text[lang].topic3Active} ({activeCount})</button>
            <button class="btn filter-btn" class:active={filter === 'done'} onclick={() => filter = 'done'}>{text[lang].topic3Done} ({doneCount})</button>
          </div>
          <ul class="task-list">
            {#each filteredTasks as task (task.id)}
              <li class:done={task.done}>
                <span class="task-check" onclick={() => toggleTask(task.id)}>
                  {task.done ? '✅' : '⬜'}
                </span>
                <span class="task-title">{task.title}</span>
                <button class="delete-btn" onclick={() => removeTask(task.id)}>✕</button>
              </li>
            {:else}
              <li class="empty">{text[lang].demoEmpty}</li>
            {/each}
          </ul>
        </div>
      </section>

      <section class="topic">
        <h3>4. {text[lang].topic4Title}</h3>
        <p>{text[lang].topic4Desc}</p>
        <CodeExample code={text[lang].topic4Code} filename="Async.svelte" />
        <div class="interactive-box">
          <h4>{text[lang].topic4Interactive}</h4>
          <div class="async-demo">
            {#if asyncStatus === 'idle'}
              <button class="btn primary" onclick={loadAsync}>{text[lang].topic4Load}</button>
            {:else if asyncStatus === 'loading'}
              <div class="loading-spinner">
                <div class="spinner"></div>
                <span>Loading...</span>
              </div>
            {:else if asyncStatus === 'success'}
              <ul class="async-list">
                {#each asyncData as item, i}
                  <li><span class="item-num">{i + 1}</span> {item}</li>
                {/each}
              </ul>
              <button class="btn secondary" onclick={() => { asyncStatus = 'idle'; asyncData = []; }}>{text[lang].topic4Reset}</button>
            {/if}
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>5. {text[lang].topic5Title}</h3>
        <p>{text[lang].topic5Desc}</p>
        <CodeExample code={text[lang].topic5Code} filename="RawHtml.svelte" />
        <div class="interactive-box">
          <h4>{text[lang].topic5Interactive}</h4>
          <div class="html-playground">
            <input type="text" placeholder={text[lang].topic5Input} bind:value={htmlInput} />
            <div class="html-compare">
              <div class="html-panel">
                <span class="panel-label">{text[lang].topic5Rendered}</span>
                <div class="html-output">{@html htmlOutput}</div>
              </div>
              <div class="html-panel">
                <span class="panel-label">{text[lang].topic5Raw}</span>
                <div class="html-output">{htmlOutput}</div>
              </div>
            </div>
            <p class="warning">{text[lang].topic5Warning}</p>
          </div>
        </div>
      </section>
    </div>
  {/snippet}

  {#snippet example()}
    <div class="demo">
      <h3>{text[lang].demoTitle}</h3>
      <p>{text[lang].demoDesc}</p>
      <div class="demo-app">
        <div class="demo-header">
          <div class="add-task">
            <input type="text" placeholder={text[lang].topic2InputPlaceholder} bind:value={newTask} onkeydown={(e) => e.key === 'Enter' && addTask()} />
            <button class="btn primary" onclick={addTask}>{text[lang].topic2Add}</button>
          </div>
        </div>
        <div class="filter-bar">
          <button class="btn filter-btn" class:active={filter === 'all'} onclick={() => filter = 'all'}>{text[lang].topic3All}</button>
          <button class="btn filter-btn" class:active={filter === 'active'} onclick={() => filter = 'active'}>{text[lang].topic3Active}</button>
          <button class="btn filter-btn" class:active={filter === 'done'} onclick={() => filter = 'done'}>{text[lang].topic3Done}</button>
        </div>
        <ul class="task-list">
          {#each filteredTasks as task (task.id)}
            <li class:done={task.done}>
              <span class="task-check" onclick={() => toggleTask(task.id)}>
                {task.done ? '✅' : '⬜'}
              </span>
              <span class="task-title">{task.title}</span>
              <span class="priority-badge" class:high={task.priority === 'high'} class:medium={task.priority === 'medium'} class:low={task.priority === 'low'}>
                {task.priority}
              </span>
              <button class="delete-btn" onclick={() => removeTask(task.id)}>✕</button>
            </li>
          {:else}
            <li class="empty">{text[lang].demoEmpty}</li>
          {/each}
        </ul>
        <div class="demo-footer">
          {#if taskCount > 0}
            <span>{activeCount} {text[lang].topic3Active} · {doneCount} {text[lang].topic3Done}</span>
          {:else}
            <span class="empty-state">{text[lang].demoEmpty}</span>
          {/if}
        </div>
      </div>
    </div>
  {/snippet}

  {#snippet challenge()}
    <div class="challenge-content">
      <p>{lang === 'en' ? 'Add a priority filter to the task list. Show only tasks with "high" priority when the "High" button is clicked.' : 'Agrega un filtro de prioridad a la lista de tareas. Muestra solo las tareas con prioridad "high" cuando se hace clic en el botón "Alta".'}</p>
      <CodeExample code={lang === 'en' ? `// Hint: Add a new filter option
let filter = $state<'all' | 'active' | 'done' | 'high'>('all');

let filtered = $derived(() => {
  if (filter === 'high') return tasks.filter(t => t.priority === 'high');
  if (filter === 'active') return tasks.filter(t => !t.done);
  if (filter === 'done') return tasks.filter(t => t.done);
  return tasks;
});` : `// Pista: Agrega una nueva opción de filtro
let filtro = $state<'todos' | 'activos' | 'hechos' | 'alto'>('todos');

let filtrados = $derived(() => {
  if (filtro === 'alto') return tareas.filter(t => t.priority === 'high');
  if (filtro === 'activos') return tareas.filter(t => !t.done);
  if (filtro === 'hechos') return tareas.filter(t => t.done);
  return tareas;
});`} filename="challenge.svelte" />
    </div>
  {/snippet}

  <section class="exercise-section">
    <h2>✏️ {lang === 'en' ? 'Exercise' : 'Ejercicio'}: {lang === 'en' ? 'Smart Task List' : 'Lista de Tareas Inteligente'}</h2>
    <div class="exercise-task">
      <p>{lang === 'en' ? 'Build a task list that:' : 'Construye una lista de tareas que:'}</p>
      <ul>
        <li>{lang === 'en' ? 'Has an array of tasks with id, text, and done properties' : 'Tenga un arreglo de tareas con propiedades id, text y done'}</li>
        <li>{lang === 'en' ? 'Uses {#each} to render each task' : 'Use {#each} para renderizar cada tarea'}</li>
        <li>{lang === 'en' ? 'Uses {#if} to show a "All done! 🎉" message when all tasks are completed' : 'Use {#if} para mostrar "¡Todo listo! 🎉" cuando todas las tareas estén completadas'}</li>
        <li>{lang === 'en' ? 'Shows a different style for completed vs pending tasks' : 'Muestre un estilo diferente para tareas completadas vs pendientes'}</li>
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
        <pre class="code-block"><code>{exerciseSolution}</code></pre>
      </div>
    {/if}
  </section>

  <section class="mistakes">
    <h2>{text[lang].mistakesTitle}</h2>
    <div class="mistake-cards">
      {#each [
        { title: text[lang].mistake1Title, wrong: text[lang].mistake1Wrong, correct: text[lang].mistake1Correct, explain: text[lang].mistake1Explain },
        { title: text[lang].mistake2Title, wrong: text[lang].mistake2Wrong, correct: text[lang].mistake2Correct, explain: text[lang].mistake2Explain },
        { title: text[lang].mistake3Title, wrong: text[lang].mistake3Wrong, correct: text[lang].mistake3Correct, explain: text[lang].mistake3Explain },
        { title: text[lang].mistake4Title, wrong: text[lang].mistake4Wrong, correct: text[lang].mistake4Correct, explain: text[lang].mistake4Explain }
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
    margin-bottom: 1rem;
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
  }
  .add-task input:focus {
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
  .btn.primary:hover { opacity: 0.9; }
  .btn.secondary {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
  }
  .btn.secondary:hover { background: var(--surface-hover); }
  .filter-btn {
    background: var(--bg);
    color: var(--text-muted);
    border: 1px solid var(--border);
  }
  .filter-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
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
  .stats {
    display: flex;
    gap: 1rem;
    margin-top: 0.75rem;
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  .filter-bar {
    display: flex;
    gap: 6px;
    margin: 1rem 0 0;
  }
  .async-demo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    min-height: 80px;
    justify-content: center;
  }
  .loading-spinner {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-muted);
  }
  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .async-list {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }
  .async-list li {
    padding: 8px 12px;
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    border-radius: 6px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #065f46;
  }
  .item-num {
    background: var(--primary);
    color: white;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  .html-playground {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .html-playground input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.9rem;
  }
  .html-compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .html-panel {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .panel-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
  }
  .html-output {
    padding: 10px 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    min-height: 40px;
    font-size: 0.9rem;
  }
  .warning {
    background: #fef3c7;
    border: 1px solid #fcd34d;
    color: #92400e;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
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
  .demo-app {
    background: var(--surface);
    border-radius: 12px;
    padding: 1.25rem;
    border: 1px solid var(--border);
  }
  .demo-header {
    margin-bottom: 0.75rem;
  }
  .priority-badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 10px;
    text-transform: uppercase;
  }
  .priority-badge.high {
    background: #fef2f2;
    color: #dc2626;
  }
  .priority-badge.medium {
    background: #fef3c7;
    color: #d97706;
  }
  .priority-badge.low {
    background: #ecfdf5;
    color: #059669;
  }
  .demo-footer {
    padding-top: 0.75rem;
    border-top: 1px solid var(--border);
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  .demo-footer .empty-state {
    font-style: italic;
  }
  .challenge-content p {
    line-height: 1.7;
    margin-bottom: 1rem;
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
  .wrong pre, .correct pre {
    margin: 0;
    background: var(--code-bg);
    padding: 0.75rem 1rem;
    border-radius: 0 8px 8px 8px;
  }
  .wrong code, .correct code {
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
    .code-compare, .html-compare {
      grid-template-columns: 1fr;
    }
  }
  .exercise-section {
    margin: 2.5rem 0;
    background: linear-gradient(135deg, #fef3c7, #fef9c3);
    border-radius: 16px;
    padding: 1.5rem;
    border: 2px solid #f59e0b;
  }
  .exercise-section h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #92400e;
  }
  .exercise-task {
    background: white;
    border-radius: 10px;
    padding: 1.25rem;
    margin-bottom: 1rem;
    line-height: 1.7;
  }
  .exercise-task ul {
    margin: 0.75rem 0;
    padding-left: 1.5rem;
  }
  .exercise-task li {
    margin-bottom: 0.4rem;
  }
  .solution-toggle {
    width: 100%;
    padding: 12px;
    border: 2px dashed #f59e0b;
    border-radius: 10px;
    background: white;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    color: #92400e;
    transition: all 0.2s;
  }
  .solution-toggle:hover {
    background: #fef3c7;
  }
  .solution-box {
    margin-top: 1rem;
    border-radius: 12px;
    overflow: hidden;
  }
  .solution-header {
    background: #22c55e;
    color: white;
    padding: 8px 16px;
    font-weight: 600;
  }
  .solution-box pre {
    background: #1e1e2e;
    padding: 1rem;
    margin: 0;
    overflow-x: auto;
  }
  .solution-box code {
    color: #cdd6f4;
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 0.85rem;
    line-height: 1.6;
    white-space: pre;
  }
</style>
