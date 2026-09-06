import type { Question } from '../types';
export type TrailSave = {
  version: 1; lessonId: string; deck: Question[]; index: number; correct: number; errors: number;
  stateErrors: Record<string,number>; factsFound: string[]; matched: string[];
  elapsed: number; streak: number; bestStreak: number;
  feedback: null | {ok:boolean; text:string; fact:string; retry?:boolean};
  selected: string | null; wrongId: string | null;
};
const key=(childId:string)=>`camp-compass.trail.${childId}`;
export function readTrail(childId:string,lessonId:string):TrailSave|null {
  try { const s=JSON.parse(localStorage.getItem(key(childId))??'null');
    if(s?.version!==1 || s.lessonId!==lessonId || !Array.isArray(s.deck) || !s.deck.length || !Number.isInteger(s.index) || s.index<0 || s.index>=s.deck.length || !Array.isArray(s.matched) || !Array.isArray(s.factsFound)) return null;
    return s;
  } catch { return null; }
}
export function writeTrail(childId:string,save:TrailSave):boolean {
  try {localStorage.setItem(key(childId),JSON.stringify(save));return true;}catch{return false;}
}
export function clearTrail(childId:string) {try{localStorage.removeItem(key(childId));}catch{/* In-memory play remains available. */}}
