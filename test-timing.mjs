import assert from 'node:assert/strict';
import {Drive} from './dist/engine.mjs';
import {ArcadeDrive} from './dist/arcade.mjs';
import {createWorld,updateWorld,createIntegratedWorld,updateIntegratedWorld} from './dist/world3d.mjs';
const near=(a,b,label)=>assert.ok(Math.abs(a-b)<1e-8,`${label}: ${a} != ${b}`);
for(const make of [()=>new Drive(0),()=>new Drive(1),()=>new Drive(2),()=>new ArcadeDrive()]){
 const reference=make();reference.start();reference.input.gas=true;
 for(let i=0;i<240;i++)reference.step(1/120);
 const world=reference.arcade?createIntegratedWorld():createWorld({index:reference.index,textures:false});
 for(const fps of [5,10,15,20,30,60,120]){
  const d=make();d.start();d.input.gas=true;
  for(let i=0;i<2*fps;i++)d.step(1/fps);
  near(d.time,2,'elapsed time');near(d.z,reference.z,'distance');near(d.speed,reference.speed,'speed');
  (d.arcade?updateIntegratedWorld:updateWorld)(world,d);
  near(world.camera.position.z,-d.z,'camera distance');
  d.input.brake=true;
  for(let i=0;i<4*fps;i++)d.step(1/fps);
  near(d.speed,0,'braking to rest');const z=d.z;
  d.step(.2);near(d.z,z,'stationary distance');
  d.pause();const time=d.time;d.step(.2);near(d.time,time,'paused time');
 }
}
for(const fps of [5,10,15]){
 const d=new ArcadeDrive();d.start();d.input.gas=true;
 for(let i=0;i<60*fps&&d.phase==='running';i++)d.step(1/fps);
 assert.equal(d.points,600);assert.equal(d.hits,3);
}
console.log('Timing checks passed: all 4 courses at 5–120 FPS, elapsed time, speed, camera distance, braking, rest, pause and low-FPS collisions.');
