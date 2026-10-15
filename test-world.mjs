import assert from 'node:assert/strict';
import * as THREE from './dist/vendor/three.module.min.js';
import {createWorld,updateWorld} from './dist/world3d.mjs';
import {Drive} from './dist/engine.mjs';
const w=createWorld({textures:false});const d=new Drive(0);d.start();
const ray=new THREE.Raycaster();
function firstVisible(){w.scene.updateMatrixWorld(true);const head=new THREE.Vector3(0,1.12,0);w.child.localToWorld(head);ray.set(w.camera.position,head.clone().sub(w.camera.position).normalize());const hits=ray.intersectObjects([w.environment,w.van,w.child],true);if(!hits.length)return null;let o=hits[0].object;while(o.parent&&o.parent!==w.scene)o=o.parent;return o;}
for(const z of [0,30,55]){d.z=z;d.actorX=-5.05;updateWorld(w,d);assert.equal(firstVisible(),w.van,`Child must be behind the van at ${z}m`);}
d.z=55;d.eventTime=3;d.actorX=-1.4;updateWorld(w,d);assert.equal(firstVisible(),w.child,'Emerging child should be visible');
assert.ok(w.child.position.x>-1,'Child moves into the driver lane');
updateWorld(w,d,{yaw:.5});assert.equal(w.camera.rotation.y,.5);updateWorld(w,d,{yaw:0,still:true});assert.equal(w.camera.rotation.y,0);
d.actorClear=true;updateWorld(w,d);assert.equal(w.child.visible,false);
let triangles=0,meshes=0;w.scene.traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;for(const n of o.geometry.attributes.position.array)assert.ok(Number.isFinite(n));}});
assert.ok(meshes<220,'Draw-call budget should remain modest');assert.ok(triangles<180000,'Geometry budget should remain modest');
console.log(`3D checks passed: actual occlusion, child emergence, look controls, completed crossing, finite geometry; ${meshes} meshes / ${Math.round(triangles)} triangles.`);
