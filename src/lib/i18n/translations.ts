export type Lang = 'en' | 'es';

const translations = {
  home: {
    en: {
      title: 'Svelte & SvelteKit Crash Course',
      subtitle: 'A hands-on course to learn Svelte 5 and SvelteKit from scratch',
      start: 'Start the Course',
      progress: 'Your Progress',
      lessonsCompleted: 'lessons completed',
      whatYouWillLearn: 'What You Will Learn',
      whatYouWillLearnDesc: 'This course takes you from zero to building a full web application with Svelte 5 and SvelteKit. Each lesson builds on the previous one, growing a Task Manager app step by step.',
      prereqs: 'Prerequisites: Basic HTML & CSS knowledge',
      growingApp: 'Growing App Approach',
      growingAppDesc: 'Instead of disconnected examples, each lesson adds a real feature to a Task Manager application. By the end, you\'ll have built a complete app yourself.'
    },
    es: {
      title: 'Curso Intensivo de Svelte & SvelteKit',
      subtitle: 'Un curso práctico para aprender Svelte 5 y SvelteKit desde cero',
      start: 'Comenzar el Curso',
      progress: 'Tu Progreso',
      lessonsCompleted: 'lecciones completadas',
      whatYouWillLearn: 'Lo Que Aprenderás',
      whatYouWillLearnDesc: 'Este curso te lleva de cero a construir una aplicación web completa con Svelte 5 y SvelteKit. Cada lección se construye sobre la anterior, haciendo crecer una aplicación de Tareas paso a paso.',
      prereqs: 'Requisitos: Conocimiento básico de HTML y CSS',
      growingApp: 'Enfoque de App Creciente',
      growingAppDesc: 'En lugar de ejemplos desconectados, cada lección agrega una funcionalidad real a una aplicación de Tareas. Al final, habrás construido una app completa tú mismo/a.'
    }
  },
  lessons: {
    en: {
      '00': { title: 'JavaScript & TypeScript Refresher', desc: 'Variables, arrow functions, destructuring, async/await, and basic TypeScript types', feature: 'Standalone exercises' },
      '01': { title: 'Svelte Basics', desc: 'Components, $state, $derived, $props() — Build a counter', feature: 'Counter Component' },
      '02': { title: 'Templating', desc: '{#if}, {#each}, {#await}, @html — Render a task list', feature: 'Task List Rendering' },
      '03': { title: 'Events', desc: 'onclick, onsubmit, handlers — Add & delete tasks', feature: 'Add/Delete Tasks' },
      '04': { title: 'Bindings', desc: 'bind:value, bind:checked, bind:group — Task input form', feature: 'Task Input Form' },
      '05': { title: 'Effects & Lifecycle', desc: '$effect, $effect.pre, cleanup — Auto-count tasks', feature: 'Auto-count Tasks' },
      '06': { title: 'State Management', desc: 'Stores vs runes, context — Share state between components', feature: 'Shared State' },
      '07': { title: 'Styling', desc: 'Scoped CSS, :global(), CSS variables — Style the app', feature: 'App Styling' },
      '08': { title: 'Component Patterns', desc: 'Slots, {@render}, snippets — Extract reusable components', feature: 'Reusable Components' },
      '09': { title: 'SvelteKit Routing', desc: 'File-based routing, [params], layouts — Multiple pages', feature: 'Multiple Pages' },
      '10': { title: 'Data Loading', desc: '+page.ts load, +page.server.ts — Fetch data from server', feature: 'Server Data' },
      '11': { title: 'API Routes', desc: '+server.ts, REST handlers — Build a backend API', feature: 'REST API' },
      '12': { title: 'Advanced SvelteKit', desc: 'Hooks, errors, redirects, SSR vs CSR — Polish the app', feature: 'Production Polish' },
      '13': { title: 'Final Project: Recipe Book', desc: 'Build a complete app from scratch using everything you learned', feature: 'Recipe Book App' }
    },
    es: {
      '00': { title: 'Repaso de JavaScript & TypeScript', desc: 'Variables, funciones flecha, desestructuración, async/await y tipos básicos de TypeScript', feature: 'Ejercicios independientes' },
      '01': { title: 'Fundamentos de Svelte', desc: 'Componentes, $state, $derived, $props() — Construir un contador', feature: 'Componente Contador' },
      '02': { title: 'Plantillas', desc: '{#if}, {#each}, {#await}, @html — Renderizar una lista de tareas', feature: 'Renderizar Lista de Tareas' },
      '03': { title: 'Eventos', desc: 'onclick, onsubmit, manejadores — Agregar y eliminar tareas', feature: 'Agregar/Eliminar Tareas' },
      '04': { title: 'Enlaces (Bindings)', desc: 'bind:value, bind:checked, bind:group — Formulario de tareas', feature: 'Formulario de Tareas' },
      '05': { title: 'Efectos y Ciclo de Vida', desc: '$effect, $effect.pre, limpieza — Contar tareas automáticamente', feature: 'Conteo Automático' },
      '06': { title: 'Gestión de Estado', desc: 'Stores vs runes, context — Compartir estado entre componentes', feature: 'Estado Compartido' },
      '07': { title: 'Estilos', desc: 'CSS scoped, :global(), variables CSS — Estilizar la aplicación', feature: 'Estilos de la App' },
      '08': { title: 'Patrones de Componentes', desc: 'Slots, {@render}, snippets — Extraer componentes reutilizables', feature: 'Componentes Reutilizables' },
      '09': { title: 'Rutas en SvelteKit', desc: 'Rutas basadas en archivos, [params], layouts — Múltiples páginas', feature: 'Múltiples Páginas' },
      '10': { title: 'Carga de Datos', desc: '+page.ts load, +page.server.ts — Obtener datos del servidor', feature: 'Datos del Servidor' },
      '11': { title: 'Rutas API', desc: '+server.ts, manejadores REST — Construir una API', feature: 'API REST' },
      '12': { title: 'SvelteKit Avanzado', desc: 'Hooks, errores, redirecciones, SSR vs CSR — Pulir la app', feature: 'Pulido Final' },
      '13': { title: 'Proyecto Final: Libro de Recetas', desc: 'Construir una app completa desde cero usando todo lo aprendido', feature: 'App de Recetas' }
    }
  },
  ui: {
    en: {
      theory: 'Theory',
      example: 'Example',
      challenge: 'Try It Yourself',
      challengeDesc: 'Now modify the code above to complete this challenge:',
      hint: 'Hint',
      showHint: 'Show Hint',
      hideHint: 'Hide Hint',
      next: 'Next Lesson →',
      prev: '← Previous Lesson',
      home: 'Home',
      commonMistakes: 'Common Mistakes',
      svelte4note: 'Svelte 4 Note',
      explanation: 'Explanation',
      result: 'Result',
      code: 'Code',
      appFeature: 'App Feature',
      resetCode: 'Reset Code',
      backToHome: '← Back to Course Home',
      lesson: 'Lesson'
    },
    es: {
      theory: 'Teoría',
      example: 'Ejemplo',
      challenge: 'Inténtalo Tú Mismo/a',
      challengeDesc: 'Ahora modifica el código de arriba para completar este desafío:',
      hint: 'Pista',
      showHint: 'Mostrar Pista',
      hideHint: 'Ocultar Pista',
      next: 'Siguiente Lección →',
      prev: '← Lección Anterior',
      home: 'Inicio',
      commonMistakes: 'Errores Comunes',
      svelte4note: 'Nota de Svelte 4',
      explanation: 'Explicación',
      result: 'Resultado',
      code: 'Código',
      appFeature: 'Funcionalidad de la App',
      resetCode: 'Reiniciar Código',
      backToHome: '← Volver al Inicio',
      lesson: 'Lección'
    }
  }
} as const;

export type Translations = typeof translations;

export function t(lang: Lang, section: 'home'): typeof translations.home[Lang];
export function t(lang: Lang, section: 'lessons'): typeof translations.lessons[Lang];
export function t(lang: Lang, section: 'ui'): typeof translations.ui[Lang];
export function t(lang: Lang, section: keyof Translations) {
  return translations[section][lang];
}

export default translations;
