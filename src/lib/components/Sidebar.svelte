<script lang="ts">
  import { getLang } from '$lib/i18n/language.svelte.js';
  import translations from '$lib/i18n/translations.js';

  let lang = $derived(getLang());
  let lessons = $derived(translations.lessons[lang]);

  let currentPath = $state('');

  $effect(() => {
    if (typeof window !== 'undefined') {
      currentPath = window.location.pathname;
    }
  });

  const lessonRoutes = [
    { num: '00', slug: 'js-refresher' },
    { num: '01', slug: 'basics' },
    { num: '02', slug: 'templating' },
    { num: '03', slug: 'events' },
    { num: '04', slug: 'bindings' },
    { num: '05', slug: 'effects' },
    { num: '06', slug: 'state' },
    { num: '07', slug: 'styling' },
    { num: '08', slug: 'composition' },
    { num: '09', slug: 'routing' },
    { num: '10', slug: 'loading' },
    { num: '11', slug: 'api' },
    { num: '12', slug: 'advanced' },
    { num: '13', slug: 'final-project' }
  ];
</script>

<aside class="sidebar">
  <a href="/" class="sidebar-logo">
    <span class="logo-icon">⚡</span>
    <span class="logo-text">Svelte Crash Course</span>
  </a>

  <nav class="sidebar-nav">
    {#each lessonRoutes as lesson}
      {@const key = lesson.num as keyof typeof lessons}
      {@const isActive = currentPath === `/${lesson.num}-${lesson.slug}`}
      <a
        href="/{lesson.num}-{lesson.slug}"
        class="sidebar-link"
        class:active={isActive}
      >
        <span class="lesson-num">{lesson.num}</span>
        <span class="lesson-title">{lessons[key].title}</span>
      </a>
    {/each}
  </nav>
</aside>

<style>
  .sidebar {
    width: 280px;
    min-height: 100vh;
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 1.5rem 0;
    position: fixed;
    top: 0;
    left: 0;
    overflow-y: auto;
    z-index: 100;
  }
  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 1.5rem 1.5rem;
    text-decoration: none;
    border-bottom: 1px solid var(--border);
    margin-bottom: 1rem;
  }
  .logo-icon {
    font-size: 1.5rem;
  }
  .logo-text {
    font-weight: 700;
    font-size: 1rem;
    color: var(--text);
  }
  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0 0.75rem;
  }
  .sidebar-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    text-decoration: none;
    color: var(--text-muted);
    font-size: 0.88rem;
    transition: all 0.15s;
  }
  .sidebar-link:hover {
    background: var(--surface-hover);
    color: var(--text);
  }
  .sidebar-link.active {
    background: var(--primary);
    color: white;
    font-weight: 600;
  }
  .lesson-num {
    background: var(--border);
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 0.75rem;
    font-weight: 700;
    min-width: 28px;
    text-align: center;
  }
  .active .lesson-num {
    background: rgba(255, 255, 255, 0.2);
  }
  .lesson-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      min-height: auto;
      position: relative;
      border-right: none;
      border-bottom: 1px solid var(--border);
    }
    .sidebar-nav {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 4px;
    }
    .sidebar-link {
      padding: 6px 10px;
      font-size: 0.8rem;
    }
    .lesson-title {
      display: none;
    }
  }
</style>
