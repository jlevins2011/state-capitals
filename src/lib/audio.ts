let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;
export function setSoundEnabled(value: boolean) {
  enabled = value;
  if (ctx && master) master.gain.setValueAtTime(value ? 1 : 0, ctx.currentTime);
}
function context(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as {webkitAudioContext:typeof AudioContext}).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = enabled ? 1 : 0;
    master.connect(ctx.destination);
  }
  return ctx;
}
export function unlockAudio(): void {
  const c = context();
  if (c?.state === 'suspended') void c.resume();
}
function tone(freq:number,delay:number,duration:number,gain=.045,type:OscillatorType='sine') {
  if (!enabled) return;
  const c = context();
  if (!c || !master) return;
  const at = c.currentTime + delay;
  const osc = c.createOscillator(), envelope = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  envelope.gain.setValueAtTime(.0001,at);
  envelope.gain.exponentialRampToValueAtTime(gain,at+.012);
  envelope.gain.exponentialRampToValueAtTime(.0001,at+duration);
  osc.connect(envelope);envelope.connect(master);
  osc.onended=()=>{osc.disconnect();envelope.disconnect();};
  osc.start(at);osc.stop(at+duration+.02);
}
export const sounds = {
  correct() {tone(659,0,.35);tone(988,.055,.4,.02);},
  combo() {tone(659,0,.3);tone(831,.08,.35);tone(988,.16,.5);},
  miss() {tone(294,0,.3,.025);tone(247,.06,.35,.018);},
  star() {tone(523,0,.5);tone(659,.12,.5);tone(784,.24,.55);tone(1047,.36,.8,.035);},
  start() {tone(392,0,.3);tone(523,.12,.45);tone(659,.22,.6,.025);},
};
