<script lang="ts">
  import LessonLayout from '$lib/components/LessonLayout.svelte';
  import CodeExample from '$lib/components/CodeExample.svelte';
  import { getLang } from '$lib/i18n/language.svelte.js';
  import { fade, slide, scale, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  let lang = $derived(getLang());

  let boxColor = $state('#ff3e00');
  let boxRadius = $state(8);
  let boxPadding = $state(16);

  let demoTheme = $state<'light' | 'dark'>('light');

  let transitionItems = $state<{ id: number; text: string }[]>([
    { id: 1, text: 'First' },
    { id: 2, text: 'Second' },
    { id: 3, text: 'Third' }
  ]);
  let nextTransId = $state(4);

  interface FlipTask {
    id: number;
    text: string;
    done: boolean;
    priority: number;
  }

  let flipTasks = $state<FlipTask[]>([
    { id: 1, text: 'Design mockup', done: false, priority: 3 },
    { id: 2, text: 'Set up project', done: true, priority: 1 },
    { id: 3, text: 'Write components', done: false, priority: 2 },
    { id: 4, text: 'Add styling', done: false, priority: 4 }
  ]);
  let flipNextId = $state(5);
  let flipInput = $state('');

  let demoTheme2 = $state<'light' | 'dark'>('light');
  let demoInput = $state('');
  let demoNextId = $state(4);
  let demoTasks = $state<{ id: number; text: string; done: boolean }[]>([
    { id: 1, text: 'Learn scoped CSS', done: false },
    { id: 2, text: 'Try transitions', done: false },
    { id: 3, text: 'Build something cool', done: false }
  ]);

  let challengeColor = $state('#ff3e00');
  let challengeDuration = $state(300);

  let showSolution = $state(false);
  const solutionCode = `\x3Cscript lang="ts">
  let { type = 'success', message = '' }: {
    type?: 'success' | 'warning' | 'error';
    message: string;
  } = $props();
\x3C/script>

<div class="notification" data-type={type}>
  <span class="icon">
    {type === 'success' ? '\u2713' : type === 'warning' ? '\u26A0' : '\u2715'}
  </span>
  <span class="message">{message}</span>
</div>

<style>
  .notification {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 1rem 1.5rem; border-radius: 12px;
    border-left: 4px solid var(--color);
    background: var(--bg); color: var(--text);
    transition: transform 0.2s, box-shadow 0.2s,
                background-color 0.2s, color 0.2s, border-color 0.2s;
  }
  .notification:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .notification[data-type="success"] {
    --color: #22c55e; --bg: #f0fdf4; --text: #166534;
  }
  .notification[data-type="warning"] {
    --color: #f59e0b; --bg: #fffbeb; --text: #92400e;
  }
  .notification[data-type="error"] {
    --color: #ef4444; --bg: #fef2f2; --text: #991b1b;
  }
\x3C/style>`;

  function addTransitionItem() {
    const id = nextTransId++;
    transitionItems.push({ id, text: `Item ${id}` });
  }

  function removeTransitionItem(id: number) {
    transitionItems = transitionItems.filter((item) => item.id !== id);
  }

  function moveFlipTask(id: number, direction: 'up' | 'down') {
    const idx = flipTasks.findIndex((t) => t.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx > 0) {
      const tmp = flipTasks[idx].priority;
      flipTasks[idx].priority = flipTasks[idx - 1].priority;
      flipTasks[idx - 1].priority = tmp;
    } else if (direction === 'down' && idx < flipTasks.length - 1) {
      const tmp = flipTasks[idx].priority;
      flipTasks[idx].priority = flipTasks[idx + 1].priority;
      flipTasks[idx + 1].priority = tmp;
    }
    flipTasks = [...flipTasks].sort((a, b) => a.priority - b.priority);
  }

  function addFlipTask() {
    const text = flipInput.trim();
    if (!text) return;
    const maxP = flipTasks.reduce((m, t) => Math.max(m, t.priority), 0);
    flipTasks.push({ id: flipNextId++, text, done: false, priority: maxP + 1 });
    flipInput = '';
  }

  function toggleFlipTask(id: number) {
    const t = flipTasks.find((t) => t.id === id);
    if (t) t.done = !t.done;
  }

  function removeFlipTask(id: number) {
    flipTasks = flipTasks.filter((t) => t.id !== id);
  }

  function addDemoTask() {
    const text = demoInput.trim();
    if (!text) return;
    demoTasks.push({ id: demoNextId++, text, done: false });
    demoInput = '';
  }

  function toggleDemoTask(id: number) {
    const t = demoTasks.find((t) => t.id === id);
    if (t) t.done = !t.done;
  }

  function removeDemoTask(id: number) {
    demoTasks = demoTasks.filter((t) => t.id !== id);
  }

  const text = {
    en: {
      title: 'Styling',
      appFeature: 'App Styling',
      topic1Title: 'Scoped CSS',
      topic1Desc: 'Styles in a Svelte component\'s <style> block are scoped by default — they only affect the current component. The compiler adds unique class names, so you never accidentally style another component.',
      topic1Code: `\x3Cscript lang="ts">
  let count = $state(0);
\x3C/script>

<button class="btn" onclick={() => count++}>
  Clicked {count} times
</button>

<style>
  .btn {
    background: var(--primary);
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
  }
  /* This only affects THIS component's .btn */
</style>`,
      demo1Title: 'Live Style Editor',
      demo1Desc: 'Adjust the CSS properties below and see how they affect the box in real time.',
      color: 'Color',
      borderRadius: 'Border Radius',
      padding: 'Padding',
      topic2Title: ':global() Escape Hatch',
      topic2Desc: 'When you need to target elements inside a child component or global selectors, use :global(). Use it sparingly — scoped styles should be the default.',
      topic2Code: `<style>
  /* Targets ALL h1 elements on the page */
  :global(h1) {
    font-family: 'Inter', sans-serif;
  }

  /* Targets .child only when inside .parent */
  .parent :global(.child) {
    color: red;
  }

  /* Target elements inside a slot/rendered snippet */
  .content :global(p) {
    line-height: 1.7;
  }
</style>`,
      topic3Title: 'CSS Custom Properties (Variables)',
      topic3Desc: 'Define CSS variables on :root for global theming, or on a component for local customization. Use var(--name) to reference them anywhere. Change the variable value and everything updates.',
      topic3Code: `/* In a global stylesheet or +layout.svelte */
:root {
  --primary: #ff3e00;
  --surface: #ffffff;
  --text: #1e1e2e;
  --border: #e5e7eb;
}

/* Switch theme by changing variables */
[data-theme="dark"] {
  --surface: #1e1e2e;
  --text: #cdd6f4;
  --border: #45475a;
}

/* Use in any component */
.card {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}`,
      demo3Title: 'Theme Switcher',
      demo3Desc: 'Toggle between light and dark mode. The entire demo area changes by swapping CSS custom properties.',
      light: 'Light',
      dark: 'Dark',
      topic4Title: 'Transitions',
      topic4Desc: 'Svelte provides built-in transitions: fade, slide, scale, and fly. Apply them with the transition: directive. They play on both enter and leave. Import from svelte/transition.',
      topic4Code: `\x3Cscript lang="ts">
  import { fade, slide, scale, fly } from 'svelte/transition';

  let visible = $state(true);
\x3C/script>

<button onclick={() => visible = !visible}>Toggle</button>

{#if visible}
  <div transition:fade={{ duration: 300 }}>
    Fades in and out
  </div>

  <div transition:slide={{ duration: 300 }}>
    Slides in and out
  </div>

  <div transition:scale={{ duration: 300, start: 0.5 }}>
    Scales in and out
  </div>

  <div transition:fly={{ duration: 300, y: 20 }}>
    Flies in from below
  </div>
{/if}`,
      demo4Title: 'Transition Playground',
      demo4Desc: 'Add and remove items to see transitions in action. Each item fades in when added and fades out when removed.',
      addItem: 'Add Item',
      topic5Title: 'animate:flip for List Reordering',
      topic5Desc: 'When list items change position, use animate:flip to smoothly animate them to their new position. Import from svelte/animate and add it to each {#each} item. Requires a keyed each block.',
      topic5Code: `\x3Cscript lang="ts">
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  let items = $state([
    { id: 1, text: 'First', priority: 1 },
    { id: 2, text: 'Second', priority: 2 },
    { id: 3, text: 'Third', priority: 3 }
  ]);

  function move(id: number, dir: 'up' | 'down') {
    // swap priorities, then sort
    items = [...items].sort((a, b) => a.priority - b.priority);
  }
\x3C/script>

{#each items as item (item.id)}
  <!-- animate:flip makes reorder smooth -->
  <li animate:flip={{ duration: 300 }}>
    {item.text}
    <button onclick={() => move(item.id, 'up')}>↑</button>
    <button onclick={() => move(item.id, 'down')}>↓</button>
  </li>
{/each}`,
      demo5Title: 'Animated Task List with Flip',
      demo5Desc: 'Reorder tasks by moving them up or down. The flip animation smoothly transitions items to their new positions.',
      moveUp: '↑',
      moveDown: '↓',
      addTask: 'Add',
      inputPlaceholder: 'New task...',
      topic6Title: 'Inline Styles with style: Directive',
      topic6Desc: 'Use the style: directive to set individual CSS properties reactively. It\'s cleaner than a style attribute string and updates efficiently when values change.',
      topic6Code: `\x3Cscript lang="ts">
  let color = $state('#ff3e00');
  let size = $state(16);
  let rotated = $state(false);
\x3C/script>

<!-- style: directive sets individual properties -->
<div
  style:color={color}
  style:font-size="{size}px"
  style:transform={rotated ? 'rotate(45deg)' : 'none'}
  style:transition="transform 0.3s"
>
  Styled with directives
</div>

<!-- Shorthand when name matches variable -->
<div style:color={color}>
  Same as style="color: {color}"
</div>`,
      demoTitle: 'Styled Task Manager',
      demoDesc: 'A fully styled task manager with theme toggle, transitions on add/remove, and flip animation for reordering.',
      demoInputPlaceholder: 'Add a task...',
      add: 'Add',
      mistakesTitle: 'Common Mistakes',
      mistake1Title: 'Expecting scoped styles to leak into children',
      mistake1Wrong: `<!-- Parent.svelte -->
<style>
  /* This will NOT style Child's .box */
  .box {
    background: red;
  }
</style>

<Child />`,
      mistake1Correct: `<!-- Parent.svelte -->
<style>
  /* Use :global to target child elements */
  :global(.box) {
    background: red;
  }
  /* OR pass a class prop to Child */
</style>

<Child class="red-box" />`,
      mistake1Explain: 'Scoped styles only affect elements in the current component. To style child components, use :global(), pass CSS classes as props, or use CSS custom properties.',
      mistake2Title: 'Overusing :global()',
      mistake2Wrong: `<style>
  :global(.container) {
    max-width: 800px;
  }
  :global(.btn) {
    padding: 8px;
  }
  :global(.title) {
    font-size: 2rem;
  }
  /* Everything is global! No scoping! */
</style>`,
      mistake2Correct: `<style>
  /* Keep styles scoped by default */
  .container {
    max-width: 800px;
  }
  .btn {
    padding: 8px;
  }
  .title {
    font-size: 2rem;
  }
  /* Only use :global when truly needed */
</style>`,
      mistake2Explain: ':global() defeats the purpose of scoped styles. Use it only when you need to target child component internals or third-party library elements. Default to scoped styles.',
      mistake3Title: 'Expensive transitions causing jank',
      mistake3Wrong: `<style>
  .card {
    transition: all 0.5s ease;
    /* 'all' triggers layout for EVERY property */
    box-shadow: 0 0 40px rgba(0,0,0,0.2);
  }
</style>`,
      mistake3Correct: `<style>
  .card {
    /* Only transition transform and opacity */
    transition: transform 0.3s ease, opacity 0.3s ease;
    will-change: transform, opacity;
  }
  .card:hover {
    transform: translateY(-2px);
  }
</style>`,
      mistake3Explain: 'Transitioning "all" or properties like box-shadow/width/height triggers expensive layout repaints. Stick to transform and opacity for smooth 60fps animations.',
      mistake4Title: 'Specificity issues with scoped styles',
      mistake4Wrong: `<style>
  /* Scoped adds a unique selector like */
  /* .btn.svelte-xyz123 { ... } */
  /* But this won't override a library class */
  .btn {
    background: red !important;
    /* Using !important is a code smell */
  }
</style>`,
      mistake4Correct: `<style>
  /* Increase specificity naturally */
  .card .btn {
    background: red;
  }
  /* Or wrap in a more specific selector */
  .my-component .btn {
    background: red;
  }
</style>`,
      mistake4Explain: 'Scoped styles add a unique class selector, which can lose to higher-specificity selectors from global styles or libraries. Increase specificity with nesting instead of !important.',
      challengeTitle: 'Challenge: Custom Transition Effect',
      challengeDesc: 'Create a custom transition function that combines fade with a vertical slide. Adjust the color and duration below to see your custom effect, then implement it in code.',
      challengeColor: 'Highlight Color',
      challengeDuration: 'Duration (ms)',
      challengePreview: 'Preview',
      challengeHint: `\x3Cscript lang="ts">
  import { fade } from 'svelte/transition';

  // Custom transition combining fade + slide
  function customSlide(
    node: Element,
    { delay = 0, duration = 300, y = 20 }: {
      delay?: number; duration?: number; y?: number;
    }
  ) {
    return {
      delay,
      duration,
      css: (t: number) => {
        const eased = t;
        return \`
          opacity: \${eased};
          transform: translateY(\${(1 - eased) * y}px);
        \`;
      }
    };
  }

  let visible = $state(true);
\x3C/script>

<button onclick={() => visible = !visible}>
  Toggle
</button>

{#if visible}
  <div transition:customSlide={{ duration: 400, y: 30 }}>
    Custom slide + fade!
  </div>
{/if}`
    },
    es: {
      title: 'Estilos',
      appFeature: 'Estilos de la App',
      topic1Title: 'CSS Scoped (Alcance limitado)',
      topic1Desc: 'Los estilos en el bloque <style> de un componente Svelte están limitados por defecto — solo afectan al componente actual. El compilador agrega nombres de clase únicos, así que nunca estilizas otro componente por accidente.',
      topic1Code: `\x3Cscript lang="ts">
  let count = $state(0);
\x3C/script>

<button class="btn" onclick={() => count++}>
  Clics: {count}
</button>

<style>
  .btn {
    background: var(--primary);
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
  }
  /* Esto solo afecta al .btn de ESTE componente */
</style>`,
      demo1Title: 'Editor de Estilos en Vivo',
      demo1Desc: 'Ajusta las propiedades CSS abajo y ve cómo afectan la caja en tiempo real.',
      color: 'Color',
      borderRadius: 'Radio del Borde',
      padding: 'Relleno',
      topic2Title: ':global() — Escape del Scoped',
      topic2Desc: 'Cuando necesitas afectar elementos dentro de un componente hijo o selectores globales, usa :global(). Úsalo con moderación — los estilos scoped deben ser el predeterminado.',
      topic2Code: `<style>
  /* Apunta a TODOS los h1 de la página */
  :global(h1) {
    font-family: 'Inter', sans-serif;
  }

  /* Apunta a .child solo cuando está dentro de .parent */
  .parent :global(.child) {
    color: red;
  }

  /* Apuntar a elementos dentro de un slot/snippet renderizado */
  .content :global(p) {
    line-height: 1.7;
  }
</style>`,
      topic3Title: 'Propiedades CSS Personalizadas (Variables)',
      topic3Desc: 'Define variables CSS en :root para temas globales, o en un componente para personalización local. Usa var(--nombre) para referenciarlas. Cambia el valor y todo se actualiza.',
      topic3Code: `/* En una hoja de estilos global o +layout.svelte */
:root {
  --primary: #ff3e00;
  --surface: #ffffff;
  --text: #1e1e2e;
  --border: #e5e7eb;
}

/* Cambiar tema cambiando variables */
[data-theme="dark"] {
  --surface: #1e1e2e;
  --text: #cdd6f4;
  --border: #45475a;
}

/* Usar en cualquier componente */
.card {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}`,
      demo3Title: 'Cambiador de Tema',
      demo3Desc: 'Alterna entre modo claro y oscuro. Toda el área cambia intercambiando propiedades CSS personalizadas.',
      light: 'Claro',
      dark: 'Oscuro',
      topic4Title: 'Transiciones',
      topic4Desc: 'Svelte proporciona transiciones integradas: fade, slide, scale y fly. Aplícalas con la directiva transition:. Se reproducen tanto al entrar como al salir. Importa desde svelte/transition.',
      topic4Code: `\x3Cscript lang="ts">
  import { fade, slide, scale, fly } from 'svelte/transition';

  let visible = $state(true);
\x3C/script>

<button onclick={() => visible = !visible}>Alternar</button>

{#if visible}
  <div transition:fade={{ duration: 300 }}>
    Aparece y desaparece con fade
  </div>

  <div transition:slide={{ duration: 300 }}>
    Entra y sale deslizándose
  </div>

  <div transition:scale={{ duration: 300, start: 0.5 }}>
    Escala al entrar y salir
  </div>

  <div transition:fly={{ duration: 300, y: 20 }}>
    Vuela desde abajo
  </div>
{/if}`,
      demo4Title: 'Zona de Juego de Transiciones',
      demo4Desc: 'Agrega y elimina elementos para ver las transiciones en acción. Cada elemento aparece con fade al agregarse y desaparece con fade al eliminarse.',
      addItem: 'Agregar Elemento',
      topic5Title: 'animate:flip para Reordenamiento de Listas',
      topic5Desc: 'Cuando los elementos de una lista cambian de posición, usa animate:flip para animarlos suavemente a su nueva posición. Importa desde svelte/animate y agrégalo a cada elemento del {#each}. Requiere un bloque each con clave.',
      topic5Code: `\x3Cscript lang="ts">
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  let items = $state([
    { id: 1, text: 'Primero', priority: 1 },
    { id: 2, text: 'Segundo', priority: 2 },
    { id: 3, text: 'Tercero', priority: 3 }
  ]);

  function mover(id: number, dir: 'up' | 'down') {
    // intercambiar prioridades, luego ordenar
    items = [...items].sort((a, b) => a.priority - b.priority);
  }
\x3C/script>

{#each items as item (item.id)}
  <!-- animate:flip hace que el reorden sea suave -->
  <li animate:flip={{ duration: 300 }}>
    {item.text}
    <button onclick={() => mover(item.id, 'up')}>↑</button>
    <button onclick={() => mover(item.id, 'down')}>↓</button>
  </li>
{/each}`,
      demo5Title: 'Lista de Tareas Animada con Flip',
      demo5Desc: 'Reordena tareas moviéndolas arriba o abajo. La animación flip transiciona suavemente los elementos a sus nuevas posiciones.',
      moveUp: '↑',
      moveDown: '↓',
      addTask: 'Agregar',
      inputPlaceholder: 'Nueva tarea...',
      topic6Title: 'Estilos Inline con la Directiva style:',
      topic6Desc: 'Usa la directiva style: para establecer propiedades CSS individuales reactivamente. Es más limpio que un string de atributo style y se actualiza eficientemente cuando cambian los valores.',
      topic6Code: `\x3Cscript lang="ts">
  let color = $state('#ff3e00');
  let size = $state(16);
  let rotated = $state(false);
\x3C/script>

<!-- style: directive establece propiedades individuales -->
<div
  style:color={color}
  style:font-size="{size}px"
  style:transform={rotated ? 'rotate(45deg)' : 'none'}
  style:transition="transform 0.3s"
>
  Estilizado con directivas
</div>

<!-- Abreviatura cuando el nombre coincide con la variable -->
<div style:color={color}>
  Igual que style="color: {color}"
</div>`,
      demoTitle: 'Gestor de Tareas Estilizado',
      demoDesc: 'Un gestor de tareas completamente estilizado con cambio de tema, transiciones al agregar/eliminar y animación flip para reordenar.',
      demoInputPlaceholder: 'Agregar tarea...',
      add: 'Agregar',
      mistakesTitle: 'Errores Comunes',
      mistake1Title: 'Esperar que estilos scoped afecten componentes hijos',
      mistake1Wrong: `<!-- Padre.svelte -->
<style>
  /* Esto NO estilizará el .box de Hijo */
  .box {
    background: red;
  }
</style>

<Hijo />`,
      mistake1Correct: `<!-- Padre.svelte -->
<style>
  /* Usa :global para apuntar a elementos hijos */
  :global(.box) {
    background: red;
  }
  /* O pasa una prop class a Hijo */
</style>

<Hijo class="red-box" />`,
      mistake1Explain: 'Los estilos scoped solo afectan elementos del componente actual. Para estilizar componentes hijos, usa :global(), pasa clases CSS como props, o usa propiedades CSS personalizadas.',
      mistake2Title: 'Abusar de :global()',
      mistake2Wrong: `<style>
  :global(.container) {
    max-width: 800px;
  }
  :global(.btn) {
    padding: 8px;
  }
  :global(.title) {
    font-size: 2rem;
  }
  /* ¡Todo es global! ¡Sin scoping! */
</style>`,
      mistake2Correct: `<style>
  /* Mantén los estilos scoped por defecto */
  .container {
    max-width: 800px;
  }
  .btn {
    padding: 8px;
  }
  .title {
    font-size: 2rem;
  }
  /* Solo usa :global cuando sea realmente necesario */
</style>`,
      mistake2Explain: ':global() anula el propósito de los estilos scoped. Úsalo solo cuando necesites afectar el interior de componentes hijos o elementos de librerías de terceros. Usa scoped por defecto.',
      mistake3Title: 'Transiciones costosas causando lentitud',
      mistake3Wrong: `<style>
  .card {
    transition: all 0.5s ease;
    /* 'all' dispara layout para TODA propiedad */
    box-shadow: 0 0 40px rgba(0,0,0,0.2);
  }
</style>`,
      mistake3Correct: `<style>
  .card {
    /* Solo transicionar transform y opacity */
    transition: transform 0.3s ease, opacity 0.3s ease;
    will-change: transform, opacity;
  }
  .card:hover {
    transform: translateY(-2px);
  }
</style>`,
      mistake3Explain: 'Transicionar "all" o propiedades como box-shadow/width/height dispara repintados costosos. Usa solo transform y opacity para animaciones fluidas a 60fps.',
      mistake4Title: 'Problemas de especificidad con estilos scoped',
      mistake4Wrong: `<style>
  /* Scoped agrega un selector único como */
  /* .btn.svelte-xyz123 { ... } */
  /* Pero esto no sobreescribirá una clase de librería */
  .btn {
    background: red !important;
    /* Usar !important es un mal olor de código */
  }
</style>`,
      mistake4Correct: `<style>
  /* Aumenta la especificidad naturalmente */
  .card .btn {
    background: red;
  }
  /* O envuelve en un selector más específico */
  .mi-componente .btn {
    background: red;
  }
</style>`,
      mistake4Explain: 'Los estilos scoped agregan una clase única que puede perder ante selectores de mayor especificidad de estilos globales o librerías. Aumenta la especificidad con anidamiento en vez de !important.',
      challengeTitle: 'Reto: Efecto de Transición Personalizado',
      challengeDesc: 'Crea una función de transición personalizada que combine fade con un deslizamiento vertical. Ajusta el color y duración abajo para ver tu efecto personalizado, luego impleméntalo en código.',
      challengeColor: 'Color de Resaltado',
      challengeDuration: 'Duración (ms)',
      challengePreview: 'Vista Previa',
      challengeHint: `\x3Cscript lang="ts">
  import { fade } from 'svelte/transition';

  // Transición personalizada combinando fade + slide
  function customSlide(
    node: Element,
    { delay = 0, duration = 300, y = 20 }: {
      delay?: number; duration?: number; y?: number;
    }
  ) {
    return {
      delay,
      duration,
      css: (t: number) => {
        const eased = t;
        return \`
          opacity: \${eased};
          transform: translateY(\${(1 - eased) * y}px);
        \`;
      }
    };
  }

  let visible = $state(true);
\x3C/script>

<button onclick={() => visible = !visible}>
  Alternar
</button>

{#if visible}
  <div transition:customSlide={{ duration: 400, y: 30 }}>
    ¡Slide + fade personalizado!
  </div>
{/if}`
    }
  };

  let t = $derived(text[lang]);

  let themeVars = $derived(
    demoTheme2 === 'dark'
      ? {
          '--demo-surface': '#1e1e2e',
          '--demo-text': '#cdd6f4',
          '--demo-border': '#45475a',
          '--demo-bg': '#11111b',
          '--demo-input-bg': '#1e1e2e'
        }
      : {
          '--demo-surface': '#ffffff',
          '--demo-text': '#1e1e2e',
          '--demo-border': '#e5e7eb',
          '--demo-bg': '#f8fafc',
          '--demo-input-bg': '#ffffff'
        }
  );
</script>

<LessonLayout lessonNum="07" title={t.title} appFeature={t.appFeature}>
  {#snippet theory()}
    <div class="topics">
      <section class="topic">
        <h3>1. {t.topic1Title}</h3>
        <p>{t.topic1Desc}</p>
        <CodeExample code={t.topic1Code} filename="Button.svelte" />
        <div class="interactive-box">
          <h4>{t.demo1Title}</h4>
          <p class="demo-desc">{t.demo1Desc}</p>
          <div class="style-controls">
            <label>
              {t.color}
              <input type="color" bind:value={boxColor} />
            </label>
            <label>
              {t.borderRadius}: {boxRadius}px
              <input type="range" min="0" max="50" bind:value={boxRadius} />
            </label>
            <label>
              {t.padding}: {boxPadding}px
              <input type="range" min="4" max="48" bind:value={boxPadding} />
            </label>
          </div>
          <div
            class="styled-box"
            style:background={boxColor}
            style:border-radius="{boxRadius}px"
            style:padding="{boxPadding}px"
          >
            Scoped CSS Demo
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>2. {t.topic2Title}</h3>
        <p>{t.topic2Desc}</p>
        <CodeExample code={t.topic2Code} filename="GlobalStyles.svelte" />
      </section>

      <section class="topic">
        <h3>3. {t.topic3Title}</h3>
        <p>{t.topic3Desc}</p>
        <CodeExample code={t.topic3Code} filename="theme.css" />
        <div class="interactive-box">
          <h4>{t.demo3Title}</h4>
          <p class="demo-desc">{t.demo3Desc}</p>
          <div class="theme-buttons-row">
            <button class="btn primary" class:outline={demoTheme === 'dark'} onclick={() => demoTheme = 'light'}>{t.light}</button>
            <button class="btn primary" class:outline={demoTheme === 'light'} onclick={() => demoTheme = 'dark'}>{t.dark}</button>
          </div>
          <div class="theme-demo-area" data-theme={demoTheme}>
            <div class="theme-card">
              <h4>{demoTheme === 'dark' ? 'Modo Oscuro' : 'Light Mode'}</h4>
              <p>{demoTheme === 'dark' ? 'Las variables CSS cambian todo el tema automáticamente.' : 'CSS variables change the entire theme automatically.'}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>4. {t.topic4Title}</h3>
        <p>{t.topic4Desc}</p>
        <CodeExample code={t.topic4Code} filename="Transitions.svelte" />
        <div class="interactive-box">
          <h4>{t.demo4Title}</h4>
          <p class="demo-desc">{t.demo4Desc}</p>
          <button class="btn primary" onclick={addTransitionItem}>{t.addItem}</button>
          <ul class="transition-list">
            {#each transitionItems as item (item.id)}
              <li transition:fade={{ duration: 300 }}>
                <span>{item.text}</span>
                <button class="delete-btn" onclick={() => removeTransitionItem(item.id)}>✕</button>
              </li>
            {/each}
          </ul>
        </div>
      </section>

      <section class="topic">
        <h3>5. {t.topic5Title}</h3>
        <p>{t.topic5Desc}</p>
        <CodeExample code={t.topic5Code} filename="FlipList.svelte" />
        <div class="interactive-box">
          <h4>{t.demo5Title}</h4>
          <p class="demo-desc">{t.demo5Desc}</p>
          <div class="add-task">
            <input type="text" placeholder={t.inputPlaceholder} bind:value={flipInput} onkeydown={(e) => e.key === 'Enter' && addFlipTask()} />
            <button class="btn primary" onclick={addFlipTask}>{t.addTask}</button>
          </div>
          <ul class="task-list">
            {#each flipTasks as task (task.id)}
              <li animate:flip={{ duration: 300 }} transition:fade={{ duration: 200 }} class:done={task.done}>
                <span class="task-check" onclick={() => toggleFlipTask(task.id)}>
                  {task.done ? '✅' : '⬜'}
                </span>
                <span class="task-title">{task.text}</span>
                <div class="move-btns">
                  <button class="move-btn" onclick={() => moveFlipTask(task.id, 'up')}>{t.moveUp}</button>
                  <button class="move-btn" onclick={() => moveFlipTask(task.id, 'down')}>{t.moveDown}</button>
                </div>
                <button class="delete-btn" onclick={() => removeFlipTask(task.id)}>✕</button>
              </li>
            {/each}
          </ul>
        </div>
      </section>

      <section class="topic">
        <h3>6. {t.topic6Title}</h3>
        <p>{t.topic6Desc}</p>
        <CodeExample code={t.topic6Code} filename="StyleDirective.svelte" />
      </section>
    </div>
  {/snippet}

  {#snippet example()}
    <div class="demo">
      <h3>{t.demoTitle}</h3>
      <p>{t.demoDesc}</p>
      <div class="demo-toolbar">
        <button class="btn primary" class:outline={demoTheme2 === 'dark'} onclick={() => demoTheme2 = 'light'}>{t.light}</button>
        <button class="btn primary" class:outline={demoTheme2 === 'light'} onclick={() => demoTheme2 = 'dark'}>{t.dark}</button>
      </div>
      <div class="demo-manager" style={Object.entries(themeVars).map(([k, v]) => `${k}:${v}`).join(';')}>
        <div class="demo-add">
          <input type="text" placeholder={t.demoInputPlaceholder} bind:value={demoInput} onkeydown={(e) => e.key === 'Enter' && addDemoTask()} style="background: var(--demo-input-bg); color: var(--demo-text); border-color: var(--demo-border);" />
          <button class="btn primary" onclick={addDemoTask}>{t.add}</button>
        </div>
        <ul class="demo-task-list">
          {#each demoTasks as task (task.id)}
            <li animate:flip={{ duration: 300 }} transition:fade={{ duration: 250 }} class:done={task.done} style="background: var(--demo-surface); border-color: var(--demo-border); color: var(--demo-text);">
              <span class="task-check" onclick={() => toggleDemoTask(task.id)}>
                {task.done ? '✅' : '⬜'}
              </span>
              <span class="task-title">{task.text}</span>
              <button class="delete-btn" onclick={() => removeDemoTask(task.id)}>✕</button>
            </li>
          {:else}
            <li class="empty" style="color: var(--demo-text); border-color: var(--demo-border);">
              {lang === 'en' ? 'No tasks yet!' : '¡Sin tareas aún!'}
            </li>
          {/each}
        </ul>
        <div class="demo-stats" style="border-color: var(--demo-border);">
          <span style="color: var(--demo-text);">{lang === 'en' ? 'Total' : 'Total'}: {demoTasks.length}</span>
          <span style="color: var(--success);">{lang === 'en' ? 'Done' : 'Hechas'}: {demoTasks.filter((t) => t.done).length}</span>
        </div>
      </div>
    </div>
  {/snippet}

  {#snippet challenge()}
    <div class="challenge-content">
      <p>{t.challengeDesc}</p>
      <div class="challenge-controls">
        <label>
          {t.challengeColor}
          <input type="color" bind:value={challengeColor} />
        </label>
        <label>
          {t.challengeDuration}: {challengeDuration}ms
          <input type="range" min="100" max="1000" step="50" bind:value={challengeDuration} />
        </label>
      </div>
      <div class="challenge-preview">
        <h4>{t.challengePreview}</h4>
        {#each [1] as _}
          <div
            transition:fade={{ duration: challengeDuration }}
            class="challenge-box"
            style:background={challengeColor}
            style:padding="16px"
            style:border-radius="8px"
            style:color="white"
            style:font-weight="600"
          >
            Custom transition!
          </div>
        {/each}
      </div>
      <CodeExample code={t.challengeHint} filename="CustomTransition.svelte" />
    </div>
  {/snippet}

  <section class="exercise-section">
    <h2>✏️ {lang === 'en' ? 'Exercise' : 'Ejercicio'}: Styled Notification Card</h2>
    <div class="exercise-task">
      <p>{lang === 'en' ? 'Create a notification card component with scoped styles:' : 'Crea un componente de tarjeta de notificación con estilos scoped:'}</p>
      <ul>
        <li>{lang === 'en' ? 'Three variants: "success" (green), "warning" (amber), "error" (red)' : 'Tres variantes: "success" (verde), "warning" (ámbar), "error" (rojo)'}</li>
        <li>{lang === 'en' ? 'Use CSS custom properties for the variant colors' : 'Usa propiedades CSS personalizadas para los colores de las variantes'}</li>
        <li>{lang === 'en' ? 'Add a hover effect (slight scale + shadow)' : 'Agrega un efecto hover (ligera escala + sombra)'}</li>
        <li>{lang === 'en' ? 'Add a transition for smooth color changes' : 'Agrega una transición para cambios de color suaves'}</li>
        <li>{lang === 'en' ? 'The component accepts type and message as props' : 'El componente acepta type y message como props'}</li>
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
  .style-controls {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    align-items: flex-end;
  }
  .style-controls label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
  }
  .style-controls input[type="color"] {
    width: 48px;
    height: 36px;
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    padding: 2px;
  }
  .style-controls input[type="range"] {
    width: 140px;
    accent-color: var(--primary);
  }
  .styled-box {
    color: white;
    font-weight: 600;
    text-align: center;
    transition: all 0.2s ease;
  }
  .theme-buttons-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .theme-demo-area {
    border-radius: 12px;
    padding: 1.25rem;
    transition: all 0.3s ease;
  }
  .theme-demo-area[data-theme="light"] {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
  }
  .theme-demo-area[data-theme="dark"] {
    background: #1e1e2e;
    border: 1px solid #45475a;
  }
  .theme-card {
    border-radius: 10px;
    padding: 1rem;
  }
  .theme-demo-area[data-theme="light"] .theme-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    color: #1e1e2e;
  }
  .theme-demo-area[data-theme="dark"] .theme-card {
    background: #11111b;
    border: 1px solid #45475a;
    color: #cdd6f4;
  }
  .theme-card h4 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  .theme-card p {
    font-size: 0.9rem;
    margin: 0;
    opacity: 0.8;
  }
  .transition-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .transition-list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.92rem;
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
  .btn.primary.outline {
    background: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
  }
  .btn.secondary {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
  }
  .btn.secondary:hover {
    background: var(--surface-hover);
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
    transition: background 0.15s, border-color 0.15s;
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
  .move-btns {
    display: flex;
    gap: 2px;
  }
  .move-btn {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    padding: 2px 8px;
    color: var(--text-muted);
    transition: all 0.15s;
  }
  .move-btn:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
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
  .demo-toolbar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .demo-manager {
    border-radius: 12px;
    padding: 1.25rem;
    transition: all 0.3s ease;
  }
  .demo-add {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .demo-add input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.95rem;
  }
  .demo-add input:focus {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
  .demo-task-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .demo-task-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
  }
  .demo-task-list li.done .task-title {
    text-decoration: line-through;
    opacity: 0.5;
  }
  .demo-task-list li.empty {
    justify-content: center;
    font-style: italic;
    background: transparent;
    border-style: dashed;
  }
  .demo-stats {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border);
    font-size: 0.85rem;
    font-weight: 600;
  }
  .challenge-content p {
    line-height: 1.7;
    margin-bottom: 1rem;
  }
  .challenge-controls {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  .challenge-controls label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
  }
  .challenge-controls input[type="color"] {
    width: 48px;
    height: 36px;
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    padding: 2px;
  }
  .challenge-controls input[type="range"] {
    width: 160px;
    accent-color: var(--primary);
  }
  .challenge-preview {
    margin-bottom: 1rem;
  }
  .challenge-preview h4 {
    font-size: 0.95rem;
    color: var(--text);
    margin-bottom: 0.75rem;
  }
  .challenge-box {
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
    .style-controls {
      flex-direction: column;
      gap: 1rem;
    }
    .code-compare {
      grid-template-columns: 1fr;
    }
    .challenge-controls {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
