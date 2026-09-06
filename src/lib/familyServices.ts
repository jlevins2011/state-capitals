import type { Session } from '../types';

/** Portable learning evidence for a future family host. Not a spendable credit. */
export type LearningReceipt = {
  schemaVersion: 1;
  gameId: 'camp-compass';
  eventId: string;
  localChildId: string;
  lessonId: string;
  occurredAt: number;
  durationMs: number;
  outcome: { correct: number; errors: number; accuracy: number; passed: boolean; stars: number };
};

export function learningReceipt(session: Session): LearningReceipt {
  return {
    schemaVersion: 1,
    gameId: 'camp-compass',
    eventId: `camp-compass:${session.childId}:${session.id}`,
    localChildId: session.childId,
    lessonId: session.lessonId,
    occurredAt: session.startedAt + session.durationMs,
    durationMs: session.durationMs,
    outcome: {
      correct: session.correct,
      errors: session.errors,
      accuracy: session.accuracy,
      passed: session.passed,
      stars: session.stars,
    },
  };
}
