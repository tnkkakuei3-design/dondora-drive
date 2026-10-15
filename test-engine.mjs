import assert from 'node:assert/strict';
import {SCENES,Drive} from './dist/engine.mjs';
function run(d,controller,dt=1/60){d.start();for(let i=0;i<120/dt&&d.phase==='running';i++){controller(d);d.step(dt);}return d;}
let checks=0;
for(let i=0;i<3;i++){
 const d=run(new Drive(i),d=>{
   if(d.cueVisible)d.mark();
   if(i<2){d.input.gas=d.distance>54;d.input.brake=d.distance<=54;}
   else {
     const stoppingDistance=d.v*d.v/(2*4.3);
     d.input.brake=d.distance<=9.5+stoppingDistance+.15||(d.distance<60&&d.speed>12);
     d.input.gas=!d.input.brake&&d.speed<11;
     if(d.stopped){d.input.brake=true;d.input.gas=false;d.observe('left');d.observe('right');}
   }
 });
 assert.equal(d.phase,'result',`Scene ${i} should complete`);
 assert.equal(d.outcome.safe,true,`Scene ${i} should allow safe driving`);
 assert.equal(d.outcome.score,100,`Scene ${i} should allow 100 points`);
 assert.ok(d.stopDistance>=d.scene.line);checks++;
 const bad=run(new Drive(i),d=>{if(d.cueVisible)d.mark();d.input.gas=true;});
 assert.equal(bad.outcome.safe,false);assert.ok(bad.outcome.score<=59);checks++;
}
const paused=new Drive();paused.start();paused.input.gas=true;paused.step(.02);const z=paused.z;paused.pause();paused.step(.05);assert.equal(paused.z,z);assert.equal(paused.input.gas,false);paused.resume();paused.step(.02);assert.ok(paused.z>z);checks++;
const markers=new Drive();markers.start();assert.equal(markers.mark(),false);markers.z=40;assert.equal(markers.mark(),true);assert.equal(markers.mark(),false);checks++;
const braking=new Drive();braking.start();braking.input.gas=braking.input.brake=true;const v=braking.v;braking.step(.05);assert.ok(braking.v<v);checks++;
const stopped=new Drive(2);stopped.start();stopped.z=70;stopped.v=0;for(let i=0;i<100;i++)stopped.step(.02);assert.equal(stopped.stopped,false);assert.equal(stopped.observe('left'),false);checks++;
const junction=new Drive(2);junction.start();junction.z=90;junction.v=0;for(let i=0;i<500;i++)junction.step(.02);assert.equal(junction.stopped,true);assert.equal(junction.phase,'running');junction.observe('left');junction.step(.02);assert.equal(junction.phase,'running');junction.observe('right');junction.step(.02);assert.equal(junction.outcome.safe,true);checks++;
const simulate=(dt)=>{const d=new Drive();d.start();d.input.brake=true;for(let i=0;i<5/dt;i++)d.step(dt);return d.z;};assert.ok(Math.abs(simulate(1/30)-simulate(1/60))<.01);checks++;
console.log(`${checks} driving checks passed: all scenarios, early stop, missed stop, pause, discovery, brake priority, intersection checks, frame-rate consistency.`);
