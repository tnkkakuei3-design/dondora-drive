import assert from 'node:assert/strict';
import {Drive} from './dist/engine.mjs';
import {ArcadeDrive} from './dist/arcade.mjs';
for(const fps of [5,30,120])for(const lane of [0,1]){
 for(let index=0;index<3;index++){
  const d=new Drive(index);d.start();d.steer(lane?1:-1);d.input.gas=true;
  while(d.phase==='running')d.step(1/fps);
  assert.ok(d.impact,`Accurate intercept course ${index}, lane ${lane}, ${fps} FPS`);
  assert.equal(d.x,lane?1.38:-1.38);assert.ok(d.impact.speed>60);assert.ok(d.impact.speed<=72.00001);
 }
 const a=new ArcadeDrive();a.start();a.steer(lane?1:-1);a.input.gas=true;
 while(a.phase==='running')a.step(1/fps);
 assert.equal(a.hits,3,`Integrated intercept, lane ${lane}, ${fps} FPS`);
}
for(let index=0;index<3;index++){
 const d=new Drive(index);d.start();d.input.gas=true;
 while(d.eventTime===null)d.step(1/120);
 d.steer(1);
 while(d.phase==='running')d.step(1/120);
 assert.equal(d.impact,null,'Lane change after launch can evade');
 const b=new Drive(index);b.start();b.input.gas=true;
 while(b.eventTime===null)b.step(1/120);
 b.input.brake=true;b.input.gas=false;
 for(let n=0;n<1200&&b.phase==='running';n++)b.step(1/120);
 assert.equal(b.impact,null,'Braking after launch can avoid contact');
}
console.log('Interception: all 3 characters in both lanes at 5/30/120 FPS, 72 km/h cap, lane/brake evasion passed.');
