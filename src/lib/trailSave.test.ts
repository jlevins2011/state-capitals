import {beforeEach,it,expect} from 'vitest';
import {clearTrail,readTrail,writeTrail,type TrailSave} from './trailSave';
import {buildChoice} from './quiz';
beforeEach(()=>localStorage.clear());
const draft:TrailSave={version:1,lessonId:'ne-meet',deck:[buildChoice('highlight-name','ME',['ME','NY','MA','VT'])],index:0,correct:1,errors:2,stateErrors:{ME:2},factsFound:['ME-0'],matched:[],elapsed:3000,streak:0,bestStreak:1,feedback:{ok:false,text:'Maine',fact:'A fact'},selected:'New York',wrongId:null};
it('restores the same deck, correction, scores and elapsed time only for this child and lesson',()=>{expect(writeTrail('one',draft)).toBe(true);expect(readTrail('one','ne-meet')).toEqual(draft);expect(readTrail('two','ne-meet')).toBeNull();expect(readTrail('one','ne-map')).toBeNull();clearTrail('one');expect(readTrail('one','ne-meet')).toBeNull();});
it('ignores malformed and obsolete drafts',()=>{localStorage.setItem('camp-compass.trail.one','broken');expect(readTrail('one','ne-meet')).toBeNull();writeTrail('one',{...draft,index:999});expect(readTrail('one','ne-meet')).toBeNull();});
it('does not resume old trivia questions or carry their partial scores into the new trail',()=>{
  for(const skill of ['fact','nickname']) {
    localStorage.setItem('camp-compass.trail.one',JSON.stringify({...draft,deck:[{...draft.deck[0],skill}]}));
    expect(readTrail('one','ne-meet')).toBeNull();
  }
});
it('converts saved silhouette questions to full-map questions without losing progress',()=>{
  localStorage.setItem('camp-compass.trail.one',JSON.stringify({...draft,deck:[{...draft.deck[0],skill:'silhouette',prompt:'Which state is this shape?'}]}));
  const resumed=readTrail('one','ne-meet')!;
  expect(resumed.deck[0]).toEqual({...draft.deck[0],skill:'highlight-name',prompt:'Which state is glowing on the map?'});
  expect(resumed.correct).toBe(draft.correct);
  expect(resumed.index).toBe(draft.index);
  expect(resumed.elapsed).toBe(draft.elapsed);
});
