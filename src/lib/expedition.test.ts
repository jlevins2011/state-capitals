import {describe,it,expect} from 'vitest';
import {campProgress, discoveredStates, explorerRank, questionFacts} from './expedition';
import {createChild} from './storage';
import {buildChoice,buildMatch} from './quiz';
import {lessonsInWorld} from '../data/curriculum';
describe('expedition rewards',()=>{
 it('lights states from collected facts, never lesson IDs or duplicates',()=>{const c=createChild('Scout','ember');c.factsFound=['ME-0','ME-1','ne-meet','NY-0'];expect(discoveredStates(c)).toEqual(['ME','NY']);});
 it('requires an earned exam star to stamp a camp',()=>{const c=createChild('Scout','ember');const exam=lessonsInWorld('maple-camp').find(l=>l.kind==='exam')!;c.completedLessons[exam.id]={stars:0,attempts:1,bestAccuracy:50,completedAt:0};expect(campProgress(c,'maple-camp').stamped).toBe(false);c.completedLessons[exam.id].stars=1;expect(campProgress(c,'maple-camp').stamped).toBe(true);expect(explorerRank(c)).toBe('New Explorer');});
 it('awards the actual matched state and correct fact index',()=>{const q=buildMatch(['ME','NY','MA','VT']);expect(questionFacts(q,'VT')).toEqual(['VT-0']);expect(questionFacts(buildChoice('capital-of','ME',['ME','NY','MA','VT']))).toEqual(['ME-1']);});
});
