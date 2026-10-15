import assert from 'node:assert/strict';
import * as T from './dist/vendor/three.module.min.js';
import {makePedestrian,posePedestrian} from './dist/pedestrian.mjs';
import {pedestrianMotion} from './dist/pedestrian-motion.mjs';
import {Drive} from './dist/engine.mjs';
import {ArcadeDrive} from './dist/arcade.mjs';
import {createWorld,updateWorld,createIntegratedWorld,updateIntegratedWorld} from './dist/world3d.mjs';
const p=makePedestrian(),q=makePedestrian();let skins=0,bones=0;
p.traverse(o=>{if(o.isSkinnedMesh)skins++;if(o.isBone)bones++;});assert.ok(skins>0&&bones>20);
posePedestrian(p,{elapsed:.6,time:2});const first=p.userData.rig.head.quaternion.clone();
for(let i=0;i<100;i++)posePedestrian(p,{elapsed:.6,time:2});assert.ok(first.angleTo(p.userData.rig.head.quaternion)<1e-6,'Paused head does not accumulate rotation');
posePedestrian(p,{elapsed:1.8,time:3});assert.equal(p.userData.rig.actions.Run.getEffectiveWeight(),1);assert.equal(q.userData.rig.actions.Run.getEffectiveWeight(),0,'Independent skeletons');
posePedestrian(p,{elapsed:1.8,time:3,flight:.4});assert.equal(p.userData.rig.actions.Death.getEffectiveWeight(),1);
const w=createWorld({index:1,textures:false}),d=new Drive(1);d.start();d.eventTime=1.8;d.step(.01);updateWorld(w,d);
const m=pedestrianMotion(d.eventTime);assert.ok(Math.abs(w.child.position.x-m.x)<1e-9);assert.ok(Math.abs(w.child.position.z-(-d.scene.hazard+m.towardCar))<1e-9);
const a=new ArcadeDrive(),aw=createIntegratedWorld();a.start();a.z=130;a.input.gas=true;for(let i=0;i<240;i++)a.step(1/120);updateIntegratedWorld(aw,a);assert.equal(aw.actors[1].position.x,a.actors[1].x);if(!a.actors[1].hit)assert.equal(aw.actors[1].position.z,-a.actors[1].currentZ);
console.log(`Pedestrian: ${skins} skinned meshes, ${bones} bones; animation independence, pause stability, acceleration and physics/render path agreement passed.`);
const {makeChild,makeBicycle}=await import('./dist/world3d.mjs');const {poseCyclist}=await import('./dist/pedestrian.mjs');
const kid=makeChild(),bike=makeBicycle();assert.equal(kid.userData.rig.kind,'child');assert.equal(bike.userData.rider.userData.rig.kind,'cyclist');assert.ok(kid.scale.x<1);
bike.rotation.y=0;
for(const travel of [0,.3,1,2,3,5]){
 poseCyclist(bike,{travel});const phase=bike.userData.crank.rotation.z,rig=bike.userData.rider.userData.rig;
 for(const [suffix,side] of [['L',-1],['R',1]]){
  const palm=rig.body.getObjectByName('Palm'+suffix).getWorldPosition(new T.Vector3()),hand=new T.Vector3(.32,1.34,side*.22);assert.ok(palm.distanceTo(hand)<.025,'Hands remain on handlebars');
  const ankle=rig.body.getObjectByName('LowerLeg'+suffix+'_end').getWorldPosition(new T.Vector3()),pedal=new T.Vector3(.08+side*.12*(Math.cos(phase)-Math.sin(phase)),.5+side*.12*(Math.sin(phase)+Math.cos(phase)),side*.14);assert.ok(ankle.distanceTo(pedal)<.035,`Feet follow pedals: ${ankle.distanceTo(pedal)}`);
 }
}
poseCyclist(bike,{travel:2});const stable=rigPositions(bike);for(let i=0;i<10;i++)poseCyclist(bike,{travel:2});const repeat=rigPositions(bike);assert.ok(stable.every((x,i)=>Math.abs(x-repeat[i])<1e-6),'Cycling pose is stable while paused');
function rigPositions(b){const out=[];b.traverse(o=>{if(o.isBone)out.push(...o.getWorldPosition(new T.Vector3()).toArray());});return out;}
console.log('Child variant, cyclist handlebar/pedal IK and repeatable cycling pose passed.');
