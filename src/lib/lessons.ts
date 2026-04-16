export type LessonRoute = { num: string; slug: string };

export const lessonRoutes: readonly LessonRoute[] = [
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

export function lessonHref({ num, slug }: LessonRoute): string {
  return `/${num}-${slug}`;
}
