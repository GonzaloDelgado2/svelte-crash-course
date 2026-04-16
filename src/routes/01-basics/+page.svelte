<script lang="ts">
  import { getLang } from '$lib/i18n/language.svelte.js';
  import translations from '$lib/i18n/translations.js';

  let lang = $derived(getLang());
  let ui = $derived(translations.ui[lang]);
  let lessonData = $derived(translations.lessons[lang]['01']);

  let showSolution = $state(false);
  const exerciseSolution = `\x3Cscript lang="ts">
  let count = $state(0);
  let total = $derived(count * 9.99);
  let message = $derived(
    count === 0
      ? 'Cart is empty'
      : \x60\${count} items - $\${total.toFixed(2)}\x60
  );
\x3C/script>

\x3Cbutton onclick={() => count = Math.max(0, count - 1)}>Remove\x3C/button>
\x3Cspan>{count}\x3C/span>
\x3Cbutton onclick={() => count++}>Add\x3C/button>
\x3Cp>{message}\x3C/p>`;

  let count = $state(0);
  let double = $derived(count * 2);
  let isEven = $derived(count % 2 === 0);
  let countLabel = $derived(
    count === 0
      ? (lang === 'en' ? 'Zero' : 'Cero')
      : count > 0
        ? (lang === 'en' ? 'Positive' : 'Positivo')
        : (lang === 'en' ? 'Negative' : 'Negativo')
  );

  let greetingName = $state('World');
  let greetingMessage = $derived(lang === 'en' ? `Hello, ${greetingName}!` : `¡Hola, ${greetingName}!`);

  let heroCount = $state(0);
  let heroEmoji = $derived(heroCount >= 10 ? '🔥' : heroCount >= 5 ? '⚡' : '🎯');

  function increment() {
    count++;
  }

  function decrement() {
    count--;
  }

  function reset() {
    count = 0;
  }

  function heroIncrement() {
    heroCount++;
  }

  function heroDecrement() {
    heroCount--;
  }

  function heroReset() {
    heroCount = 0;
  }

  let fileStructureCode = $derived(
    lang === 'en'
      ? `\x3Cscript lang="ts">\n  // Your JavaScript/TypeScript logic goes here\n  let name = $state('Svelte');\n\x3C/script>\n\n\x3C!-- Your HTML template goes here -->\n\x3Ch1>Hello {name}!\x3C/h1>\n\n\x3Cstyle>\n  /* Scoped CSS — only affects this component */\n  h1 {\n    color: #ff3e00;\n  }\n\x3C/style>`
      : `\x3Cscript lang="ts">\n  // Tu lógica JavaScript/TypeScript va aquí\n  let name = $state('Svelte');\n\x3C/script>\n\n\x3C!-- Tu plantilla HTML va aquí -->\n\x3Ch1>Hola {name}!\x3C/h1>\n\n\x3Cstyle>\n  /* CSS Scoped — solo afecta a este componente */\n  h1 {\n    color: #ff3e00;\n  }\n\x3C/style>`
  );

  const text = {
    en: {
      lessonBadge: 'Lesson 01',
      title: 'Svelte Basics',
      subtitle: 'Components, $state, $derived, $props() — Build your first counter',
      appFeature: 'App Feature: Counter Component',
      appFeatureDesc: 'In this lesson we build the very first piece of our Task Manager: a counter. Later, this counter will track how many tasks you have!',
      topic1Title: 'What is Svelte?',
      topic1Desc: 'Svelte is a compiled JavaScript framework. Unlike React or Vue, Svelte doesn\'t use a virtual DOM — it compiles your components into efficient vanilla JavaScript at build time. This means faster apps with less boilerplate.',
      topic1Bullet1: 'Compiled at build time → no runtime overhead',
      topic1Bullet2: 'No virtual DOM → direct DOM updates',
      topic1Bullet3: '.svelte files combine script, markup, and style',
      topic1Bullet4: 'Less code → more readable, more maintainable',
      topic2Title: '.svelte File Structure',
      topic2Desc: 'Every Svelte component lives in a .svelte file with three sections: \x3Cscript> for logic, HTML for the template, and \x3Cstyle> for scoped CSS.',
      topic2FileLabel: 'Component.svelte',
      topic3Title: '$state — Reactive State',
      topic3Desc: 'The $state rune declares reactive variables. When a $state variable changes, Svelte automatically updates the DOM. No setState, no useState — just assign a new value!',
      topic3Code: 'let count = $state(0);\n\nfunction increment() {\n  count++; // DOM updates automatically!\n}',
      topic3Interactive: 'Interactive Counter',
      topic3Increment: '+1',
      topic3Decrement: '-1',
      topic3Reset: 'Reset',
      topic4Title: '$derived — Computed Values',
      topic4Desc: 'The $derived rune creates values that automatically update when their dependencies change. Think of them as formulas in a spreadsheet.',
      topic4Code: 'let count = $state(0);\nlet double = $derived(count * 2);\nlet isEven = $derived(count % 2 === 0);',
      topic4Double: 'Double',
      topic4IsEven: 'Is Even?',
      topic4Yes: 'Yes',
      topic4No: 'No',
      topic4Sign: 'Sign',
      topic5Title: '$props() — Component Props',
      topic5Desc: 'The $props() rune lets a component receive data from its parent. Props are how components communicate. The parent passes data in, the child uses it.',
      topic5Code: '// Child component (Greeting.svelte)\nlet { name } = $props();\n\n// Usage in parent:\n<Greeting name="World" />',
      topic5Interactive: 'Try it — change the name!',
      topic5Placeholder: 'Type a name...',
      topic6Title: 'Component Imports',
      topic6Desc: 'Components are imported with standard ES module syntax. Once imported, you use them as custom HTML tags in your template.',
      topic6Code: "// Import\nimport Greeting from './Greeting.svelte';\n\n// Use in template\n<Greeting name=\"Svelte\" />",
      topic6Result: 'Rendered output:',
      demoTitle: 'Your First App Feature: The Counter',
      demoDesc: 'This counter is the very first piece of the Task Manager. Click it, play with it — this is YOUR creation!',
      demoScore: 'Score',
      mistakesTitle: 'Common Mistakes',
      mistake1Title: 'Forgetting $state for reactive variables',
      mistake1Bad: 'let count = 0;\n\nfunction increment() {\n  count++; // DOM won\'t update!\n}',
      mistake1Good: 'let count = $state(0);\n\nfunction increment() {\n  count++; // DOM updates! ✅\n}',
      mistake1Why: 'Without $state, Svelte doesn\'t know to track changes. The variable updates in memory but the DOM stays the same.',
      mistake2Title: 'Using $derived like a function call',
      mistake2Bad: 'let double = $derived(count * 2);\ndouble = $derived(count * 4); // Error!',
      mistake2Good: 'let double = $derived(count * 2);\nlet quad = $derived(count * 4); // New variable',
      mistake2Why: '$derived values are read-only. They recalculate when dependencies change. To change the logic, create a new $derived variable.',
      mistake3Title: 'Mutating arrays/objects without reassignment',
      mistake3Bad: 'let items = $state([1, 2, 3]);\nitems.push(4); // May not trigger update',
      mistake3Good: 'let items = $state([1, 2, 3]);\nitems = [...items, 4]; // New array ✅',
      mistake3Why: 'In Svelte 5 with $state, push() actually works fine. But reassigning with a new array is the safest pattern and works in all Svelte versions.',
      mistake4Title: 'Putting $state/$derived outside \x3Cscript>',
      mistake4Bad: '\x3C!-- In the template -->\n\x3Cp>let count = $state(0);\x3C/p>',
      mistake4Good: '\x3Cscript>\n  let count = $state(0);\n\x3C/script>\n\x3Cp>{count}\x3C/p>',
      mistake4Why: 'Runes like $state and $derived only work inside \x3Cscript> blocks. In the template, use curly braces { } to display values.',
      prevLesson: '← Lesson 00: JS Refresher',
      nextLesson: 'Lesson 02: Templating →'
    },
    es: {
      lessonBadge: 'Lección 01',
      title: 'Fundamentos de Svelte',
      subtitle: 'Componentes, $state, $derived, $props() — Construye tu primer contador',
      appFeature: 'Funcionalidad: Componente Contador',
      appFeatureDesc: 'En esta lección construimos la primera pieza de nuestro Gestor de Tareas: un contador. Más adelante, ¡este contador rastreará cuántas tareas tienes!',
      topic1Title: '¿Qué es Svelte?',
      topic1Desc: 'Svelte es un framework de JavaScript compilado. A diferencia de React o Vue, Svelte no usa un virtual DOM — compila tus componentes en JavaScript vanilla eficiente en tiempo de construcción. Esto significa apps más rápidas con menos código.',
      topic1Bullet1: 'Compilado en build → sin overhead en runtime',
      topic1Bullet2: 'Sin virtual DOM → actualizaciones directas al DOM',
      topic1Bullet3: 'Archivos .svelte combinan script, markup y estilo',
      topic1Bullet4: 'Menos código → más legible, más mantenible',
      topic2Title: 'Estructura de un archivo .svelte',
      topic2Desc: 'Cada componente Svelte vive en un archivo .svelte con tres secciones: \x3Cscript> para la lógica, HTML para la plantilla, y \x3Cstyle> para CSS scoped.',
      topic2FileLabel: 'Componente.svelte',
      topic3Title: '$state — Estado Reactivo',
      topic3Desc: 'El rune $state declara variables reactivas. Cuando una variable $state cambia, Svelte actualiza automáticamente el DOM. Sin setState, sin useState — ¡solo asigna un nuevo valor!',
      topic3Code: 'let count = $state(0);\n\nfunction incrementar() {\n  count++; // ¡El DOM se actualiza solo!\n}',
      topic3Interactive: 'Contador Interactivo',
      topic3Increment: '+1',
      topic3Decrement: '-1',
      topic3Reset: 'Reiniciar',
      topic4Title: '$derived — Valores Calculados',
      topic4Desc: 'El rune $derived crea valores que se actualizan automáticamente cuando sus dependencias cambian. Piensa en ellos como fórmulas en una hoja de cálculo.',
      topic4Code: 'let count = $state(0);\nlet double = $derived(count * 2);\nlet isEven = $derived(count % 2 === 0);',
      topic4Double: 'Doble',
      topic4IsEven: '¿Es par?',
      topic4Yes: 'Sí',
      topic4No: 'No',
      topic4Sign: 'Signo',
      topic5Title: '$props() — Props de Componentes',
      topic5Desc: 'El rune $props() permite que un componente reciba datos de su padre. Los props son la forma en que los componentes se comunican. El padre pasa datos, el hijo los usa.',
      topic5Code: '// Componente hijo (Greeting.svelte)\nlet { name } = $props();\n\n// Uso en el padre:\n<Greeting name="Mundo" />',
      topic5Interactive: '¡Pruébalo — cambia el nombre!',
      topic5Placeholder: 'Escribe un nombre...',
      topic6Title: 'Importar Componentes',
      topic6Desc: 'Los componentes se importan con la sintaxis estándar de módulos ES. Una vez importados, los usas como etiquetas HTML personalizadas en tu plantilla.',
      topic6Code: "// Importar\nimport Greeting from './Greeting.svelte';\n\n// Usar en la plantilla\n<Greeting name=\"Svelte\" />",
      topic6Result: 'Resultado renderizado:',
      demoTitle: 'Tu Primera Funcionalidad: El Contador',
      demoDesc: 'Este contador es la primera pieza del Gestor de Tareas. Haz clic, juega con él — ¡es TU creación!',
      demoScore: 'Puntaje',
      mistakesTitle: 'Errores Comunes',
      mistake1Title: 'Olvidar $state para variables reactivas',
      mistake1Bad: 'let count = 0;\n\nfunction incrementar() {\n  count++; // ¡El DOM no se actualiza!\n}',
      mistake1Good: 'let count = $state(0);\n\nfunction incrementar() {\n  count++; // ¡El DOM se actualiza! ✅\n}',
      mistake1Why: 'Sin $state, Svelte no sabe que debe rastrear los cambios. La variable se actualiza en memoria pero el DOM permanece igual.',
      mistake2Title: 'Usar $derived como una llamada a función',
      mistake2Bad: 'let double = $derived(count * 2);\ndouble = $derived(count * 4); // ¡Error!',
      mistake2Good: 'let double = $derived(count * 2);\nlet quad = $derived(count * 4); // Nueva variable',
      mistake2Why: 'Los valores $derived son de solo lectura. Se recalculan cuando las dependencias cambian. Para cambiar la lógica, crea una nueva variable $derived.',
      mistake3Title: 'Mutar arrays/objetos sin reasignar',
      mistake3Bad: 'let items = $state([1, 2, 3]);\nitems.push(4); // Puede no disparar actualización',
      mistake3Good: 'let items = $state([1, 2, 3]);\nitems = [...items, 4]; // Nuevo array ✅',
      mistake3Why: 'En Svelte 5 con $state, push() funciona bien. Pero reasignar con un nuevo array es el patrón más seguro y funciona en todas las versiones de Svelte.',
      mistake4Title: 'Poner $state/$derived fuera de \x3Cscript>',
      mistake4Bad: '\x3C!-- En la plantilla -->\n\x3Cp>let count = $state(0);\x3C/p>',
      mistake4Good: '\x3Cscript>\n  let count = $state(0);\n\x3C/script>\n\x3Cp>{count}\x3C/p>',
      mistake4Why: 'Los runes como $state y $derived solo funcionan dentro de bloques \x3Cscript>. En la plantilla, usa llaves { } para mostrar valores.',
      prevLesson: '← Lección 00: Repaso JS',
      nextLesson: 'Lección 02: Plantillas →'
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

  <!-- HERO COUNTER -->
  <section class="hero-counter-section">
    <div class="hero-counter">
      <div class="hero-counter-emoji">{heroEmoji}</div>
      <div class="hero-counter-display">
        <span class="hero-count-number">{heroCount}</span>
      </div>
      <div class="hero-counter-controls">
        <button class="btn btn-hero" onclick={heroDecrement}>−</button>
        <button class="btn btn-hero-reset" onclick={heroReset}>{t.topic3Reset}</button>
        <button class="btn btn-hero" onclick={heroIncrement}>+</button>
      </div>
      <p class="hero-counter-hint">{lang === 'en' ? 'Click the buttons above!' : '¡Haz clic en los botones de arriba!'}</p>
    </div>
  </section>

  <!-- TOPIC 1: What is Svelte? -->
  <section class="topic">
    <h2>1. {t.topic1Title}</h2>
    <p class="topic-desc">{t.topic1Desc}</p>

    <ul class="feature-list">
      <li>{t.topic1Bullet1}</li>
      <li>{t.topic1Bullet2}</li>
      <li>{t.topic1Bullet3}</li>
      <li>{t.topic1Bullet4}</li>
    </ul>

    <div class="comparison-grid">
      <div class="compare-card">
        <div class="compare-label">{lang === 'en' ? 'Other Frameworks' : 'Otros Frameworks'}</div>
        <pre class="code-block"><code>// React
const [count, setCount] = useState(0);
setCount(prev => prev + 1);

// Vue
const count = ref(0);
count.value++;</code></pre>
      </div>
      <div class="compare-card compare-highlight">
        <div class="compare-label">Svelte 5</div>
        <pre class="code-block"><code>let count = $state(0);
count++; // That's it! 🎉</code></pre>
      </div>
    </div>
  </section>

  <!-- TOPIC 2: .svelte File Structure -->
  <section class="topic">
    <h2>2. {t.topic2Title}</h2>
    <p class="topic-desc">{t.topic2Desc}</p>

    <div class="file-tab-box">
      <div class="file-tab">{t.topic2FileLabel}</div>
      <pre class="code-block file-code"><code>{fileStructureCode}</code></pre>
    </div>

    <div class="structure-legend">
      <div class="legend-item">
        <span class="legend-color" style="background: #89b4fa;"></span>
        <span>&lt;script&gt;</span>
        <span class="legend-desc">{lang === 'en' ? 'Logic, state, functions' : 'Lógica, estado, funciones'}</span>
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background: #a6e3a1;"></span>
        <span>{lang === 'en' ? 'Template' : 'Plantilla'}</span>
        <span class="legend-desc">{lang === 'en' ? 'HTML with expressions' : 'HTML con expresiones'}</span>
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background: #f9e2af;"></span>
        <span>&lt;style&gt;</span>
        <span class="legend-desc">{lang === 'en' ? 'Scoped CSS' : 'CSS scoped'}</span>
      </div>
    </div>
  </section>

  <!-- TOPIC 3: $state -->
  <section class="topic">
    <h2>3. {t.topic3Title}</h2>
    <p class="topic-desc">{t.topic3Desc}</p>

    <pre class="code-block"><code>{t.topic3Code}</code></pre>

    <div class="interactive-area">
      <div class="interactive-label">{t.topic3Interactive}</div>
      <div class="counter-demo">
        <div class="counter-display">
          <span class="counter-number">{count}</span>
        </div>
        <div class="counter-controls">
          <button class="btn btn-primary" onclick={decrement}>{t.topic3Decrement}</button>
          <button class="btn btn-secondary" onclick={reset}>{t.topic3Reset}</button>
          <button class="btn btn-primary" onclick={increment}>{t.topic3Increment}</button>
        </div>
      </div>
    </div>
  </section>

  <!-- TOPIC 4: $derived -->
  <section class="topic">
    <h2>4. {t.topic4Title}</h2>
    <p class="topic-desc">{t.topic4Desc}</p>

    <pre class="code-block"><code>{t.topic4Code}</code></pre>

    <div class="interactive-area">
      <div class="interactive-label">{lang === 'en' ? 'Live Derived Values' : 'Valores Derivados en Vivo'}</div>
      <div class="counter-demo">
        <div class="counter-display">
          <span class="counter-number">{count}</span>
        </div>
        <div class="counter-controls">
          <button class="btn btn-primary" onclick={decrement}>{t.topic3Decrement}</button>
          <button class="btn btn-secondary" onclick={reset}>{t.topic3Reset}</button>
          <button class="btn btn-primary" onclick={increment}>{t.topic3Increment}</button>
        </div>
      </div>
      <div class="derived-grid">
        <div class="derived-card">
          <span class="derived-label">{t.topic4Double}</span>
          <span class="derived-value">{double}</span>
        </div>
        <div class="derived-card">
          <span class="derived-label">{t.topic4IsEven}</span>
          <span class="derived-value" class:even={isEven} class:odd={!isEven}>
            {isEven ? t.topic4Yes : t.topic4No}
          </span>
        </div>
        <div class="derived-card">
          <span class="derived-label">{t.topic4Sign}</span>
          <span class="derived-value">{countLabel}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- TOPIC 5: $props() -->
  <section class="topic">
    <h2>5. {t.topic5Title}</h2>
    <p class="topic-desc">{t.topic5Desc}</p>

    <pre class="code-block"><code>{t.topic5Code}</code></pre>

    <div class="interactive-area">
      <div class="interactive-label">{t.topic5Interactive}</div>
      <input
        type="text"
        bind:value={greetingName}
        placeholder={t.topic5Placeholder}
        class="input"
      />
      <div class="greeting-preview">
        <div class="greeting-bubble">
          <span class="greeting-text">{greetingMessage}</span>
        </div>
        <div class="greeting-code-hint">
          <code>&lt;Greeting name="{greetingName}" /&gt;</code>
        </div>
      </div>
    </div>
  </section>

  <!-- TOPIC 6: Component Imports -->
  <section class="topic">
    <h2>6. {t.topic6Title}</h2>
    <p class="topic-desc">{t.topic6Desc}</p>

    <pre class="code-block"><code>{t.topic6Code}</code></pre>

    <div class="interactive-area">
      <div class="component-flow">
        <div class="flow-step">
          <div class="flow-number">1</div>
          <div class="flow-content">
            <span class="flow-title">{lang === 'en' ? 'Import' : 'Importar'}</span>
            <code>import Greeting from './Greeting.svelte'</code>
          </div>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <div class="flow-number">2</div>
          <div class="flow-content">
            <span class="flow-title">{lang === 'en' ? 'Use' : 'Usar'}</span>
            <code>&lt;Greeting name="Svelte" /&gt;</code>
          </div>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <div class="flow-number">3</div>
          <div class="flow-content">
            <span class="flow-title">{t.topic6Result}</span>
            <div class="flow-result">Hello, Svelte!</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FULL DEMO -->
  <section class="topic demo-section">
    <h2>{t.demoTitle}</h2>
    <p class="topic-desc">{t.demoDesc}</p>

    <div class="demo-box">
      <div class="demo-header">
        <span class="demo-badge">🛠️ Task Manager v0.1</span>
        <span class="demo-score-label">{t.demoScore}:</span>
        <span class="demo-score-value">{heroCount}</span>
      </div>

      <div class="demo-counter-big">
        <div class="demo-count-ring" style="--progress: {(heroCount % 11) * 9.09}%">
          <span class="demo-count-number">{heroCount}</span>
        </div>
      </div>

      <div class="demo-controls">
        <button class="btn btn-primary btn-lg" onclick={heroDecrement}>
          <span class="btn-icon">−</span> {t.topic3Decrement}
        </button>
        <button class="btn btn-secondary btn-lg" onclick={heroReset}>
          {t.topic3Reset}
        </button>
        <button class="btn btn-primary btn-lg" onclick={heroIncrement}>
          <span class="btn-icon">+</span> {t.topic3Increment}
        </button>
      </div>

      <div class="demo-stats">
        <div class="stat-item">
          <span class="stat-label">{t.topic4Double}</span>
          <span class="stat-value">{heroCount * 2}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">{t.topic4IsEven}</span>
          <span class="stat-value" class:even={heroCount % 2 === 0} class:odd={heroCount % 2 !== 0}>
            {heroCount % 2 === 0 ? t.topic4Yes : t.topic4No}
          </span>
        </div>
        <div class="stat-item">
          <span class="stat-label">{t.topic4Sign}</span>
          <span class="stat-value">
            {heroCount === 0
              ? (lang === 'en' ? 'Zero' : 'Cero')
              : heroCount > 0
                ? (lang === 'en' ? 'Positive' : 'Positivo')
                : (lang === 'en' ? 'Negative' : 'Negativo')}
          </span>
        </div>
      </div>

      <div class="demo-svelte4-note">
        <span class="svelte4-badge">{ui.svelte4note}</span>
        <p>{lang === 'en'
          ? 'In Svelte 4, you used let count = 0 (without $state). The compiler figured out reactivity. In Svelte 5, runes like $state make it explicit.'
          : 'En Svelte 4, usabas let count = 0 (sin $state). El compilador deducía la reactividad. En Svelte 5, los runes como $state lo hacen explícito.'}</p>
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
    <h2>✏️ {lang === 'en' ? 'Exercise' : 'Ejercicio'}: {lang === 'en' ? 'Shopping Cart Counter' : 'Contador de Carrito de Compras'}</h2>
    <div class="exercise-task">
      <p>{lang === 'en' ? 'Build a shopping cart counter component that:' : 'Construye un componente de contador de carrito de compras que:'}</p>
      <ul>
        <li>{lang === 'en' ? 'Uses $state for the item count (starts at 0)' : 'Usa $state para el conteo de items (empieza en 0)'}</li>
        <li>{lang === 'en' ? 'Uses $derived to calculate the total price (each item costs $9.99)' : 'Usa $derived para calcular el precio total (cada item cuesta $9.99)'}</li>
        <li>{lang === 'en' ? 'Uses $derived for a message: "Cart is empty" when 0, "X items - $XX.XX" otherwise' : 'Usa $derived para un mensaje: "Carrito vacío" cuando es 0, "X items - $XX.XX" en otro caso'}</li>
        <li>{lang === 'en' ? 'Has Add (+1) and Remove (-1, minimum 0) buttons' : 'Tiene botones Add (+1) y Remove (-1, mínimo 0)'}</li>
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
    <a href="/00-js-refresher" class="nav-link">{t.prevLesson}</a>
    <a href="/02-templating" class="nav-link">{t.nextLesson}</a>
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

  /* Hero Counter */
  .hero-counter-section {
    margin-bottom: 3rem;
  }

  .hero-counter {
    background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
    border-radius: 20px;
    padding: 2.5rem;
    text-align: center;
    border: 2px solid rgba(255, 62, 0, 0.3);
  }

  .hero-counter-emoji {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    transition: transform 0.2s;
  }

  .hero-counter-display {
    margin-bottom: 1.5rem;
  }

  .hero-count-number {
    font-size: 5rem;
    font-weight: 700;
    color: #ff3e00;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  .hero-counter-controls {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .btn-hero {
    background: var(--primary);
    color: white;
    min-width: 60px;
    height: 60px;
    font-size: 1.5rem;
    font-weight: 700;
    border-radius: 16px;
    border: none;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-hero:hover {
    background: var(--primary-light);
    transform: scale(1.05);
  }

  .btn-hero:active {
    transform: scale(0.95);
  }

  .btn-hero-reset {
    background: rgba(255, 255, 255, 0.1);
    color: #cdd6f4;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0 20px;
    height: 60px;
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-hero-reset:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .hero-counter-hint {
    color: rgba(205, 214, 244, 0.5);
    font-size: 0.85rem;
  }

  /* Topics */
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

  .feature-list {
    list-style: none;
    padding: 0;
    margin-bottom: 1.25rem;
  }

  .feature-list li {
    padding: 0.5rem 0 0.5rem 1.5rem;
    position: relative;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .feature-list li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--success);
    font-weight: 700;
  }

  .comparison-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .compare-card {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border);
  }

  .compare-highlight {
    border: 2px solid var(--primary);
    box-shadow: 0 0 0 1px var(--primary);
  }

  .compare-label {
    background: var(--surface);
    padding: 6px 14px;
    font-size: 0.8rem;
    font-weight: 600;
    border-bottom: 1px solid var(--border);
  }

  .compare-highlight .compare-label {
    background: var(--primary);
    color: white;
    border-bottom-color: var(--primary);
  }

  .compare-card .code-block {
    margin: 0;
    border-radius: 0;
    font-size: 0.8rem;
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

  /* File tab box */
  .file-tab-box {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border);
    margin-bottom: 1.25rem;
  }

  .file-tab {
    background: var(--surface);
    padding: 8px 16px;
    font-size: 0.8rem;
    font-weight: 600;
    border-bottom: 1px solid var(--border);
    color: var(--primary);
  }

  .file-code {
    margin: 0;
    border-radius: 0;
  }

  .structure-legend {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .legend-color {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .legend-desc {
    color: var(--text-muted);
    font-size: 0.8rem;
  }

  /* Interactive area */
  .interactive-area {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.25rem;
  }

  .interactive-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .counter-demo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .counter-display {
    background: var(--bg);
    border: 2px solid var(--border);
    border-radius: 16px;
    padding: 1rem 2rem;
    min-width: 100px;
    text-align: center;
  }

  .counter-number {
    font-size: 3rem;
    font-weight: 700;
    color: var(--primary);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  .counter-controls {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
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

  .btn-secondary {
    background: var(--surface-hover);
    color: var(--text);
  }

  .btn-secondary:hover {
    background: var(--border);
  }

  .btn-lg {
    padding: 12px 24px;
    font-size: 1rem;
    border-radius: 12px;
  }

  .btn-icon {
    font-weight: 700;
    font-size: 1.1rem;
  }

  /* Derived grid */
  .derived-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin-top: 1.25rem;
  }

  .derived-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
  }

  .derived-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }

  .derived-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }

  .derived-value.even {
    color: var(--success);
  }

  .derived-value.odd {
    color: var(--primary);
  }

  /* Greeting */
  .input {
    width: 100%;
    padding: 10px 14px;
    border: 2px solid var(--border);
    border-radius: 8px;
    font-size: 0.95rem;
    font-family: inherit;
    transition: border-color 0.15s;
    background: var(--bg);
    color: var(--text);
    margin-bottom: 1rem;
  }

  .input:focus {
    outline: none;
    border-color: var(--primary);
  }

  .greeting-preview {
    text-align: center;
  }

  .greeting-bubble {
    display: inline-block;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    color: white;
    padding: 1rem 2rem;
    border-radius: 20px 20px 20px 4px;
    margin-bottom: 0.75rem;
  }

  .greeting-text {
    font-size: 1.3rem;
    font-weight: 600;
  }

  .greeting-code-hint {
    color: var(--text-muted);
    font-size: 0.85rem;
  }

  /* Component flow */
  .component-flow {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .flow-step {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem;
    flex: 1;
    min-width: 160px;
    text-align: center;
  }

  .flow-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: var(--primary);
    color: white;
    border-radius: 50%;
    font-size: 0.8rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .flow-title {
    display: block;
    font-weight: 600;
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
  }

  .flow-content code {
    font-size: 0.75rem;
    display: block;
    color: var(--text-muted);
    background: var(--surface);
    padding: 4px 8px;
    border-radius: 4px;
    word-break: break-all;
  }

  .flow-arrow {
    font-size: 1.5rem;
    color: var(--text-muted);
    font-weight: 700;
  }

  .flow-result {
    font-size: 1rem;
    font-weight: 600;
    color: var(--success);
    margin-top: 0.25rem;
  }

  /* Demo section */
  .demo-section {
    border-top: 3px solid var(--primary);
    padding-top: 2rem;
  }

  .demo-box {
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: 14px;
    padding: 2rem;
    text-align: center;
  }

  .demo-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .demo-badge {
    background: var(--primary);
    color: white;
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .demo-score-label {
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  .demo-score-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
    font-variant-numeric: tabular-nums;
  }

  .demo-counter-big {
    margin-bottom: 1.5rem;
  }

  .demo-count-ring {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: conic-gradient(
      var(--primary) var(--progress, 0%),
      var(--surface-hover) var(--progress, 0%) 100%
    );
    position: relative;
  }

  .demo-count-ring::before {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: 50%;
    background: var(--surface);
  }

  .demo-count-number {
    position: relative;
    z-index: 1;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary);
    font-variant-numeric: tabular-nums;
  }

  .demo-controls {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .demo-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .stat-item {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.75rem;
  }

  .stat-label {
    display: block;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
  }

  .stat-value {
    font-size: 1.2rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .stat-value.even {
    color: var(--success);
  }

  .stat-value.odd {
    color: var(--primary);
  }

  .demo-svelte4-note {
    background: var(--bg);
    border: 1px solid var(--border);
    border-left: 4px solid var(--warning);
    border-radius: 8px;
    padding: 1rem;
    text-align: left;
  }

  .svelte4-badge {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--warning);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .demo-svelte4-note p {
    margin-top: 0.25rem;
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  /* Mistakes */
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

  /* Navigation */
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
    .comparison-grid,
    .code-compare,
    .derived-grid,
    .demo-stats {
      grid-template-columns: 1fr;
    }

    .lesson-header h1 {
      font-size: 1.6rem;
    }

    .hero-count-number {
      font-size: 3.5rem;
    }

    .component-flow {
      flex-direction: column;
    }

    .flow-arrow {
      transform: rotate(90deg);
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
