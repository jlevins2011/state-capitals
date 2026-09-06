export type Coat = "ember" | "snow" | "dusk" | "moss";

export type RegionId = "northeast" | "southeast" | "midwest" | "southwest" | "west" | "all";

export type LessonKind = "guide" | "map" | "capitals" | "facts" | "match" | "exam";

export type QuestionSkill =
  | "highlight-name"
  | "tap-state"
  | "capital-of"
  | "state-of"
  | "match-capitals";

export type Mood = "dawn" | "day" | "dusk" | "fire" | "night";

export type View =
  | { name: "title" }
  | { name: "profiles" }
  | { name: "map" }
  | { name: "lesson"; lessonId: string }
  | { name: "results"; lessonId: string; sessionId: string }
  | { name: "parent-gate" }
  | { name: "parent" }
  | { name: "settings" }
  | { name: "journal" };

export type LessonGoals = {
  accuracy: number;
};

export type Lesson = {
  id: string;
  worldId: string;
  number: number;
  title: string;
  tease: string;
  kind: LessonKind;
  regionId: RegionId;
  stateIds: string[];
  skills: QuestionSkill[];
  questionCount: number;
  goals: LessonGoals;
  intro: string;
  tip: string;
};

export type World = {
  id: string;
  name: string;
  subtitle: string;
  mood: Mood;
  regionId: RegionId;
};

export type StateInfo = {
  id: string;
  name: string;
  capital: string;
  regionId: Exclude<RegionId, "all">;
  nickname: string;
  facts: [string, string];
};

export type LessonRecord = {
  stars: number;
  bestAccuracy: number;
  attempts: number;
  completedAt: number;
};

export type Session = {
  id: string;
  childId: string;
  lessonId: string;
  startedAt: number;
  durationMs: number;
  accuracy: number;
  errors: number;
  correct: number;
  stateErrors: Record<string, number>;
  stars: number;
  passed: boolean;
  factsFound: string[];
};

export type Child = {
  id: string;
  name: string;
  coat: Coat;
  createdAt: number;
  completedLessons: Record<string, LessonRecord>;
  sessions: Session[];
  factsFound: string[];
};

export type Settings = {
  sound: boolean;
  highContrast: boolean;
  alwaysShowLabels: boolean;
};

export type StoreData = {
  version: 1;
  parentPin: string | null;
  children: Child[];
  activeChildId: string | null;
  settings: Settings;
};

export type ChoiceQuestion = {
  kind: "choice";
  skill: Exclude<QuestionSkill, "tap-state" | "match-capitals">;
  stateId: string;
  prompt: string;
  choices: string[];
  answer: string;
  fact: string;
};

export type TapQuestion = {
  kind: "tap";
  skill: "tap-state";
  stateId: string;
  prompt: string;
  answer: string;
  fact: string;
};

export type MatchQuestion = {
  kind: "match";
  skill: "match-capitals";
  prompt: string;
  left: { id: string; label: string }[];
  right: { id: string; label: string }[];
  pairs: Record<string, string>;
  fact: string;
};

export type Question = ChoiceQuestion | TapQuestion | MatchQuestion;

export type QuizSnapshot = {
  questions: Question[];
  index: number;
  startedAt: number | null;
  correct: number;
  errors: number;
  stateErrors: Record<string, number>;
  lastWasError: boolean;
  finished: boolean;
  factsFound: string[];
};
