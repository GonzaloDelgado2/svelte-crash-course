<script lang="ts">
  import LessonLayout from '$lib/components/LessonLayout.svelte';
  import CodeExample from '$lib/components/CodeExample.svelte';
  import { getLang } from '$lib/i18n/language.svelte.js';

  let lang = $derived(getLang());

  let effectCounter = $state(0);
  let effectLog = $state<string[]>([]);
  let logId = $state(0);

  function incrementEffect() {
    effectCounter++;
    logId++;
    effectLog = [...effectLog, `${lang === 'en' ? 'Effect fired!' : '¡Efecto ejecutado!'} count=${effectCounter} (id=${logId})`];
  }

  function clearLog() {
    effectLog = [];
  }

  $effect(() => {
    const _ = effectCounter;
    if (typeof window !== 'undefined' && _ > 0) {
      document.title = `Counter: ${_}`;
    }
  });

  let tasks = $state<{ id: number; title: string; done: boolean }[]>([
    { id: 1, title: lang === 'en' ? 'Learn Svelte' : 'Aprender Svelte', done: false },
    { id: 2, title: lang === 'en' ? 'Build an app' : 'Construir una app', done: true },
    { id: 3, title: lang === 'en' ? 'Deploy' : 'Desplegar', done: false }
  ]);
  let nextTaskId = $state(4);
  let newTask = $state('');
  let totalCount = $derived(tasks.length);
  let activeCount = $derived(tasks.filter(t => !t.done).length);
  let doneCount = $derived(tasks.filter(t => t.done).length);

  let lastCountChange = $state('');
  $effect(() => {
    const total = tasks.length;
    const active = tasks.filter(t => !t.done).length;
    const done = tasks.filter(t => t.done).length;
    lastCountChange = lang === 'en'
      ? `Stats updated: ${total} total, ${active} active, ${done} done`
      : `Estadísticas actualizadas: ${total} total, ${active} activas, ${done} hechas`;
  });

  function addTask() {
    const title = newTask.trim();
    if (!title) return;
    tasks.push({ id: nextTaskId++, title, done: false });
    newTask = '';
  }

  function removeTask(id: number) {
    tasks = tasks.filter(t => t.id !== id);
  }

  function toggleTask(id: number) {
    const task = tasks.find(t => t.id === id);
    if (task) task.done = !task.done;
  }

  let timerCount = $state(0);
  let timerRunning = $state(false);
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  $effect(() => {
    if (timerRunning) {
      timerInterval = setInterval(() => {
        timerCount++;
      }, 1000);
    }
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    };
  });

  function startTimer() {
    timerRunning = true;
  }

  function stopTimer() {
    timerRunning = false;
  }

  function resetTimer() {
    timerRunning = false;
    timerCount = 0;
  }

  let showSolution = $state(false);
  const solutionCode = `\x3Cscript lang="ts">
  let note = $state('');
  let saving = $state(false);

  $effect(() => {
    const text = note;
    if (!text) return;

    console.log('Auto-saving:', text);
    saving = true;

    const timeout = setTimeout(() => {
      saving = false;
    }, 500);

    return () => clearTimeout(timeout);
  });
\x3C/script>

<textarea bind:value={note} placeholder="Type a note..."></textarea>
{#if saving}
  <span>Saving...</span>
{/if}`;

  let toasts = $state<{ id: number; message: string; type: 'success' | 'info' | 'warning' }[]>([]);
  let toastId = $state(0);

  $effect(() => {
    if (toasts.length > 0) {
      const timeout = setTimeout(() => {
        toasts = toasts.slice(1);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  });

  function showToast(message: string, type: 'success' | 'info' | 'warning' = 'success') {
    toastId++;
    toasts = [...toasts, { id: toastId, message, type }];
  }

  function addTaskWithToast() {
    const title = newTask.trim();
    if (!title) {
      showToast(lang === 'en' ? 'Please enter a task name!' : '¡Ingresa un nombre de tarea!', 'warning');
      return;
    }
    tasks.push({ id: nextTaskId++, title, done: false });
    newTask = '';
    showToast(lang === 'en' ? `Task "${title}" added!` : `¡Tarea "${title}" agregada!`);
  }

  const text = {
    en: {
      title: 'Effects & Lifecycle',
      appFeature: 'Auto-count Tasks',
      topic1Title: '$effect — The Basics',
      topic1Desc: '$effect runs a function automatically whenever its reactive dependencies change. It is the Svelte 5 replacement for lifecycle methods like onMount, onDestroy, and reactive statements ($:).',
      topic1Code: `\x3Cscript lang="ts">
  let count = $state(0);

  // Runs whenever count changes
  $effect(() => {
    console.log('Count changed:', count);
  });

  // You can also update the document title
  $effect(() => {
    document.title = \`Counter: \${count}\`;
  });
\x3C/script>

<button onclick={() => count++}>
  Count: {count}
</button>`,
      topic1Interactive: 'Effect Logger — watch $effect fire',
      topic1Increment: 'Increment Counter',
      topic1Clear: 'Clear Log',
      topic1Empty: 'Click increment to see the effect fire!',
      topic2Title: 'Dependency Tracking',
      topic2Desc: '$effect automatically tracks which reactive values it reads. When any of those values change, the effect re-runs. You do NOT need to declare dependencies manually.',
      topic2Code: `let tasks = $state([]);
let filter = $state('all');

// Only depends on tasks.length
$effect(() => {
  console.log('Task count:', tasks.length);
});

// Depends on both tasks AND filter
$effect(() => {
  const filtered = tasks.filter(t =>
    filter === 'all' ? true : t.done
  );
  console.log('Filtered count:', filtered.length);
});`,
      topic2Interactive: 'Auto-counting Task Stats',
      topic2Stats: 'Stats auto-updated via $effect!',
      topic3Title: 'Cleanup Functions',
      topic3Desc: 'Return a function from $effect to run cleanup code. This runs before the effect re-runs and when the component is destroyed. Essential for intervals, event listeners, and subscriptions.',
      topic3Code: `\x3Cscript lang="ts">
  let count = $state(0);
  let running = $state(false);

  $effect(() => {
    if (running) {
      const id = setInterval(() => count++, 1000);
      // Cleanup: runs when running becomes false
      // or when component is destroyed
      return () => clearInterval(id);
    }
  });
\x3C/script>

<button onclick={() => running = !running">
  {running ? 'Stop' : 'Start'}
</button>
<p>Timer: {count}s</p>`,
      topic3Interactive: 'Cleanup Timer Demo',
      topic3Start: 'Start',
      topic3Stop: 'Stop',
      topic3Reset: 'Reset',
      topic3Seconds: 's',
      topic3Running: 'Running...',
      topic3Stopped: 'Stopped',
      topic4Title: '$effect.pre — Before DOM Update',
      topic4Desc: 'Use $effect.pre when you need to run code before the DOM updates. Regular $effect runs after. This is useful for measuring DOM elements before they change.',
      topic4Code: `// Runs AFTER DOM updates
$effect(() => {
  console.log('DOM is updated:', element.offsetWidth);
});

// Runs BEFORE DOM updates
$effect.pre(() => {
  console.log('About to update DOM');
});

// Rule of thumb:
// - Use $effect for most things
// - Use $effect.pre only when you need
//   to measure DOM before changes`,
      topic5Title: 'Toast Notifications with $effect',
      topic5Desc: 'A practical pattern: use $effect to auto-dismiss notifications after a timeout. The cleanup function clears the timeout if the component unmounts early.',
      topic5Code: `let toasts = $state([]);

function showToast(message: string) {
  toasts = [...toasts, { id: Date.now(), message }];
}

$effect(() => {
  if (toasts.length > 0) {
    const timeout = setTimeout(() => {
      toasts = toasts.slice(1);
    }, 3000);
    // Cleanup: cancel timeout if effect re-runs
    // or component unmounts
    return () => clearTimeout(timeout);
  }
});`,
      topic5Interactive: 'Toast Demo — add a task!',
      topic5InputPlaceholder: 'Add a task...',
      topic5Add: 'Add with Toast',
      demoTitle: 'Full Demo: Task Manager with Effects',
      demoDesc: 'This task manager uses $effect for auto-counting stats, localStorage persistence, and toast notifications — all reactive!',
      demoStats: 'Auto-counted stats',
      demoTotal: 'Total',
      demoActive: 'Active',
      demoDone: 'Done',
      demoInputPlaceholder: 'Add a task...',
      demoAdd: 'Add',
      demoToast: 'Task added!',
      mistakesTitle: 'Common Mistakes',
      mistake1Title: 'Using $effect for derived values',
      mistake1Wrong: `let count = $state(0);
let double = $state(0);

$effect(() => {
  double = count * 2; // Don't do this!
});`,
      mistake1Correct: `let count = $state(0);
let double = $derived(count * 2); // Use $derived!

// $derived is more efficient:
// - No unnecessary re-runs
// - Computed lazily (only when read)
// - Clearer intent`,
      mistake1Explain: '$effect is for side effects (logging, DOM manipulation, network). $derived is for computing values. Using $effect for derived values is slower and can cause infinite loops.',
      mistake2Title: 'Infinite loop in $effect',
      mistake2Wrong: `$effect(() => {
  count++; // Modifies dependency → re-runs → infinite!
});`,
      mistake2Correct: `$effect(() => {
  // READ reactive values
  console.log(count);

  // Do NOT WRITE to reactive values
  // that this effect reads
});`,
      mistake2Explain: 'If an $effect writes to a reactive value it also reads, it creates an infinite loop. Keep reads and writes separate, or use conditional guards.',
      mistake3Title: 'Forgetting cleanup for intervals/listeners',
      mistake3Wrong: `$effect(() => {
  setInterval(() => count++, 1000);
  // No cleanup! Interval keeps running
  // even after component is destroyed.
});`,
      mistake3Correct: `$effect(() => {
  const id = setInterval(() => count++, 1000);
  return () => clearInterval(id); // Proper cleanup!
});`,
      mistake3Explain: 'Without cleanup, intervals and event listeners persist after component destruction, causing memory leaks and bugs. Always return a cleanup function.',
      mistake4Title: 'Using $effect synchronously in module scope',
      mistake4Wrong: `// In a .svelte.ts file:
let count = $state(0);
$effect(() => {
  // This might not work as expected
  // in module scope (SSR issues)
  console.log(count);
});`,
      mistake4Correct: `// In a .svelte.ts file, export functions:
let count = $state(0);

export function getCount() {
  return count;
}

// Use $effect only in .svelte components
// or inside $effect.root() for module scope`,
      mistake4Explain: '$effect is designed for component lifecycle. In module-level code (.svelte.ts files), use $effect.root() or export functions that components can call from their own $effect blocks.'
    },
    es: {
      title: 'Efectos y Ciclo de Vida',
      appFeature: 'Conteo Automático',
      topic1Title: '$effect — Lo Básico',
      topic1Desc: '$effect ejecuta una función automáticamente cuando sus dependencias reactivas cambian. Es el reemplazo en Svelte 5 para los métodos de ciclo de vida como onMount, onDestroy y las declaraciones reactivas ($:).',
      topic1Code: `\x3Cscript lang="ts">
  let count = $state(0);

  // Se ejecuta cada vez que count cambia
  $effect(() => {
    console.log('Count cambió:', count);
  });

  // También puedes actualizar el título del documento
  $effect(() => {
    document.title = \`Contador: \${count}\`;
  });
\x3C/script>

<button onclick={() => count++}>
  Contador: {count}
</button>`,
      topic1Interactive: 'Registro de Efectos — observa $effect ejecutarse',
      topic1Increment: 'Incrementar Contador',
      topic1Clear: 'Limpiar Registro',
      topic1Empty: '¡Haz clic en incrementar para ver el efecto ejecutarse!',
      topic2Title: 'Seguimiento de Dependencias',
      topic2Desc: '$effect rastrea automáticamente qué valores reactivos lee. Cuando cualquiera de esos valores cambia, el efecto se vuelve a ejecutar. NO necesitas declarar dependencias manualmente.',
      topic2Code: `let tareas = $state([]);
let filtro = $state('todos');

// Solo depende de tareas.length
$effect(() => {
  console.log('Cantidad de tareas:', tareas.length);
});

// Depende de tareas Y filtro
$effect(() => {
  const filtradas = tareas.filter(t =>
    filtro === 'todos' ? true : t.done
  );
  console.log('Filtradas:', filtradas.length);
});`,
      topic2Interactive: 'Estadísticas de Tareas con Auto-conteo',
      topic2Stats: '¡Estadísticas actualizadas automáticamente via $effect!',
      topic3Title: 'Funciones de Limpieza',
      topic3Desc: 'Retorna una función desde $effect para ejecutar código de limpieza. Esto se ejecuta antes de que el efecto se vuelva a ejecutar y cuando el componente se destruye. Esencial para intervalos, event listeners y suscripciones.',
      topic3Code: `\x3Cscript lang="ts">
  let count = $state(0);
  let running = $state(false);

  $effect(() => {
    if (running) {
      const id = setInterval(() => count++, 1000);
      // Limpieza: se ejecuta cuando running es false
      // o cuando el componente se destruye
      return () => clearInterval(id);
    }
  });
\x3C/script>

<button onclick={() => running = !running}>
  {running ? 'Detener' : 'Iniciar'}
</button>
<p>Temporizador: {count}s</p>`,
      topic3Interactive: 'Demo de Temporizador con Limpieza',
      topic3Start: 'Iniciar',
      topic3Stop: 'Detener',
      topic3Reset: 'Reiniciar',
      topic3Seconds: 's',
      topic3Running: 'Ejecutándose...',
      topic3Stopped: 'Detenido',
      topic4Title: '$effect.pre — Antes de la Actualización del DOM',
      topic4Desc: 'Usa $effect.pre cuando necesitas ejecutar código antes de que el DOM se actualice. El $effect normal se ejecuta después. Esto es útil para medir elementos del DOM antes de que cambien.',
      topic4Code: `// Se ejecuta DESPUÉS de actualizaciones del DOM
$effect(() => {
  console.log('DOM actualizado:', element.offsetWidth);
});

// Se ejecuta ANTES de actualizaciones del DOM
$effect.pre(() => {
  console.log('A punto de actualizar el DOM');
});

// Regla general:
// - Usa $effect para la mayoría de cosas
// - Usa $effect.pre solo cuando necesites
//   medir el DOM antes de cambios`,
      topic5Title: 'Notificaciones Toast con $effect',
      topic5Desc: 'Un patrón práctico: usa $effect para auto-descartar notificaciones después de un timeout. La función de limpieza cancela el timeout si el componente se desmonta antes.',
      topic5Code: `let toasts = $state([]);

function mostrarToast(mensaje: string) {
  toasts = [...toasts, { id: Date.now(), message: mensaje }];
}

$effect(() => {
  if (toasts.length > 0) {
    const timeout = setTimeout(() => {
      toasts = toasts.slice(1);
    }, 3000);
    // Limpieza: cancela timeout si el efecto se re-ejecuta
    // o el componente se desmonta
    return () => clearTimeout(timeout);
  }
});`,
      topic5Interactive: 'Demo Toast — ¡agrega una tarea!',
      topic5InputPlaceholder: 'Agregar tarea...',
      topic5Add: 'Agregar con Toast',
      demoTitle: 'Demo Completa: Gestor de Tareas con Efectos',
      demoDesc: 'Este gestor de tareas usa $effect para auto-contar estadísticas, persistir en localStorage y mostrar notificaciones toast — ¡todo reactivo!',
      demoStats: 'Estadísticas auto-contadas',
      demoTotal: 'Total',
      demoActive: 'Activas',
      demoDone: 'Hechas',
      demoInputPlaceholder: 'Agregar tarea...',
      demoAdd: 'Agregar',
      demoToast: '¡Tarea agregada!',
      mistakesTitle: 'Errores Comunes',
      mistake1Title: 'Usar $effect para valores derivados',
      mistake1Wrong: `let count = $state(0);
let double = $state(0);

$effect(() => {
  double = count * 2; // ¡No hagas esto!
});`,
      mistake1Correct: `let count = $state(0);
let double = $derived(count * 2); // ¡Usa $derived!

// $derived es más eficiente:
// - Sin re-ejecuciones innecesarias
// - Se calcula perezosamente (solo al leer)
// - Intención más clara`,
      mistake1Explain: '$effect es para efectos secundarios (logging, manipulación del DOM, red). $derived es para calcular valores. Usar $effect para valores derivados es más lento y puede causar bucles infinitos.',
      mistake2Title: 'Bucle infinito en $effect',
      mistake2Wrong: `$effect(() => {
  count++; // Modifica dependencia → re-ejecuta → ¡infinito!
});`,
      mistake2Correct: `$effect(() => {
  // LEER valores reactivos
  console.log(count);

  // NO ESCRIBIR a valores reactivos
  // que este efecto lee
});`,
      mistake2Explain: 'Si un $effect escribe a un valor reactivo que también lee, crea un bucle infinito. Mantén lecturas y escrituras separadas, o usa guardas condicionales.',
      mistake3Title: 'Olvidar limpieza para intervalos/listeners',
      mistake3Wrong: `$effect(() => {
  setInterval(() => count++, 1000);
  // ¡Sin limpieza! El intervalo sigue ejecutándose
  // incluso después de que el componente se destruye.
});`,
      mistake3Correct: `$effect(() => {
  const id = setInterval(() => count++, 1000);
  return () => clearInterval(id); // ¡Limpieza correcta!
});`,
      mistake3Explain: 'Sin limpieza, los intervalos y event listeners persisten después de la destrucción del componente, causando memory leaks y bugs. Siempre retorna una función de limpieza.',
      mistake4Title: 'Usar $effect sincrónicamente en ámbito de módulo',
      mistake4Wrong: `// En un archivo .svelte.ts:
let count = $state(0);
$effect(() => {
  // Esto podría no funcionar como se espera
  // en ámbito de módulo (problemas de SSR)
  console.log(count);
});`,
      mistake4Correct: `// En un archivo .svelte.ts, exporta funciones:
let count = $state(0);

export function getCount() {
  return count;
}

// Usa $effect solo en componentes .svelte
// o dentro de $effect.root() para ámbito de módulo`,
      mistake4Explain: '$effect está diseñado para el ciclo de vida de componentes. En código a nivel de módulo (archivos .svelte.ts), usa $effect.root() o exporta funciones que los componentes puedan llamar desde sus propios bloques $effect.'
    }
  };
</script>

<LessonLayout lessonNum="05" title={text[lang].title} appFeature={text[lang].appFeature}>
  {#snippet theory()}
    <div class="topics">
      <section class="topic">
        <h3>1. {text[lang].topic1Title}</h3>
        <p>{text[lang].topic1Desc}</p>
        <CodeExample code={text[lang].topic1Code} filename="Effect.svelte" />
        <div class="interactive-box">
          <h4>{text[lang].topic1Interactive}</h4>
          <div class="effect-demo">
            <div class="effect-controls">
              <span class="counter-display">Count: <strong>{effectCounter}</strong></span>
              <button class="btn primary" onclick={incrementEffect}>{text[lang].topic1Increment}</button>
              <button class="btn secondary" onclick={clearLog}>{text[lang].topic1Clear}</button>
            </div>
            <div class="log-panel">
              <div class="log-header">{lang === 'en' ? 'Effect Log:' : 'Registro de Efectos:'}</div>
              <div class="log-entries">
                {#each effectLog as entry, i}
                  <div class="log-entry" style="opacity: {1 - (effectLog.length - 1 - i) * 0.1}">
                    <span class="log-num">#{i + 1}</span> {entry}
                  </div>
                {:else}
                  <div class="log-empty">{text[lang].topic1Empty}</div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>2. {text[lang].topic2Title}</h3>
        <p>{text[lang].topic2Desc}</p>
        <CodeExample code={text[lang].topic2Code} filename="Dependencies.svelte" />
        <div class="interactive-box">
          <h4>{text[lang].topic2Interactive}</h4>
          <p class="hint-text">{text[lang].topic2Stats}</p>
          <div class="add-task">
            <input type="text" placeholder={lang === 'en' ? 'Add a task...' : 'Agregar tarea...'} bind:value={newTask} onkeydown={(e) => e.key === 'Enter' && addTask()} />
            <button class="btn primary" onclick={addTask}>{lang === 'en' ? 'Add' : 'Agregar'}</button>
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
            {/each}
          </ul>
          <div class="stats-bar">
            <span>{totalCount} {lang === 'en' ? 'total' : 'total'}</span>
            <span>{activeCount} {lang === 'en' ? 'active' : 'activas'}</span>
            <span>{doneCount} {lang === 'en' ? 'done' : 'hechas'}</span>
          </div>
          <div class="change-log">{lastCountChange}</div>
        </div>
      </section>

      <section class="topic">
        <h3>3. {text[lang].topic3Title}</h3>
        <p>{text[lang].topic3Desc}</p>
        <CodeExample code={text[lang].topic3Code} filename="Cleanup.svelte" />
        <div class="interactive-box">
          <h4>{text[lang].topic3Interactive}</h4>
          <div class="timer-demo">
            <div class="timer-display">
              <span class="timer-value">{timerCount}</span>
              <span class="timer-unit">{text[lang].topic3Seconds}</span>
            </div>
            <div class="timer-status" class:running={timerRunning}>
              {timerRunning ? text[lang].topic3Running : text[lang].topic3Stopped}
            </div>
            <div class="timer-controls">
              {#if !timerRunning}
                <button class="btn primary" onclick={startTimer}>{text[lang].topic3Start}</button>
              {:else}
                <button class="btn warning" onclick={stopTimer}>{text[lang].topic3Stop}</button>
              {/if}
              <button class="btn secondary" onclick={resetTimer}>{text[lang].topic3Reset}</button>
            </div>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>4. {text[lang].topic4Title}</h3>
        <p>{text[lang].topic4Desc}</p>
        <CodeExample code={text[lang].topic4Code} filename="EffectPre.svelte" />
      </section>

      <section class="topic">
        <h3>5. {text[lang].topic5Title}</h3>
        <p>{text[lang].topic5Desc}</p>
        <CodeExample code={text[lang].topic5Code} filename="Toasts.svelte" />
        <div class="interactive-box">
          <h4>{text[lang].topic5Interactive}</h4>
          <div class="toast-demo">
            <div class="add-task">
              <input type="text" placeholder={text[lang].topic5InputPlaceholder} bind:value={newTask} onkeydown={(e) => e.key === 'Enter' && addTaskWithToast()} />
              <button class="btn primary" onclick={addTaskWithToast}>{text[lang].topic5Add}</button>
            </div>
            <div class="toast-container">
              {#each toasts as toast (toast.id)}
                <div class="toast" class:success={toast.type === 'success'} class:warning={toast.type === 'warning'} class:info={toast.type === 'info'}>
                  {toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : 'ℹ️'} {toast.message}
                </div>
              {/each}
            </div>
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
        <div class="demo-stats">
          <h4>{text[lang].demoStats}</h4>
          <div class="stat-cards">
            <div class="stat-card">
              <span class="stat-value">{totalCount}</span>
              <span class="stat-label">{text[lang].demoTotal}</span>
            </div>
            <div class="stat-card active">
              <span class="stat-value">{activeCount}</span>
              <span class="stat-label">{text[lang].demoActive}</span>
            </div>
            <div class="stat-card done">
              <span class="stat-value">{doneCount}</span>
              <span class="stat-label">{text[lang].demoDone}</span>
            </div>
          </div>
        </div>
        <div class="add-task">
          <input type="text" placeholder={text[lang].demoInputPlaceholder} bind:value={newTask} onkeydown={(e) => e.key === 'Enter' && addTaskWithToast()} />
          <button class="btn primary" onclick={addTaskWithToast}>{text[lang].demoAdd}</button>
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
          {/each}
        </ul>
        <div class="toast-container">
          {#each toasts as toast (toast.id)}
            <div class="toast" class:success={toast.type === 'success'} class:warning={toast.type === 'warning'}>
              {toast.type === 'success' ? '✅' : '⚠️'} {toast.message}
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/snippet}

  {#snippet challenge()}
    <div class="challenge-content">
      <p>{lang === 'en'
        ? 'Create a "stale task" detector: add a $effect that checks each task\'s age and marks tasks as stale (different style) after 10 seconds. Hint: use Date.now() when creating tasks and compare in the effect.'
        : 'Crea un detector de "tareas obsoletas": agrega un $effect que verifique la antigüedad de cada tarea y marque las tareas como obsoletas (estilo diferente) después de 10 segundos. Pista: usa Date.now() al crear tareas y compara en el efecto.'}</p>
      <CodeExample code={lang === 'en'
        ? `interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: number; // Date.now()
  stale?: boolean;
}

$effect(() => {
  const now = Date.now();
  const STALE_MS = 10_000; // 10 seconds
  for (const task of tasks) {
    if (now - task.createdAt > STALE_MS) {
      task.stale = true;
    }
  }
});`
        : `interface Tarea {
  id: number;
  titulo: string;
  hecho: boolean;
  creadoEn: number; // Date.now()
  obsoleta?: boolean;
}

$effect(() => {
  const ahora = Date.now();
  const MS_OBSOLETA = 10_000; // 10 segundos
  for (const tarea of tareas) {
    if (ahora - tarea.creadoEn > MS_OBSOLETA) {
      tarea.obsoleta = true;
    }
  }
});`} filename="challenge.svelte" />
    </div>
  {/snippet}

  <section class="exercise-section">
    <h2>✏️ {lang === 'en' ? 'Exercise' : 'Ejercicio'}: Auto-Save with $effect</h2>
    <div class="exercise-task">
      <p>{lang === 'en' ? 'Build a note-taking component that:' : 'Construye un componente de notas que:'}</p>
      <ul>
        <li>{lang === 'en' ? 'Uses $state for the note text' : 'Usa $state para el texto de la nota'}</li>
        <li>{lang === 'en' ? 'Uses $effect to "auto-save" (console.log) whenever the text changes' : 'Usa $effect para "auto-guardar" (console.log) cuando el texto cambie'}</li>
        <li>{lang === 'en' ? 'Shows a "Saving..." indicator for 500ms after each change using $effect' : 'Muestra un indicador "Saving..." durante 500ms después de cada cambio usando $effect'}</li>
        <li>{lang === 'en' ? 'The effect cleanup function should clear the timeout' : 'La función de limpieza del efecto debe limpiar el timeout'}</li>
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
  .hint-text {
    color: var(--info);
    font-weight: 500;
    margin-bottom: 1rem;
    font-size: 0.9rem;
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
  .btn.primary { background: var(--primary); color: white; }
  .btn.primary:hover { opacity: 0.9; }
  .btn.secondary { background: var(--surface); color: var(--text); border: 1px solid var(--border); }
  .btn.secondary:hover { background: var(--surface-hover); }
  .btn.warning { background: var(--warning); color: white; }
  .btn.warning:hover { opacity: 0.9; }
  .effect-demo {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .effect-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .counter-display {
    font-size: 1.1rem;
    font-weight: 600;
    min-width: 100px;
  }
  .counter-display strong {
    color: var(--primary);
    font-size: 1.3rem;
  }
  .log-panel {
    background: var(--code-bg);
    border-radius: 8px;
    overflow: hidden;
  }
  .log-header {
    padding: 6px 12px;
    background: #2a2a3e;
    color: #89b4fa;
    font-size: 0.8rem;
    font-weight: 600;
  }
  .log-entries {
    padding: 0.5rem;
    max-height: 200px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .log-entry {
    color: #cdd6f4;
    font-size: 0.82rem;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  .log-num {
    color: var(--primary);
    font-weight: 700;
    margin-right: 6px;
  }
  .log-empty {
    color: #6c7086;
    font-size: 0.85rem;
    padding: 1rem;
    text-align: center;
    font-style: italic;
  }
  .add-task {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
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
  .task-list {
    list-style: none;
    padding: 0;
    margin: 0;
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
  }
  .task-list li.done .task-title {
    text-decoration: line-through;
    opacity: 0.5;
  }
  .task-check { cursor: pointer; font-size: 1.1rem; user-select: none; }
  .task-title { flex: 1; font-size: 0.92rem; }
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
  .delete-btn:hover { color: var(--error); background: #fef2f2; }
  .stats-bar {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border);
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  .change-log {
    margin-top: 0.75rem;
    padding: 8px 12px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    color: #1e40af;
    font-size: 0.85rem;
    font-weight: 500;
  }
  .timer-demo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .timer-display {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }
  .timer-value {
    font-size: 3rem;
    font-weight: 700;
    color: var(--primary);
    font-variant-numeric: tabular-nums;
  }
  .timer-unit {
    font-size: 1.2rem;
    color: var(--text-muted);
  }
  .timer-status {
    font-size: 0.9rem;
    font-weight: 600;
    padding: 4px 16px;
    border-radius: 20px;
    background: var(--surface);
    color: var(--text-muted);
  }
  .timer-status.running {
    background: #ecfdf5;
    color: #059669;
  }
  .timer-controls {
    display: flex;
    gap: 0.5rem;
  }
  .toast-demo {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .toast-container {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 40px;
  }
  .toast {
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.9rem;
    animation: slideIn 0.3s ease-out;
  }
  .toast.success { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
  .toast.warning { background: #fef3c7; border: 1px solid #fcd34d; color: #92400e; }
  .toast.info { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .demo h3 { font-size: 1.2rem; color: var(--text); margin-bottom: 0.5rem; }
  .demo p { color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem; }
  .demo-app {
    background: var(--surface);
    border-radius: 12px;
    padding: 1.25rem;
    border: 1px solid var(--border);
  }
  .demo-stats h4 { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.75rem; }
  .stat-cards { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
  .stat-card {
    flex: 1;
    text-align: center;
    padding: 1rem;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
  }
  .stat-card .stat-value {
    display: block;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text);
  }
  .stat-card .stat-label {
    font-size: 0.8rem;
    color: var(--text-muted);
    text-transform: uppercase;
    font-weight: 600;
  }
  .stat-card.active { border-color: var(--info); }
  .stat-card.active .stat-value { color: var(--info); }
  .stat-card.done { border-color: var(--success); }
  .stat-card.done .stat-value { color: var(--success); }
  .challenge-content p { line-height: 1.7; margin-bottom: 1rem; }
  .mistakes { margin-top: 2rem; }
  .mistakes h2 { font-size: 1.3rem; color: var(--text); margin-bottom: 1.5rem; }
  .mistake-cards { display: flex; flex-direction: column; gap: 1.5rem; }
  .mistake-card {
    background: var(--surface);
    border-radius: 12px;
    padding: 1.25rem;
    border: 1px solid var(--border);
  }
  .mistake-card h3 { font-size: 1rem; color: var(--error); margin-bottom: 1rem; }
  .code-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
  .wrong pre, .correct pre { margin: 0; background: var(--code-bg); padding: 0.75rem 1rem; border-radius: 0 8px 8px 8px; }
  .wrong code, .correct code { color: #cdd6f4; font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace; font-size: 0.82rem; line-height: 1.5; white-space: pre; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 6px 6px 0 0; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
  .wrong-badge { background: #fecaca; color: #991b1b; }
  .correct-badge { background: #bbf7d0; color: #166534; }
  .explain { color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; font-style: italic; }
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
  @media (max-width: 768px) {
    .code-compare { grid-template-columns: 1fr; }
    .stat-cards { flex-direction: column; }
  }
</style>
