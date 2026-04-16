<script lang="ts">
  import { getLang, toggleLang } from '$lib/i18n/language.svelte.js';

  let lang = $derived(getLang());
</script>

<button class="lang-toggle" onclick={toggleLang}>
  <span class={lang === 'en' ? 'active' : ''}>EN</span>
  <span class="separator">/</span>
  <span class={lang === 'es' ? 'active' : ''}>ES</span>
</button>

<style>
  .lang-toggle {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 6px 14px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.2s;
    display: flex;
    gap: 4px;
    align-items: center;
  }
  .lang-toggle:hover {
    background: var(--surface-hover);
  }
  .separator {
    color: var(--text-muted);
  }
  .active {
    color: var(--primary);
  }
  :global(.lang-toggle span:not(.active)) {
    color: var(--text-muted);
  }
</style>
