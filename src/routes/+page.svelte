<script lang="ts">
  import { getLang } from '$lib/i18n/language.svelte.js';
  import translations from '$lib/i18n/translations.js';

  let lang = $derived(getLang());
  let home = $derived(translations.home[lang]);
  let lessons = $derived(translations.lessons[lang]);

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

<div class="home">
  <div class="hero">
    <div class="hero-icon">⚡</div>
    <h1>{home.title}</h1>
    <p class="subtitle">{home.subtitle}</p>
    <a href="/00-js-refresher" class="cta-button">{home.start}</a>
  </div>

  <div class="info-grid">
    <div class="info-card">
      <h3>📚 {home.whatYouWillLearn}</h3>
      <p>{home.whatYouWillLearnDesc}</p>
      <p class="prereq">{home.prereqs}</p>
    </div>
    <div class="info-card">
      <h3>🏗️ {home.growingApp}</h3>
      <p>{home.growingAppDesc}</p>
    </div>
  </div>

  <div class="lessons-grid">
    {#each lessonRoutes as lesson, i}
      {@const key = lesson.num as keyof typeof lessons}
      <a href="/{lesson.num}-{lesson.slug}" class="lesson-card">
        <div class="lesson-card-num">{lesson.num}</div>
        <div class="lesson-card-content">
          <h3>{lessons[key].title}</h3>
          <p>{lessons[key].desc}</p>
          <span class="lesson-card-feature">🛠️ {lessons[key].feature}</span>
        </div>
      </a>
    {/each}
  </div>
</div>

<style>
  .home {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem;
  }

  .hero {
    text-align: center;
    padding: 4rem 2rem;
    background: linear-gradient(135deg, #ff3e00 0%, #ff6b3d 100%);
    border-radius: 20px;
    color: white;
    margin-bottom: 3rem;
  }

  .hero-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .hero h1 {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }

  .subtitle {
    opacity: 0.9;
    font-size: 1.15rem;
    margin-bottom: 2rem;
  }

  .cta-button {
    background: white;
    color: #ff3e00;
    padding: 14px 36px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 1.1rem;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    display: inline-block;
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    text-decoration: none;
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .info-card {
    background: var(--surface);
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid var(--border);
  }

  .info-card h3 {
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
  }

  .info-card p {
    color: var(--text-muted);
    line-height: 1.6;
  }

  .prereq {
    margin-top: 0.75rem;
    font-style: italic;
    font-size: 0.9rem;
  }

  .lessons-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .lesson-card {
    display: flex;
    gap: 1rem;
    padding: 1.25rem;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
  }

  .lesson-card:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    text-decoration: none;
  }

  .lesson-card-num {
    background: var(--primary);
    color: white;
    border-radius: 10px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  .lesson-card-content h3 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .lesson-card-content p {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .lesson-card-feature {
    font-size: 0.8rem;
    color: var(--primary);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .info-grid, .lessons-grid {
      grid-template-columns: 1fr;
    }
    .hero h1 {
      font-size: 1.8rem;
    }
  }
</style>
