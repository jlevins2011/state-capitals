import { LESSONS, lessonsInWorld } from '../data/curriculum';
import { STATES } from '../data/states';
import type { Child, Question } from '../types';

export function discoveredStates(child: Child): string[] {
  return [...new Set(child.factsFound.map(id => id.split('-')[0]))].filter(id => STATES.some(s => s.id === id));
}
export function campProgress(child: Child, worldId: string) {
  const lessons = lessonsInWorld(worldId);
  const done = lessons.filter(l => (child.completedLessons[l.id]?.stars ?? 0) > 0).length;
  const exam = lessons.find(l => l.kind === 'exam');
  return { done, total: lessons.length, stamped: !!exam && (child.completedLessons[exam.id]?.stars ?? 0) > 0 };
}
export function explorerRank(child: Child): string {
  const done = LESSONS.filter(l => (child.completedLessons[l.id]?.stars ?? 0) > 0).length;
  return child.completedLessons['atlas-exam']?.stars ? 'Compass Keeper' : done >= 20 ? 'Wayfinder' : done >= 8 ? 'Trail Scout' : 'New Explorer';
}
export function questionFacts(q: Question, stateId?: string): string[] {
  if (q.kind === 'match') return (stateId ? [stateId] : q.left.map(s => s.id)).map(id => `${id}-0`);
  const second = q.skill === 'capital-of';
  return [`${q.stateId}-${second ? 1 : 0}`];
}
