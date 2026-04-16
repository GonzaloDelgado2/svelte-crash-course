import type { Lang } from './translations.js';

let currentLang = $state<Lang>('es');

if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('curso-svelte-lang');
  if (saved === 'en' || saved === 'es') {
    currentLang = saved;
  }
}

export function getLang(): Lang {
  return currentLang;
}

export function setLang(lang: Lang) {
  currentLang = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem('curso-svelte-lang', lang);
  }
}

export function toggleLang() {
  setLang(currentLang === 'en' ? 'es' : 'en');
}
