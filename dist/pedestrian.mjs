import * as THREE from './vendor/three.module.min.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {clone} from './vendor/SkeletonUtils.js';
import data from './assets/pedestrian-data.mjs';
import {pedestrianMotion,PREPARE} from './pedestrian-motion.mjs?v=070';
const bytes=Uint8Array.from(atob(data),c=>c.charCodeAt(0));
const asset=await new GLTFLoader().parseAsync(bytes.buffer,'');
const bounds=new THREE.Box3().setFromObject(asset.scene),scale=1.76/(bounds.max.y-bounds.min.y);
export function makePedestrian(){
 const actor=new THREE.Group();actor.name='pedestrian';const body=clone(asset.scene);body.scale.setScalar(scale);body.position.y=-bounds.min.y*scale;actor.add(body);
 body.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;}});
 const mixer=new THREE.AnimationMixer(body),actions={};
 for(const clip of asset.animations){const action=mixer.clipAction(clip);action.play();action.setEffectiveWeight(0);actions[clip.name]=action;}
 const head=body.getObjectByName('Head'),torso=body.getObjectByName('Torso');
 actor.userData={legs:[],arms:[],rig:{body,mixer,actions,head,torso,headRest:head?.quaternion.clone(),torsoRest:torso?.quaternion.clone()}};
 posePedestrian(actor,{elapsed:null,time:0});return actor;
}
export function posePedestrian(actor,{elapsed=null,time=0,flight=null,impactSpeed=24}={}){
 const {body,mixer,actions,head,torso,headRest,torsoRest}=actor.userData.rig;
 if(head)head.quaternion.copy(headRest);if(torso)torso.quaternion.copy(torsoRest);
 const m=pedestrianMotion(elapsed),running=elapsed!==null&&elapsed>PREPARE;
 for(const a of Object.values(actions))a.setEffectiveWeight(0);
 const blend=Math.min(1,m.speed/3.2);
 actions.Idle.setEffectiveWeight(running?0:1);actions.Walk.setEffectiveWeight(running?1-blend:0);actions.Run.setEffectiveWeight(running?blend:0);
 // Pose sampling is driven by travelled distance, not display frame count.
 mixer.setTime(running?m.travel/2.8:time);
 body.position.y=-bounds.min.y*scale+blend*.065;
 body.rotation.set(running?Math.min(.16,m.speed*.05):0,0,0);
 actor.rotation.set(0,Math.atan2(1,.15),0);
 if(!running&&head){head.rotation.y+=elapsed===null?Math.sin(time*1.2)*.16:-.65*Math.sin(Math.min(elapsed/PREPARE,1)*Math.PI);}
 if(!running&&elapsed!==null&&torso)torso.rotation.x+=Math.sin(elapsed/PREPARE*Math.PI)*.13;
 if(flight!==null){
  // Keep authored limb reaction; tumble only part of a turn, then settle.
  for(const a of Object.values(actions))a.setEffectiveWeight(0);actions.Death.setEffectiveWeight(1);
  const t=Math.max(0,flight);mixer.setTime(Math.min(t*1.45,actions.Death.getClip().duration-.001));
  body.rotation.x=Math.sin(Math.min(t/1.15,1)*Math.PI)*(.5+Math.min(impactSpeed,50)*.005);
  actor.rotation.z=-Math.sin(Math.min(t/1.4,1)*Math.PI)*.48;
 }
 actor.updateMatrixWorld(true);
}
