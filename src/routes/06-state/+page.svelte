<script lang="ts">
  import LessonLayout from '$lib/components/LessonLayout.svelte';
  import CodeExample from '$lib/components/CodeExample.svelte';
  import { getLang } from '$lib/i18n/language.svelte.js';

  let lang = $derived(getLang());

  let sharedCount = $state(0);

  let themeColor = $state('#ff3e00');
  let childColor = $derived(themeColor);

  class TaskManager {
    tasks = $state<{ id: number; text: string; done: boolean }[]>([]);
    nextId = $state(1);

    add(text: string) {
      this.tasks.push({ id: this.nextId++, text, done: false });
    }

    remove(id: number) {
      this.tasks = this.tasks.filter((t) => t.id !== id);
    }

    toggle(id: number) {
      const task = this.tasks.find((t) => t.id === id);
      if (task) task.done = !task.done;
    }

    get count() {
      return this.tasks.length;
    }

    get doneCount() {
      return this.tasks.filter((t) => t.done).length;
    }

    get activeCount() {
      return this.tasks.filter((t) => !t.done).length;
    }
  }

  let manager = $state(new TaskManager());
  let taskInput = $state('');

  function addManagerTask() {
    const text = taskInput.trim();
    if (!text) return;
    manager.add(text);
    taskInput = '';
  }

  let settingsTheme = $state<'light' | 'dark' | 'auto'>('auto');
  let settingsFontSize = $state(16);
  let settingsLang = $state<'en' | 'es'>('en');

  let showSolution = $state(false);
  const solutionCode = `// src/lib/shopping-list.svelte.ts — shared instance so any component can import it
class ShoppingList {
  items = $state<{ id: number; name: string; bought: boolean }[]>([]);
  total = $derived(this.items.length);
  bought = $derived(this.items.filter(i => i.bought).length);

  addItem(name: string) {
    this.items = [...this.items, { id: Date.now(), name, bought: false }];
  }

  removeItem(id: number) {
    this.items = this.items.filter(i => i.id !== id);
  }

  toggleItem(id: number) {
    this.items = this.items.map(i =>
      i.id === id ? { ...i, bought: !i.bought } : i
    );
  }
}

export const list = new ShoppingList();

// In any component, just:
//   import { list } from '$lib/shopping-list.svelte';
// Both components read/write the same reactive instance.`;

  const text = {
    en: {
      title: 'State Management',
      appFeature: 'Shared State',
      topic1Title: 'Module-Level State with .svelte.ts',
      topic1Desc: 'In Svelte 5, shared state lives in .svelte.ts files using the $state rune. Any component that imports the same variable shares the same reactive reference — no stores needed.',
      topic1Code: `// counter.svelte.ts
// In a real app, this would be in a separate .svelte.ts file
let count = $state(0);

export function getCount() { return count; }
export function increment() { count++; }
export function reset() { count = 0; }

// ComponentA.svelte and ComponentB.svelte
// both import from the same file — they share state!
import { getCount, increment } from './counter.svelte.ts';`,
      demo1Title: 'Shared Counter Demo',
      demo1Desc: 'Both panels share the same state. Incrementing in one updates the other instantly.',
      panelA: 'Panel A',
      panelB: 'Panel B',
      increment: '+1',
      decrement: '-1',
      reset: 'Reset',
      topic2Title: 'setContext / getContext',
      topic2Desc: 'Use setContext in a parent component to provide data deep down the tree. Children access it with getContext. This avoids prop drilling — passing props through many intermediate layers.',
      topic2Code: `// In parent component
import { setContext } from 'svelte';
setContext('theme', $state({ color: '#ff3e00' }));

// In any deeply nested child
import { getContext } from 'svelte';
const theme = getContext('theme');
// theme.color is reactively linked!`,
      demo2Title: 'Theme Context Demo',
      demo2Desc: 'The "parent" sets a theme color. The "child" panels read it reactively.',
      parentLabel: 'Parent (setContext)',
      childALabel: 'Child A (getContext)',
      childBLabel: 'Child B (getContext)',
      pickColor: 'Pick theme color:',
      topic3Title: 'Reactive Classes with $state',
      topic3Desc: 'You can use $state inside class definitions. Properties decorated with $state become reactive — any component using an instance of the class will update when properties change.',
      topic3Code: `class TaskManager {
  tasks = $state<Task[]>([]);
  nextId = $state(1);

  add(text: string) {
    this.tasks.push({ id: this.nextId++, text, done: false });
  }

  remove(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

  get count() { return this.tasks.length; }
  get doneCount() {
    return this.tasks.filter(t => t.done).length;
  }
}

// In a .svelte.ts file:
export const taskManager = new TaskManager();`,
      demo3Title: 'Reactive TaskManager Class',
      demo3Desc: 'Tasks are managed by a class with $state properties. The stats update automatically.',
      addTask: 'Add',
      inputPlaceholder: 'Add a task...',
      noTasks: 'No tasks yet!',
      total: 'Total',
      done: 'Done',
      active: 'Active',
      topic4Title: 'State Ownership Visualization',
      topic4Desc: 'Understanding where state "lives" vs where it is "used" is critical. State should be owned by the closest common ancestor that needs it, or lifted to module level when shared across distant components.',
      diagramModule: 'Module (.svelte.ts)',
      diagramParent: 'Parent Component',
      diagramChildA: 'Child A',
      diagramChildB: 'Child B',
      diagramDeepChild: 'Deep Child',
      diagramLegend1: 'Module state: shared everywhere',
      diagramLegend2: 'Context: parent-to-deep-child',
      diagramLegend3: 'Props: parent-to-direct-child',
      demoTitle: 'Full Demo: Shared Task Manager',
      demoDesc: 'A single TaskManager instance is shared between a list view and a stats view. Adding or completing tasks in one view instantly updates the other.',
      listView: 'List View',
      statsView: 'Stats View',
      all: 'All',
      mistakesTitle: 'Common Mistakes',
      mistake1Title: 'Using Svelte 4 stores in Svelte 5',
      mistake1Wrong: `import { writable } from 'svelte/store';
const count = writable(0);
// $count = 5; // old syntax`,
      mistake1Correct: `// counter.svelte.ts
let count = $state(0);
export function getCount() { return count; }
export function setCount(n: number) { count = n; }`,
      mistake1Explain: 'Svelte 5 replaces stores with $state runes in .svelte.ts files. Stores still work but are the legacy approach. Use runes for new code.',
      mistake2Title: 'Calling getContext outside component initialization',
      mistake2Wrong: `// Inside an event handler or $effect
function handleClick() {
  const theme = getContext('theme'); // ERROR!
}`,
      mistake2Correct: `// At the top level of the component
const theme = getContext('theme');

function handleClick() {
  console.log(theme.color); // OK!
}`,
      mistake2Explain: 'getContext and setContext must be called during component initialization (top level of the <script> block), not inside event handlers, $effect, or callbacks.',
      mistake3Title: 'Module state SSR issues',
      mistake3Wrong: `// state.svelte.ts
let user = $state(null); // shared across ALL users on SSR!
export function getUser() { return user; }`,
      mistake3Correct: `// state.svelte.ts (browser only)
let user = $state(null);
export function getUser() {
  if (typeof window === 'undefined') return null;
  return user;
}
// Or better: use SvelteKit load functions for server state`,
      mistake3Explain: 'Module-level state is shared across all requests during SSR. For user-specific data, use SvelteKit load functions or ensure state is only created in the browser.',
      mistake4Title: 'Not understanding reactivity boundaries',
      mistake4Wrong: `// In a regular .ts file (no .svelte.ts!)
let count = 0; // NOT reactive!
export function increment() { count++; }`,
      mistake4Correct: `// In a .svelte.ts file
let count = $state(0); // Reactive!
export function increment() { count++; }
export function getCount() { return count; }`,
      mistake4Explain: 'The $state rune only works in .svelte or .svelte.ts files. A regular .ts file has no Svelte compiler processing, so runes are treated as plain variables.',
      challengeTitle: 'Challenge: Shared Settings Store',
      challengeDesc: 'Create a shared settings store that persists theme preference to localStorage. Toggle between light, dark, and auto themes, and see the preference persist across page reloads.',
      theme: 'Theme',
      fontSize: 'Font Size',
      language: 'Language',
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto',
      currentSettings: 'Current Settings',
      settingsHint: `// settings.svelte.ts
// In a real app, this would be a separate file
let theme = $state<'light' | 'dark' | 'auto'>('auto');
let fontSize = $state(16);

// Persist to localStorage
$effect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('settings', JSON.stringify({ theme, fontSize }));
  }
});

export function getTheme() { return theme; }
export function setTheme(t: typeof theme) { theme = t; }`
    },
    es: {
      title: 'Gestión de Estado',
      appFeature: 'Estado Compartido',
      topic1Title: 'Estado a Nivel de Módulo con .svelte.ts',
      topic1Desc: 'En Svelte 5, el estado compartido vive en archivos .svelte.ts usando el rune $state. Cualquier componente que importe la misma variable comparte la misma referencia reactiva — no necesitas stores.',
      topic1Code: `// contador.svelte.ts
// En una app real, esto estaría en un archivo .svelte.ts separado
let count = $state(0);

export function getCount() { return count; }
export function incrementar() { count++; }
export function resetear() { count = 0; }

// ComponenteA.svelte y ComponenteB.svelte
// ambos importan del mismo archivo — ¡comparten estado!
import { getCount, incrementar } from './contador.svelte.ts';`,
      demo1Title: 'Demo de Contador Compartido',
      demo1Desc: 'Ambos paneles comparten el mismo estado. Incrementar en uno actualiza el otro instantáneamente.',
      panelA: 'Panel A',
      panelB: 'Panel B',
      increment: '+1',
      decrement: '-1',
      reset: 'Reiniciar',
      topic2Title: 'setContext / getContext',
      topic2Desc: 'Usa setContext en un componente padre para proveer datos profundo en el árbol. Los hijos los acceden con getContext. Esto evita prop drilling — pasar props a través de muchas capas intermedias.',
      topic2Code: `// En el componente padre
import { setContext } from 'svelte';
setContext('theme', $state({ color: '#ff3e00' }));

// En cualquier hijo anidado profundamente
import { getContext } from 'svelte';
const theme = getContext('theme');
// ¡theme.color está enlazado reactivamente!`,
      demo2Title: 'Demo de Contexto de Tema',
      demo2Desc: 'El "padre" establece un color de tema. Los paneles "hijos" lo leen reactivamente.',
      parentLabel: 'Padre (setContext)',
      childALabel: 'Hijo A (getContext)',
      childBLabel: 'Hijo B (getContext)',
      pickColor: 'Elige color del tema:',
      topic3Title: 'Clases Reactivas con $state',
      topic3Desc: 'Puedes usar $state dentro de definiciones de clase. Las propiedades con $state se vuelven reactivas — cualquier componente que use una instancia de la clase se actualizará cuando las propiedades cambien.',
      topic3Code: `class GestorTareas {
  tareas = $state<Tarea[]>([]);
  nextId = $state(1);

  agregar(texto: string) {
    this.tareas.push({ id: this.nextId++, texto, hecho: false });
  }

  eliminar(id: number) {
    this.tareas = this.tareas.filter(t => t.id !== id);
  }

  get total() { return this.tareas.length; }
  get hechos() {
    return this.tareas.filter(t => t.hecho).length;
  }
}

// En un archivo .svelte.ts:
export const gestor = new GestorTareas();`,
      demo3Title: 'Clase GestorTareas Reactiva',
      demo3Desc: 'Las tareas son gestionadas por una clase con propiedades $state. Las estadísticas se actualizan automáticamente.',
      addTask: 'Agregar',
      inputPlaceholder: 'Agregar tarea...',
      noTasks: '¡Sin tareas aún!',
      total: 'Total',
      done: 'Hechas',
      active: 'Activas',
      topic4Title: 'Visualización de Propiedad del Estado',
      topic4Desc: 'Entender dónde "vive" el estado vs dónde se "usa" es crítico. El estado debe ser propiedad del ancestro común más cercano que lo necesite, o elevado a nivel de módulo cuando se comparte entre componentes distantes.',
      diagramModule: 'Módulo (.svelte.ts)',
      diagramParent: 'Componente Padre',
      diagramChildA: 'Hijo A',
      diagramChildB: 'Hijo B',
      diagramDeepChild: 'Hijo Profundo',
      diagramLegend1: 'Estado de módulo: compartido en todas partes',
      diagramLegend2: 'Contexto: de padre a hijo profundo',
      diagramLegend3: 'Props: de padre a hijo directo',
      demoTitle: 'Demo Completa: Gestor de Tareas Compartido',
      demoDesc: 'Una sola instancia de GestorTareas se comparte entre una vista de lista y una vista de estadísticas. Agregar o completar tareas en una vista actualiza instantáneamente la otra.',
      listView: 'Vista Lista',
      statsView: 'Vista Estadísticas',
      all: 'Todos',
      mistakesTitle: 'Errores Comunes',
      mistake1Title: 'Usar stores de Svelte 4 en Svelte 5',
      mistake1Wrong: `import { writable } from 'svelte/store';
const count = writable(0);
// $count = 5; // sintaxis antigua`,
      mistake1Correct: `// contador.svelte.ts
let count = $state(0);
export function getCount() { return count; }
export function setCount(n: number) { count = n; }`,
      mistake1Explain: 'Svelte 5 reemplaza stores con runes $state en archivos .svelte.ts. Los stores aún funcionan pero son el enfoque legacy. Usa runes para código nuevo.',
      mistake2Title: 'Llamar getContext fuera de la inicialización del componente',
      mistake2Wrong: `// Dentro de un event handler o $effect
function handleClick() {
  const theme = getContext('theme'); // ¡ERROR!
}`,
      mistake2Correct: `// Al nivel superior del componente
const theme = getContext('theme');

function handleClick() {
  console.log(theme.color); // ¡OK!
}`,
      mistake2Explain: 'getContext y setContext deben llamarse durante la inicialización del componente (nivel superior del bloque <script>), no dentro de event handlers, $effect o callbacks.',
      mistake3Title: 'Problemas SSR con estado de módulo',
      mistake3Wrong: `// estado.svelte.ts
let user = $state(null); // ¡compartido entre TODOS los usuarios en SSR!
export function getUser() { return user; }`,
      mistake3Correct: `// estado.svelte.ts (solo navegador)
let user = $state(null);
export function getUser() {
  if (typeof window === 'undefined') return null;
  return user;
}
// O mejor: usa load functions de SvelteKit para estado del servidor`,
      mistake3Explain: 'El estado a nivel de módulo se comparte entre todas las solicitudes durante SSR. Para datos específicos del usuario, usa load functions de SvelteKit o asegúrate de que el estado solo se cree en el navegador.',
      mistake4Title: 'No entender los límites de reactividad',
      mistake4Wrong: `// En un archivo .ts regular (¡no .svelte.ts!)
let count = 0; // ¡NO es reactivo!
export function incrementar() { count++; }`,
      mistake4Correct: `// En un archivo .svelte.ts
let count = $state(0); // ¡Reactivo!
export function incrementar() { count++; }
export function getCount() { return count; }`,
      mistake4Explain: 'El rune $state solo funciona en archivos .svelte o .svelte.ts. Un archivo .ts regular no tiene procesamiento del compilador de Svelte, así que los runes son tratados como variables normales.',
      challengeTitle: 'Reto: Store de Configuración Compartida',
      challengeDesc: 'Crea un store de configuración compartida que persista la preferencia de tema en localStorage. Alterna entre temas claro, oscuro y automático, y ve cómo la preferencia persiste entre recargas de página.',
      theme: 'Tema',
      fontSize: 'Tamaño de Fuente',
      language: 'Idioma',
      light: 'Claro',
      dark: 'Oscuro',
      auto: 'Auto',
      currentSettings: 'Configuración Actual',
      settingsHint: `// configuracion.svelte.ts
// En una app real, esto sería un archivo separado
let tema = $state<'light' | 'dark' | 'auto'>('auto');
let tamanoFuente = $state(16);

// Persistir en localStorage
$effect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('config', JSON.stringify({ tema, tamanoFuente }));
  }
});

export function getTema() { return tema; }
export function setTema(t: typeof tema) { tema = t; }`
    }
  };

  let t = $derived(text[lang]);
</script>

<LessonLayout lessonNum="06" title={t.title} appFeature={t.appFeature}>
  {#snippet theory()}
    <div class="topics">
      <section class="topic">
        <h3>1. {t.topic1Title}</h3>
        <p>{t.topic1Desc}</p>
        <CodeExample code={t.topic1Code} filename="counter.svelte.ts" />
        <div class="interactive-box">
          <h4>{t.demo1Title}</h4>
          <p class="demo-desc">{t.demo1Desc}</p>
          <div class="shared-panels">
            <div class="panel">
              <div class="panel-header">{t.panelA}</div>
              <div class="panel-count">{sharedCount}</div>
              <div class="panel-actions">
                <button class="btn primary" onclick={() => sharedCount++}>{t.increment}</button>
                <button class="btn secondary" onclick={() => sharedCount--}>{t.decrement}</button>
              </div>
            </div>
            <div class="shared-indicator">
              <div class="shared-arrow">{'<-->'}</div>
              <span class="shared-label">Shared State</span>
            </div>
            <div class="panel">
              <div class="panel-header">{t.panelB}</div>
              <div class="panel-count">{sharedCount}</div>
              <div class="panel-actions">
                <button class="btn primary" onclick={() => sharedCount++}>{t.increment}</button>
                <button class="btn secondary" onclick={() => sharedCount--}>{t.decrement}</button>
              </div>
            </div>
          </div>
          <div class="reset-row">
            <button class="btn secondary" onclick={() => sharedCount = 0}>{t.reset}</button>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>2. {t.topic2Title}</h3>
        <p>{t.topic2Desc}</p>
        <CodeExample code={t.topic2Code} filename="ThemeContext.svelte" />
        <div class="interactive-box">
          <h4>{t.demo2Title}</h4>
          <p class="demo-desc">{t.demo2Desc}</p>
          <div class="context-tree">
            <div class="context-parent" style="border-color: {themeColor}">
              <div class="context-label">{t.parentLabel}</div>
              <div class="color-picker-row">
                <span>{t.pickColor}</span>
                <input type="color" bind:value={themeColor} />
                <code class="color-code">{themeColor}</code>
              </div>
              <div class="context-children">
                <div class="context-child" style="background: {childColor}22; border-color: {childColor}">
                  <div class="context-label">{t.childALabel}</div>
                  <div class="child-swatch" style="background: {childColor}"></div>
                  <code>{childColor}</code>
                </div>
                <div class="context-child" style="background: {childColor}22; border-color: {childColor}">
                  <div class="context-label">{t.childBLabel}</div>
                  <div class="child-swatch" style="background: {childColor}"></div>
                  <code>{childColor}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>3. {t.topic3Title}</h3>
        <p>{t.topic3Desc}</p>
        <CodeExample code={t.topic3Code} filename="TaskManager.svelte.ts" />
        <div class="interactive-box">
          <h4>{t.demo3Title}</h4>
          <p class="demo-desc">{t.demo3Desc}</p>
          <div class="add-task">
            <input type="text" placeholder={t.inputPlaceholder} bind:value={taskInput} onkeydown={(e) => e.key === 'Enter' && addManagerTask()} />
            <button class="btn primary" onclick={addManagerTask}>{t.addTask}</button>
          </div>
          <ul class="task-list">
            {#each manager.tasks as task (task.id)}
              <li class:done={task.done}>
                <span class="task-check" onclick={() => manager.toggle(task.id)}>
                  {task.done ? '✅' : '⬜'}
                </span>
                <span class="task-title">{task.text}</span>
                <button class="delete-btn" onclick={() => manager.remove(task.id)}>✕</button>
              </li>
            {:else}
              <li class="empty">{t.noTasks}</li>
            {/each}
          </ul>
          <div class="class-stats">
            <div class="stat-chip">
              <span class="stat-num">{manager.count}</span>
              <span class="stat-label">{t.total}</span>
            </div>
            <div class="stat-chip">
              <span class="stat-num">{manager.doneCount}</span>
              <span class="stat-label">{t.done}</span>
            </div>
            <div class="stat-chip">
              <span class="stat-num">{manager.activeCount}</span>
              <span class="stat-label">{t.active}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>4. {t.topic4Title}</h3>
        <p>{t.topic4Desc}</p>
        <div class="interactive-box">
          <div class="state-diagram">
            <div class="diagram-level module-level">
              <div class="diagram-node module-node">{t.diagramModule}</div>
              <div class="diagram-legend">{t.diagramLegend1}</div>
            </div>
            <div class="diagram-arrow down-arrow">{'{ }'}</div>
            <div class="diagram-level parent-level">
              <div class="diagram-node parent-node">{t.diagramParent}</div>
              <div class="diagram-legend">{t.diagramLegend2}</div>
            </div>
            <div class="diagram-arrows-row">
              <div class="diagram-arrow down-arrow">props</div>
              <div class="diagram-arrow down-arrow">context</div>
            </div>
            <div class="diagram-level children-level">
              <div class="diagram-node child-node">{t.diagramChildA}</div>
              <div class="diagram-node child-node">{t.diagramChildB}</div>
              <div class="diagram-node deep-node">{t.diagramDeepChild}</div>
            </div>
            <div class="diagram-legend-row">
              <span class="legend-item legend-props">{t.diagramLegend3}</span>
              <span class="legend-item legend-props">{t.diagramLegend3}</span>
              <span class="legend-item legend-context">{t.diagramLegend2}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  {/snippet}

  {#snippet example()}
    <div class="demo">
      <h3>{t.demoTitle}</h3>
      <p>{t.demoDesc}</p>
      <div class="demo-panels">
        <div class="demo-panel list-panel">
          <div class="demo-panel-header">{t.listView}</div>
          <div class="add-task">
            <input type="text" placeholder={t.inputPlaceholder} bind:value={taskInput} onkeydown={(e) => e.key === 'Enter' && addManagerTask()} />
            <button class="btn primary" onclick={addManagerTask}>{t.addTask}</button>
          </div>
          <ul class="task-list">
            {#each manager.tasks as task (task.id)}
              <li class:done={task.done}>
                <span class="task-check" onclick={() => manager.toggle(task.id)}>
                  {task.done ? '✅' : '⬜'}
                </span>
                <span class="task-title">{task.text}</span>
                <button class="delete-btn" onclick={() => manager.remove(task.id)}>✕</button>
              </li>
            {:else}
              <li class="empty">{t.noTasks}</li>
            {/each}
          </ul>
        </div>
        <div class="demo-panel stats-panel">
          <div class="demo-panel-header">{t.statsView}</div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-big">{manager.count}</div>
              <div class="stat-label">{t.total}</div>
            </div>
            <div class="stat-card stat-done">
              <div class="stat-big">{manager.doneCount}</div>
              <div class="stat-label">{t.done}</div>
            </div>
            <div class="stat-card stat-active">
              <div class="stat-big">{manager.activeCount}</div>
              <div class="stat-label">{t.active}</div>
            </div>
          </div>
          {#if manager.count > 0}
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: {(manager.doneCount / manager.count) * 100}%"></div>
            </div>
            <div class="progress-label">
              {Math.round((manager.doneCount / manager.count) * 100)}% {t.done}
            </div>
          {:else}
            <p class="empty-stats">{t.noTasks}</p>
          {/if}
        </div>
      </div>
    </div>
  {/snippet}

  {#snippet challenge()}
    <div class="challenge-content">
      <p>{t.challengeDesc}</p>
      <div class="settings-demo">
        <div class="settings-controls">
          <div class="setting-group">
            <label>{t.theme}</label>
            <div class="theme-buttons">
              <button class="btn theme-btn" class:active={settingsTheme === 'light'} onclick={() => settingsTheme = 'light'}>{t.light}</button>
              <button class="btn theme-btn" class:active={settingsTheme === 'dark'} onclick={() => settingsTheme = 'dark'}>{t.dark}</button>
              <button class="btn theme-btn" class:active={settingsTheme === 'auto'} onclick={() => settingsTheme = 'auto'}>{t.auto}</button>
            </div>
          </div>
          <div class="setting-group">
            <label>{t.fontSize}: {settingsFontSize}px</label>
            <input type="range" min="12" max="24" bind:value={settingsFontSize} />
          </div>
        </div>
        <div class="settings-preview" style="font-size: {settingsFontSize}px" class:preview-dark={settingsTheme === 'dark'} class:preview-light={settingsTheme === 'light'} class:preview-auto={settingsTheme === 'auto'}>
          <div class="preview-content">
            <h4>{t.currentSettings}</h4>
            <p>theme: '{settingsTheme}'</p>
            <p>fontSize: {settingsFontSize}</p>
          </div>
        </div>
      </div>
      <CodeExample code={t.settingsHint} filename="settings.svelte.ts" />
    </div>
  {/snippet}

  <section class="exercise-section">
    <h2>✏️ {lang === 'en' ? 'Exercise' : 'Ejercicio'}: Shared Shopping List</h2>
    <div class="exercise-task">
      <p>{lang === 'en' ? 'Create a shared shopping list using a class with $state:' : 'Crea una lista de compras compartida usando una clase con $state:'}</p>
      <ul>
        <li>{lang === 'en' ? 'Create a ShoppingList class with items as $state' : 'Crea una clase ShoppingList con items como $state'}</li>
        <li>{lang === 'en' ? 'Methods: addItem(name), removeItem(id), toggleItem(id)' : 'Métodos: addItem(name), removeItem(id), toggleItem(id)'}</li>
        <li>{lang === 'en' ? 'Use $derived to count total and completed items' : 'Usa $derived para contar el total y los items completados'}</li>
        <li>{lang === 'en' ? 'Two separate components should share the same list instance' : 'Dos componentes separados deben compartir la misma instancia de la lista'}</li>
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
  .shared-panels {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    align-items: center;
  }
  .panel {
    background: var(--bg);
    border: 2px solid var(--border);
    border-radius: 12px;
    padding: 1.25rem;
    text-align: center;
  }
  .panel-header {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--primary);
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }
  .panel-count {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--text);
    margin-bottom: 0.75rem;
    font-variant-numeric: tabular-nums;
  }
  .panel-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }
  .shared-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .shared-arrow {
    font-size: 1.5rem;
    color: var(--primary);
    font-weight: 700;
  }
  .shared-label {
    font-size: 0.7rem;
    color: var(--text-muted);
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.05em;
  }
  .reset-row {
    margin-top: 1rem;
    text-align: center;
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
  .context-tree {
    display: flex;
    justify-content: center;
  }
  .context-parent {
    background: var(--bg);
    border: 2px solid var(--primary);
    border-radius: 12px;
    padding: 1.25rem;
    width: 100%;
  }
  .context-label {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    color: var(--text-muted);
  }
  .color-picker-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
  .color-picker-row input[type="color"] {
    width: 40px;
    height: 32px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    padding: 0;
  }
  .color-code {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
  }
  .context-children {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  .context-child {
    border: 2px solid;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
  }
  .child-swatch {
    width: 100%;
    height: 24px;
    border-radius: 6px;
    margin: 0.5rem 0;
  }
  .context-child code {
    font-size: 0.8rem;
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
  .class-stats {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border);
  }
  .stat-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 20px;
    font-size: 0.85rem;
  }
  .stat-num {
    font-weight: 700;
    color: var(--primary);
    font-variant-numeric: tabular-nums;
  }
  .stat-label {
    color: var(--text-muted);
  }
  .state-diagram {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
  }
  .diagram-level {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .diagram-node {
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 600;
    text-align: center;
    min-width: 140px;
  }
  .module-node {
    background: var(--primary);
    color: white;
  }
  .parent-node {
    background: #dbeafe;
    color: #1e40af;
    border: 2px solid #93c5fd;
  }
  .child-node {
    background: #dcfce7;
    color: #166534;
    border: 2px solid #86efac;
  }
  .deep-node {
    background: #fef3c7;
    color: #92400e;
    border: 2px solid #fcd34d;
  }
  .diagram-legend {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-style: italic;
  }
  .diagram-arrow {
    color: var(--text-muted);
    font-size: 0.8rem;
    font-weight: 600;
  }
  .children-level {
    gap: 0.75rem;
  }
  .diagram-arrows-row {
    display: flex;
    gap: 6rem;
  }
  .diagram-legend-row {
    display: flex;
    gap: 1rem;
    font-size: 0.7rem;
  }
  .legend-item {
    padding: 3px 10px;
    border-radius: 4px;
    font-weight: 600;
  }
  .legend-props {
    background: #dcfce7;
    color: #166534;
  }
  .legend-context {
    background: #fef3c7;
    color: #92400e;
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
  .demo-panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .demo-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.25rem;
  }
  .demo-panel-header {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--primary);
    text-transform: uppercase;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  .stat-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
  }
  .stat-card.stat-done {
    border-color: var(--success);
    background: #ecfdf5;
  }
  .stat-card.stat-active {
    border-color: var(--primary);
    background: #fff7ed;
  }
  .stat-big {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }
  .stat-card .stat-label {
    font-size: 0.8rem;
    color: var(--text-muted);
    text-transform: uppercase;
    font-weight: 600;
    margin-top: 0.25rem;
  }
  .progress-bar-container {
    background: var(--border);
    border-radius: 6px;
    height: 10px;
    overflow: hidden;
  }
  .progress-bar {
    background: var(--success);
    height: 100%;
    border-radius: 6px;
    transition: width 0.3s ease;
  }
  .progress-label {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 0.5rem;
    text-align: center;
  }
  .empty-stats {
    text-align: center;
    color: var(--text-muted);
    font-style: italic;
    font-size: 0.9rem;
    margin-top: 1rem;
  }
  .challenge-content p {
    line-height: 1.7;
    margin-bottom: 1rem;
  }
  .settings-demo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .settings-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .setting-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .setting-group label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
  }
  .theme-buttons {
    display: flex;
    gap: 0.5rem;
  }
  .btn.theme-btn {
    background: var(--bg);
    color: var(--text-muted);
    border: 1px solid var(--border);
    padding: 6px 14px;
    font-size: 0.8rem;
  }
  .btn.theme-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  input[type="range"] {
    width: 100%;
    accent-color: var(--primary);
  }
  .settings-preview {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.25rem;
    transition: all 0.3s;
  }
  .settings-preview.preview-dark {
    background: #1e1e2e;
    color: #cdd6f4;
    border-color: #45475a;
  }
  .settings-preview.preview-light {
    background: #ffffff;
    color: #1e1e2e;
    border-color: #e5e7eb;
  }
  .settings-preview.preview-auto {
    background: var(--bg);
    color: var(--text);
  }
  .preview-content h4 {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }
  .preview-content p {
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.85rem;
    margin: 0.25rem 0;
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
    .shared-panels {
      grid-template-columns: 1fr;
    }
    .shared-indicator {
      transform: rotate(90deg);
    }
    .context-children {
      grid-template-columns: 1fr;
    }
    .demo-panels {
      grid-template-columns: 1fr;
    }
    .code-compare {
      grid-template-columns: 1fr;
    }
    .settings-demo {
      grid-template-columns: 1fr;
    }
    .diagram-arrows-row {
      gap: 2rem;
    }
  }
</style>
