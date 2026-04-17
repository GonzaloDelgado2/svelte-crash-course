<script lang="ts">
  import LessonLayout from '$lib/components/LessonLayout.svelte';
  import CodeExample from '$lib/components/CodeExample.svelte';
  import { getLang } from '$lib/i18n/language.svelte.js';

  let lang = $derived(getLang());

  let showSolution = $state(false);
  const exerciseSolution = `const processScores = ({ scores }: { scores: number[] }): number => {
  const filtered = scores.filter(s => s >= 0);
  const doubled = filtered.map(s => s * 2);
  return doubled.reduce((sum, n) => sum + n, 0);
};

// Or as a one-liner using destructured params:
const processScores2 = ({ scores }: { scores: number[] }): number =>
  scores
    .filter(s => s >= 0)
    .map(s => s * 2)
    .reduce((sum, n) => sum + n, 0);

// Test it:
console.log(processScores({ scores: [3, -1, 4, -2, 5] })); // 24`;

  let jsInput = $state('const name = "Svelte";\nconsole.log(name);');
  let jsOutput = $state('');
  let typeInput = $state('let age: number = 25;');
  let typeResult = $state('');
  let promiseStatus = $state('idle');
  let promiseResult = $state('');
  let arrowInput1 = $state(3);
  let arrowInput2 = $state(7);
  let arrowResult = $derived(arrowInput1 + arrowInput2);
  let destructName = $state('Svelte');
  let destructVersion = $state('5');
  let destructObj = $derived({ name: destructName, version: destructVersion, framework: 'SvelteKit', compiler: true });
  let destructNameOut = $derived(destructObj.name);
  let destructVersionOut = $derived(destructObj.version);
  let destructFrameworkOut = $derived(destructObj.framework);

  function runJs() {
    try {
      const logs: string[] = [];
      const fakeConsole = { log: (...args: unknown[]) => logs.push(args.map(String).join(' ')) };
      const fn = new Function('console', jsInput);
      fn(fakeConsole);
      jsOutput = logs.join('\n') || (lang === 'en' ? 'No output' : 'Sin salida');
    } catch (e) {
      jsOutput = `Error: ${(e as Error).message}`;
    }
  }

  function checkType() {
    const t = typeInput.trim();
    if (t.includes(': string') || t.includes(": string")) typeResult = lang === 'en' ? 'string — a text value' : 'string — un valor de texto';
    else if (t.includes(': number') || t.includes(": number")) typeResult = lang === 'en' ? 'number — a numeric value' : 'number — un valor numérico';
    else if (t.includes(': boolean') || t.includes(": boolean")) typeResult = lang === 'en' ? 'boolean — true or false' : 'boolean — verdadero o falso';
    else if (t.includes(': string[]') || t.includes(": string[]")) typeResult = lang === 'en' ? 'string[] — an array of strings' : 'string[] — un arreglo de strings';
    else if (t.includes(': {') || t.includes(": {")) typeResult = lang === 'en' ? 'object — a structured type' : 'object — un tipo estructurado';
    else typeResult = lang === 'en' ? 'No type annotation found — try adding : string, : number, etc.' : 'Sin anotación de tipo — intenta agregar : string, : number, etc.';
  }

  async function runPromise() {
    promiseStatus = 'pending';
    promiseResult = '';
    await new Promise(r => setTimeout(r, 1500));
    promiseResult = lang === 'en' ? 'Data loaded successfully! (simulated API response)' : '¡Datos cargados! (respuesta de API simulada)';
    promiseStatus = 'resolved';
  }

  function resetPromise() {
    promiseStatus = 'idle';
    promiseResult = '';
  }

  const text = {
    en: {
      title: 'JavaScript & TypeScript Refresher',
      appFeature: 'Standalone Exercises',
      topic1Title: 'Variables: let and const',
      topic1Desc: 'Modern JavaScript uses let and const instead of var. let is for variables that change, const is for values that stay the same.',
      topic1Code: `// var — old way (avoid!)
var oldWay = "don't use this";

// let — reassignable
let score = 0;
score = 10; // OK!

// const — cannot reassign
const APP_NAME = "Task Manager";
// APP_NAME = "Other"; // Error!`,
      topic2Title: 'Arrow Functions',
      topic2Desc: 'Arrow functions (=>) are a shorter way to write functions. They also preserve the this context, which matters in callbacks.',
      topic2Code: `// Regular function
function add(a, b) {
  return a + b;
}

// Arrow function — shorter!
const add = (a: number, b: number): number => a + b;

// With body
const greet = (name: string): string => {
  return \`Hello, \${name}!\`;
};`,
      topic2Interactive: 'Try arrow functions — live addition',
      topic3Title: 'Destructuring',
      topic3Desc: 'Destructuring lets you extract values from arrays and objects into variables in one step.',
      topic3Code: `// Object destructuring
const framework = { name: "Svelte", version: 5, compiler: true };
const { name, version } = framework;
// name = "Svelte", version = 5

// Array destructuring
const colors = ["red", "green", "blue"];
const [first, , third] = colors;
// first = "red", third = "blue"

// In function params
function greet({ name }: { name: string }) {
  return \`Hello \${name}\`;
}`,
      topic3Interactive: 'Live destructuring playground',
      topic3Label: 'Object to destructure:',
      topic4Title: 'Template Literals',
      topic4Desc: 'Template literals use backticks (\`) and allow embedded expressions with ${}. They also support multi-line strings.',
      topic4Code: `const name = "Svelte";
const version = 5;

// Template literal
const msg = \`\${name} version \${version} is awesome!\`;

// Multi-line
const html = \`
  <div>
    <h1>\${name}</h1>
  </div>
\`;`,
      topic5Title: 'Promises & Async/Await',
      topic5Desc: 'Promises handle asynchronous operations. async/await is syntactic sugar that makes Promises easier to read and write.',
      topic5Code: `// Promise
function fetchData(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Data loaded!"), 1000);
  });
}

// Using async/await
async function loadData() {
  const result = await fetchData();
  console.log(result); // "Data loaded!"
}

// Error handling
async function safeLoad() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.error("Failed:", error);
  }
}`,
      topic5Interactive: 'Simulate an async operation',
      topic5Idle: 'Not started',
      topic5Pending: 'Loading...',
      topic5Resolved: 'Completed!',
      topic5Button: 'Fetch Data',
      topic5Reset: 'Reset',
      topic6Title: 'TypeScript Types — The Basics',
      topic6Desc: 'TypeScript adds static types to JavaScript. This catches errors before you run the code. Here are the essential types you will see in this course.',
      topic6Code: `// Primitives
let name: string = "Svelte";
let version: number = 5;
let isAwesome: boolean = true;

// Arrays
let tasks: string[] = ["Learn Svelte", "Build app"];
let scores: number[] = [95, 87, 100];

// Interfaces — describe object shapes
interface Task {
  id: number;
  title: string;
  done: boolean;
}

// Using the interface
let task: Task = {
  id: 1,
  title: "Learn Svelte",
  done: false
};

// Type alias — alternative to interface
type Status = "pending" | "done" | "archived";`,
      topic6Interactive: 'Type explorer — write a typed variable',
      topic6Placeholder: 'e.g. let age: number = 25;',
      topic6Check: 'Check Type',
      playgroundTitle: 'JavaScript Playground',
      playgroundDesc: 'Write any JavaScript code and run it. Experiment with what you have learned!',
      playgroundPlaceholder: 'Write JavaScript here...',
      playgroundRun: 'Run',
      playgroundOutput: 'Output:',
      mistakesTitle: 'Common Mistakes',
      mistake1Title: 'Using var instead of let/const',
      mistake1Wrong: `var x = 10;
if (true) {
  var x = 20; // Same variable! Bug!
}
console.log(x); // 20 — unexpected`,
      mistake1Correct: `let x = 10;
if (true) {
  let x = 20; // Different scope — OK
}
console.log(x); // 10 — as expected`,
      mistake1Explain: 'var is function-scoped, not block-scoped. This causes bugs when you reuse variable names inside if/for blocks.',
      mistake2Title: 'Forgetting await with async functions',
      mistake2Wrong: `async function load() {
  const data = fetch("/api"); // Missing await!
  console.log(data); // Promise object, not data!
}`,
      mistake2Correct: `async function load() {
  const data = await fetch("/api");
  const json = await data.json();
  console.log(json); // Actual data!
}`,
      mistake2Explain: 'Without await, you get a Promise object instead of the resolved value. Always await async operations.',
      mistake3Title: 'Not handling Promise errors',
      mistake3Wrong: `const data = await fetch("/api");
// If the request fails, the whole app crashes!`,
      mistake3Correct: `try {
  const data = await fetch("/api");
  const json = await data.json();
} catch (error) {
  console.error("Request failed:", error);
  // Show user-friendly error message
}`,
      mistake3Explain: 'Network requests can fail. Always wrap await calls in try/catch to handle errors gracefully.',
      mistake4Title: 'Confusing let and const',
      mistake4Wrong: `let APP_NAME = "Task Manager";
let MAX_TASKS = 100;
// These should never change! Use const.`,
      mistake4Correct: `const APP_NAME = "Task Manager";
const MAX_TASKS = 100;
// Use let only for values that change:
let taskCount = 0;
taskCount++; // This is fine`,
      mistake4Explain: 'Use const by default. Only use let when you need to reassign. This prevents accidental mutations and signals intent.'
    },
    es: {
      title: 'Repaso de JavaScript & TypeScript',
      appFeature: 'Ejercicios Independientes',
      topic1Title: 'Variables: let y const',
      topic1Desc: 'JavaScript moderno usa let y const en lugar de var. let es para variables que cambian, const es para valores que permanecen iguales.',
      topic1Code: `// var — forma antigua (¡evítalo!)
var formaAntigua = "no uses esto";

// let — reasignable
let puntaje = 0;
puntaje = 10; // ¡OK!

// const — no se puede reasignar
const APP_NAME = "Task Manager";
// APP_NAME = "Otro"; // ¡Error!`,
      topic2Title: 'Funciones Flecha',
      topic2Desc: 'Las funciones flecha (=>) son una forma más corta de escribir funciones. También conservan el contexto this, lo cual importa en callbacks.',
      topic2Code: `// Función regular
function sumar(a, b) {
  return a + b;
}

// Función flecha — ¡más corta!
const sumar = (a: number, b: number): number => a + b;

// Con cuerpo
const saludar = (nombre: string): string => {
  return \`¡Hola, \${nombre}!\`;
};`,
      topic2Interactive: 'Prueba funciones flecha — suma en vivo',
      topic3Title: 'Desestructuración',
      topic3Desc: 'La desestructuración te permite extraer valores de arreglos y objetos en variables en un solo paso.',
      topic3Code: `// Desestructuración de objetos
const framework = { name: "Svelte", version: 5, compiler: true };
const { name, version } = framework;
// name = "Svelte", version = 5

// Desestructuración de arreglos
const colores = ["rojo", "verde", "azul"];
const [primero, , tercero] = colores;
// primero = "rojo", tercero = "azul"

// En parámetros de función
function saludar({ name }: { name: string }) {
  return \`Hola \${name}\`;
}`,
      topic3Interactive: 'Playground de desestructuración en vivo',
      topic3Label: 'Objeto a desestructurar:',
      topic4Title: 'Plantillas Literales',
      topic4Desc: 'Las plantillas literales usan comillas invertidas (\`) y permiten expresiones incrustadas con ${}. También soportan cadenas multilínea.',
      topic4Code: `const nombre = "Svelte";
const version = 5;

// Plantilla literal
const msg = \`\${nombre} versión \${version} es increíble!\`;

// Multilínea
const html = \`
  <div>
    <h1>\${nombre}</h1>
  </div>
\`;`,
      topic5Title: 'Promesas y Async/Await',
      topic5Desc: 'Las Promesas manejan operaciones asíncronas. async/await es azúcar sintáctica que hace las Promesas más fáciles de leer y escribir.',
      topic5Code: `// Promesa
function obtenerDatos(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve("¡Datos cargados!"), 1000);
  });
}

// Usando async/await
async function cargarDatos() {
  const resultado = await obtenerDatos();
  console.log(resultado); // "¡Datos cargados!"
}

// Manejo de errores
async function cargaSegura() {
  try {
    const datos = await obtenerDatos();
    return datos;
  } catch (error) {
    console.error("Falló:", error);
  }
}`,
      topic5Interactive: 'Simular una operación asíncrona',
      topic5Idle: 'No iniciado',
      topic5Pending: 'Cargando...',
      topic5Resolved: '¡Completado!',
      topic5Button: 'Obtener Datos',
      topic5Reset: 'Reiniciar',
      topic6Title: 'Tipos de TypeScript — Lo Básico',
      topic6Desc: 'TypeScript agrega tipos estáticos a JavaScript. Esto detecta errores antes de ejecutar el código. Aquí están los tipos esenciales que verás en este curso.',
      topic6Code: `// Primitivos
let nombre: string = "Svelte";
let version: number = 5;
let esGenial: boolean = true;

// Arreglos
let tareas: string[] = ["Aprender Svelte", "Construir app"];
let puntajes: number[] = [95, 87, 100];

// Interfaces — describen la forma de objetos
interface Tarea {
  id: number;
  titulo: string;
  hecho: boolean;
}

// Usando la interfaz
let tarea: Tarea = {
  id: 1,
  titulo: "Aprender Svelte",
  hecho: false
};

// Alias de tipo — alternativa a interface
type Estado = "pendiente" | "hecho" | "archivado";`,
      topic6Interactive: 'Explorador de tipos — escribe una variable tipada',
      topic6Placeholder: 'ej. let edad: number = 25;',
      topic6Check: 'Verificar Tipo',
      playgroundTitle: 'Playground de JavaScript',
      playgroundDesc: 'Escribe cualquier código JavaScript y ejecútalo. ¡Experimenta con lo que has aprendido!',
      playgroundPlaceholder: 'Escribe JavaScript aquí...',
      playgroundRun: 'Ejecutar',
      playgroundOutput: 'Salida:',
      mistakesTitle: 'Errores Comunes',
      mistake1Title: 'Usar var en lugar de let/const',
      mistake1Wrong: `var x = 10;
if (true) {
  var x = 20; // ¡Misma variable! ¡Bug!
}
console.log(x); // 20 — inesperado`,
      mistake1Correct: `let x = 10;
if (true) {
  let x = 20; // Diferente alcance — OK
}
console.log(x); // 10 — como se esperaba`,
      mistake1Explain: 'var tiene alcance de función, no de bloque. Esto causa bugs cuando reutilizas nombres de variables dentro de bloques if/for.',
      mistake2Title: 'Olvidar await con funciones async',
      mistake2Wrong: `async function cargar() {
  const datos = fetch("/api"); // ¡Falta await!
  console.log(datos); // Objeto Promise, ¡no datos!
}`,
      mistake2Correct: `async function cargar() {
  const datos = await fetch("/api");
  const json = await datos.json();
  console.log(json); // ¡Datos reales!
}`,
      mistake2Explain: 'Sin await, obtienes un objeto Promise en lugar del valor resuelto. Siempre usa await con operaciones asíncronas.',
      mistake3Title: 'No manejar errores de Promesas',
      mistake3Wrong: `const datos = await fetch("/api");
// Si la petición falla, ¡toda la app se rompe!`,
      mistake3Correct: `try {
  const datos = await fetch("/api");
  const json = await datos.json();
} catch (error) {
  console.error("La petición falló:", error);
  // Mostrar mensaje de error amigable
}`,
      mistake3Explain: 'Las peticiones de red pueden fallar. Siempre envuelve llamadas await en try/catch para manejar errores gracefully.',
      mistake4Title: 'Confundir let y const',
      mistake4Wrong: `let APP_NAME = "Task Manager";
let MAX_TASKS = 100;
// ¡Estos nunca deberían cambiar! Usa const.`,
      mistake4Correct: `const APP_NAME = "Task Manager";
const MAX_TASKS = 100;
// Usa let solo para valores que cambian:
let taskCount = 0;
taskCount++; // Esto está bien`,
      mistake4Explain: 'Usa const por defecto. Solo usa let cuando necesites reasignar. Esto previene mutaciones accidentales y señala la intención.'
    }
  };
</script>

<LessonLayout lessonNum="00" title={text[lang].title} appFeature={text[lang].appFeature}>
  {#snippet theory()}
    <div class="topics">
      <section class="topic">
        <h3>1. {text[lang].topic1Title}</h3>
        <p>{text[lang].topic1Desc}</p>
        <CodeExample code={text[lang].topic1Code} filename="variables.ts" />
      </section>

      <section class="topic">
        <h3>2. {text[lang].topic2Title}</h3>
        <p>{text[lang].topic2Desc}</p>
        <CodeExample code={text[lang].topic2Code} filename="arrows.ts" />
        <div class="interactive-box">
          <h4>{text[lang].topic2Interactive}</h4>
          <div class="arrow-demo">
            <div class="arrow-inputs">
              <label class="input-group">
                <span>a = </span>
                <input type="number" bind:value={arrowInput1} />
              </label>
              <span class="operator">+</span>
              <label class="input-group">
                <span>b = </span>
                <input type="number" bind:value={arrowInput2} />
              </label>
              <span class="operator">=</span>
              <span class="result">{arrowResult}</span>
            </div>
            <pre class="code-inline">const add = (a, b) =&gt; a + b;  // add({arrowInput1}, {arrowInput2}) = {arrowResult}</pre>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>3. {text[lang].topic3Title}</h3>
        <p>{text[lang].topic3Desc}</p>
        <CodeExample code={text[lang].topic3Code} filename="destructuring.ts" />
        <div class="interactive-box">
          <h4>{text[lang].topic3Interactive}</h4>
          <p class="label">{text[lang].topic3Label}</p>
          <div class="destruct-demo">
            <label class="input-row">
              <span>name:</span>
              <input type="text" bind:value={destructName} />
            </label>
            <label class="input-row">
              <span>version:</span>
              <input type="text" bind:value={destructVersion} />
            </label>
            <div class="destruct-output">
              <pre class="code-inline">const {'{'} name, version, framework {'}'} = obj;</pre>
              <div class="destruct-results">
                <span class="tag">name = <strong>{destructNameOut}</strong></span>
                <span class="tag">version = <strong>{destructVersionOut}</strong></span>
                <span class="tag">framework = <strong>{destructFrameworkOut}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>4. {text[lang].topic4Title}</h3>
        <p>{text[lang].topic4Desc}</p>
        <CodeExample code={text[lang].topic4Code} filename="template-literals.ts" />
      </section>

      <section class="topic">
        <h3>5. {text[lang].topic5Title}</h3>
        <p>{text[lang].topic5Desc}</p>
        <CodeExample code={text[lang].topic5Code} filename="async.ts" />
        <div class="interactive-box">
          <h4>{text[lang].topic5Interactive}</h4>
          <div class="promise-demo">
            <div class="promise-status" class:pending={promiseStatus === 'pending'} class:resolved={promiseStatus === 'resolved'}>
              {#if promiseStatus === 'idle'}
                <span class="status-dot idle"></span>
                {text[lang].topic5Idle}
              {:else if promiseStatus === 'pending'}
                <span class="status-dot pending"></span>
                {text[lang].topic5Pending}
              {:else}
                <span class="status-dot resolved"></span>
                {text[lang].topic5Resolved}
              {/if}
            </div>
            {#if promiseResult}
              <div class="promise-result">{promiseResult}</div>
            {/if}
            <div class="promise-actions">
              {#if promiseStatus !== 'pending'}
                <button class="btn primary" onclick={runPromise}>{text[lang].topic5Button}</button>
              {/if}
              {#if promiseStatus === 'resolved'}
                <button class="btn secondary" onclick={resetPromise}>{text[lang].topic5Reset}</button>
              {/if}
            </div>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>6. {text[lang].topic6Title}</h3>
        <p>{text[lang].topic6Desc}</p>
        <CodeExample code={text[lang].topic6Code} filename="types.ts" />
        <div class="interactive-box">
          <h4>{text[lang].topic6Interactive}</h4>
          <input type="text" placeholder={text[lang].topic6Placeholder} bind:value={typeInput} class="type-input" />
          <button class="btn primary" onclick={checkType}>{text[lang].topic6Check}</button>
          {#if typeResult}
            <div class="type-result">{typeResult}</div>
          {/if}
        </div>
      </section>
    </div>
  {/snippet}

  {#snippet example()}
    <div class="playground">
      <h3>{text[lang].playgroundTitle}</h3>
      <p>{text[lang].playgroundDesc}</p>
      <textarea bind:value={jsInput} rows="6" placeholder={text[lang].playgroundPlaceholder}></textarea>
      <button class="btn primary" onclick={runJs}>{text[lang].playgroundRun}</button>
      {#if jsOutput}
        <div class="output-box">
          <strong>{text[lang].playgroundOutput}</strong>
          <pre>{jsOutput}</pre>
        </div>
      {/if}
    </div>
  {/snippet}

  {#snippet challenge()}
    <div class="challenge-content">
      <p>{lang === 'en' ? 'Write a function that takes an array of numbers and returns only the even ones using arrow functions and array methods.' : 'Escribe una función que tome un arreglo de números y devuelva solo los pares usando funciones flecha y métodos de arreglo.'}</p>
      <CodeExample code={lang === 'en' ? '// Your solution:\nconst getEvenNumbers = (numbers: number[]): number[] => {\n  // TODO: filter even numbers\n  return numbers.filter(n => n % 2 === 0);\n};\n\n// Test it:\nconsole.log(getEvenNumbers([1, 2, 3, 4, 5, 6]));\n// Expected: [2, 4, 6]' : '// Tu solución:\nconst obtenerPares = (numeros: number[]): number[] => {\n  // TODO: filtrar números pares\n  return numeros.filter(n => n % 2 === 0);\n};\n\n// Pruébalo:\nconsole.log(obtenerPares([1, 2, 3, 4, 5, 6]));\n// Esperado: [2, 4, 6]'} filename="challenge.ts" />
    </div>
  {/snippet}

  <section class="exercise-section">
    <h2>✏️ {lang === 'en' ? 'Exercise' : 'Ejercicio'}: {lang === 'en' ? 'Array Transformation Pipeline' : 'Pipeline de Transformación de Arreglos'}</h2>
    <div class="exercise-task">
      <p>{lang === 'en' ? 'Write a function called processScores(scores: number[]) that:' : 'Escribe una función llamada processScores(scores: number[]) que:'}</p>
      <ul>
        <li>{lang === 'en' ? 'Filters out all negative numbers' : 'Filtra todos los números negativos'}</li>
        <li>{lang === 'en' ? 'Doubles each remaining number using .map()' : 'Duplica cada número restante usando .map()'}</li>
        <li>{lang === 'en' ? 'Returns the sum of all doubled numbers using .reduce()' : 'Retorna la suma de todos los números duplicados usando .reduce()'}</li>
        <li>{lang === 'en' ? 'Uses arrow function syntax and destructuring' : 'Usa sintaxis de funciones flecha y desestructuración'}</li>
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
  .arrow-demo {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .arrow-inputs {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .input-group {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .input-group > span {
    font-weight: 600;
    font-size: 0.95rem;
  }
  .input-group input {
    width: 70px;
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 1rem;
    text-align: center;
  }
  .operator {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--primary);
  }
  .result {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--success);
    min-width: 40px;
  }
  .code-inline {
    background: var(--code-bg);
    color: #cdd6f4;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.85rem;
    overflow-x: auto;
  }
  .destruct-demo {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .input-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .input-row > span {
    font-weight: 500;
    min-width: 70px;
  }
  .input-row input {
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.95rem;
  }
  .destruct-output {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .destruct-results {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .tag {
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
  }
  .tag strong {
    color: var(--primary);
  }
  .promise-demo {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  .promise-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    background: var(--bg);
    border: 2px solid var(--border);
  }
  .promise-status.pending {
    border-color: var(--warning);
  }
  .promise-status.resolved {
    border-color: var(--success);
  }
  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
  }
  .status-dot.idle {
    background: var(--text-muted);
  }
  .status-dot.pending {
    background: var(--warning);
    animation: pulse 1s infinite;
  }
  .status-dot.resolved {
    background: var(--success);
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  .promise-result {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #065f46;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-weight: 500;
  }
  .promise-actions {
    display: flex;
    gap: 0.75rem;
  }
  .btn {
    padding: 8px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
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
  .type-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }
  .type-result {
    margin-top: 0.75rem;
    padding: 0.75rem 1rem;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    color: #1e40af;
    font-weight: 500;
  }
  .playground {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .playground h3 {
    font-size: 1.2rem;
    color: var(--text);
  }
  .playground p {
    color: var(--text-muted);
    line-height: 1.6;
  }
  .playground textarea {
    width: 100%;
    padding: 1rem;
    background: var(--code-bg);
    color: #cdd6f4;
    border: 1px solid var(--border);
    border-radius: 12px;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    resize: vertical;
  }
  .playground textarea:focus {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
  .output-box {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem;
    margin-top: 0.5rem;
  }
  .output-box strong {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-muted);
    font-size: 0.85rem;
  }
  .output-box pre {
    margin: 0;
    white-space: pre-wrap;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.85rem;
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
  .wrong, .correct {
    border-radius: 8px;
    overflow: hidden;
  }
  .wrong pre, .correct pre {
    margin: 0;
    background: var(--code-bg);
    padding: 0.75rem 1rem;
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
    .code-compare {
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
