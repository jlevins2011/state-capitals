import { STATES, getState, statesIn } from "../data/states";
import type { ChoiceQuestion, Lesson, MatchQuestion, Question, QuestionSkill, TapQuestion } from "../types";

export function shuffle<T>(items: T[], rand: () => number = Math.random): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function pickN<T>(items: T[], n: number, rand: () => number = Math.random): T[] {
  return shuffle(items, rand).slice(0, Math.min(n, items.length));
}

function distractorStates(correctId: string, poolIds: string[], extraIds: string[], count: number, rand: () => number) {
  const fromPool = poolIds.filter((id) => id !== correctId);
  const picked = pickN(fromPool, count, rand);
  if (picked.length >= count) return picked;
  const fromExtra = extraIds.filter((id) => id !== correctId && !picked.includes(id) && !fromPool.includes(id));
  return [...picked, ...pickN(fromExtra, count - picked.length, rand)];
}

function choicesFor(correct: string, others: string[], rand: () => number): string[] {
  return shuffle([correct, ...others], rand);
}

function factFor(stateId: string, index = 0): string {
  const state = getState(stateId);
  return state.facts[index % state.facts.length];
}

export function buildChoice(
  skill: ChoiceQuestion["skill"],
  stateId: string,
  poolIds: string[],
  rand: () => number = Math.random,
): ChoiceQuestion {
  const state = getState(stateId);
  const others = distractorStates(stateId, poolIds, STATES.map((s) => s.id), 3, rand).map(getState);
  const extra = STATES.filter((s) => s.id !== stateId);

  if (skill === "highlight-name" || skill === "silhouette") {
    const prompt =
      skill === "silhouette"
        ? "Which state is this shape?"
        : "Which state is glowing on the map?";
    return {
      kind: "choice",
      skill,
      stateId,
      prompt,
      choices: choicesFor(state.name, others.map((s) => s.name), rand),
      answer: state.name,
      fact: factFor(stateId),
    };
  }

  if (skill === "capital-of") {
    const capitals = others.map((s) => s.capital);
    return {
      kind: "choice",
      skill,
      stateId,
      prompt: `What is the capital of ${state.name}?`,
      choices: choicesFor(state.capital, capitals, rand),
      answer: state.capital,
      fact: factFor(stateId, 1),
    };
  }

  if (skill === "state-of") {
    return {
      kind: "choice",
      skill,
      stateId,
      prompt: `${state.capital} is the capital of…`,
      choices: choicesFor(state.name, others.map((s) => s.name), rand),
      answer: state.name,
      fact: factFor(stateId),
    };
  }

  if (skill === "nickname") {
    return {
      kind: "choice",
      skill,
      stateId,
      prompt: `Which state is the ${state.nickname}?`,
      choices: choicesFor(state.name, others.map((s) => s.name), rand),
      answer: state.name,
      fact: `${state.name} is also called the ${state.nickname}.`,
    };
  }

  const fact = state.facts[0];
  const decoys = pickN(extra, 3, rand).map((s) => s.name);
  return {
    kind: "choice",
    skill: "fact",
    stateId,
    prompt: fact,
    choices: choicesFor(state.name, decoys, rand),
    answer: state.name,
    fact: state.facts[1],
  };
}

export function buildTap(stateId: string): TapQuestion {
  const state = getState(stateId);
  return {
    kind: "tap",
    skill: "tap-state",
    stateId,
    prompt: `Tap ${state.name} on the map.`,
    answer: state.name,
    fact: factFor(stateId),
  };
}

export function buildMatch(poolIds: string[], rand: () => number = Math.random): MatchQuestion {
  const picked = pickN(statesIn(poolIds), 4, rand);
  const left = picked.map((s) => ({ id: s.id, label: s.name }));
  const right = shuffle(
    picked.map((s) => ({ id: s.id, label: s.capital })),
    rand,
  );
  const pairs = Object.fromEntries(picked.map((s) => [s.id, s.id]));
  return {
    kind: "match",
    skill: "match-capitals",
    prompt: "Drag each state to its capital.",
    left,
    right,
    pairs,
    fact: `${picked[0].name}’s capital is ${picked[0].capital}.`,
  };
}

function pickState(pool: string[], used: Set<string>, rand: () => number): string {
  const unused = pool.filter((id) => !used.has(id));
  const source = unused.length ? unused : pool;
  const id = source[Math.floor(rand() * source.length)];
  used.add(id);
  return id;
}

export function buildDeck(lesson: Lesson, rand: () => number = Math.random): Question[] {
  const pool = lesson.stateIds;
  const skills = lesson.skills.length ? lesson.skills : (["highlight-name"] as QuestionSkill[]);
  const deck: Question[] = [];
  const used = new Set<string>();
  let skillIndex = 0;

  while (deck.length < lesson.questionCount) {
    const skill = skills[skillIndex % skills.length];
    skillIndex += 1;

    if (skill === "match-capitals") {
      if (pool.length >= 4) {
        deck.push(buildMatch(pool, rand));
      } else {
        deck.push(buildChoice("capital-of", pickState(pool, used, rand), pool, rand));
      }
      continue;
    }

    const stateId = pickState(pool, used, rand);
    if (skill === "tap-state") {
      deck.push(buildTap(stateId));
    } else {
      deck.push(buildChoice(skill, stateId, pool, rand));
    }
  }

  return deck;
}

export function withFocusedState(deck: Question[], lesson: Lesson, stateId: string | null | undefined): Question[] {
  if (!stateId || !lesson.stateIds.includes(stateId)) return deck;
  const rest = deck.filter((q) => !("stateId" in q) || q.stateId !== stateId);
  return [buildChoice("highlight-name", stateId, lesson.stateIds), ...rest].slice(0, lesson.questionCount);
}

export function withPlayMode(deck: Question[], lesson: Lesson, play: string | null | undefined): Question[] {
  if (play !== "match" || lesson.stateIds.length < 4) return deck;
  const existing = deck.find((q): q is MatchQuestion => q.kind === "match");
  const match = existing ?? buildMatch(lesson.stateIds);
  return [match, ...deck.filter((q) => q !== match)].slice(0, lesson.questionCount);
}

export function accuracyOf(correct: number, errors: number): number {
  const total = correct + errors;
  if (total === 0) return 100;
  return Math.round((correct / total) * 1000) / 10;
}

export function starsFor(passed: boolean, accuracy: number): number {
  if (!passed) return 0;
  if (accuracy >= 95) return 3;
  if (accuracy >= 85) return 2;
  return 1;
}

export function evaluateQuiz(
  lesson: Lesson,
  correct: number,
  errors: number,
): { accuracy: number; passed: boolean; stars: number } {
  const accuracy = accuracyOf(correct, errors);
  const passed = correct + errors > 0 && accuracy >= lesson.goals.accuracy;
  return { accuracy, passed, stars: starsFor(passed, accuracy) };
}

export function factId(stateId: string, index: number): string {
  return `${stateId}-${index}`;
}
