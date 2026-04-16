<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import LanguageToggle from '$lib/components/LanguageToggle.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="app-layout">
  <Sidebar />
  <main class="main-content">
    <div class="top-bar">
      <LanguageToggle />
    </div>
    <div class="page-content">
      {@render children()}
    </div>
  </main>
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(:root) {
    --primary: #ff3e00;
    --primary-light: #ff6b3d;
    --surface: #f8f9fa;
    --surface-hover: #e9ecef;
    --border: #dee2e6;
    --text: #212529;
    --text-muted: #6c757d;
    --bg: #ffffff;
    --code-bg: #1e1e2e;
    --success: #22c55e;
    --warning: #f59e0b;
    --error: #ef4444;
    --info: #3b82f6;
  }

  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  :global(h1), :global(h2), :global(h3) {
    color: var(--text);
  }

  :global(a) {
    color: var(--primary);
    text-decoration: none;
  }

  :global(a:hover) {
    text-decoration: underline;
  }

  :global(code) {
    background: var(--surface);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
  }

  :global(pre code) {
    background: none;
    padding: 0;
  }

  .app-layout {
    display: flex;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    margin-left: 280px;
    min-height: 100vh;
  }

  .top-bar {
    display: flex;
    justify-content: flex-end;
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .page-content {
    padding: 0;
  }

  @media (max-width: 768px) {
    .app-layout {
      flex-direction: column;
    }
    .main-content {
      margin-left: 0;
    }
  }
</style>
