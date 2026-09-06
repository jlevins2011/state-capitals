import { useEffect, useRef, useState } from 'react';
import { getLesson, WORLDS } from '../data/curriculum';
import { getState } from '../data/states';
import { sounds, unlockAudio } from '../lib/audio';
import { lessonShowsAbbreviations } from '../lib/mapLabels';
import { buildDeck, withFocusedState, withPlayMode } from '../lib/quiz';
import { questionFacts } from '../lib/expedition';
import { clearTrail, readTrail, writeTrail, type TrailSave } from '../lib/trailSave';
import { useActiveChild, useStore } from '../store/StoreContext';
import type { MatchQuestion, Question } from '../types';
import { MatchBoard } from './MatchBoard';
import { Pip } from './Pip';
import { StateSilhouette, UsaMap } from './UsaMap';
const skillNames:Record<string,string>={'highlight-name':'Map discovery','tap-state':'Find the state',silhouette:'Shape detective','capital-of':'Capital connection','state-of':'Follow the capital','match-capitals':'Connect the capitals'};

export function LessonView({lessonId}:{lessonId:string}) {
  const {state,dispatch}=useStore();
  const child=useActiveChild();
  const lesson=getLesson(lessonId);
  const [saved]=useState(()=>child?readTrail(child.id,lessonId):null);
  const [started,setStarted]=useState(false);
  const [paused,setPaused]=useState(false);
  const [deck]=useState(()=>{
    if(saved) return saved.deck;
    if(!lesson)return [];
    const params=new URLSearchParams(window.location.search);
    return withPlayMode(withFocusedState(buildDeck(lesson),lesson,params.get('focus')?.toUpperCase()),lesson,params.get('play')?.toLowerCase());
  });
  const [index,setIndex]=useState(saved?.index??0);
  const [correct,setCorrect]=useState(saved?.correct??0);
  const [errors,setErrors]=useState(saved?.errors??0);
  const [stateErrors,setStateErrors]=useState<Record<string,number>>(saved?.stateErrors??{});
  const [factsFound,setFactsFound]=useState<string[]>(saved?.factsFound??[]);
  const [feedback,setFeedback]=useState<TrailSave['feedback']>(saved?.feedback??null);
  const [wrongId,setWrongId]=useState<string|null>(saved?.wrongId??null);
  const [selected,setSelected]=useState<string|null>(saved?.selected??null);
  const [leftPick,setLeftPick]=useState<string|null>(null);
  const [matched,setMatched]=useState<string[]>(saved?.matched??[]);
  const [streak,setStreak]=useState(saved?.streak??0);
  const [bestStreak,setBestStreak]=useState(saved?.bestStreak??0);
  const [saveFailed,setSaveFailed]=useState(false);
  const elapsed=useRef(saved?.elapsed??0);
  const clock=useRef<number|null>(null);
  const finished=useRef(false);
  const answerLock=useRef(false);
  const feedbackButton=useRef<HTMLButtonElement>(null);
  const prompt=useRef<HTMLHeadingElement>(null);
  const pauseButton=useRef<HTMLButtonElement>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const currentElapsed=()=>elapsed.current+(clock.current===null?0:performance.now()-clock.current);

  useEffect(()=>{if(started&&!paused)clock.current=performance.now();return()=>{if(clock.current!==null){elapsed.current+=performance.now()-clock.current;clock.current=null;}};},[started,paused]);
  useEffect(()=>{const hide=()=>{if(document.hidden&&started)setPaused(true);};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide);},[started]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape'&&started){e.preventDefault();setPaused(p=>!p);}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[started]);
  useEffect(()=>{if(paused)dialog.current?.showModal();else dialog.current?.close();},[paused]);
  useEffect(()=>{if(feedback)feedbackButton.current?.focus();else if(started)prompt.current?.focus();},[feedback,index,started]);
  useEffect(()=>{
    if(!started||!child||finished.current)return;
    const persist=()=>{if(finished.current)return;const ok=writeTrail(child.id,{version:1,lessonId,deck,index,correct,errors,stateErrors,factsFound,matched,elapsed:currentElapsed(),streak,bestStreak,feedback,selected,wrongId});setSaveFailed(!ok);};
    persist();window.addEventListener('pagehide',persist);
    return()=>window.removeEventListener('pagehide',persist);
  },[started,paused,child,lessonId,deck,index,correct,errors,stateErrors,factsFound,matched,streak,bestStreak,feedback,selected,wrongId]);
  if(!child||!lesson)return null;
  const world=WORLDS.find(w=>w.id===lesson.worldId);
  const question=deck[index];
  const showMapLabels=state.settings.alwaysShowLabels||lessonShowsAbbreviations(lesson);
  const pose=feedback?.ok?'celebrate':paused?'sit':'idle';
  const progress=(index+(feedback&&!feedback.retry?1:0))/deck.length;

  function award(q:Question,id?:string) {
    setCorrect(n=>n+1);setStreak(streak+1);setBestStreak(Math.max(bestStreak,streak+1));
    setFactsFound(list=>[...new Set([...list,...questionFacts(q,id)])]);
    if(state.settings.sound)(streak>0&&(streak+1)%3===0?sounds.combo:sounds.correct)();
  }
  function miss(id:string){setErrors(n=>n+1);setStreak(0);setStateErrors(m=>({...m,[id]:(m[id]??0)+1}));if(state.settings.sound)sounds.miss();}
  function mark(ok:boolean,q:Question,choice?:string){
    if(feedback||paused||answerLock.current||q.kind==='match')return;
    answerLock.current=true;setSelected(choice??null);
    // Facts are gifts for visiting a state, independent of the answer score.
    setFactsFound(list=>[...new Set([...list,...questionFacts(q)])]);
    if(ok){award(q);setFeedback({ok:true,text:streak>=2?`${streak+1} lanterns in a row!`:'A new light on the trail!',fact:q.fact});}
    else{miss(q.stateId);if(q.kind==='tap')setWrongId(choice??null);setFeedback({ok:false,text:`The answer is ${q.answer}.`,fact:q.fact});}
  }
  function next(){
    if(!feedback||paused||finished.current)return;
    if(feedback.retry){setFeedback(null);answerLock.current=false;return;}
    if(index+1>=deck.length){finished.current=true;clearTrail(child!.id);dispatch({type:'record-session',lessonId,durationMs:currentElapsed(),correct,errors,stateErrors,factsFound,finished:true});return;}
    setFeedback(null);setWrongId(null);setSelected(null);setMatched([]);setLeftPick(null);setIndex(n=>n+1);answerLock.current=false;
  }
  function onMatch(id:string,q:MatchQuestion){
    if(feedback||paused||!leftPick||matched.includes(id)||answerLock.current)return;
    answerLock.current=true;
    const picked=leftPick;setLeftPick(null);
    if(q.pairs[picked]===id){
      const nextMatched=[...matched,picked];setMatched(nextMatched);award(q,picked);
      if(nextMatched.length===q.left.length)setFeedback({ok:true,text:'Every connection shines!',fact:q.left.map(s=>`${s.label} → ${getState(s.id).capital}`).join(' · ')});
      else answerLock.current=false;
    }else{miss(picked);setFeedback({ok:false,retry:true,text:`${getState(picked).name} pairs with ${getState(picked).capital}.`,fact:'Take another look. Your completed pairs are safe.'});}
  }
  return <div className="screen lesson-screen">
    <header className="lesson-top"><button ref={pauseButton} className="btn ghost" onClick={()=>started?setPaused(true):dispatch({type:'go',view:{name:'map'}})}>{started?'Ⅱ Pause':'← Expedition'}</button><div className="lesson-heading"><p className="eyebrow">{world?.name} · Trail {lesson.number}</p><b>{lesson.title}</b></div><button className="sound-toggle" aria-label={state.settings.sound?'Mute sound':'Enable sound'} onClick={()=>{unlockAudio();dispatch({type:'settings',patch:{sound:!state.settings.sound}});}}>{state.settings.sound?'Sound on':'Sound off'}</button></header>
    {!started?<section className="trail-intro"><div className="intro-art"><span className="intro-compass" aria-hidden="true">✧</span><Pip coat={child.coat} pose="sit" size={140}/></div><div className="intro panel"><p className="eyebrow">{saved?'Welcome back to the trail':skillNames[lesson.skills[0]]}</p><h1>{lesson.title}</h1><p>{lesson.intro}</p><div className="trail-brief"><span><b>{deck.length}</b> trail stops</span><span><b>{lesson.goals.accuracy}%</b> to unlock</span><span><b>No rush</b> play at your pace</span></div><div className="trail-tip"><b>Pip’s field notes</b><p>{lesson.tip}</p></div>{lesson.kind !== "exam" && <details className="field-guide"><summary>Open your field guide · {lesson.stateIds.length} states</summary><div className="field-guide-grid">{lesson.stateIds.map(id => <article key={id}><b>{getState(id).name}</b><span>{getState(id).capital}</span><small>{getState(id).nickname}</small></article>)}</div></details>}<button className="btn primary" onClick={()=>{unlockAudio();if(state.settings.sound)sounds.start();setStarted(true);}}>{saved?`Resume at stop ${index+1}`:'Light the first lantern'} →</button><p className="fine">Pause whenever you need. Your trail is saved as you play.</p></div></section>:question&&<>
      <div className="trail-hud"><span>Stop <b>{index+1}</b> of {deck.length}</span><progress aria-label="Trail progress" value={progress} max={1}/><span><b>{correct}</b> lanterns lit</span>{streak>=3&&<span className="streak-badge">✦ {streak} in a row</span>}</div>
      <div className="lesson-stage"><aside className="pip-column"><Pip coat={child.coat} pose={pose} size={108}/><p>{feedback?.ok===false?'A new connection to remember.':streak>=3?'Look at your trail glow!':'Let curiosity lead.'}</p><span className="trail-stop-number">{String(index+1).padStart(2,'0')}</span></aside><section className="prompt-card panel"><p className="eyebrow">{skillNames[question.skill]}</p><h2 ref={prompt} tabIndex={-1}>{question.prompt}</h2>
      {(question.kind==='tap'||(question.kind==='choice'&&question.skill==='highlight-name'))&&<div className="play-map"><UsaMap regionId={lesson.regionId} highlightId={question.kind==='choice'||feedback?question.stateId:null} zoomToId={question.kind==='choice'?question.stateId:null} zoomMode="tight" wrongId={wrongId} litIds={factsFound.map(id=>id.split('-')[0])} interactive={question.kind==='tap'&&!feedback&&!paused} onSelect={id=>mark(id===question.stateId,question,id)} showLabels={showMapLabels} focusIds={lesson.stateIds}/>{!showMapLabels&&<p className="tip label-hint">Use the outline and its neighbors. You’ve got this.</p>}</div>}
      {question.kind==='choice'&&question.skill==='silhouette'&&<div className="play-map silhouette-wrap"><StateSilhouette stateId={question.stateId}/></div>}
      {question.kind==='choice'&&<div className="choice-grid">{question.choices.map((choice,i)=><button key={choice} className={`choice answer-choice ${feedback&&choice===question.answer?'answer-correct':''} ${feedback&&!feedback.ok&&choice===selected?'answer-wrong':''}`} disabled={!!feedback||paused} onClick={()=>mark(choice===question.answer,question,choice)}><span className="answer-letter" aria-hidden="true">{feedback&&choice===question.answer?'✓':String.fromCharCode(65+i)}</span>{choice}</button>)}</div>}
      {question.kind==='match'&&<MatchBoard question={question} leftPick={leftPick} matched={matched} locked={!!feedback||paused} onPickLeft={id=>setLeftPick(id)} onChooseRight={id=>onMatch(id,question)}/>}
      {feedback&&<div role="status" className={`feedback ${feedback.ok?'is-ok':'is-miss'}`}><strong>{feedback.ok?'✦':'◇'} {feedback.text}</strong><p><span className="fact-label">{feedback.retry || question.kind === 'match' ? 'Trail note' : 'Just for fun · not tested'}</span>{feedback.fact}</p><button ref={feedbackButton} className="btn primary" onClick={next}>{feedback.retry?'Try that connection':index+1>=deck.length?'Complete the trail':'Next lantern'} →</button></div>}
      </section></div>
    </>}
    {saveFailed&&<p role="alert" className="save-warning">This browser couldn’t save your trail. Keep this tab open to finish your session.</p>}
    <dialog ref={dialog} className="pause-dialog" onCancel={e=>{e.preventDefault();setPaused(false);pauseButton.current?.focus();}}><Pip coat={child.coat} pose="sit" size={100}/><p className="eyebrow">Rest by the campfire</p><h2>Your trail can wait.</h2><p>Stop {index+1} of {deck.length} · {correct} lanterns lit.<br/>{saveFailed?'Progress is available in this tab.':'Your place is saved on this device.'}</p><div className="row-actions"><button autoFocus className="btn primary" onClick={()=>{setPaused(false);pauseButton.current?.focus();}}>Keep exploring</button><button className="btn ghost" onClick={()=>dispatch({type:'go',view:{name:'map'}})}>Return to camp</button></div></dialog>
  </div>;
}
