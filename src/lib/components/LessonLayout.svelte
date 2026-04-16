<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getLang } from '$lib/i18n/language.svelte.js';
  import translations from '$lib/i18n/translations.js';

  let lang = $derived(getLang());
  let ui = $derived(translations.ui[lang]);

  const lessonSlugs: Record<number, string> = {
    0: 'js-refresher',
    1: 'basics',
    2: 'templating',
    3: 'events',
    4: 'bindings',
    5: 'effects',
    6: 'state',
    7: 'styling',
    8: 'composition',
    9: 'routing',
    10: 'loading',
    11: 'api',
    12: 'advanced',
    13: 'final-project'
  };

  function getSlug(num: number): string {
    return lessonSlugs[num] || '';
  }

  let {
    lessonNum,
    title,
    appFeature,
    children,
    theory,
    example,
    challenge
  }: {
    lessonNum: string;
    title: string;
    appFeature: string;
    children: Snippet;
    theory?: Snippet;
    example?: Snippet;
    challenge?: Snippet;
  } = $props();

  let showChallenge = $state(false);
</script>

<div class="lesson">
  <div class="lesson-header">
    <span class="lesson-badge">Lección {lessonNum}</span>
    <h1>{title}</h1>
    <div class="app-feature">
      <span class="feature-icon">🛠️</span>
      <span>{ui.appFeature}: {appFeature}</span>
    </div>
  </div>

  <div class="lesson-content">
    {#if theory}
      <section class="section theory-section">
        <h2>📖 {ui.theory}</h2>
        <div class="section-content">
          {@render theory()}
        </div>
      </section>
    {/if}

    {#if example}
      <section class="section example-section">
        <h2>💻 {ui.example}</h2>
        <div class="section-content">
          {@render example()}
        </div>
      </section>
    {/if}

    {#if challenge}
      <section class="section challenge-section">
        <button class="challenge-toggle" onclick={() => showChallenge = !showChallenge}>
          🎯 {ui.challenge} {showChallenge ? '▲' : '▼'}
        </button>
        {#if showChallenge}
          <div class="section-content">
            <p class="challenge-desc">{ui.challengeDesc}</p>
            {@render challenge()}
          </div>
        {/if}
      </section>
    {/if}

    <section class="section children-section">
      {@render children()}
    </section>
  </div>

  <div class="lesson-nav">
    {#if parseInt(lessonNum) > 0}
      <a class="nav-btn prev" href="/{String(parseInt(lessonNum) - 1).padStart(2, '0')}-{getSlug(parseInt(lessonNum) - 1)}">
        {ui.prev}
      </a>
    {:else}
      <a class="nav-btn prev" href="/">
        {ui.backToHome}
      </a>
    {/if}
    {#if parseInt(lessonNum) < 13}
      <a class="nav-btn next" href="/{String(parseInt(lessonNum) + 1).padStart(2, '0')}-{getSlug(parseInt(lessonNum) + 1)}">
        {ui.next}
      </a>
    {:else}
      <a class="nav-btn next" href="/">
        {ui.backToHome}
      </a>
    {/if}
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
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  h1 {
    margin: 0.75rem 0 0.5rem;
    font-size: 2rem;
    color: var(--text);
  }
  .app-feature {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--primary);
    font-weight: 500;
    font-size: 0.95rem;
  }
  .feature-icon {
    font-size: 1.1rem;
  }
  .section {
    margin-bottom: 2rem;
  }
  .section h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: var(--text);
  }
  .theory-section {
    background: var(--surface);
    border-radius: 12px;
    padding: 1.5rem;
    border-left: 4px solid var(--primary);
  }
  .example-section {
    background: var(--surface);
    border-radius: 12px;
    padding: 1.5rem;
    border-left: 4px solid #22c55e;
  }
  .challenge-section {
    border: 2px dashed var(--primary);
    border-radius: 12px;
    padding: 1rem;
  }
  .challenge-toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--primary);
    padding: 0.5rem;
    width: 100%;
    text-align: left;
  }
  .challenge-toggle:hover {
    opacity: 0.8;
  }
  .challenge-desc {
    color: var(--text-muted);
    font-style: italic;
    margin-bottom: 1rem;
  }
  .section-content {
    line-height: 1.7;
  }
  .lesson-nav {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 2px solid var(--border);
  }
  .nav-btn {
    padding: 10px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s;
  }
  .nav-btn.prev {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
  }
  .nav-btn.prev:hover {
    background: var(--surface-hover);
  }
  .nav-btn.next {
    background: var(--primary);
    color: white;
  }
  .nav-btn.next:hover {
    opacity: 0.9;
  }
</style>
