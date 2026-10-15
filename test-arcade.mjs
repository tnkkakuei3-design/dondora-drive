import assert from 'node:assert/strict';
import{ArcadeDrive}from'./dist/arcade.mjs';
import{Drive}from'./dist/engine.mjs';
import{createIntegratedWorld,updateIntegratedWorld,createWorld,updateWorld}from'./dist/world3d.mjs';
function run(dt){const d=new ArcadeDrive();d.start();d.input.gas=true;for(let i=0;i<120/dt&&d.phase==='running';i++)d.step(dt);return d;}
for(const dt of [1/30,1/60,1/120]){const d=run(dt);assert.equal(d.phase,'result');assert.equal(d.hits,3);assert.equal(d.maxCombo,3);assert.equal(d.points,600);assert.equal(d.events.length,3);console.log('3 contacts, 3 combo, 600 points at dt',dt);}
const paused=new ArcadeDrive();paused.start();paused.input.gas=true;paused.step(.05);paused.pause();const z=paused.z,t=paused.time;paused.step(.05);assert.equal(paused.z,z);assert.equal(paused.time,t);assert.equal(paused.input.gas,false);
const stopped=new ArcadeDrive();stopped.start();stopped.z=86;stopped.v=0;stopped.input.brake=true;for(let i=0;i<200;i++)stopped.step(.05);assert.equal(stopped.hits,0);
const missed=new ArcadeDrive();missed.start();missed.combo=2;missed.z=92;missed.v=1;missed.actors[0].started=-50;missed.step(.05);assert.equal(missed.combo,0);
const w=createIntegratedWorld();const d=run(1/60);d.phase='running';d.z=88;d.time=d.actors[0].hit.at+.3;updateIntegratedWorld(w,d);assert.ok(w.actors[0].position.y>0);assert.ok(w.sparks[0].visible);assert.equal(w.index,3);assert.equal(w.camera.position.z,-88);
const lesson=new Drive(0);lesson.start();lesson.z=85.8;lesson.v=6;lesson.eventTime=2.5;lesson.actorX=-2.2;lesson.step(.05);assert.ok(lesson.impact);const lw=createWorld({textures:false});lesson.time+=.4;updateWorld(lw,lesson);assert.ok(lw.child.position.y>0);for(let i=0;i<60;i++)lesson.step(.05);assert.equal(lesson.outcome.safe,false);
let meshes=0,tri=0;w.scene.traverse(o=>{if(o.isMesh){meshes++;tri+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;for(const n of o.geometry.attributes.position.array)assert.ok(Number.isFinite(n));}});assert.ok(meshes<360);assert.ok(tri<180000);console.log(`Integrated world: ${meshes} meshes / ${tri} triangles. Pause, combo reset, stationary non-hit, launch and lesson failure checked.`);
