# AGENTS.md

## Project

SvelteKit 5 interactive Svelte course (Spanish/English bilingual). No tests, no linter, no CI configured.

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
```

No `test`, `lint`, `typecheck`, or `check` scripts exist.

## Architecture

- **Svelte 5 runes** only (`$state`, `$derived`, `$props`, `$effect`). Do not use Svelte 4 stores (`writable`, `readable`, etc.) or `onMount`/`createEventDispatcher`.
- **Snippets** (`{#snippet}`, `{@render}`) for component composition, not slots. Props typed as `Snippet` from `svelte`.
- **Route convention**: `src/routes/{NN}-{slug}/+page.svelte` where `NN` is zero-padded lesson number (00–13).
- **i18n**: custom system in `src/lib/i18n/`. State via `$state` rune in `language.svelte.ts`, persisted to localStorage under key `curso-svelte-lang`. Languages: `es` (default), `en`.
- **Layout**: `src/routes/+layout.svelte` renders sidebar + `LanguageToggle` + `{@render children()}`.
- **LessonLayout** (`src/lib/components/LessonLayout.svelte`): shared lesson shell accepting `theory`, `example`, `challenge` optional snippets.

## Key Patterns

- All `<script>` blocks use `lang="ts"`.
- TypeScript strict mode with `allowJs` + `checkJs` enabled.
- CSS uses scoped `<style>` blocks; global styles set via `:global()` in `+layout.svelte` (CSS variables defined on `:root`).
- `data-sveltekit-prerender="true"` on `<body>` in `app.html` — all pages are pre-rendered.
- No adapter-specific config; uses `@sveltejs/adapter-auto`.
