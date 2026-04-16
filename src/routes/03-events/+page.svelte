<script lang="ts">
  import { getLang } from '$lib/i18n/language.svelte.js';
  import translations from '$lib/i18n/translations.js';

  let lang = $derived(getLang());
  let ui = $derived(translations.ui[lang]);
  let lessonData = $derived(translations.lessons[lang]['03']);

  let showSolution = $state(false);
  const exerciseSolution = `\x3Cscript lang="ts">
  let newTask = $state('');
  let tasks = $state\x3C{ id: number; text: string }[]>([]);

  function addTask() {
    if (!newTask.trim()) return;
    tasks = [...tasks, { id: Date.now(), text: newTask.trim() }];
    newTask = '';
  }

  function deleteTask(id: number) {
    tasks = tasks.filter(t => t.id !== id);
  }
\x3C/script>

\x3Cform onsubmit={(e) => { e.preventDefault(); addTask(); }}>
  \x3Cinput type="text" bind:value={newTask} placeholder="New task..." />
  \x3Cbutton type="submit">Add\x3C/button>
\x3C/form>
\x3Cp>Tasks: {tasks.length}\x3C/p>
\x3Cul>
  {#each tasks as task (task.id)}
    \x3Cli>
      {task.text}
      \x3Cbutton onclick={() => deleteTask(task.id)}>Delete\x3C/button>
    \x3C/li>
  {/each}
\x3C/ul>`;

  let inlineTasks = $state<{ id: number; text: string }[]>([
    { id: 1, text: 'Buy milk' },
    { id: 2, text: 'Read a book' }
  ]);
  let funcRefTasks = $state<{ id: number; text: string }[]>([
    { id: 1, text: 'Buy milk' },
    { id: 2, text: 'Read a book' }
  ]);
  let nextInlineId = $state(3);
  let nextFuncRefId = $state(3);

  let eventInfo = $state<{ type: string; target: string; timestamp: number } | null>(null);

  let formInput = $state('');
  let formTasks = $state<{ id: number; text: string }[]>([
    { id: 1, text: 'Learn Svelte' }
  ]);
  let nextFormId = $state(2);

  let kbInput = $state('');
  let kbTasks = $state<{ id: number; text: string }[]>([]);
  let nextKbId = $state(1);

  let demoInput = $state('');
  let demoTasks = $state<{ id: number; text: string }[]>([
    { id: 1, text: lang === 'en' ? 'Build the task app' : 'Construir la app de tareas' },
    { id: 2, text: lang === 'en' ? 'Master Svelte events' : 'Dominar eventos en Svelte' }
  ]);
  let nextDemoId = $state(3);

  function addInlineTask(text: string) {
    inlineTasks = [...inlineTasks, { id: nextInlineId++, text }];
  }

  function addFuncRefTask() {
    funcRefTasks = [...funcRefTasks, { id: nextFuncRefId++, text: lang === 'en' ? 'New task' : 'Nueva tarea' }];
  }

  function handleEventClick(e: MouseEvent) {
    eventInfo = {
      type: e.type,
      target: (e.target as HTMLElement).tagName.toLowerCase(),
      timestamp: Math.round(e.timeStamp)
    };
  }

  function handleFormSubmit(e: Event) {
    e.preventDefault();
    const text = formInput.trim();
    if (!text) return;
    formTasks = [...formTasks, { id: nextFormId++, text }];
    formInput = '';
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const text = kbInput.trim();
      if (!text) return;
      kbTasks = [...kbTasks, { id: nextKbId++, text }];
      kbInput = '';
    }
  }

  function addDemoTask() {
    const text = demoInput.trim();
    if (!text) return;
    demoTasks = [...demoTasks, { id: nextDemoId++, text }];
    demoInput = '';
  }

  function handleDemoKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      addDemoTask();
    }
  }

  function deleteDemoTask(id: number) {
    demoTasks = demoTasks.filter((t) => t.id !== id);
  }

  function deleteFormTask(id: number) {
    formTasks = formTasks.filter((t) => t.id !== id);
  }

  function deleteKbTask(id: number) {
    kbTasks = kbTasks.filter((t) => t.id !== id);
  }

  function deleteInlineTask(id: number) {
    inlineTasks = inlineTasks.filter((t) => t.id !== id);
  }

  function deleteFuncRefTask(id: number) {
    funcRefTasks = funcRefTasks.filter((t) => t.id !== id);
  }

  const text = {
    en: {
      lessonBadge: 'Lesson 03',
      title: 'Events',
      subtitle: 'Handle user interactions with onclick, onsubmit, and event handlers',
      appFeature: 'App Feature: Add & Delete Tasks',
      appFeatureDesc: 'In this lesson we grow the Task Manager by letting users add new tasks and delete existing ones — all through Svelte event handling.',
      topic1Title: 'onclick — Inline vs Function Handler',
      topic1Desc: 'Svelte lets you attach click handlers directly. You can use an inline arrow function or reference a named function.',
      inlineLabel: 'Inline handler',
      inlineCode: 'onclick={() => addTask("New task")}',
      funcRefLabel: 'Function reference',
      funcRefCode: 'onclick={handleAdd}',
      addTask: 'Add task',
      noTasks: 'No tasks yet',
      topic2Title: 'The Event Object',
      topic2Desc: 'Every event handler receives an event object with useful properties like type, target, and timeStamp.',
      topic2Btn: 'Click me!',
      topic2Code: 'onclick={(e) => { console.log(e.type, e.target, e.timeStamp) }}',
      topic2Result: 'Event info',
      topic2Click: 'Click the button to see event data',
      topic2Type: 'Type',
      topic2Target: 'Target',
      topic2Timestamp: 'Timestamp (ms)',
      topic3Title: 'onsubmit & Form Handling',
      topic3Desc: 'Use onsubmit on a <form> to handle submissions. Always call e.preventDefault() to avoid a page reload.',
      topic3Code: '<form onsubmit={(e) => { e.preventDefault(); addTask(input); } }>',
      topic3Placeholder: 'Type a new task...',
      topic3Submit: 'Add',
      topic4Title: 'Keyboard Events',
      topic4Desc: 'Listen for key presses with onkeydown. Check e.key to respond to specific keys like Enter.',
      topic4Code: '<input onkeydown={(e) => { if (e.key === "Enter") addTask(); } } />',
      topic4Placeholder: 'Type and press Enter...',
      topic5Title: 'Deleting Tasks',
      topic5Desc: 'Use Array.filter() inside an event handler to remove a task by its id.',
      topic5Code: 'tasks = tasks.filter(t => t.id !== id)',
      topic5Delete: 'Delete',
      demoTitle: 'Full Interactive Demo: Mini Task Manager',
      demoDesc: 'Combine everything you learned — add tasks via button or Enter key, and delete them.',
      demoPlaceholder: 'Add a new task...',
      demoAdd: 'Add',
      demoDelete: '×',
      mistakesTitle: 'Common Mistakes',
      mistake1Title: 'Calling the function instead of passing it',
      mistake1Bad: 'onclick={handleClick()}',
      mistake1Good: 'onclick={handleClick}',
      mistake1Why: 'Using () calls the function immediately. Without () you pass a reference that runs on click.',
      mistake2Title: 'Forgetting e.preventDefault() on forms',
      mistake2Bad: '<form onsubmit={handleSubmit}>  // page reloads!',
      mistake2Good: 'function handleSubmit(e) {\n  e.preventDefault();\n  // now it works\n}',
      mistake2Why: 'Without preventDefault() the browser submits the form and reloads the page.',
      mistake3Title: 'Not checking for empty input',
      mistake3Bad: 'function addTask(text) {\n  tasks = [...tasks, { text }];\n}',
      mistake3Good: 'function addTask(text) {\n  if (!text.trim()) return;\n  tasks = [...tasks, { text: text.trim() }];\n}',
      mistake3Why: 'Users might submit empty strings. Always validate input before adding.',
      mistake4Title: 'Mutating the array directly',
      mistake4Bad: 'tasks.splice(index, 1);',
      mistake4Good: 'tasks = tasks.filter(t => t.id !== id);',
      mistake4Why: 'Svelte needs a new array reference to detect the change. Mutating in place won\'t trigger a re-render.',
      prevLesson: '← Lesson 02: Templating',
      nextLesson: 'Lesson 04: Bindings →'
    },
    es: {
      lessonBadge: 'Lección 03',
      title: 'Eventos',
      subtitle: 'Maneja interacciones del usuario con onclick, onsubmit y manejadores de eventos',
      appFeature: 'Funcionalidad: Agregar y Eliminar Tareas',
      appFeatureDesc: 'En esta lección hacemos crecer el Gestor de Tareas permitiendo a los usuarios agregar nuevas tareas y eliminar las existentes, todo mediante el manejo de eventos en Svelte.',
      topic1Title: 'onclick — Manejador Inline vs Función',
      topic1Desc: 'Svelte te permite adjuntar manejadores de clic directamente. Puedes usar una función flecha inline o referenciar una función con nombre.',
      inlineLabel: 'Manejador inline',
      inlineCode: 'onclick={() => addTask("Nueva tarea")}',
      funcRefLabel: 'Referencia a función',
      funcRefCode: 'onclick={handleAdd}',
      addTask: 'Agregar tarea',
      noTasks: 'Sin tareas aún',
      topic2Title: 'El Objeto Event',
      topic2Desc: 'Cada manejador de eventos recibe un objeto event con propiedades útiles como type, target y timeStamp.',
      topic2Btn: '¡Haz clic!',
      topic2Code: 'onclick={(e) => { console.log(e.type, e.target, e.timeStamp) }}',
      topic2Result: 'Info del evento',
      topic2Click: 'Haz clic en el botón para ver los datos del evento',
      topic2Type: 'Tipo',
      topic2Target: 'Target',
      topic2Timestamp: 'Timestamp (ms)',
      topic3Title: 'onsubmit & Manejo de Formularios',
      topic3Desc: 'Usa onsubmit en un <form> para manejar envíos. Siempre llama a e.preventDefault() para evitar que la página se recargue.',
      topic3Code: '<form onsubmit={(e) => { e.preventDefault(); addTask(input); } }>',
      topic3Placeholder: 'Escribe una nueva tarea...',
      topic3Submit: 'Agregar',
      topic4Title: 'Eventos de Teclado',
      topic4Desc: 'Escucha pulsaciones de teclas con onkeydown. Verifica e.key para responder a teclas específicas como Enter.',
      topic4Code: '<input onkeydown={(e) => { if (e.key === "Enter") addTask(); } } />',
      topic4Placeholder: 'Escribe y presiona Enter...',
      topic5Title: 'Eliminar Tareas',
      topic5Desc: 'Usa Array.filter() dentro de un manejador de eventos para eliminar una tarea por su id.',
      topic5Code: 'tasks = tasks.filter(t => t.id !== id)',
      topic5Delete: 'Eliminar',
      demoTitle: 'Demo Interactivo Completo: Mini Gestor de Tareas',
      demoDesc: 'Combina todo lo que aprendiste — agrega tareas con botón o Enter, y elimínalas.',
      demoPlaceholder: 'Agregar una nueva tarea...',
      demoAdd: 'Agregar',
      demoDelete: '×',
      mistakesTitle: 'Errores Comunes',
      mistake1Title: 'Llamar la función en vez de pasarla',
      mistake1Bad: 'onclick={handleClick()}',
      mistake1Good: 'onclick={handleClick}',
      mistake1Why: 'Usar () ejecuta la función inmediatamente. Sin () pasas una referencia que se ejecuta al hacer clic.',
      mistake2Title: 'Olvidar e.preventDefault() en formularios',
      mistake2Bad: '<form onsubmit={handleSubmit}>  // ¡la página se recarga!',
      mistake2Good: 'function handleSubmit(e) {\n  e.preventDefault();\n  // ahora funciona\n}',
      mistake2Why: 'Sin preventDefault() el navegador envía el formulario y recarga la página.',
      mistake3Title: 'No validar input vacío',
      mistake3Bad: 'function addTask(text) {\n  tasks = [...tasks, { text }];\n}',
      mistake3Good: 'function addTask(text) {\n  if (!text.trim()) return;\n  tasks = [...tasks, { text: text.trim() }];\n}',
      mistake3Why: 'Los usuarios podrían enviar cadenas vacías. Siempre valida el input antes de agregar.',
      mistake4Title: 'Mutar el array directamente',
      mistake4Bad: 'tasks.splice(index, 1);',
      mistake4Good: 'tasks = tasks.filter(t => t.id !== id);',
      mistake4Why: 'Svelte necesita una nueva referencia de array para detectar el cambio. Mutar in-place no dispara una re-renderización.',
      prevLesson: '← Lección 02: Plantillas',
      nextLesson: 'Lección 04: Enlaces →'
    }
  };

  let t = $derived(text[lang]);
</script>

<div class="lesson">
  <div class="lesson-header">
    <div class="lesson-badge">{t.lessonBadge}</div>
    <a href="/" class="back-link">{ui.backToHome}</a>
    <h1>{t.title}</h1>
    <p class="subtitle">{t.subtitle}</p>
  </div>

  <div class="app-feature-banner">
    <span class="app-feature-badge">🛠️ {t.appFeature}</span>
    <p>{t.appFeatureDesc}</p>
  </div>

  <!-- TOPIC 1: onclick -->
  <section class="topic">
    <h2>1. {t.topic1Title}</h2>
    <p class="topic-desc">{t.topic1Desc}</p>

    <div class="side-by-side">
      <div class="example-box">
        <div class="example-label">{t.inlineLabel}</div>
        <pre class="code-block"><code>{t.inlineCode}</code></pre>
        <div class="interactive-area">
          <button class="btn btn-primary" onclick={() => addInlineTask(lang === 'en' ? 'New task' : 'Nueva tarea')}>
            {t.addTask}
          </button>
          <ul class="mini-list">
            {#each inlineTasks as task}
              <li>
                {task.text}
                <button class="btn-delete-sm" onclick={() => deleteInlineTask(task.id)}>×</button>
              </li>
            {/each}
          </ul>
          {#if inlineTasks.length === 0}
            <p class="empty-msg">{t.noTasks}</p>
          {/if}
        </div>
      </div>

      <div class="example-box">
        <div class="example-label">{t.funcRefLabel}</div>
        <pre class="code-block"><code>{t.funcRefCode}</code></pre>
        <div class="interactive-area">
          <button class="btn btn-primary" onclick={addFuncRefTask}>
            {t.addTask}
          </button>
          <ul class="mini-list">
            {#each funcRefTasks as task}
              <li>
                {task.text}
                <button class="btn-delete-sm" onclick={() => deleteFuncRefTask(task.id)}>×</button>
              </li>
            {/each}
          </ul>
          {#if funcRefTasks.length === 0}
            <p class="empty-msg">{t.noTasks}</p>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <!-- TOPIC 2: Event Object -->
  <section class="topic">
    <h2>2. {t.topic2Title}</h2>
    <p class="topic-desc">{t.topic2Desc}</p>

    <pre class="code-block"><code>{t.topic2Code}</code></pre>

    <div class="interactive-area">
      <button class="btn btn-primary" onclick={handleEventClick}>{t.topic2Btn}</button>

      {#if eventInfo}
        <div class="event-info-card">
          <h4>{t.topic2Result}</h4>
          <div class="event-info-grid">
            <div class="event-info-item">
              <span class="event-info-label">{t.topic2Type}:</span>
              <code>{eventInfo.type}</code>
            </div>
            <div class="event-info-item">
              <span class="event-info-label">{t.topic2Target}:</span>
              <code>&lt;{eventInfo.target}&gt;</code>
            </div>
            <div class="event-info-item">
              <span class="event-info-label">{t.topic2Timestamp}:</span>
              <code>{eventInfo.timestamp}</code>
            </div>
          </div>
        </div>
      {:else}
        <p class="hint-text">{t.topic2Click}</p>
      {/if}
    </div>
  </section>

  <!-- TOPIC 3: onsubmit -->
  <section class="topic">
    <h2>3. {t.topic3Title}</h2>
    <p class="topic-desc">{t.topic3Desc}</p>

    <pre class="code-block"><code>{t.topic3Code}</code></pre>

    <div class="interactive-area">
      <form class="task-form" onsubmit={handleFormSubmit}>
        <input
          type="text"
          bind:value={formInput}
          placeholder={t.topic3Placeholder}
          class="input"
        />
        <button type="submit" class="btn btn-primary">{t.topic3Submit}</button>
      </form>

      <ul class="task-list">
        {#each formTasks as task}
          <li>
            <span>{task.text}</span>
            <button class="btn-delete" onclick={() => deleteFormTask(task.id)}>{t.topic5Delete}</button>
          </li>
        {/each}
      </ul>
    </div>
  </section>

  <!-- TOPIC 4: Keyboard Events -->
  <section class="topic">
    <h2>4. {t.topic4Title}</h2>
    <p class="topic-desc">{t.topic4Desc}</p>

    <pre class="code-block"><code>{t.topic4Code}</code></pre>

    <div class="interactive-area">
      <input
        type="text"
        bind:value={kbInput}
        onkeydown={handleKeydown}
        placeholder={t.topic4Placeholder}
        class="input"
      />

      <ul class="task-list">
        {#each kbTasks as task}
          <li>
            <span>{task.text}</span>
            <button class="btn-delete" onclick={() => deleteKbTask(task.id)}>{t.topic5Delete}</button>
          </li>
        {/each}
      </ul>
      {#if kbTasks.length === 0}
        <p class="hint-text">{t.topic4Placeholder}</p>
      {/if}
    </div>
  </section>

  <!-- TOPIC 5: Deleting Tasks -->
  <section class="topic">
    <h2>5. {t.topic5Title}</h2>
    <p class="topic-desc">{t.topic5Desc}</p>

    <pre class="code-block"><code>{t.topic5Code}</code></pre>

    <div class="interactive-area">
      <ul class="task-list">
        {#each demoTasks as task}
          <li>
            <span>{task.text}</span>
            <button class="btn-delete" onclick={() => deleteDemoTask(task.id)}>{t.topic5Delete}</button>
          </li>
        {/each}
      </ul>
      {#if demoTasks.length === 0}
        <p class="empty-msg">{t.noTasks}</p>
      {/if}
    </div>
  </section>

  <!-- FULL DEMO -->
  <section class="topic demo-section">
    <h2>{t.demoTitle}</h2>
    <p class="topic-desc">{t.demoDesc}</p>

    <div class="demo-box">
      <form class="task-form" onsubmit={(e) => { e.preventDefault(); addDemoTask(); }}>
        <input
          type="text"
          bind:value={demoInput}
          onkeydown={handleDemoKeydown}
          placeholder={t.demoPlaceholder}
          class="input"
        />
        <button type="submit" class="btn btn-primary">{t.demoAdd}</button>
      </form>

      <ul class="task-list demo-list">
        {#each demoTasks as task}
          <li>
            <span>{task.text}</span>
            <button class="btn-delete" onclick={() => deleteDemoTask(task.id)}>{t.demoDelete}</button>
          </li>
        {/each}
      </ul>
      {#if demoTasks.length === 0}
        <p class="empty-msg">{t.noTasks}</p>
      {/if}

      <div class="demo-counter">
        {#if demoTasks.length > 0}
          <span>{demoTasks.length} {lang === 'en' ? 'task(s)' : 'tarea(s)'}</span>
        {/if}
      </div>
    </div>
  </section>

  <!-- COMMON MISTAKES -->
  <section class="topic">
    <h2>{ui.commonMistakes}</h2>

    <div class="mistake-card">
      <h4>1. {t.mistake1Title}</h4>
      <div class="code-compare">
        <div class="code-bad">
          <span class="code-label bad">{lang === 'en' ? 'Wrong' : 'Incorrecto'}</span>
          <pre><code>{t.mistake1Bad}</code></pre>
        </div>
        <div class="code-good">
          <span class="code-label good">{lang === 'en' ? 'Correct' : 'Correcto'}</span>
          <pre><code>{t.mistake1Good}</code></pre>
        </div>
      </div>
      <p class="mistake-why">{t.mistake1Why}</p>
    </div>

    <div class="mistake-card">
      <h4>2. {t.mistake2Title}</h4>
      <div class="code-compare">
        <div class="code-bad">
          <span class="code-label bad">{lang === 'en' ? 'Wrong' : 'Incorrecto'}</span>
          <pre><code>{t.mistake2Bad}</code></pre>
        </div>
        <div class="code-good">
          <span class="code-label good">{lang === 'en' ? 'Correct' : 'Correcto'}</span>
          <pre><code>{t.mistake2Good}</code></pre>
        </div>
      </div>
      <p class="mistake-why">{t.mistake2Why}</p>
    </div>

    <div class="mistake-card">
      <h4>3. {t.mistake3Title}</h4>
      <div class="code-compare">
        <div class="code-bad">
          <span class="code-label bad">{lang === 'en' ? 'Wrong' : 'Incorrecto'}</span>
          <pre><code>{t.mistake3Bad}</code></pre>
        </div>
        <div class="code-good">
          <span class="code-label good">{lang === 'en' ? 'Correct' : 'Correcto'}</span>
          <pre><code>{t.mistake3Good}</code></pre>
        </div>
      </div>
      <p class="mistake-why">{t.mistake3Why}</p>
    </div>

    <div class="mistake-card">
      <h4>4. {t.mistake4Title}</h4>
      <div class="code-compare">
        <div class="code-bad">
          <span class="code-label bad">{lang === 'en' ? 'Wrong' : 'Incorrecto'}</span>
          <pre><code>{t.mistake4Bad}</code></pre>
        </div>
        <div class="code-good">
          <span class="code-label good">{lang === 'en' ? 'Correct' : 'Correcto'}</span>
          <pre><code>{t.mistake4Good}</code></pre>
        </div>
      </div>
      <p class="mistake-why">{t.mistake4Why}</p>
    </div>
  </section>

  <section class="exercise-section">
    <h2>✏️ {lang === 'en' ? 'Exercise' : 'Ejercicio'}: {lang === 'en' ? 'Mini Todo App' : 'Mini App de Tareas'}</h2>
    <div class="exercise-task">
      <p>{lang === 'en' ? 'Build a mini todo application that:' : 'Construye una mini aplicación de tareas que:'}</p>
      <ul>
        <li>{lang === 'en' ? 'Has an input field and an "Add" button' : 'Tenga un campo de entrada y un botón "Add"'}</li>
        <li>{lang === 'en' ? 'Pressing Enter in the input also adds the task' : 'Presionar Enter en el input también agregue la tarea'}</li>
        <li>{lang === 'en' ? 'Each task has a delete button' : 'Cada tarea tenga un botón de eliminar'}</li>
        <li>{lang === 'en' ? 'Shows a count of total tasks' : 'Muestre un conteo del total de tareas'}</li>
        <li>{lang === 'en' ? 'Prevents adding empty tasks' : 'Prevenga agregar tareas vacías'}</li>
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

  <div class="lesson-nav">
    <a href="/02-templating" class="nav-link">{t.prevLesson}</a>
    <a href="/04-bindings" class="nav-link">{t.nextLesson}</a>
  </div>
</div>

<style>
  .lesson {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }

  .lesson-header {
    margin-bottom: 2.5rem;
  }

  .lesson-badge {
    display: inline-block;
    background: var(--primary);
    color: white;
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .back-link {
    display: block;
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 1rem;
  }

  .lesson-header h1 {
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: var(--text-muted);
    font-size: 1.1rem;
    line-height: 1.5;
  }

  .app-feature-banner {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    color: white;
    border-radius: 16px;
    padding: 1.5rem 2rem;
    margin-bottom: 2.5rem;
  }

  .app-feature-badge {
    font-weight: 600;
    font-size: 1rem;
  }

  .app-feature-banner p {
    margin-top: 0.5rem;
    opacity: 0.95;
    line-height: 1.6;
  }

  .topic {
    margin-bottom: 3rem;
  }

  .topic h2 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    color: var(--text);
  }

  .topic-desc {
    color: var(--text-muted);
    margin-bottom: 1.25rem;
    line-height: 1.6;
  }

  .code-block {
    background: var(--code-bg);
    color: #cdd6f4;
    padding: 1rem 1.25rem;
    border-radius: 10px;
    overflow-x: auto;
    margin-bottom: 1.25rem;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .interactive-area {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.25rem;
  }

  .side-by-side {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .example-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }

  .example-label {
    background: var(--primary);
    color: white;
    padding: 6px 14px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .example-box .code-block {
    margin: 0;
    border-radius: 0;
    font-size: 0.8rem;
    padding: 0.75rem 1rem;
  }

  .example-box .interactive-area {
    border: none;
    border-top: 1px solid var(--border);
    border-radius: 0;
  }

  .btn {
    padding: 8px 20px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-primary {
    background: var(--primary);
    color: white;
  }

  .btn-primary:hover {
    background: var(--primary-light);
    transform: translateY(-1px);
  }

  .btn-delete {
    background: transparent;
    color: var(--error);
    border: 1px solid var(--error);
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.15s;
    font-weight: 500;
  }

  .btn-delete:hover {
    background: var(--error);
    color: white;
  }

  .btn-delete-sm {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 1rem;
    padding: 0 4px;
    line-height: 1;
    transition: color 0.15s;
  }

  .btn-delete-sm:hover {
    color: var(--error);
  }

  .mini-list {
    list-style: none;
    padding: 0;
    margin-top: 0.75rem;
  }

  .mini-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px;
    background: var(--bg);
    border-radius: 6px;
    margin-bottom: 4px;
    font-size: 0.9rem;
  }

  .event-info-card {
    margin-top: 1rem;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem;
  }

  .event-info-card h4 {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
    color: var(--primary);
  }

  .event-info-grid {
    display: grid;
    gap: 0.5rem;
  }

  .event-info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .event-info-label {
    font-weight: 600;
    font-size: 0.85rem;
    color: var(--text-muted);
    min-width: 120px;
  }

  .task-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .input {
    flex: 1;
    padding: 10px 14px;
    border: 2px solid var(--border);
    border-radius: 8px;
    font-size: 0.95rem;
    font-family: inherit;
    transition: border-color 0.15s;
    background: var(--bg);
    color: var(--text);
  }

  .input:focus {
    outline: none;
    border-color: var(--primary);
  }

  .task-list {
    list-style: none;
    padding: 0;
  }

  .task-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    margin-bottom: 6px;
    transition: all 0.15s;
  }

  .task-list li:hover {
    border-color: var(--primary-light);
  }

  .task-list li span {
    font-size: 0.95rem;
  }

  .demo-section {
    border-top: 3px solid var(--primary);
    padding-top: 2rem;
  }

  .demo-box {
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: 14px;
    padding: 1.5rem;
  }

  .demo-list {
    margin-top: 0.5rem;
  }

  .demo-counter {
    text-align: center;
    margin-top: 0.75rem;
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .empty-msg {
    text-align: center;
    color: var(--text-muted);
    font-style: italic;
    padding: 1rem 0;
    font-size: 0.9rem;
  }

  .hint-text {
    color: var(--text-muted);
    font-size: 0.85rem;
    margin-top: 0.75rem;
  }

  .mistake-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 4px solid var(--error);
    border-radius: 10px;
    padding: 1.25rem;
    margin-bottom: 1rem;
  }

  .mistake-card h4 {
    margin-bottom: 0.75rem;
    font-size: 1rem;
  }

  .code-compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .code-bad pre,
  .code-good pre {
    background: var(--code-bg);
    color: #cdd6f4;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.8rem;
    overflow-x: auto;
    margin: 0;
  }

  .code-label {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 6px;
    text-transform: uppercase;
  }

  .code-label.bad {
    background: #fde2e2;
    color: var(--error);
  }

  .code-label.good {
    background: #dcfce7;
    color: var(--success);
  }

  .mistake-why {
    color: var(--text-muted);
    font-size: 0.9rem;
    line-height: 1.5;
    background: var(--bg);
    padding: 0.75rem 1rem;
    border-radius: 8px;
  }

  .lesson-nav {
    display: flex;
    justify-content: space-between;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
    margin-top: 1rem;
  }

  .nav-link {
    padding: 10px 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.15s;
    color: var(--text);
    text-decoration: none;
  }

  .nav-link:hover {
    border-color: var(--primary);
    color: var(--primary);
    text-decoration: none;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .side-by-side,
    .code-compare {
      grid-template-columns: 1fr;
    }

    .lesson-header h1 {
      font-size: 1.6rem;
    }

    .task-form {
      flex-direction: column;
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
