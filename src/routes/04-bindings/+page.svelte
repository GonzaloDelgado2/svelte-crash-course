<script lang="ts">
  import LessonLayout from '$lib/components/LessonLayout.svelte';
  import CodeExample from '$lib/components/CodeExample.svelte';
  import { getLang } from '$lib/i18n/language.svelte.js';

  let lang = $derived(getLang());

  let liveText = $state('');

  let checkTasks = $state<{ id: number; title: string; done: boolean }[]>([
    { id: 1, title: lang === 'en' ? 'Learn Svelte bindings' : 'Aprender bindings Svelte', done: false },
    { id: 2, title: lang === 'en' ? 'Practice with forms' : 'Practicar con formularios', done: false },
    { id: 3, title: lang === 'en' ? 'Build task form' : 'Construir formulario de tareas', done: true }
  ]);
  let completedCount = $derived(checkTasks.filter(t => t.done).length);

  let selectedPriority = $state('medium');
  let selectedCategories = $state<string[]>([]);

  let refInput: HTMLInputElement | undefined = $state();

  function focusInput() {
    refInput?.focus();
  }

  let formTitle = $state('');
  let formDesc = $state('');
  let formPriority = $state('medium');
  let formCategories = $state<string[]>([]);
  let taskList = $state<{ id: number; title: string; description: string; priority: string; categories: string[] }[]>([]);
  let nextId = $state(1);

  function addFormTask() {
    const title = formTitle.trim();
    if (!title) return;
    taskList.push({
      id: nextId++,
      title,
      description: formDesc.trim(),
      priority: formPriority,
      categories: [...formCategories]
    });
    formTitle = '';
    formDesc = '';
    formPriority = 'medium';
    formCategories = [];
  }

  function removeFormTask(id: number) {
    taskList = taskList.filter(t => t.id !== id);
  }

  let challengeTitle = $state('');
  let challengeDesc = $state('');
  let challengePriority = $state('');
  let challengeErrors = $derived({
    title: challengeTitle.length > 0 && challengeTitle.length < 3,
    priority: challengePriority === '',
    desc: challengeDesc.length > 200
  });
  let challengeValid = $derived(
    challengeTitle.length >= 3 && challengePriority !== '' && challengeDesc.length <= 200
  );
  let challengeSubmitted = $state(false);

  let showSolution = $state(false);
  const solutionCode = `\x3Cscript lang="ts">
  let name = $state('');
  let email = $state('');
  let bio = $state('');
  let subscribed = $state(false);

  function reset() {
    name = ''; email = ''; bio = ''; subscribed = false;
  }
\x3C/script>

<input type="text" bind:value={name} placeholder="Name" />
<input type="email" bind:value={email} placeholder="Email" />
<textarea bind:value={bio} placeholder="Bio"></textarea>
<label><input type="checkbox" bind:checked={subscribed} /> Subscribe</label>
<button onclick={reset}>Reset</button>

<h3>Preview:</h3>
<p>Name: {name || '(empty)'}</p>
<p>Email: {email || '(empty)'}</p>
<p>Bio: {bio || '(empty)'}</p>
<p>Subscribed: {subscribed ? 'Yes' : 'No'}</p>`;

  function submitChallenge() {
    if (!challengeValid) return;
    challengeSubmitted = true;
  }

  function resetChallenge() {
    challengeSubmitted = false;
    challengeTitle = '';
    challengeDesc = '';
    challengePriority = '';
  }

  function catLabel(c: string): string {
    const t = text[lang];
    if (c === 'work') return t.catWork;
    if (c === 'personal') return t.catPersonal;
    return t.catUrgent;
  }

  const text = {
    en: {
      title: 'Bindings',
      appFeature: 'Task Input Form',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      catWork: 'Work',
      catPersonal: 'Personal',
      catUrgent: 'Urgent',
      topic1Title: 'bind:value — Two-way Data Binding',
      topic1Desc: 'bind:value creates a two-way binding between an input element and a variable. When the user types, the variable updates automatically. When you change the variable programmatically, the input reflects it. Works with <input>, <textarea>, and <select>.',
      topic1Code: `\x3Cscript lang="ts">
  let name = $state('');
  let bio = $state('');
\x3C/script>

<input type="text" bind:value={name} />
<p>Hello, {name}!</p>

<textarea bind:value={bio}></textarea>
<p>Characters: {bio.length}</p>`,
      topic1Interactive: 'Live Text Binding',
      topic1Placeholder: 'Type something...',
      topic1Mirror: 'Live mirror:',
      topic1CharCount: 'characters',
      topic2Title: 'bind:checked — Checkbox Binding',
      topic2Desc: 'bind:checked binds a boolean to a checkbox. Perfect for toggles, task completion, and agreement checkboxes. The binding is two-way: clicking updates the variable, and changing the variable updates the checkbox.',
      topic2Code: `\x3Cscript lang="ts">
  let agreed = $state(false);
  let tasks = $state([
    { id: 1, title: "Task 1", done: false }
  ]);
\x3C/script>

<input type="checkbox" bind:checked={agreed} />
<button disabled={!agreed}>Submit</button>

{#each tasks as task (task.id)}
  <input type="checkbox" bind:checked={task.done} />
  <span>{task.title}</span>
{/each}`,
      topic2Interactive: 'Task Completion Toggle',
      topic2Completed: 'completed',
      topic3Title: 'bind:group — Radio & Checkbox Groups',
      topic3Desc: 'bind:group binds multiple inputs to a single variable. For radio buttons, the variable holds the selected value. For checkboxes, it holds an array of all selected values. This eliminates manual event handlers entirely.',
      topic3Code: `\x3Cscript lang="ts">
  let priority = $state('medium');
  let categories = $state<string[]>([]);
\x3C/script>

<!-- Radio: single value -->
<input type="radio" name="priority" value="low"
  bind:group={priority} /> Low
<input type="radio" name="priority" value="medium"
  bind:group={priority} /> Medium
<input type="radio" name="priority" value="high"
  bind:group={priority} /> High

<p>Selected: {priority}</p>

<!-- Checkbox group: array -->
<input type="checkbox" value="work"
  bind:group={categories} /> Work
<input type="checkbox" value="personal"
  bind:group={categories} /> Personal
<input type="checkbox" value="urgent"
  bind:group={categories} /> Urgent

<p>Categories: {categories.join(', ')}</p>`,
      topic3Interactive: 'Priority & Category Selector',
      topic3Priority: 'Priority',
      topic3Categories: 'Categories',
      topic3Selected: 'Selected priority:',
      topic3SelectedCats: 'Selected categories:',
      topic3None: '(none)',
      topic4Title: 'bind:this — DOM Element Reference',
      topic4Desc: 'bind:this gives you a direct reference to a DOM element. Use it to call imperative methods like focus(), scrollIntoView(), or play(). The variable is undefined until the element mounts.',
      topic4Code: `\x3Cscript lang="ts">
  let inputEl: HTMLInputElement | undefined = $state();

  function focusInput() {
    inputEl?.focus();
  }
\x3C/script>

<input bind:this={inputEl} type="text" />
<button onclick={focusInput}>Focus the input</button>`,
      topic4Interactive: 'Focus Input Demo',
      topic4Placeholder: 'Click the button to focus me...',
      topic4Focus: 'Focus Input',
      topic4Hint: 'The button programmatically focuses the input using bind:this',
      demoTitle: 'Full Demo: Task Input Form',
      demoDesc: 'A complete task creation form using bind:value, bind:group, and bind:checked. Fill in the details and add tasks to the list.',
      demoTitleLabel: 'Title',
      demoTitlePlaceholder: 'Task title...',
      demoDescLabel: 'Description',
      demoDescPlaceholder: 'Task description...',
      demoPriorityLabel: 'Priority',
      demoCategoriesLabel: 'Categories',
      demoAdd: 'Add Task',
      demoEmpty: 'No tasks yet. Fill the form and add one!',
      demoNoCategories: 'No categories',
      mistakesTitle: 'Common Mistakes',
      mistake1Title: 'Using oninput instead of bind:value',
      mistake1Wrong: `<input type="text"
  oninput={(e) => name = e.currentTarget.value} />
<p>{name}</p>`,
      mistake1Correct: `<input type="text" bind:value={name} />
<p>{name}</p>`,
      mistake1Explain: 'bind:value is cleaner and handles edge cases that oninput misses. It also sets the initial value from the variable — true two-way binding.',
      mistake2Title: 'Not using bind:group for radio buttons',
      mistake2Wrong: `\x3Cscript lang="ts">
  let color = $state('red');
\x3C/script>
<input type="radio" name="color" value="red"
  checked={color === 'red'}
  onchange={() => color = 'red'} /> Red
<input type="radio" name="color" value="blue"
  checked={color === 'blue'}
  onchange={() => color = 'blue'} /> Blue`,
      mistake2Correct: `\x3Cscript lang="ts">
  let color = $state('red');
\x3C/script>
<input type="radio" name="color" value="red"
  bind:group={color} /> Red
<input type="radio" name="color" value="blue"
  bind:group={color} /> Blue`,
      mistake2Explain: 'bind:group replaces manual checked/onchange handlers for radio buttons and checkbox groups. Less code, fewer bugs, automatic synchronization.',
      mistake3Title: 'Using bind:this before the element exists',
      mistake3Wrong: `\x3Cscript lang="ts">
  let el: HTMLInputElement | undefined = $state();
  // Component just created, el is undefined!
  el.focus(); // Error!
\x3C/script>
<input bind:this={el} />`,
      mistake3Correct: `\x3Cscript lang="ts">
  let el: HTMLInputElement | undefined = $state();

  function doFocus() {
    el?.focus(); // Safe: called after mount
  }
\x3C/script>
<input bind:this={el} />
<button onclick={doFocus}>Focus</button>`,
      mistake3Explain: 'bind:this is undefined until the element mounts. Only use the reference inside event handlers or $effect (which runs after DOM updates).',
      mistake4Title: 'Binding to a $derived value',
      mistake4Wrong: `let firstName = $state('');
let lastName = $state('');
let fullName = $derived(firstName + ' ' + lastName);

<input bind:value={fullName} />`,
      mistake4Correct: `let firstName = $state('');
let lastName = $state('');

<input bind:value={firstName} />
<input bind:value={lastName} />`,
      mistake4Explain: 'bind:value requires a writable $state variable, not a read-only $derived. Bind to the source variables and derive the computed value separately.',
      challengeDesc: 'Add validation to the task form. Requirements: title must be at least 3 characters, priority must be selected, description max 200 characters.',
      challengeCode: `\x3Cscript lang="ts">
  let title = $state('');
  let priority = $state('');
  let desc = $state('');

  let errors = $derived({
    title: title.length > 0 && title.length < 3,
    priority: priority === '',
    desc: desc.length > 200
  });

  let isValid = $derived(
    title.length >= 3 &&
    priority !== '' &&
    desc.length <= 200
  );
\x3C/script>

{#if errors.title}
  <p class="error">Title must be at least 3 chars</p>
{/if}
<button disabled={!isValid}>Submit</button>`,
      challengePlaceholder: 'Task title (min 3 chars)...',
      challengeDescPlaceholder: 'Description (max 200 chars)...',
      challengePriorityLabel: 'Priority',
      challengeErrorTitleShort: 'Title must be at least 3 characters',
      challengeErrorPriority: 'Priority is required',
      challengeErrorDescLong: 'Description must be 200 characters or less',
      challengeCharsRemaining: 'characters remaining',
      challengeCharsOver: 'characters over limit',
      challengeSubmit: 'Submit',
      challengeReset: 'Reset',
      challengeFormValid: 'Form submitted successfully!',
      challengeFormInvalid: 'Fix the errors above to submit.'
    },
    es: {
      title: 'Bindings',
      appFeature: 'Formulario de Entrada de Tareas',
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      catWork: 'Trabajo',
      catPersonal: 'Personal',
      catUrgent: 'Urgente',
      topic1Title: 'bind:value — Enlace de Datos Bidireccional',
      topic1Desc: 'bind:value crea un enlace bidireccional entre un elemento de entrada y una variable. Cuando el usuario escribe, la variable se actualiza automáticamente. Cuando cambias la variable programáticamente, la entrada se refleja. Funciona con <input>, <textarea> y <select>.',
      topic1Code: `\x3Cscript lang="ts">
  let nombre = $state('');
  let bio = $state('');
\x3C/script>

<input type="text" bind:value={nombre} />
<p>¡Hola, {nombre}!</p>

<textarea bind:value={bio}></textarea>
<p>Caracteres: {bio.length}</p>`,
      topic1Interactive: 'Enlace de Texto en Vivo',
      topic1Placeholder: 'Escribe algo...',
      topic1Mirror: 'Espejo en vivo:',
      topic1CharCount: 'caracteres',
      topic2Title: 'bind:checked — Enlace de Checkbox',
      topic2Desc: 'bind:checked enlaza un booleano a un checkbox. Perfecto para interruptores, completar tareas y checkboxes de acuerdo. El enlace es bidireccional: al hacer clic se actualiza la variable, y al cambiar la variable se actualiza el checkbox.',
      topic2Code: `\x3Cscript lang="ts">
  let aceptado = $state(false);
  let tareas = $state([
    { id: 1, title: "Tarea 1", done: false }
  ]);
\x3C/script>

<input type="checkbox" bind:checked={aceptado} />
<button disabled={!aceptado}>Enviar</button>

{#each tareas as tarea (tarea.id)}
  <input type="checkbox" bind:checked={tarea.done} />
  <span>{tarea.title}</span>
{/each}`,
      topic2Interactive: 'Interruptor de Completar Tareas',
      topic2Completed: 'completadas',
      topic3Title: 'bind:group — Grupos de Radio y Checkbox',
      topic3Desc: 'bind:group enlaza múltiples entradas a una sola variable. Para botones radio, la variable contiene el valor seleccionado. Para checkboxes, contiene un arreglo de todos los valores seleccionados. Esto elimina manejadores de eventos manuales.',
      topic3Code: `\x3Cscript lang="ts">
  let prioridad = $state('medium');
  let categorias = $state<string[]>([]);
\x3C/script>

<!-- Radio: valor único -->
<input type="radio" name="prioridad" value="low"
  bind:group={prioridad} /> Baja
<input type="radio" name="prioridad" value="medium"
  bind:group={prioridad} /> Media
<input type="radio" name="prioridad" value="high"
  bind:group={prioridad} /> Alta

<p>Seleccionada: {prioridad}</p>

<!-- Grupo de checkbox: arreglo -->
<input type="checkbox" value="trabajo"
  bind:group={categorias} /> Trabajo
<input type="checkbox" value="personal"
  bind:group={categorias} /> Personal
<input type="checkbox" value="urgente"
  bind:group={categorias} /> Urgente

<p>Categorías: {categorias.join(', ')}</p>`,
      topic3Interactive: 'Selector de Prioridad y Categoría',
      topic3Priority: 'Prioridad',
      topic3Categories: 'Categorías',
      topic3Selected: 'Prioridad seleccionada:',
      topic3SelectedCats: 'Categorías seleccionadas:',
      topic3None: '(ninguna)',
      topic4Title: 'bind:this — Referencia a Elemento DOM',
      topic4Desc: 'bind:this te da una referencia directa a un elemento DOM. Úsalo para llamar métodos imperativos como focus(), scrollIntoView() o play(). La variable es undefined hasta que el elemento se monta.',
      topic4Code: `\x3Cscript lang="ts">
  let inputEl: HTMLInputElement | undefined = $state();

  function enfocarInput() {
    inputEl?.focus();
  }
\x3C/script>

<input bind:this={inputEl} type="text" />
<button onclick={enfocarInput}>Enfocar el input</button>`,
      topic4Interactive: 'Demo de Enfoque de Input',
      topic4Placeholder: 'Haz clic en el botón para enfocarme...',
      topic4Focus: 'Enfocar Input',
      topic4Hint: 'El botón enfoca programáticamente el input usando bind:this',
      demoTitle: 'Demo Completa: Formulario de Tareas',
      demoDesc: 'Un formulario completo de creación de tareas usando bind:value, bind:group y bind:checked. Completa los detalles y agrega tareas a la lista.',
      demoTitleLabel: 'Título',
      demoTitlePlaceholder: 'Título de la tarea...',
      demoDescLabel: 'Descripción',
      demoDescPlaceholder: 'Descripción de la tarea...',
      demoPriorityLabel: 'Prioridad',
      demoCategoriesLabel: 'Categorías',
      demoAdd: 'Agregar Tarea',
      demoEmpty: '¡Aún no hay tareas. Completa el formulario y agrega una!',
      demoNoCategories: 'Sin categorías',
      mistakesTitle: 'Errores Comunes',
      mistake1Title: 'Usar oninput en lugar de bind:value',
      mistake1Wrong: `<input type="text"
  oninput={(e) => nombre = e.currentTarget.value} />
<p>{nombre}</p>`,
      mistake1Correct: `<input type="text" bind:value={nombre} />
<p>{nombre}</p>`,
      mistake1Explain: 'bind:value es más limpio y maneja casos extremos que oninput pasa por alto. También establece el valor inicial desde la variable — enlace bidireccional real.',
      mistake2Title: 'No usar bind:group para botones radio',
      mistake2Wrong: `\x3Cscript lang="ts">
  let color = $state('rojo');
\x3C/script>
<input type="radio" name="color" value="rojo"
  checked={color === 'rojo'}
  onchange={() => color = 'rojo'} /> Rojo
<input type="radio" name="color" value="azul"
  checked={color === 'azul'}
  onchange={() => color = 'azul'} /> Azul`,
      mistake2Correct: `\x3Cscript lang="ts">
  let color = $state('rojo');
\x3C/script>
<input type="radio" name="color" value="rojo"
  bind:group={color} /> Rojo
<input type="radio" name="color" value="azul"
  bind:group={color} /> Azul`,
      mistake2Explain: 'bind:group reemplaza manejadores manuales checked/onchange para botones radio y grupos de checkboxes. Menos código, menos errores, sincronización automática.',
      mistake3Title: 'Usar bind:this antes de que el elemento exista',
      mistake3Wrong: `\x3Cscript lang="ts">
  let el: HTMLInputElement | undefined = $state();
  // ¡El componente acaba de crearse, el es undefined!
  el.focus(); // ¡Error!
\x3C/script>
<input bind:this={el} />`,
      mistake3Correct: `\x3Cscript lang="ts">
  let el: HTMLInputElement | undefined = $state();

  function enfocar() {
    el?.focus(); // Seguro: se llama después del montaje
  }
\x3C/script>
<input bind:this={el} />
<button onclick={enfocar}>Enfocar</button>`,
      mistake3Explain: 'bind:this es undefined hasta que el elemento se monta. Solo usa la referencia dentro de manejadores de eventos o $effect (que se ejecuta después de actualizar el DOM).',
      mistake4Title: 'Enlazar a un valor $derived',
      mistake4Wrong: `let nombre = $state('');
let apellido = $state('');
let nombreCompleto = $derived(nombre + ' ' + apellido);

<input bind:value={nombreCompleto} />`,
      mistake4Correct: `let nombre = $state('');
let apellido = $state('');

<input bind:value={nombre} />
<input bind:value={apellido} />`,
      mistake4Explain: 'bind:value requiere una variable escribible $state, no un valor de solo lectura $derived. Enlaza a las variables fuente y deriva el valor computado por separado.',
      challengeDesc: 'Agrega validación al formulario de tareas. Requisitos: título mínimo 3 caracteres, prioridad obligatoria, descripción máximo 200 caracteres.',
      challengeCode: `\x3Cscript lang="ts">
  let titulo = $state('');
  let prioridad = $state('');
  let desc = $state('');

  let errores = $derived({
    titulo: titulo.length > 0 && titulo.length < 3,
    prioridad: prioridad === '',
    desc: desc.length > 200
  });

  let esValido = $derived(
    titulo.length >= 3 &&
    prioridad !== '' &&
    desc.length <= 200
  );
\x3C/script>

{#if errores.titulo}
  <p class="error">El título debe tener al menos 3 caracteres</p>
{/if}
<button disabled={!esValido}>Enviar</button>`,
      challengePlaceholder: 'Título (mín. 3 caracteres)...',
      challengeDescPlaceholder: 'Descripción (máx. 200 caracteres)...',
      challengePriorityLabel: 'Prioridad',
      challengeErrorTitleShort: 'El título debe tener al menos 3 caracteres',
      challengeErrorPriority: 'La prioridad es obligatoria',
      challengeErrorDescLong: 'La descripción debe tener 200 caracteres o menos',
      challengeCharsRemaining: 'caracteres restantes',
      challengeCharsOver: 'caracteres de más',
      challengeSubmit: 'Enviar',
      challengeReset: 'Reiniciar',
      challengeFormValid: '¡Formulario enviado con éxito!',
      challengeFormInvalid: 'Corrige los errores de arriba para enviar.'
    }
  };
</script>

<LessonLayout lessonNum="04" title={text[lang].title} appFeature={text[lang].appFeature}>
  {#snippet theory()}
    <div class="topics">
      <section class="topic">
        <h3>1. {text[lang].topic1Title}</h3>
        <p>{text[lang].topic1Desc}</p>
        <CodeExample code={text[lang].topic1Code} filename="BindValue.svelte" />
        <div class="interactive-box">
          <h4>{text[lang].topic1Interactive}</h4>
          <div class="mirror-demo">
            <input type="text" placeholder={text[lang].topic1Placeholder} bind:value={liveText} />
            <div class="mirror">
              <span class="panel-label">{text[lang].topic1Mirror}</span>
              <div class="mirror-output">{liveText || '...'}</div>
              <span class="char-count">{liveText.length} {text[lang].topic1CharCount}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>2. {text[lang].topic2Title}</h3>
        <p>{text[lang].topic2Desc}</p>
        <CodeExample code={text[lang].topic2Code} filename="BindChecked.svelte" />
        <div class="interactive-box">
          <h4>{text[lang].topic2Interactive}</h4>
          <ul class="task-list">
            {#each checkTasks as task (task.id)}
              <li class:done={task.done}>
                <input type="checkbox" bind:checked={task.done} />
                <span class="task-title">{task.title}</span>
              </li>
            {/each}
          </ul>
          <div class="stats">
            <span>{completedCount}/{checkTasks.length} {text[lang].topic2Completed}</span>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>3. {text[lang].topic3Title}</h3>
        <p>{text[lang].topic3Desc}</p>
        <CodeExample code={text[lang].topic3Code} filename="BindGroup.svelte" />
        <div class="interactive-box">
          <h4>{text[lang].topic3Interactive}</h4>
          <div class="group-demo">
            <div class="group-section">
              <span class="group-label">{text[lang].topic3Priority}</span>
              <div class="option-group">
                <label class="option-label">
                  <input type="radio" name="demo-priority" value="low" bind:group={selectedPriority} />
                  <span>{text[lang].low}</span>
                </label>
                <label class="option-label">
                  <input type="radio" name="demo-priority" value="medium" bind:group={selectedPriority} />
                  <span>{text[lang].medium}</span>
                </label>
                <label class="option-label">
                  <input type="radio" name="demo-priority" value="high" bind:group={selectedPriority} />
                  <span>{text[lang].high}</span>
                </label>
              </div>
              <p class="selection">{text[lang].topic3Selected} <strong>{selectedPriority}</strong></p>
            </div>
            <div class="group-section">
              <span class="group-label">{text[lang].topic3Categories}</span>
              <div class="option-group">
                <label class="option-label">
                  <input type="checkbox" value="work" bind:group={selectedCategories} />
                  <span>{text[lang].catWork}</span>
                </label>
                <label class="option-label">
                  <input type="checkbox" value="personal" bind:group={selectedCategories} />
                  <span>{text[lang].catPersonal}</span>
                </label>
                <label class="option-label">
                  <input type="checkbox" value="urgent" bind:group={selectedCategories} />
                  <span>{text[lang].catUrgent}</span>
                </label>
              </div>
              <p class="selection">{text[lang].topic3SelectedCats} <strong>{selectedCategories.length > 0 ? selectedCategories.map(catLabel).join(', ') : text[lang].topic3None}</strong></p>
            </div>
          </div>
        </div>
      </section>

      <section class="topic">
        <h3>4. {text[lang].topic4Title}</h3>
        <p>{text[lang].topic4Desc}</p>
        <CodeExample code={text[lang].topic4Code} filename="BindThis.svelte" />
        <div class="interactive-box">
          <h4>{text[lang].topic4Interactive}</h4>
          <div class="focus-demo">
            <input type="text" placeholder={text[lang].topic4Placeholder} bind:this={refInput} />
            <button class="btn primary" onclick={focusInput}>{text[lang].topic4Focus}</button>
          </div>
          <p class="hint">{text[lang].topic4Hint}</p>
        </div>
      </section>
    </div>
  {/snippet}

  {#snippet example()}
    <div class="demo">
      <h3>{text[lang].demoTitle}</h3>
      <p>{text[lang].demoDesc}</p>
      <div class="demo-app">
        <div class="demo-form">
          <div class="form-row">
            <div class="form-field">
              <label>{text[lang].demoTitleLabel}</label>
              <input type="text" placeholder={text[lang].demoTitlePlaceholder} bind:value={formTitle} onkeydown={(e) => e.key === 'Enter' && addFormTask()} />
            </div>
            <div class="form-field">
              <label>{text[lang].demoDescLabel}</label>
              <textarea placeholder={text[lang].demoDescPlaceholder} bind:value={formDesc}></textarea>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <label>{text[lang].demoPriorityLabel}</label>
              <div class="option-group">
                <label class="option-label">
                  <input type="radio" name="demo-form-priority" value="low" bind:group={formPriority} />
                  <span>{text[lang].low}</span>
                </label>
                <label class="option-label">
                  <input type="radio" name="demo-form-priority" value="medium" bind:group={formPriority} />
                  <span>{text[lang].medium}</span>
                </label>
                <label class="option-label">
                  <input type="radio" name="demo-form-priority" value="high" bind:group={formPriority} />
                  <span>{text[lang].high}</span>
                </label>
              </div>
            </div>
            <div class="form-field">
              <label>{text[lang].demoCategoriesLabel}</label>
              <div class="option-group">
                <label class="option-label">
                  <input type="checkbox" value="work" bind:group={formCategories} />
                  <span>{text[lang].catWork}</span>
                </label>
                <label class="option-label">
                  <input type="checkbox" value="personal" bind:group={formCategories} />
                  <span>{text[lang].catPersonal}</span>
                </label>
                <label class="option-label">
                  <input type="checkbox" value="urgent" bind:group={formCategories} />
                  <span>{text[lang].catUrgent}</span>
                </label>
              </div>
            </div>
          </div>
          <button class="btn primary" onclick={addFormTask}>{text[lang].demoAdd}</button>
        </div>
        <ul class="task-list">
          {#each taskList as task (task.id)}
            <li>
              <div class="task-info">
                <span class="task-title">{task.title}</span>
                {#if task.description}
                  <span class="task-desc">{task.description}</span>
                {/if}
              </div>
              <span class="priority-badge" class:high={task.priority === 'high'} class:medium={task.priority === 'medium'} class:low={task.priority === 'low'}>
                {task.priority}
              </span>
              <span class="cats">{task.categories.length > 0 ? task.categories.map(catLabel).join(', ') : text[lang].demoNoCategories}</span>
              <button class="delete-btn" onclick={() => removeFormTask(task.id)}>✕</button>
            </li>
          {:else}
            <li class="empty">{text[lang].demoEmpty}</li>
          {/each}
        </ul>
      </div>
    </div>
  {/snippet}

  {#snippet challenge()}
    <div class="challenge-content">
      <p>{text[lang].challengeDesc}</p>
      <CodeExample code={text[lang].challengeCode} filename="Validation.svelte" />
      {#if challengeSubmitted}
        <div class="challenge-form">
          <div class="success-msg">{text[lang].challengeFormValid}</div>
          <button class="btn secondary" onclick={resetChallenge}>{text[lang].challengeReset}</button>
        </div>
      {:else}
        <div class="challenge-form">
          <div class="form-field">
            <label>{text[lang].demoTitleLabel}</label>
            <input type="text" placeholder={text[lang].challengePlaceholder} bind:value={challengeTitle} />
            {#if challengeErrors.title}
              <span class="validation-msg error">{text[lang].challengeErrorTitleShort}</span>
            {/if}
          </div>
          <div class="form-field">
            <label>{text[lang].challengePriorityLabel}</label>
            <div class="option-group">
              <label class="option-label">
                <input type="radio" name="challenge-priority" value="low" bind:group={challengePriority} />
                <span>{text[lang].low}</span>
              </label>
              <label class="option-label">
                <input type="radio" name="challenge-priority" value="medium" bind:group={challengePriority} />
                <span>{text[lang].medium}</span>
              </label>
              <label class="option-label">
                <input type="radio" name="challenge-priority" value="high" bind:group={challengePriority} />
                <span>{text[lang].high}</span>
              </label>
            </div>
            {#if challengeErrors.priority}
              <span class="validation-msg error">{text[lang].challengeErrorPriority}</span>
            {/if}
          </div>
          <div class="form-field">
            <label>{text[lang].demoDescLabel}</label>
            <textarea placeholder={text[lang].challengeDescPlaceholder} bind:value={challengeDesc}></textarea>
            <div class="char-row">
              {#if challengeDesc.length <= 200}
                <span class="char-hint">{200 - challengeDesc.length} {text[lang].challengeCharsRemaining}</span>
              {:else}
                <span class="char-hint over">{challengeDesc.length - 200} {text[lang].challengeCharsOver}</span>
              {/if}
              {#if challengeErrors.desc}
                <span class="validation-msg error">{text[lang].challengeErrorDescLong}</span>
              {/if}
            </div>
          </div>
          <div class="form-status" class:valid={challengeValid} class:invalid={!challengeValid}>
            {challengeValid ? text[lang].challengeFormValid : text[lang].challengeFormInvalid}
          </div>
          <button class="btn primary" disabled={!challengeValid} onclick={submitChallenge}>{text[lang].challengeSubmit}</button>
        </div>
      {/if}
    </div>
  {/snippet}

  <section class="exercise-section">
    <h2>✏️ {lang === 'en' ? 'Exercise' : 'Ejercicio'}: User Profile Form</h2>
    <div class="exercise-task">
      <p>{lang === 'en' ? 'Build a user profile form that:' : 'Construye un formulario de perfil de usuario que:'}</p>
      <ul>
        <li>{lang === 'en' ? 'Uses bind:value for name, email, and bio inputs' : 'Usa bind:value para los campos de nombre, email y bio'}</li>
        <li>{lang === 'en' ? 'Uses bind:checked for a "Subscribe to newsletter" checkbox' : 'Usa bind:checked para un checkbox de "Suscribir al newsletter"'}</li>
        <li>{lang === 'en' ? 'Shows a live preview of all the form values below' : 'Muestra una vista previa en vivo de todos los valores del formulario'}</li>
        <li>{lang === 'en' ? 'Has a "Reset" button that clears all fields' : 'Tiene un botón "Reset" que limpia todos los campos'}</li>
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
  .mirror-demo {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .mirror-demo input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.95rem;
  }
  .mirror-demo input:focus {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
  .mirror {
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
  .mirror-output {
    padding: 10px 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    min-height: 40px;
    font-size: 0.95rem;
    color: var(--text);
    transition: all 0.15s;
  }
  .char-count {
    font-size: 0.8rem;
    color: var(--text-muted);
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
  .task-list li input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--primary);
  }
  .task-title {
    flex: 1;
    font-size: 0.92rem;
  }
  .task-desc {
    font-size: 0.8rem;
    color: var(--text-muted);
    display: block;
  }
  .task-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .stats {
    display: flex;
    gap: 1rem;
    margin-top: 0.75rem;
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  .group-demo {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .group-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .group-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .option-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .option-label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--text);
    padding: 4px 8px;
    border-radius: 6px;
    transition: background 0.15s;
  }
  .option-label:hover {
    background: var(--surface-hover);
  }
  .option-label input[type="radio"],
  .option-label input[type="checkbox"] {
    accent-color: var(--primary);
    cursor: pointer;
  }
  .selection {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin: 0;
  }
  .selection strong {
    color: var(--primary);
  }
  .focus-demo {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .focus-demo input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.95rem;
  }
  .focus-demo input:focus {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
  .hint {
    font-size: 0.82rem;
    color: var(--text-muted);
    margin-top: 0.75rem;
    font-style: italic;
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
  .btn.primary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .btn.secondary {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
  }
  .btn.secondary:hover { background: var(--surface-hover); }
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
  .demo-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .form-field label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .form-field input,
  .form-field textarea {
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.9rem;
    font-family: inherit;
    background: var(--bg);
    color: var(--text);
    transition: border-color 0.15s;
  }
  .form-field input:focus,
  .form-field textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(255, 62, 0, 0.15);
  }
  .form-field textarea {
    resize: vertical;
    min-height: 60px;
  }
  .challenge-form {
    background: var(--surface);
    border-radius: 12px;
    padding: 1.25rem;
    border: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .challenge-content p {
    line-height: 1.7;
    margin-bottom: 1rem;
  }
  .validation-msg {
    font-size: 0.8rem;
    font-weight: 500;
  }
  .validation-msg.error {
    color: var(--error);
  }
  .char-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }
  .char-hint {
    font-size: 0.8rem;
    color: var(--text-muted);
  }
  .char-hint.over {
    color: var(--error);
    font-weight: 600;
  }
  .form-status {
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    text-align: center;
  }
  .form-status.valid {
    background: #ecfdf5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }
  .form-status.invalid {
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }
  .success-msg {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #065f46;
    padding: 1rem;
    border-radius: 8px;
    font-weight: 600;
    text-align: center;
    font-size: 1rem;
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
  .priority-badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 10px;
    text-transform: uppercase;
    white-space: nowrap;
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
  .cats {
    font-size: 0.75rem;
    color: var(--text-muted);
    white-space: nowrap;
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
    .code-compare,
    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
