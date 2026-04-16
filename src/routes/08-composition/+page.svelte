<script lang="ts">
  import type { Snippet } from 'svelte';
  import LessonLayout from '$lib/components/LessonLayout.svelte';
  import CodeExample from '$lib/components/CodeExample.svelte';
  import { getLang } from '$lib/i18n/language.svelte.js';

  let lang = $derived(getLang());

  let showSolution = $state(false);
  const solutionCode = `\x3C!-- Card.svelte -->
\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';

  let { title, body, footer }: {
    title: string;
    body: Snippet;
    footer?: Snippet;
  } = $props();
\x3C/script>

\x3Cdiv class="card">
  \x3Cdiv class="card-header">
    \x3Ch3>{title}\x3C/h3>
  \x3C/div>
  \x3Cdiv class="card-body">
    {@render body()}
  \x3C/div>
  {#if footer}
    \x3Cdiv class="card-footer">
      {@render footer()}
    \x3C/div>
  {/if}
\x3C/div>

\x3C!-- Usage: -->
\x3C!-- \x3CCard title="My Card" body={snippet body}>content\x3C/Card> -->`;

  let showCardHeader = $state(true);
  let showCardFooter = $state(true);

  interface DemoTask {
    id: number;
    text: string;
    done: boolean;
    priority: 'low' | 'medium' | 'high';
  }

  let listTasks = $state<DemoTask[]>([
    { id: 1, text: 'Design UI mockup', done: false, priority: 'high' },
    { id: 2, text: 'Set up project', done: true, priority: 'medium' },
    { id: 3, text: 'Write components', done: false, priority: 'high' },
    { id: 4, text: 'Add tests', done: false, priority: 'low' }
  ]);

  let callbackTasks = $state<DemoTask[]>([
    { id: 1, text: 'Design UI', done: false, priority: 'high' },
    { id: 2, text: 'Set up project', done: true, priority: 'medium' },
    { id: 3, text: 'Write tests', done: false, priority: 'low' }
  ]);
  let confirmTarget = $state<number | null>(null);
  let lastAction = $state('');

  let builderShowHeader = $state(true);
  let builderShowBody = $state(true);
  let builderShowFooter = $state(true);

  let demoTasks = $state<DemoTask[]>([
    { id: 1, text: 'Learn snippets', done: true, priority: 'high' },
    { id: 2, text: 'Build reusable card', done: false, priority: 'medium' },
    { id: 3, text: 'Create list component', done: false, priority: 'high' },
    { id: 4, text: 'Add callback props', done: false, priority: 'low' }
  ]);
  let demoInput = $state('');
  let demoNextId = $state(5);

  let modalOpen = $state(false);
  let modalConfirmed = $state(false);

  function toggleListTask(id: number) {
    const t = listTasks.find((t) => t.id === id);
    if (t) t.done = !t.done;
  }

  function confirmDelete(id: number) {
    confirmTarget = id;
  }

  function executeDelete() {
    if (confirmTarget !== null) {
      const task = callbackTasks.find((t) => t.id === confirmTarget);
      if (task) lastAction = `Deleted: ${task.text}`;
      callbackTasks = callbackTasks.filter((t) => t.id !== confirmTarget);
      confirmTarget = null;
    }
  }

  function cancelDelete() {
    confirmTarget = null;
  }

  function addDemoTask() {
    const text = demoInput.trim();
    if (!text) return;
    demoTasks.push({ id: demoNextId++, text, done: false, priority: 'medium' });
    demoInput = '';
  }

  function toggleDemoTask(id: number) {
    const t = demoTasks.find((t) => t.id === id);
    if (t) t.done = !t.done;
  }

  function removeDemoTask(id: number) {
    demoTasks = demoTasks.filter((t) => t.id !== id);
  }

  function priorityColor(p: string): string {
    if (p === 'high') return 'var(--error)';
    if (p === 'medium') return 'var(--warning)';
    return 'var(--success)';
  }

  const text = {
    en: {
      title: 'Component Patterns',
      appFeature: 'Reusable Components',
      topic1Title: 'Snippets: {#snippet} and {@render}',
      topic1Desc: 'Svelte 5 replaces slots with snippets. Define reusable template fragments with {#snippet name()} and render them with {@render name()}. Snippets can be passed to child components, making composition explicit and type-safe.',
      topic1Code: `\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';

  let { header, children, footer }: {
    header?: Snippet;
    children: Snippet;
    footer?: Snippet;
  } = $props();
\x3C/script>

<div class="card">
  {#if header}
    <div class="card-header">
      {@render header()}
    </div>
  {/if}
  <div class="card-body">
    {@render children()}
  </div>
  {#if footer}
    <div class="card-footer">
      {@render footer()}
    </div>
  {/if}
</div>`,
      topic2Title: 'Passing Snippets as Props',
      topic2Desc: 'Snippets are first-class values in Svelte 5. Import the Snippet type from \'svelte\' and use it to type props. This gives you compile-time guarantees that the passed value is renderable. Optional snippets let you build flexible APIs.',
      topic2Code: `\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';

  let { items, item }: {
    items: { id: number; name: string }[];
    item: Snippet<[{ id: number; name: string }]>;
  } = $props();
\x3C/script>

<ul>
  {#each items as entry (entry.id)}
    <li>
      {@render item(entry)}
    </li>
  {/each}
</ul>`,
      topic3Title: 'Component Composition Patterns',
      topic3Desc: 'Composition lets you build complex UIs from simple, focused components. Common patterns include: wrapper components (Card, Panel), layout components (Sidebar, Grid), and collection components (List, DataTable). Snippets make these patterns clean and explicit.',
      topic3Code: `\x3C!-- Wrapper pattern: Card accepts snippets -->
\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';
  let { children, title }: {
    children: Snippet;
    title?: Snippet;
  } = $props();
\x3C/script>

<div class="panel">
  {#if title}
    <div class="panel-title">{@render title()}</div>
  {/if}
  <div class="panel-content">
    {@render children()}
  </div>
</div>`,
      topic4Title: 'Callback Props instead of Events',
      topic4Desc: 'In Svelte 5, prefer passing callback functions as props over using createEventDispatcher. Callback props are simpler, more type-safe, and easier to test. Just pass a function like onclick, onconfirm, or ondelete as a prop.',
      topic4Code: `\x3C!-- ConfirmButton.svelte -->
\x3Cscript lang="ts">
  let { onclick, label, color = 'primary' }: {
    onclick: () => void;
    label: string;
    color?: string;
  } = $props();

  let showConfirm = $state(false);
\x3C/script>

{#if showConfirm}
  <button class="confirm" onclick={() => { onclick(); showConfirm = false; }}>
    Confirm?
  </button>
  <button onclick={() => showConfirm = false}>Cancel</button>
{:else}
  <button class={color} onclick={() => showConfirm = true}>
    {label}
  </button>
{/if}`,
      topic5Title: 'Generic-like Patterns with TypeScript',
      topic5Desc: 'While Svelte doesn\'t have built-in generics for components yet, you can use TypeScript generics in your prop types and callback signatures to create flexible, reusable APIs. Type your snippets and callbacks precisely for maximum safety.',
      topic5Code: `\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';

  interface ListProps<T> {
    items: T[];
    renderItem: Snippet<[T]>;
    keyFn?: (item: T) => string | number;
  }

  let { items, renderItem }: ListProps<{ id: number; name: string; done: boolean }> = $props();
\x3C/script>

{#each items as item (item.id)}
  <div class="list-item">
    {@render renderItem(item)}
  </div>
{/each}`,
      demo1Title: 'Card Component with Snippets',
      demo1Desc: 'Toggle which snippets are passed to the Card component. The Card adapts its layout based on which snippets it receives.',
      demo1ToggleHeader: 'Header Snippet',
      demo1ToggleFooter: 'Footer Snippet',
      demo2Title: 'List with Custom Item Rendering',
      demo2Desc: 'Each task renders with a custom item snippet showing priority badges and status toggles.',
      demo3Title: 'Callback Props Demo',
      demo3Desc: 'Click "Delete" to trigger a callback prop pattern. The button asks for confirmation before deleting.',
      demo3Confirm: 'Confirm Delete?',
      demo3Cancel: 'Cancel',
      demo3Delete: 'Delete',
      demo3LastAction: 'Last action',
      demo3None: 'None yet',
      demo4Title: 'Component Builder',
      demo4Desc: 'Toggle which snippets are passed and see how the Panel component adapts.',
      demo4Header: 'Header',
      demo4Body: 'Body',
      demo4Footer: 'Footer',
      demoTitle: 'Full Demo: Task Manager with Component Patterns',
      demoDesc: 'A task manager built entirely with snippet-based components: TaskCard, TaskList, and ConfirmDelete — all using composition patterns.',
      demoInputPlaceholder: 'Add a task...',
      add: 'Add',
      mistakesTitle: 'Common Mistakes',
      mistake1Title: 'Using <slot> in Svelte 5',
      mistake1Wrong: `\x3C!-- Outdated Svelte 4 pattern -->
\x3Cscript lang="ts">
  // Don't use slots in Svelte 5!
\x3C/script>

<div class="card">
  <slot name="header" />
  <slot />
  <slot name="footer" />
</div>`,
      mistake1Correct: `\x3C!-- Svelte 5 snippet pattern -->
\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';
  let { header, children, footer }: {
    header?: Snippet;
    children: Snippet;
    footer?: Snippet;
  } = $props();
\x3C/script>

<div class="card">
  {#if header}<div class="hdr">{@render header()}</div>{/if}
  <div class="body">{@render children()}</div>
  {#if footer}<div class="ftr">{@render footer()}</div>{/if}
</div>`,
      mistake1Explain: 'Slots are deprecated in Svelte 5. Use {#snippet} and {@render} instead. The children snippet replaces the default slot, and named snippets replace named slots.',
      mistake2Title: 'Forgetting the Snippet type import',
      mistake2Wrong: `\x3Cscript lang="ts">
  // Missing Snippet type import!
  let { header, children }: {
    header?: any;          // loses type safety
    children: any;         // no compile checks
  } = $props();
\x3C/script>

{#if header}{@render header()}{/if}
{@render children()}`,
      mistake2Correct: `\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';

  let { header, children }: {
    header?: Snippet;
    children: Snippet;
  } = $props();
\x3C/script>

{#if header}{@render header()}{/if}
{@render children()}`,
      mistake2Explain: 'Always import and use the Snippet type from \'svelte\'. Using any loses compile-time safety and IDE autocompletion for your snippet props.',
      mistake3Title: 'Using createEventDispatcher instead of callback props',
      mistake3Wrong: `\x3Cscript lang="ts">
  import { createEventDispatcher } from 'svelte';
  // Deprecated in Svelte 5!
  const dispatch = createEventDispatcher();
\x3C/script>

<button onclick={() => dispatch('delete', id)}>
  Delete
</button>`,
      mistake3Correct: `\x3Cscript lang="ts">
  let { ondelete, id }: {
    ondelete: (id: number) => void;
    id: number;
  } = $props();
\x3C/script>

<button onclick={() => ondelete(id)}>
  Delete
</button>`,
      mistake3Explain: 'createEventDispatcher is deprecated in Svelte 5. Pass callback functions as props instead — they are simpler, type-safe, and more explicit.',
      mistake4Title: 'Over-fragmenting into tiny components',
      mistake4Wrong: `\x3C!-- Too many tiny components -->
\x3CText text="Hello" />
\x3CSpacer size={16} />
\x3CDivider />
\x3CSpacer size={8} />
\x3CText text="World" />
<!-- Each "component" is just HTML -->`,
      mistake4Correct: `\x3C!-- Keep it simple with snippets -->
\x3CPanel>
  {#snippet title()}
    <h2>Greeting</h2>
  {/snippet}
  <p>Hello</p>
  <hr />
  <p>World</p>
\x3C/Panel>

<!-- Extract components only when they have
     real logic or reusable patterns -->`,
      mistake4Explain: 'Don\'t create a component for every HTML element. Extract components when there is real reusable logic, state, or composition patterns. Use snippets for template reuse.',
      challengeTitle: 'Challenge: Reusable Modal Component',
      challengeDesc: 'Create a reusable Modal using snippets for its header, body, and footer. The modal should accept callback props for confirm and cancel actions.',
      challengeOpen: 'Open Modal',
      challengeClose: 'Cancel',
      challengeConfirm: 'Confirm',
      challengeConfirmed: 'Action confirmed!',
      challengeReset: 'Reset',
      challengeHint: `\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';

  let {
    open,
    title,
    body,
    footer,
    onconfirm,
    oncancel
  }: {
    open: boolean;
    title?: Snippet;
    body: Snippet;
    footer?: Snippet;
    onconfirm: () => void;
    oncancel: () => void;
  } = $props();
\x3C/script>

{#if open}
  <div class="overlay" onclick={oncancel}>
    <div class="modal" onclick|stopPropagation>
      {#if title}
        <div class="modal-header">
          {@render title()}
        </div>
      {/if}
      <div class="modal-body">
        {@render body()}
      </div>
      {#if footer}
        <div class="modal-footer">
          {@render footer()}
        </div>
      {:else}
        <div class="modal-footer">
          <button onclick={oncancel}>Cancel</button>
          <button onclick={onconfirm}>Confirm</button>
        </div>
      {/if}
    </div>
  </div>
{/if}`
    },
    es: {
      title: 'Patrones de Componentes',
      appFeature: 'Componentes Reutilizables',
      topic1Title: 'Snippets: {#snippet} y {@render}',
      topic1Desc: 'Svelte 5 reemplaza los slots con snippets. Define fragmentos de plantilla reutilizables con {#snippet nombre()} y renderízalos con {@render nombre()}. Los snippets se pueden pasar a componentes hijos, haciendo la composición explícita y con seguridad de tipos.',
      topic1Code: `\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';

  let { header, children, footer }: {
    header?: Snippet;
    children: Snippet;
    footer?: Snippet;
  } = $props();
\x3C/script>

<div class="card">
  {#if header}
    <div class="card-header">
      {@render header()}
    </div>
  {/if}
  <div class="card-body">
    {@render children()}
  </div>
  {#if footer}
    <div class="card-footer">
      {@render footer()}
    </div>
  {/if}
</div>`,
      topic2Title: 'Pasar Snippets como Props',
      topic2Desc: 'Los snippets son valores de primera clase en Svelte 5. Importa el tipo Snippet desde \'svelte\' y úsalo para tipar las props. Esto te da garantías en tiempo de compilación de que el valor pasado es renderizable. Los snippets opcionales te permiten construir APIs flexibles.',
      topic2Code: `\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';

  let { items, item }: {
    items: { id: number; name: string }[];
    item: Snippet<[{ id: number; name: string }]>;
  } = $props();
\x3C/script>

<ul>
  {#each items as entry (entry.id)}
    <li>
      {@render item(entry)}
    </li>
  {/each}
</ul>`,
      topic3Title: 'Patrones de Composición de Componentes',
      topic3Desc: 'La composición te permite construir UIs complejas a partir de componentes simples y enfocados. Patrones comunes incluyen: componentes envoltorio (Card, Panel), componentes de layout (Sidebar, Grid), y componentes de colección (List, DataTable). Los snippets hacen estos patrones limpios y explícitos.',
      topic3Code: `\x3C!-- Patrón envoltorio: Card acepta snippets -->
\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';
  let { children, title }: {
    children: Snippet;
    title?: Snippet;
  } = $props();
\x3C/script>

<div class="panel">
  {#if title}
    <div class="panel-title">{@render title()}</div>
  {/if}
  <div class="panel-content">
    {@render children()}
  </div>
</div>`,
      topic4Title: 'Callback Props en vez de Eventos',
      topic4Desc: 'En Svelte 5, prefiere pasar funciones callback como props en lugar de usar createEventDispatcher. Las callbacks son más simples, más seguras con tipos, y más fáciles de probar. Solo pasa una función como onclick, onconfirm, o ondelete como prop.',
      topic4Code: `\x3C!-- ConfirmButton.svelte -->
\x3Cscript lang="ts">
  let { onclick, label, color = 'primary' }: {
    onclick: () => void;
    label: string;
    color?: string;
  } = $props();

  let showConfirm = $state(false);
\x3C/script>

{#if showConfirm}
  <button class="confirm" onclick={() => { onclick(); showConfirm = false; }}>
    ¿Confirmar?
  </button>
  <button onclick={() => showConfirm = false}>Cancelar</button>
{:else}
  <button class={color} onclick={() => showConfirm = true}>
    {label}
  </button>
{/if}`,
      topic5Title: 'Patrones Genéricos con TypeScript',
      topic5Desc: 'Aunque Svelte aún no tiene genéricos integrados para componentes, puedes usar genéricos de TypeScript en tus tipos de props y firmas de callbacks para crear APIs flexibles y reutilizables. Tipa tus snippets y callbacks con precisión para máxima seguridad.',
      topic5Code: `\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';

  interface ListProps<T> {
    items: T[];
    renderItem: Snippet<[T]>;
    keyFn?: (item: T) => string | number;
  }

  let { items, renderItem }: ListProps<{ id: number; name: string; done: boolean }> = $props();
\x3C/script>

{#each items as item (item.id)}
  <div class="list-item">
    {@render renderItem(item)}
  </div>
{/each}`,
      demo1Title: 'Componente Card con Snippets',
      demo1Desc: 'Alterna qué snippets se pasan al componente Card. El Card adapta su layout según qué snippets recibe.',
      demo1ToggleHeader: 'Snippet Header',
      demo1ToggleFooter: 'Snippet Footer',
      demo2Title: 'Lista con Renderizado Personalizado',
      demo2Desc: 'Cada tarea se renderiza con un snippet personalizado que muestra insignias de prioridad y toggles de estado.',
      demo3Title: 'Demo de Callback Props',
      demo3Desc: 'Haz clic en "Eliminar" para activar el patrón de callback prop. El botón pide confirmación antes de eliminar.',
      demo3Confirm: '¿Confirmar?',
      demo3Cancel: 'Cancelar',
      demo3Delete: 'Eliminar',
      demo3LastAction: 'Última acción',
      demo3None: 'Ninguna aún',
      demo4Title: 'Constructor de Componentes',
      demo4Desc: 'Alterna qué snippets se pasan y ve cómo se adapta el componente Panel.',
      demo4Header: 'Encabezado',
      demo4Body: 'Cuerpo',
      demo4Footer: 'Pie',
      demoTitle: 'Demo Completa: Gestor de Tareas con Patrones de Componentes',
      demoDesc: 'Un gestor de tareas construido con componentes basados en snippets: TaskCard, TaskList y ConfirmDelete — todos usando patrones de composición.',
      demoInputPlaceholder: 'Agregar tarea...',
      add: 'Agregar',
      mistakesTitle: 'Errores Comunes',
      mistake1Title: 'Usar <slot> en Svelte 5',
      mistake1Wrong: `\x3C!-- Patrón obsoleto de Svelte 4 -->
\x3Cscript lang="ts">
  // ¡No uses slots en Svelte 5!
\x3C/script>

<div class="card">
  <slot name="header" />
  <slot />
  <slot name="footer" />
</div>`,
      mistake1Correct: `\x3C!-- Patrón de snippets en Svelte 5 -->
\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';
  let { header, children, footer }: {
    header?: Snippet;
    children: Snippet;
    footer?: Snippet;
  } = $props();
\x3C/script>

<div class="card">
  {#if header}<div class="hdr">{@render header()}</div>{/if}
  <div class="body">{@render children()}</div>
  {#if footer}<div class="ftr">{@render footer()}</div>{/if}
</div>`,
      mistake1Explain: 'Los slots están deprecados en Svelte 5. Usa {#snippet} y {@render} en su lugar. El snippet children reemplaza al slot por defecto, y los snippets nombrados reemplazan a los slots nombrados.',
      mistake2Title: 'Olvidar importar el tipo Snippet',
      mistake2Wrong: `\x3Cscript lang="ts">
  // ¡Falta importar el tipo Snippet!
  let { header, children }: {
    header?: any;          // pierde seguridad de tipos
    children: any;         // sin verificaciones en compilación
  } = $props();
\x3C/script>

{#if header}{@render header()}{/if}
{@render children()}`,
      mistake2Correct: `\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';

  let { header, children }: {
    header?: Snippet;
    children: Snippet;
  } = $props();
\x3C/script>

{#if header}{@render header()}{/if}
{@render children()}`,
      mistake2Explain: 'Siempre importa y usa el tipo Snippet desde \'svelte\'. Usar any pierde la seguridad en tiempo de compilación y el autocompletado del IDE para tus props de snippet.',
      mistake3Title: 'Usar createEventDispatcher en vez de callback props',
      mistake3Wrong: `\x3Cscript lang="ts">
  import { createEventDispatcher } from 'svelte';
  // ¡Deprecado en Svelte 5!
  const dispatch = createEventDispatcher();
\x3C/script>

<button onclick={() => dispatch('delete', id)}>
  Eliminar
</button>`,
      mistake3Correct: `\x3Cscript lang="ts">
  let { ondelete, id }: {
    ondelete: (id: number) => void;
    id: number;
  } = $props();
\x3C/script>

<button onclick={() => ondelete(id)}>
  Eliminar
</button>`,
      mistake3Explain: 'createEventDispatcher está deprecado en Svelte 5. Pasa funciones callback como props — son más simples, seguras con tipos, y más explícitas.',
      mistake4Title: 'Sobre-fragmentar en componentes diminutos',
      mistake4Wrong: `\x3C!-- Demasiados componentes diminutos -->
\x3CText text="Hola" />
\x3CSpacer size={16} />
\x3CDivider />
\x3CSpacer size={8} />
\x3CText text="Mundo" />
<!-- Cada "componente" es solo HTML -->`,
      mistake4Correct: `\x3C!-- Mantén simple con snippets -->
\x3CPanel>
  {#snippet title()}
    <h2>Saludo</h2>
  {/snippet}
  <p>Hola</p>
  <hr />
  <p>Mundo</p>
\x3C/Panel>

<!-- Extrae componentes solo cuando tengan
     lógica real o patrones reutilizables -->`,
      mistake4Explain: 'No crees un componente para cada elemento HTML. Extrae componentes cuando haya lógica reutilizable real, estado, o patrones de composición. Usa snippets para reutilización de plantillas.',
      challengeTitle: 'Reto: Componente Modal Reutilizable',
      challengeDesc: 'Crea un Modal reutilizable usando snippets para su encabezado, cuerpo y pie. El modal debe aceptar callback props para las acciones de confirmar y cancelar.',
      challengeOpen: 'Abrir Modal',
      challengeClose: 'Cancelar',
      challengeConfirm: 'Confirmar',
      challengeConfirmed: '¡Acción confirmada!',
      challengeReset: 'Reiniciar',
      challengeHint: `\x3Cscript lang="ts">
  import type { Snippet } from 'svelte';

  let {
    open,
    title,
    body,
    footer,
    onconfirm,
    oncancel
  }: {
    open: boolean;
    title?: Snippet;
    body: Snippet;
    footer?: Snippet;
    onconfirm: () => void;
    oncancel: () => void;
  } = $props();
\x3C/script>

{#if open}
  <div class="overlay" onclick={oncancel}>
    <div class="modal" onclick|stopPropagation>
      {#if title}
        <div class="modal-header">
          {@render title()}
        </div>
      {/if}
      <div class="modal-body">
        {@render body()}
      </div>
      {#if footer}
        <div class="modal-footer">
          {@render footer()}
        </div>
      {:else}
        <div class="modal-footer">
          <button onclick={oncancel}>Cancelar</button>
          <button onclick={onconfirm}>Confirmar</button>
        </div>
      {/if}
    </div>
  </div>
{/if}`
    }
  };

  let t = $derived(text[lang]);
</script>

<LessonLayout lessonNum="08" title={t.title} appFeature={t.appFeature}>
  {#snippet theory()}
    <div class="topics">
      <section class="topic">
        <h3>1. {t.topic1Title}</h3>
        <p>{t.topic1Desc}</p>
        <CodeExample code={t.topic1Code} filename="Card.svelte" />
        <div class="interactive-box">
          <h4>{t.demo1Title}</h4>
          <p class="demo-desc">{t.demo1Desc}</p>
          <div class="toggle-row">
            <label class="toggle-label">
              <input type="checkbox" bind:checked={showCardHeader} />
              {t.demo1ToggleHeader}
            </label>
            <label class="toggle-label">
              <input type="checkbox" bind:checked={showCardFooter} />
              {t.demo1ToggleFooter}
            </label>
          </div>
          <div class="card-demo">
            <div class="demo-card">
              {#if showCardHeader}
                <div class="demo-card-header">
                  <h4>{lang === 'en' ? 'My Card Title' : 'Título de Mi Card'}</h4>
                </div>
              {/if}
              <div class="demo-card-body">
                <p>{lang === 'en' ? 'This is the card body rendered via' : 'Este es el cuerpo de la card renderizado vía'} <code>{'{@render children()}'}</code></p>
              </div>
              {#if showCardFooter}
                <div class="demo-card-footer">
                  <span>{lang === 'en' ? 'Footer content here' : 'Contenido del pie aquí'}</span>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>2. {t.topic2Title}</h3>
        <p>{t.topic2Desc}</p>
        <CodeExample code={t.topic2Code} filename="ItemList.svelte" />
      </section>

      <section class="topic">
        <h3>3. {t.topic3Title}</h3>
        <p>{t.topic3Desc}</p>
        <CodeExample code={t.topic3Code} filename="Panel.svelte" />
        <div class="interactive-box">
          <h4>{t.demo2Title}</h4>
          <p class="demo-desc">{t.demo2Desc}</p>
          <ul class="custom-list">
            {#each listTasks as task (task.id)}
              <li class:done={task.done}>
                <span class="priority-badge" style:background={priorityColor(task.priority)}>
                  {task.priority}
                </span>
                <span class="task-text" onclick={() => toggleListTask(task.id)}>
                  {task.done ? '✅' : '⬜'} {task.text}
                </span>
              </li>
            {/each}
          </ul>
        </div>
      </section>

      <section class="topic">
        <h3>4. {t.topic4Title}</h3>
        <p>{t.topic4Desc}</p>
        <CodeExample code={t.topic4Code} filename="ConfirmButton.svelte" />
      </section>

      <section class="topic">
        <h3>5. {t.topic5Title}</h3>
        <p>{t.topic5Desc}</p>
        <CodeExample code={t.topic5Code} filename="GenericList.svelte" />
      </section>
    </div>
  {/snippet}

  {#snippet example()}
    <div class="demo">
      <h3>{t.demo3Title}</h3>
      <p>{t.demo3Desc}</p>

      {#if lastAction}
        <div class="action-toast">{lastAction}</div>
      {/if}

      <ul class="callback-list">
        {#each callbackTasks as task (task.id)}
          <li class:done={task.done}>
            <span class="task-text">{task.done ? '✅' : '⬜'} {task.text}</span>
            {#if confirmTarget === task.id}
              <div class="confirm-row">
                <span class="confirm-label">{t.demo3Confirm}</span>
                <button class="btn confirm-btn" onclick={executeDelete}>{t.demo3Confirm}</button>
                <button class="btn cancel-btn" onclick={cancelDelete}>{t.demo3Cancel}</button>
              </div>
            {:else}
              <button class="btn delete-btn" onclick={() => confirmDelete(task.id)}>{t.demo3Delete}</button>
            {/if}
          </li>
        {/each}
      </ul>

      <div class="divider"></div>

      <h3>{t.demo4Title}</h3>
      <p>{t.demo4Desc}</p>
      <div class="toggle-row">
        <label class="toggle-label">
          <input type="checkbox" bind:checked={builderShowHeader} />
          {t.demo4Header}
        </label>
        <label class="toggle-label">
          <input type="checkbox" bind:checked={builderShowBody} />
          {t.demo4Body}
        </label>
        <label class="toggle-label">
          <input type="checkbox" bind:checked={builderShowFooter} />
          {t.demo4Footer}
        </label>
      </div>
      <div class="builder-panel">
        {#if builderShowHeader}
          <div class="builder-header">
            <h4>{lang === 'en' ? 'Panel Title' : 'Título del Panel'}</h4>
          </div>
        {/if}
        {#if builderShowBody}
          <div class="builder-body">
            <p>{lang === 'en' ? 'Main content goes here. This is the children snippet.' : 'El contenido principal va aquí. Este es el snippet children.'}</p>
          </div>
        {/if}
        {#if builderShowFooter}
          <div class="builder-footer">
            <span>{lang === 'en' ? 'Footer with actions' : 'Pie con acciones'}</span>
          </div>
        {/if}
        {#if !builderShowHeader && !builderShowBody && !builderShowFooter}
          <p class="empty-builder">{lang === 'en' ? 'No snippets passed — enable at least one above!' : '¡No se pasaron snippets — habilita al menos uno arriba!'}</p>
        {/if}
      </div>
    </div>
  {/snippet}

  {#snippet challenge()}
    <div class="challenge-content">
      <p>{t.challengeDesc}</p>
      <div class="challenge-demo">
        <button class="btn primary" onclick={() => { modalOpen = true; modalConfirmed = false; }}>
          {t.challengeOpen}
        </button>
        {#if modalConfirmed}
          <div class="confirmed-msg">{t.challengeConfirmed}</div>
        {/if}

        {#if modalOpen}
          <div class="modal-overlay" onclick={() => modalOpen = false}>
            <div class="modal-box" onclick={(e) => e.stopPropagation()}>
              <div class="modal-header">
                <h4>{t.challengeTitle}</h4>
                <button class="modal-close" onclick={() => modalOpen = false}>✕</button>
              </div>
              <div class="modal-body">
                <p>{lang === 'en' ? 'This is the modal body, rendered via a body snippet. You can put any content here!' : 'Este es el cuerpo del modal, renderizado vía un snippet body. ¡Puedes poner cualquier contenido aquí!'}</p>
              </div>
              <div class="modal-footer">
                <button class="btn secondary" onclick={() => modalOpen = false}>{t.challengeClose}</button>
                <button class="btn primary" onclick={() => { modalOpen = false; modalConfirmed = true; }}>{t.challengeConfirm}</button>
              </div>
            </div>
          </div>
        {/if}

        {#if modalConfirmed}
          <button class="btn secondary" onclick={() => modalConfirmed = false}>{t.challengeReset}</button>
        {/if}
      </div>
      <CodeExample code={t.challengeHint} filename="Modal.svelte" />
    </div>
  {/snippet}

  <section class="full-demo">
    <h2>{t.demoTitle}</h2>
    <p>{t.demoDesc}</p>
    <div class="task-manager">
      <div class="tm-add">
        <input
          type="text"
          placeholder={t.demoInputPlaceholder}
          bind:value={demoInput}
          onkeydown={(e) => e.key === 'Enter' && addDemoTask()}
        />
        <button class="btn primary" onclick={addDemoTask}>{t.add}</button>
      </div>
      <ul class="tm-list">
        {#each demoTasks as task (task.id)}
          <li class:done={task.done}>
            <div class="tm-task-left">
              <span class="priority-dot" style:background={priorityColor(task.priority)}></span>
              <span class="task-check" onclick={() => toggleDemoTask(task.id)}>
                {task.done ? '✅' : '⬜'}
              </span>
              <span class="task-title">{task.text}</span>
            </div>
            <button class="delete-btn" onclick={() => removeDemoTask(task.id)}>✕</button>
          </li>
        {:else}
          <li class="empty">{lang === 'en' ? 'No tasks yet!' : '¡Sin tareas aún!'}</li>
        {/each}
      </ul>
      <div class="tm-stats">
        <span>{lang === 'en' ? 'Total' : 'Total'}: {demoTasks.length}</span>
        <span class="success">{lang === 'en' ? 'Done' : 'Hechas'}: {demoTasks.filter((task) => task.done).length}</span>
      </div>
    </div>
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

  <section class="exercise-section">
    <h2>✏️ {lang === 'en' ? 'Exercise' : 'Ejercicio'}: Reusable Card Component</h2>
    <div class="exercise-task">
      <p>{lang === 'en' ? 'Create a reusable Card component using snippets:' : 'Crea un componente Card reutilizable usando snippets:'}</p>
      <ul>
        <li>{lang === 'en' ? 'Create a Card component that accepts a `title` prop and a `body` snippet' : 'Crea un componente Card que acepte una prop `title` y un snippet `body`'}</li>
        <li>{lang === 'en' ? 'Use `{@render}` to render the snippet content' : 'Usa `{@render}` para renderizar el contenido del snippet'}</li>
        <li>{lang === 'en' ? 'The card should have a header with the title and a body section' : 'El card debe tener un encabezado con el título y una sección de cuerpo'}</li>
        <li>{lang === 'en' ? 'Support an optional `footer` snippet' : 'Soporta un snippet `footer` opcional'}</li>
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
  .toggle-row {
    display: flex;
    gap: 1.25rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  .toggle-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text);
    cursor: pointer;
  }
  .toggle-label input[type="checkbox"] {
    accent-color: var(--primary);
    width: 16px;
    height: 16px;
  }
  .card-demo {
    display: flex;
    justify-content: center;
  }
  .demo-card {
    width: 100%;
    max-width: 400px;
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  .demo-card-header {
    background: var(--primary);
    color: white;
    padding: 12px 16px;
  }
  .demo-card-header h4 {
    margin: 0;
    font-size: 1rem;
  }
  .demo-card-body {
    padding: 16px;
    background: var(--surface);
  }
  .demo-card-body p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text);
  }
  .demo-card-body code {
    background: var(--code-bg);
    color: var(--primary);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.82rem;
  }
  .demo-card-footer {
    padding: 10px 16px;
    background: var(--bg);
    border-top: 1px solid var(--border);
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  .custom-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .custom-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    transition: background 0.15s, border-color 0.15s;
  }
  .custom-list li.done .task-text {
    text-decoration: line-through;
    opacity: 0.5;
  }
  .priority-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.72rem;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    min-width: 56px;
    text-align: center;
  }
  .task-text {
    flex: 1;
    font-size: 0.92rem;
    cursor: pointer;
    user-select: none;
  }
  .demo {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .demo h3 {
    font-size: 1.15rem;
    color: var(--text);
    margin-bottom: 0.25rem;
  }
  .demo p {
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 0.25rem;
  }
  .action-toast {
    background: var(--error);
    color: white;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: 600;
  }
  .callback-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .callback-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    flex-wrap: wrap;
  }
  .callback-list li.done .task-text {
    text-decoration: line-through;
    opacity: 0.5;
  }
  .callback-list .task-text {
    flex: 1;
    min-width: 120px;
  }
  .confirm-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .confirm-label {
    font-size: 0.85rem;
    color: var(--error);
    font-weight: 600;
  }
  .btn {
    padding: 6px 14px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.82rem;
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
  .confirm-btn {
    background: var(--error);
    color: white;
  }
  .confirm-btn:hover {
    opacity: 0.9;
  }
  .cancel-btn {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
  }
  .delete-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.82rem;
    padding: 4px 10px;
    border-radius: 6px;
    transition: all 0.15s;
  }
  .delete-btn:hover {
    color: var(--error);
    border-color: var(--error);
    background: #fef2f2;
  }
  .divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 1.5rem 0;
  }
  .builder-panel {
    border: 2px dashed var(--primary);
    border-radius: 12px;
    overflow: hidden;
    min-height: 80px;
  }
  .builder-header {
    background: var(--primary);
    color: white;
    padding: 12px 16px;
  }
  .builder-header h4 {
    margin: 0;
    font-size: 1rem;
  }
  .builder-body {
    padding: 16px;
    background: var(--surface);
  }
  .builder-body p {
    margin: 0;
    color: var(--text);
    font-size: 0.9rem;
  }
  .builder-footer {
    padding: 10px 16px;
    background: var(--bg);
    border-top: 1px solid var(--border);
    color: var(--text-muted);
    font-size: 0.85rem;
  }
  .empty-builder {
    text-align: center;
    color: var(--text-muted);
    font-style: italic;
    padding: 1.5rem;
    margin: 0;
  }
  .full-demo {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  .full-demo h2 {
    font-size: 1.3rem;
    color: var(--text);
    margin-bottom: 0.5rem;
  }
  .full-demo > p {
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  .task-manager {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.25rem;
  }
  .tm-add {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .tm-add input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.95rem;
    background: var(--bg);
    color: var(--text);
  }
  .tm-add input:focus {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
  .tm-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .tm-list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    transition: background 0.15s;
  }
  .tm-list li.done .task-title {
    text-decoration: line-through;
    opacity: 0.5;
  }
  .tm-list li.empty {
    justify-content: center;
    color: var(--text-muted);
    font-style: italic;
    background: transparent;
    border-style: dashed;
  }
  .tm-task-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }
  .priority-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .task-check {
    cursor: pointer;
    font-size: 1rem;
    user-select: none;
  }
  .task-title {
    flex: 1;
    font-size: 0.92rem;
  }
  .tm-stats {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-muted);
  }
  .tm-stats .success {
    color: var(--success);
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
  .challenge-content p {
    line-height: 1.7;
    margin-bottom: 1rem;
  }
  .challenge-demo {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }
  .confirmed-msg {
    background: var(--success);
    color: white;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: 600;
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal-box {
    background: var(--surface);
    border-radius: 16px;
    width: 90%;
    max-width: 440px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
  }
  .modal-header h4 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text);
  }
  .modal-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.15s;
  }
  .modal-close:hover {
    background: var(--surface-hover);
    color: var(--text);
  }
  .modal-body {
    padding: 20px;
  }
  .modal-body p {
    margin: 0;
    color: var(--text);
    line-height: 1.6;
  }
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 20px;
    border-top: 1px solid var(--border);
    background: var(--bg);
  }
  @media (max-width: 768px) {
    .toggle-row {
      flex-direction: column;
      gap: 0.75rem;
    }
    .code-compare {
      grid-template-columns: 1fr;
    }
    .confirm-row {
      width: 100%;
      justify-content: flex-end;
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
