import { useState } from 'react';
import { getLesson, WORLDS, lessonsInWorld } from '../data/curriculum';
import { isLessonUnlocked, recommendedLessonId, totalStars } from '../lib/stats';
import { campProgress, discoveredStates, explorerRank } from '../lib/expedition';
import { useActiveChild, useStore } from '../store/StoreContext';
import { Pip } from './Pip';
import { UsaMap } from './UsaMap';
const symbols = ['❧','☀','≈','△','♧','✧'];
const kinds = {guide:'Discover',map:'Map trail',capitals:'Capital trail',facts:'Story trail',match:'Connections',exam:'Passport challenge'};
export function RegionMap() {
  const { dispatch } = useStore();
  const child = useActiveChild();
  const rec = child ? recommendedLessonId(child) : '';
  const recommended = getLesson(rec);
  const [worldId,setWorldId]=useState(recommended?.worldId ?? WORLDS[0].id);
  if (!child || !recommended) return null;
  const world=WORLDS.find(w=>w.id===worldId)!;
  const progress=campProgress(child,worldId);
  const found=discoveredStates(child);
  return <div className="screen map-screen">
    <header className="expedition-nav"><button className="brand text-back" onClick={()=>dispatch({type:'go',view:{name:'title'}})}>✧ CAMP COMPASS</button><nav><button className="nav-active" aria-current="page">Expedition</button><button onClick={()=>dispatch({type:'go',view:{name:'journal'}})}>Story journal</button><button onClick={()=>dispatch({type:'go',view:{name:'settings'}})}>Settings</button></nav><button className="explorer-switch" onClick={()=>dispatch({type:'go',view:{name:'profiles'}})}><Pip coat={child.coat} size={38}/>{child.name}</button></header>
    <section className="expedition-banner"><div><p className="eyebrow">{explorerRank(child)}</p><h1>The next light is yours.</h1><p>Pick up your lantern. Your next stop is <b>{recommended.title}</b>.</p><button className="btn primary" onClick={()=>dispatch({type:'go',view:{name:'lesson',lessonId:rec}})}>Continue the journey →</button></div><div className="expedition-totals"><span><b>{found.length}<small>/ 50</small></b>states discovered</span><span><b>{totalStars(child)}<small> ★</small></b>trail stars earned</span><span><b>{WORLDS.filter(w=>campProgress(child,w.id).stamped).length}<small>/ 6</small></b>passport stamps</span></div></section>
    <div className="expedition-layout"><aside className="camp-selector"><p className="eyebrow">Your expedition</p><h2>Six camps. A country of stories.</h2><div className="camp-tabs" role="tablist" aria-label="Camps">{WORLDS.map((w,i)=>{const p=campProgress(child,w.id);return <button key={w.id} role="tab" aria-selected={worldId===w.id} aria-controls="camp-detail" className={`camp-tab ${worldId===w.id?'selected':''}`} onClick={()=>setWorldId(w.id)}><span className="camp-emblem" aria-hidden="true">{symbols[i]}</span><span><b>{w.name}</b><small>{p.stamped?'Passport stamped':`${p.done} of ${p.total} trails complete`}</small></span><span aria-hidden="true">{p.stamped?'✓':'›'}</span></button>;})}</div><div className="companion-note"><Pip coat={child.coat} size={68} pose="sit"/><p>Every trail leaves a light.<br/><b>Every mistake shows the way.</b></p></div></aside>
    <section id="camp-detail" role="tabpanel" aria-label={world.name} className={`camp-detail mood-${world.mood}`}><header className="camp-heading"><div><p className="eyebrow">{world.subtitle}</p><h2>{world.name}</h2></div><span className={`passport-seal ${progress.stamped?'earned':''}`}>{progress.stamped?'✓ STAMPED':'PASSPORT'}<small>{progress.stamped?'Well explored':'Pass the final trail'}</small></span></header><div className="map-preview expedition-map"><UsaMap regionId={world.regionId} litIds={found} showLabels/><span className="map-legend"><i/> Your discovered states glow gold</span></div><div className="camp-progress"><span>{progress.done} of {progress.total} trails lit</span><progress value={progress.done} max={progress.total}/></div><ol className="trail-list">{lessonsInWorld(world.id).map(l=>{const stars=child.completedLessons[l.id]?.stars ?? 0;const open=isLessonUnlocked(child,l.id);return <li key={l.id}><button disabled={!open} className={`trail-row ${l.id===rec?'next':''} ${stars?'complete':''}`} onClick={()=>dispatch({type:'go',view:{name:'lesson',lessonId:l.id}})}><span className="trail-marker">{stars?'✓':l.kind==='exam'?'✧':String(l.number).padStart(2,'0')}</span><span className="trail-description"><small>{kinds[l.kind]}{l.id===rec?' · UP NEXT':''}</small><b>{l.title}</b><span>{open?l.tease:'Complete the previous trail to unlock'}</span></span><span className="trail-rating" aria-label={stars?`${stars} stars`:open?'Not completed':'Locked'}>{stars?'★'.repeat(stars)+'☆'.repeat(3-stars):open?'→':'Locked'}</span></button></li>;})}</ol></section></div>
  </div>;
}
