<script lang="ts">
  import { getLang } from '$lib/i18n/language.svelte.js';

  let lang = $derived(getLang());

  type Category = 'breakfast' | 'lunch' | 'dinner' | 'dessert';
  type Difficulty = 'easy' | 'medium' | 'hard';

  interface Recipe {
    id: number;
    name: string;
    ingredients: string[];
    category: Category;
    difficulty: Difficulty;
    favorite: boolean;
  }

  const defaultRecipes: Recipe[] = [
    { id: 1, name: 'Pasta Carbonara', ingredients: ['pasta', 'eggs', 'bacon', 'parmesan', 'black pepper'], category: 'lunch', difficulty: 'medium', favorite: true },
    { id: 2, name: 'Pancakes', ingredients: ['flour', 'milk', 'eggs', 'butter', 'maple syrup'], category: 'breakfast', difficulty: 'easy', favorite: false },
    { id: 3, name: 'Caesar Salad', ingredients: ['lettuce', 'croutons', 'parmesan', 'caesar dressing'], category: 'lunch', difficulty: 'easy', favorite: true },
    { id: 4, name: 'Chocolate Cake', ingredients: ['flour', 'sugar', 'cocoa', 'eggs', 'butter', 'vanilla'], category: 'dessert', difficulty: 'hard', favorite: false },
    { id: 5, name: 'Grilled Salmon', ingredients: ['salmon', 'lemon', 'garlic', 'olive oil', 'herbs'], category: 'dinner', difficulty: 'medium', favorite: true },
  ];

  let recipes = $state<Recipe[]>([]);
  let search = $state('');
  let filter = $state<Category | 'all'>('all');
  let showForm = $state(false);
  let showFavoritesOnly = $state(false);

  let formName = $state('');
  let formIngredients = $state('');
  let formCategory = $state<Category>('lunch');
  let formDifficulty = $state<Difficulty>('easy');

  let showSolution = $state(false);

  const solutionCode = [
    '// Add these state variables to the script:',
    'let editingId = $state<number | null>(null);',
    '',
    '// Modify the addRecipe function:',
    'function saveRecipe() {',
    '  if (editingId !== null) {',
    '    // Update existing recipe',
    '    recipes = recipes.map(r => r.id === editingId ? {',
    '      ...r,',
    '      name: formName.trim(),',
    "      ingredients: formIngredients.split(',').map(s => s.trim()).filter(Boolean),",
    '      category: formCategory,',
    '      difficulty: formDifficulty',
    '    } : r);',
    '    editingId = null;',
    '  } else {',
    '    // Add new recipe (existing logic)',
    '    recipes = [...recipes, { id: Date.now(), name: formName.trim(), ... }];',
    '  }',
    '  // Reset form...',
    '}',
    '',
    'function editRecipe(recipe: Recipe) {',
    '  editingId = recipe.id;',
    '  formName = recipe.name;',
    "  formIngredients = recipe.ingredients.join(', ');",
    '  formCategory = recipe.category;',
    '  formDifficulty = recipe.difficulty;',
    '  showForm = true;',
    '}',
    '',
    '// In the template, change the button to:',
    '<button onclick={() => editRecipe(recipe)}>Edit</button>',
    '',
    '// Change form submit button text based on mode:',
    '<button type="submit">',
    "  {editingId ? 'Update Recipe' : 'Add Recipe'}",
    '</button>'
  ].join('\n');

  $effect(() => {
    const saved = localStorage.getItem('curso-svelte-recipes');
    if (saved) {
      try {
        recipes = JSON.parse(saved);
        return;
      } catch { /* ignore */ }
    }
    recipes = [...defaultRecipes];
  });

  $effect(() => {
    if (recipes.length > 0) {
      localStorage.setItem('curso-svelte-recipes', JSON.stringify(recipes));
    }
  });

  let filteredRecipes = $derived(() => {
    let result = recipes;
    if (filter !== 'all') {
      result = result.filter(r => r.category === filter);
    }
    if (showFavoritesOnly) {
      result = result.filter(r => r.favorite);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.ingredients.some(i => i.toLowerCase().includes(q))
      );
    }
    return result;
  });

  let totalCount = $derived(recipes.length);
  let filteredCount = $derived(filteredRecipes().length);
  let favoriteCount = $derived(recipes.filter(r => r.favorite).length);

  function toggleFavorite(id: number) {
    recipes = recipes.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r);
  }

  function deleteRecipe(id: number) {
    recipes = recipes.filter(r => r.id !== id);
  }

  function addRecipe() {
    if (!formName.trim() || !formIngredients.trim()) return;
    const newRecipe: Recipe = {
      id: Date.now(),
      name: formName.trim(),
      ingredients: formIngredients.split(',').map(s => s.trim()).filter(Boolean),
      category: formCategory,
      difficulty: formDifficulty,
      favorite: false
    };
    recipes = [...recipes, newRecipe];
    formName = '';
    formIngredients = '';
    formCategory = 'lunch';
    formDifficulty = 'easy';
    showForm = false;
  }

  function resetRecipes() {
    recipes = [...defaultRecipes];
    localStorage.removeItem('curso-svelte-recipes');
  }

  const categoryLabels: Record<Category, { en: string; es: string }> = {
    breakfast: { en: 'Breakfast', es: 'Desayuno' },
    lunch: { en: 'Lunch', es: 'Almuerzo' },
    dinner: { en: 'Dinner', es: 'Cena' },
    dessert: { en: 'Dessert', es: 'Postre' }
  };

  const difficultyColors: Record<Difficulty, string> = {
    easy: '#22c55e',
    medium: '#f59e0b',
    hard: '#ef4444'
  };

  const categoryEmoji: Record<Category, string> = {
    breakfast: '🥞',
    lunch: '🥗',
    dinner: '🍽️',
    dessert: '🍰'
  };
</script>

<div class="lesson">
  <div class="lesson-header">
    <span class="lesson-badge">Lesson 13</span>
    <h1>{lang === 'en' ? 'Final Project: Recipe Book' : 'Proyecto Final: Libro de Recetas'}</h1>
    <div class="app-feature">
      <span>🛠️ {lang === 'en' ? 'Build a complete app using everything you learned!' : '¡Construye una app completa usando todo lo aprendido!'}</span>
    </div>
  </div>

  <div class="lesson-content">

    <section class="intro-section">
      <h2>🏆 {lang === 'en' ? 'You Made It!' : '¡Lo Lograste!'}</h2>
      <p>{lang === 'en'
        ? 'This is the final lesson. Below is a fully working Recipe Book app built with ALL the concepts from this course. Study it, then try building your own version!'
        : 'Esta es la lección final. Abajo hay una app de Libro de Recetas completamente funcional construida con TODOS los conceptos del curso. ¡Estúdiala, y luego intenta construir tu propia versión!'}</p>
    </section>

    <section class="concepts-used">
      <h3>{lang === 'en' ? 'Concepts Used (click to review lesson)' : 'Conceptos Usados (clic para repasar)'}</h3>
      <div class="concept-grid">
        <a href="/01-basics" class="concept-chip">$state, $derived, $props</a>
        <a href="/02-templating" class="concept-chip">{'{#each}'}, {'{#if}'}</a>
        <a href="/03-events" class="concept-chip">onclick, events</a>
        <a href="/04-bindings" class="concept-chip">bind:value</a>
        <a href="/05-effects" class="concept-chip">$effect</a>
        <a href="/06-state" class="concept-chip">shared state</a>
        <a href="/07-styling" class="concept-chip">scoped styles</a>
        <a href="/08-composition" class="concept-chip">component patterns</a>
      </div>
    </section>

    <section class="recipe-app">
      <div class="app-header">
        <div class="app-title-row">
          <h2>📖 {lang === 'en' ? 'Recipe Book' : 'Libro de Recetas'}</h2>
          <div class="app-stats">
            <span class="stat">{lang === 'en' ? 'Showing' : 'Mostrando'} {filteredCount} {lang === 'en' ? 'of' : 'de'} {totalCount}</span>
            <span class="stat">❤️ {favoriteCount} {lang === 'en' ? 'favorites' : 'favoritos'}</span>
          </div>
        </div>

        <div class="app-controls">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              bind:value={search}
              placeholder={lang === 'en' ? 'Search recipes or ingredients...' : 'Buscar recetas o ingredientes...'}
            />
          </div>

          <div class="filter-row">
            <button class="filter-btn" class:active={filter === 'all'} onclick={() => filter = 'all'}>
              {lang === 'en' ? 'All' : 'Todas'}
            </button>
            {#each (['breakfast', 'lunch', 'dinner', 'dessert'] as Category[]) as cat}
              <button class="filter-btn" class:active={filter === cat} onclick={() => filter = cat}>
                {categoryEmoji[cat]} {categoryLabels[cat][lang]}
              </button>
            {/each}
            <button class="filter-btn" class:active={showFavoritesOnly} onclick={() => showFavoritesOnly = !showFavoritesOnly}>
              ❤️ {lang === 'en' ? 'Favorites' : 'Favoritos'}
            </button>
          </div>

          <div class="action-row">
            <button class="btn add-btn" onclick={() => showForm = !showForm}>
              {showForm ? '✕ ' + (lang === 'en' ? 'Cancel' : 'Cancelar') : '+ ' + (lang === 'en' ? 'Add Recipe' : 'Agregar Receta')}
            </button>
            <button class="btn reset-btn" onclick={resetRecipes}>
              🔄 {lang === 'en' ? 'Reset' : 'Reiniciar'}
            </button>
          </div>
        </div>
      </div>

      {#if showForm}
        <form class="recipe-form" onsubmit={(e) => { e.preventDefault(); addRecipe(); }}>
          <h3>{lang === 'en' ? 'New Recipe' : 'Nueva Receta'}</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>{lang === 'en' ? 'Recipe Name' : 'Nombre de la Receta'}</label>
              <input type="text" bind:value={formName} placeholder={lang === 'en' ? 'e.g. Guacamole' : 'ej. Guacamole'} />
            </div>
            <div class="form-group">
              <label>{lang === 'en' ? 'Category' : 'Categoría'}</label>
              <select bind:value={formCategory}>
                {#each (['breakfast', 'lunch', 'dinner', 'dessert'] as Category[]) as cat}
                  <option value={cat}>{categoryEmoji[cat]} {categoryLabels[cat][lang]}</option>
                {/each}
              </select>
            </div>
            <div class="form-group full-width">
              <label>{lang === 'en' ? 'Ingredients (comma-separated)' : 'Ingredientes (separados por coma)'}</label>
              <input type="text" bind:value={formIngredients} placeholder={lang === 'en' ? 'e.g. avocado, lime, salt, onion' : 'ej. aguacate, limón, sal, cebolla'} />
            </div>
            <div class="form-group">
              <label>{lang === 'en' ? 'Difficulty' : 'Dificultad'}</label>
              <select bind:value={formDifficulty}>
                <option value="easy">🟢 {lang === 'en' ? 'Easy' : 'Fácil'}</option>
                <option value="medium">🟡 {lang === 'en' ? 'Medium' : 'Media'}</option>
                <option value="hard">🔴 {lang === 'en' ? 'Hard' : 'Difícil'}</option>
              </select>
            </div>
          </div>
          <button type="submit" class="btn submit-btn" disabled={!formName.trim() || !formIngredients.trim()}>
            {lang === 'en' ? 'Add Recipe' : 'Agregar Receta'}
          </button>
        </form>
      {/if}

      <div class="recipes-grid">
        {#if filteredRecipes().length === 0}
          <div class="empty-state">
            <p class="empty-icon">🍽️</p>
            <p>{lang === 'en' ? 'No recipes found. Try a different filter or add a new recipe!' : 'No se encontraron recetas. ¡Prueba un filtro diferente o agrega una nueva receta!'}</p>
          </div>
        {:else}
          {#each filteredRecipes() as recipe (recipe.id)}
            <div class="recipe-card">
              <div class="card-header">
                <span class="card-category">
                  {categoryEmoji[recipe.category]} {categoryLabels[recipe.category][lang]}
                </span>
                <div class="card-actions">
                  <button class="fav-btn" class:active={recipe.favorite} onclick={() => toggleFavorite(recipe.id)}>
                    {recipe.favorite ? '❤️' : '🤍'}
                  </button>
                  <button class="delete-btn" onclick={() => deleteRecipe(recipe.id)}>✕</button>
                </div>
              </div>
              <h3 class="card-title">{recipe.name}</h3>
              <div class="card-difficulty">
                <span class="diff-dot" style="background: {difficultyColors[recipe.difficulty]}"></span>
                {recipe.difficulty === 'easy' ? (lang === 'en' ? 'Easy' : 'Fácil') : recipe.difficulty === 'medium' ? (lang === 'en' ? 'Medium' : 'Media') : (lang === 'en' ? 'Hard' : 'Difícil')}
              </div>
              <div class="card-ingredients">
                {#each recipe.ingredients as ingredient}
                  <span class="ingredient-tag">{ingredient}</span>
                {/each}
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </section>

    <section class="congrats-section">
      <div class="congrats-card">
        <h2>🎉 {lang === 'en' ? 'Congratulations!' : '¡Felicidades!'}</h2>
        <p>{lang === 'en'
          ? 'You\'ve completed the entire Svelte & SvelteKit Crash Course! You now know how to build modern web applications with Svelte 5 and SvelteKit.'
          : '¡Has completado todo el Curso Intensivo de Svelte & SvelteKit! Ahora sabes cómo construir aplicaciones web modernas con Svelte 5 y SvelteKit.'}</p>
        <div class="next-steps">
          <h3>{lang === 'en' ? 'Next Steps' : 'Próximos Pasos'}</h3>
          <ul>
            <li><a href="https://svelte.dev/docs" target="_blank" rel="noopener">{lang === 'en' ? 'Svelte Documentation' : 'Documentación de Svelte'}</a></li>
            <li><a href="https://svelte.dev/docs/kit" target="_blank" rel="noopener">{lang === 'en' ? 'SvelteKit Documentation' : 'Documentación de SvelteKit'}</a></li>
            <li><a href="https://svelte.dev/tutorial" target="_blank" rel="noopener">{lang === 'en' ? 'Official Svelte Tutorial' : 'Tutorial Oficial de Svelte'}</a></li>
            <li><a href="https://svelte.dev/examples" target="_blank" rel="noopener">{lang === 'en' ? 'Svelte Examples' : 'Ejemplos de Svelte'}</a></li>
          </ul>
        </div>
      </div>
    </section>

    <section class="exercise-section">
      <h2>✏️ {lang === 'en' ? 'Exercise' : 'Ejercicio'}: {lang === 'en' ? 'Add Edit Feature to Recipe Book' : 'Agregar Función de Edición al Libro de Recetas'}</h2>
      <div class="exercise-task">
        <p>{lang === 'en' ? 'Add an "Edit Recipe" feature to the Recipe Book app from this lesson:' : 'Agrega una función "Editar Receta" a la app Libro de Recetas de esta lección:'}</p>
        <ul>
          <li>{lang === 'en' ? 'Add an "Edit" button to each recipe card' : 'Agrega un botón "Editar" a cada tarjeta de receta'}</li>
          <li>{lang === 'en' ? 'When clicked, populate the form with the recipe\'s current data' : 'Al hacer clic, llena el formulario con los datos actuales de la receta'}</li>
          <li>{lang === 'en' ? 'Submitting the form should update the existing recipe (not create a new one)' : 'Enviar el formulario debe actualizar la receta existente (no crear una nueva)'}</li>
          <li>{lang === 'en' ? 'Add a "Cancel Edit" button to return to "Add" mode' : 'Agrega un botón "Cancelar Edición" para volver al modo "Agregar"'}</li>
          <li>{lang === 'en' ? 'The changes should persist to localStorage via the existing $effect' : 'Los cambios deben persistir en localStorage mediante el $effect existente'}</li>
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

  </div>

  <div class="lesson-nav">
    <a class="nav-btn prev" href="/12-advanced">← {lang === 'en' ? 'Previous' : 'Anterior'}</a>
    <a class="nav-btn next" href="/">{lang === 'en' ? 'Home' : 'Inicio'} →</a>
  </div>
</div>

<style>
  .lesson {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }
  .lesson-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--border);
  }
  .lesson-badge {
    background: var(--primary);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  h1 { margin: 0.75rem 0 0.5rem; font-size: 2rem; }
  h2 { font-size: 1.5rem; margin-bottom: 1rem; }
  h3 { font-size: 1.1rem; margin-bottom: 0.75rem; }
  .app-feature { color: var(--primary); font-weight: 500; font-size: 0.95rem; margin-top: 0.5rem; }

  .intro-section {
    background: linear-gradient(135deg, #ff3e00, #ff6b3d);
    color: white;
    padding: 2rem;
    border-radius: 16px;
    margin-bottom: 2rem;
    text-align: center;
  }
  .intro-section h2 { color: white; }
  .intro-section p { opacity: 0.95; line-height: 1.7; }

  .concepts-used {
    margin-bottom: 2rem;
  }
  .concept-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 0.75rem;
  }
  .concept-chip {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.85rem;
    color: var(--primary);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.15s;
  }
  .concept-chip:hover {
    background: var(--primary);
    color: white;
    text-decoration: none;
  }

  .recipe-app {
    background: var(--surface);
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid var(--border);
    margin-bottom: 2.5rem;
  }

  .app-header {
    margin-bottom: 1.5rem;
  }
  .app-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .app-title-row h2 { margin: 0; }
  .app-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: var(--text-muted);
  }
  .stat { font-weight: 500; }

  .app-controls { display: flex; flex-direction: column; gap: 0.75rem; }
  .search-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: white;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0 12px;
  }
  .search-icon { font-size: 1rem; }
  .search-bar input {
    flex: 1;
    border: none;
    padding: 10px 0;
    font-size: 0.95rem;
    outline: none;
    background: transparent;
  }

  .filter-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .filter-btn {
    padding: 6px 14px;
    border: 1px solid var(--border);
    border-radius: 20px;
    background: white;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.15s;
  }
  .filter-btn:hover { border-color: var(--primary); }
  .filter-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }

  .action-row { display: flex; gap: 8px; }
  .btn {
    padding: 8px 18px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.15s;
  }
  .add-btn {
    background: var(--primary);
    color: white;
  }
  .add-btn:hover { opacity: 0.9; }
  .reset-btn {
    background: white;
    color: var(--text);
    border: 1px solid var(--border);
  }
  .reset-btn:hover { background: var(--surface-hover); }

  .recipe-form {
    background: white;
    border: 2px solid var(--primary);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .recipe-form h3 { margin-bottom: 1rem; color: var(--primary); }
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .form-group { display: flex; flex-direction: column; gap: 4px; }
  .form-group.full-width { grid-column: 1 / -1; }
  .form-group label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
  .form-group input, .form-group select {
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.9rem;
  }
  .form-group input:focus, .form-group select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.1);
  }
  .submit-btn {
    background: var(--primary);
    color: white;
    width: 100%;
  }
  .submit-btn:hover { opacity: 0.9; }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .recipes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
  }

  .recipe-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.25rem;
    transition: all 0.2s;
  }
  .recipe-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  .card-category {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
    background: var(--surface);
    padding: 3px 10px;
    border-radius: 12px;
  }
  .card-actions { display: flex; gap: 4px; }
  .fav-btn, .delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 2px 4px;
    border-radius: 4px;
    transition: all 0.15s;
  }
  .fav-btn:hover { transform: scale(1.2); }
  .delete-btn { color: var(--text-muted); font-size: 0.85rem; }
  .delete-btn:hover { color: var(--error); background: #fef2f2; }

  .card-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  .card-difficulty {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    text-transform: capitalize;
  }
  .diff-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .card-ingredients {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .ingredient-tag {
    background: var(--surface);
    color: var(--text-muted);
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 0.78rem;
  }

  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    color: var(--text-muted);
  }
  .empty-icon { font-size: 3rem; margin-bottom: 0.5rem; }

  .congrats-section {
    margin-top: 2rem;
  }
  .congrats-card {
    background: linear-gradient(135deg, #1e1e2e, #2a2a3e);
    color: white;
    padding: 2.5rem;
    border-radius: 16px;
    text-align: center;
  }
  .congrats-card h2 { color: #fbbf24; font-size: 2rem; }
  .congrats-card p { opacity: 0.9; margin: 1rem 0; line-height: 1.7; }
  .next-steps {
    margin-top: 1.5rem;
    text-align: left;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  .next-steps h3 { color: #fbbf24; text-align: center; margin-bottom: 1rem; }
  .next-steps ul { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
  .next-steps a {
    color: #89b4fa;
    text-decoration: none;
    font-size: 0.95rem;
    display: block;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    transition: background 0.15s;
  }
  .next-steps a:hover { background: rgba(255, 255, 255, 0.1); text-decoration: none; }

  .lesson-nav { display: flex; justify-content: space-between; margin-top: 3rem; padding-top: 1.5rem; border-top: 2px solid var(--border); }
  .nav-btn { padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.2s; }
  .nav-btn.prev { background: var(--surface); color: var(--text); border: 1px solid var(--border); }
  .nav-btn.prev:hover { background: var(--surface-hover); text-decoration: none; }
  .nav-btn.next { background: var(--primary); color: white; }
  .nav-btn.next:hover { opacity: 0.9; text-decoration: none; }

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

  @media (max-width: 768px) {
    .form-grid { grid-template-columns: 1fr; }
    .app-title-row { flex-direction: column; align-items: flex-start; }
    .recipes-grid { grid-template-columns: 1fr; }
  }
</style>
