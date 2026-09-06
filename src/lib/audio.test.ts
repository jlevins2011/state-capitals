import {expect,it,vi} from 'vitest';
import {setSoundEnabled,sounds} from './audio';
it('keeps every chime silent when disabled and mutes the shared output immediately',()=>{
 const gain={value:1,setValueAtTime:vi.fn(),exponentialRampToValueAtTime:vi.fn()};
 const createOscillator=vi.fn(()=>({frequency:{value:0},connect:vi.fn(),disconnect:vi.fn(),start:vi.fn(),stop:vi.fn()}));
 const createGain=vi.fn(()=>({gain,connect:vi.fn(),disconnect:vi.fn()}));
 const mock=vi.fn(function(){return {currentTime:0,destination:{},createOscillator,createGain};});
 vi.stubGlobal('AudioContext',mock);
 setSoundEnabled(false);sounds.star();sounds.correct();expect(createOscillator).not.toHaveBeenCalled();
 setSoundEnabled(true);sounds.star();expect(createOscillator).toHaveBeenCalledTimes(4);
 setSoundEnabled(false);expect(gain.setValueAtTime).toHaveBeenLastCalledWith(0,0);sounds.combo();expect(createOscillator).toHaveBeenCalledTimes(4);
 vi.unstubAllGlobals();
});
