import { unlockAudio } from '../lib/audio';
import { useActiveChild, useStore } from '../store/StoreContext';
import { APP_VERSION } from '../version';
import { Pip } from './Pip';

export function TitleScreen() {
  const { dispatch } = useStore();
  const child = useActiveChild();
  return <div className="screen title-screen expedition-title">
    <nav className="brand-bar"><span className="brand"><span aria-hidden="true">✧</span> CAMP COMPASS</span><button className="text-back" onClick={() => dispatch({type:'go',view:{name:'parent-gate'}})}>For grown-ups ↗</button></nav>
    <div className="title-landscape">
      <div className="fireflies" aria-hidden="true">{Array.from({length:16},(_,i)=><span key={i} className="firefly" style={{['--i' as string]:i}} />)}</div>
      <header className="title-copy"><p className="eyebrow">Fifty states. One unforgettable journey.</p><h1>A little curiosity.<br/>A grand adventure.</h1><p className="lede">Follow the lanterns with Pip. Discover the states, learn their capitals, and fill your passport with places you’ll never forget.</p><div className="title-actions"><button className="btn primary" onClick={()=>{unlockAudio();dispatch({type:'go',view:{name:child?'map':'profiles'}});}}>{child ? `Continue as ${child.name}` : 'Begin your adventure'} <span aria-hidden="true">→</span></button>{child && <button className="btn ghost" onClick={()=>dispatch({type:'go',view:{name:'profiles'}})}>Switch explorer</button>}</div><p className="title-note">Your progress stays saved on this device.</p></header>
      <div className="pip-welcome"><Pip coat={child?.coat ?? 'ember'} pose="idle" size={118}/><div><b>Your trail partner, Pip</b><span>“There’s a whole country out there.”</span></div></div>
    </div>
    <div className="adventure-promises"><div><span>01 / EXPLORE</span><h2>Find your way.</h2><p>Real maps. Memorable places. One region at a time.</p></div><div><span>02 / DISCOVER</span><h2>Make connections.</h2><p>Match each state to its capital and uncover its stories.</p></div><div><span>03 / COLLECT</span><h2>Leave a little light.</h2><p>Earn stars, collect story stones, and stamp all six camps.</p></div></div><footer className="title-footer">An adventure for curious minds <span>Camp Compass · {APP_VERSION}</span></footer>
  </div>;
}
