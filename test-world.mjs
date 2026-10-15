import assert from 'node:assert/strict';
import * as THREE from './dist/vendor/three.module.min.js';
import {createWorld,updateWorld} from './dist/world3d.mjs';
import {Drive} from './dist/engine.mjs';
const w=createWorld({textures:false});const d=new Drive(0);d.start();
const ray=new THREE.Raycaster();
function firstVisible(){w.scene.updateMatrixWorld(true);w.child.traverse(o=>{if(o.isSkinnedMesh){o.skeleton.update();o.computeBoundingSphere();o.computeBoundingBox();}});const head=w.child.userData.rig.head.getWorldPosition(new THREE.Vector3());head.y+=.05;ray.set(w.camera.position,head.clone().sub(w.camera.position).normalize());const hits=ray.intersectObjects([w.environment,w.van,w.child],true);if(!hits.length)return null;let o=hits[0].object;while(o.parent&&o.parent!==w.scene)o=o.parent;return o;}
for(const z of [0,30,55]){d.z=z;d.actorX=-5.05;updateWorld(w,d);assert.equal(firstVisible()?.name,w.van.name,`Child must be behind the van at ${z}m`);}
d.z=55;d.eventTime=1.65;d.actorX=-1.4;updateWorld(w,d);assert.equal(firstVisible()?.name,w.child.name,'Emerging child should be visible');
assert.ok(w.child.position.x>-1,'Child moves into the driver lane');
updateWorld(w,d,{yaw:.5});assert.equal(w.camera.rotation.y,.5);updateWorld(w,d,{yaw:0,still:true});assert.equal(w.camera.rotation.y,0);
d.actorClear=true;updateWorld(w,d);assert.equal(w.child.visible,false);
let triangles=0,meshes=0;w.scene.traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;for(const n of o.geometry.attributes.position.array)assert.ok(Number.isFinite(n));}});
assert.ok(meshes<220,'Draw-call budget should remain modest');assert.ok(triangles<180000,'Geometry budget should remain modest');
console.log(`3D checks passed: actual occlusion, child emergence, look controls, completed crossing, finite geometry; ${meshes} meshes / ${Math.round(triangles)} triangles.`);
for(const index of [1,2]){
 const w=createWorld({index,textures:false}),d=new Drive(index);d.start();
 const rootOf=o=>{while(o.parent&&o.parent!==w.scene)o=o.parent;return o;};
 const toward=(target)=>{w.scene.traverse(o=>{if(o.isSkinnedMesh){o.skeleton.update();o.computeBoundingSphere();o.computeBoundingBox();}});ray.set(w.camera.position,target.clone().sub(w.camera.position).normalize());return ray.intersectObjects(w.occluders.filter(o=>o.visible),true).map(h=>rootOf(h.object))[0];};
 d.z=45;updateWorld(w,d);const head=new THREE.Vector3(w.child.position.x,1.55,-d.scene.hazard);
 if(index===1){assert.equal(toward(head)?.name,w.child.name,'Waiting pedestrian visible before entering road');assert.ok(w.targets.includes(w.child));}
 else {assert.equal(toward(head)?.name,w.corner.name,'Cyclist is hidden by the near corner');assert.ok(w.targets.includes(w.corner));d.actorX=1;d.eventTime=3;updateWorld(w,d);assert.equal(toward(w.child.userData.rider.userData.rig.head.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(-.05,.14,0)))?.name,w.child.name,'Cyclist becomes visible in intersection');}
 d.actorClear=true;updateWorld(w,d);assert.equal(w.child.visible,false);
 let count=0,tri=0;w.scene.traverse(o=>{if(o.isMesh){count++;tri+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;for(const n of o.geometry.attributes.position.array)assert.ok(Number.isFinite(n));}});
 assert.ok(count<260);assert.ok(tri<180000);console.log(`Course ${index+1}: visibility and geometry passed (${count} meshes, ${Math.round(tri)} triangles).`);
}
