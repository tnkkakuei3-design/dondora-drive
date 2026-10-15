import * as THREE from './vendor/three.module.min.js';
import {mergeGeometries} from './vendor/BufferGeometryUtils.js';
const mats=new Map();
function mat(color,roughness=.85){const key=color+':'+roughness;if(!mats.has(key))mats.set(key,new THREE.MeshStandardMaterial({color,roughness}));return mats.get(key);}
function mesh(parent,geo,color,x=0,y=0,z=0){const m=new THREE.Mesh(geo,typeof color==='string'?mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(p,x,y,z,w,h,d,col){return mesh(p,new THREE.BoxGeometry(w,h,d),col,x,y,z);}
function round(p,x,y,z,w,h,d,r,col){r=Math.min(r,w/3,h/3,d/3);const s=new THREE.Shape();const a=-w/2+r,b=w/2-r,c=-h/2+r,e=h/2-r;s.moveTo(a,-h/2);s.lineTo(b,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,c);s.lineTo(w/2,e);s.quadraticCurveTo(w/2,h/2,b,h/2);s.lineTo(a,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,e);s.lineTo(-w/2,c);s.quadraticCurveTo(-w/2,-h/2,a,-h/2);const g=new THREE.ExtrudeGeometry(s,{depth:d-r*2,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:r*.5,bevelThickness:r,curveSegments:3});g.translate(0,0,-(d-r*2)/2);return mesh(p,g,col,x,y,z);}
function cyl(p,x,y,z,r1,r2,h,col,segments=10){return mesh(p,new THREE.CylinderGeometry(r1,r2,h,segments),col,x,y,z);}
function sphere(p,x,y,z,r,col,scale=[1,1,1]){const m=mesh(p,new THREE.SphereGeometry(r,12,8),col,x,y,z);m.scale.set(...scale);return m;}
function line(p,points,r,col){const curve=new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v)));return mesh(p,new THREE.TubeGeometry(curve,16,r,5,false),col);}
function texture(text,w=256,h=256,bg='#f8f4df',fg='#374f53'){if(typeof document==='undefined')return null;const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');if(!ctx)return null;ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`700 ${Math.floor(h*.48)}px sans-serif`;ctx.fillText(text,w/2,h/2,w*.9);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function label(p,x,y,z,w,h,text,bg,fg){const t=texture(text,512,128,bg,fg);const material=t?new THREE.MeshStandardMaterial({map:t,roughness:1}):mat(bg);const m=mesh(p,new THREE.PlaneGeometry(w,h),material,x,y,z);m.castShadow=false;return m;}
function planter(p,x,z,scale=1){cyl(p,x,.25*scale,z,.3*scale,.22*scale,.5*scale,'#ae8068',8);sphere(p,x,.68*scale,z,.42*scale,'#75916a',[1,1.2,1]);}
function tree(p,x,z,size=1){cyl(p,x,1.4*size,z,.11*size,.17*size,2.8*size,'#8e8370',8);sphere(p,x,3.3*size,z,1.35*size,'#7c9c77',[1,1.25,1]);sphere(p,x-.5*size,3.8*size,z-.1,.85*size,'#93ab82');sphere(p,x+.6*size,3.4*size,z+.3,.9*size,'#85a17a');}
function windowPanel(p,x,y,z,w,h){box(p,x,y,z,w+.12,h+.12,.09,'#ede9df');box(p,x,y,z+.06,w,h,.045,'#76939c');box(p,x,y,z+.095,.04,h,.035,'#d8ddd9');box(p,x,y-h*.12,z+.095,w,.035,.035,'#d8ddd9');box(p,x,y-h*.5-.08,z+.11,w+.25,.09,.23,'#a9ada6');}
function house(parent,x,z,seed){const g=new THREE.Group();parent.add(g);g.position.set(x,0,z);g.rotation.y=x<0?Math.PI/2:-Math.PI/2;const w=5.8+(seed%3)*.45,d=5.3,h=seed%4===0?3.5:6.3;const wall=['#e6e0d2','#d6dfdc','#e7d4bd','#e3e6e2'][seed%4];box(g,0,.2,0,w+.15,.4,d+.15,'#b6b8ac');box(g,0,h/2+.3,0,w,h,d,wall);
 const shape=new THREE.Shape();shape.moveTo(-w*.57,0);shape.lineTo(0,1.5);shape.lineTo(w*.57,0);shape.closePath();const roofGeo=new THREE.ExtrudeGeometry(shape,{depth:d+1,bevelEnabled:false});roofGeo.translate(0,h+.2,-(d+1)/2);mesh(g,roofGeo,['#687b7d','#79847e','#8d8c7d'][seed%3]);
 // Slender roof seams and eaves, sliding windows, entry canopy, balcony.
 for(const sign of [-1,1])box(g,sign*w*.54,h+.18,0,.16,.14,d+1.1,'#78857f');
 for(const xx of [-w*.27,w*.27]){windowPanel(g,xx,2,d/2+.02,1.55,1.35);if(h>4)windowPanel(g,xx,4.8,d/2+.02,1.6,1.55);}
 box(g,0,1.25,d/2+.04,.95,2.1,.1,'#7b8177');box(g,.34,1.22,d/2+.12,.035,.36,.07,'#d7d7c5');box(g,0,2.4,d/2+.3,1.45,.12,.95,'#7a8988');box(g,0,.22,d/2+.42,1.6,.15,1,'#b5b6aa');
 if(h>4){box(g,w*.25,3.85,d/2+.48,2.35,.17,1.0,'#c5ccc5');box(g,w*.25,4.25,d/2+.98,2.35,.08,.06,'#728381');for(let n=0;n<9;n++)box(g,w*.25-1.1+n*.275,4.05,d/2+.98,.035,.55,.04,'#7f8f8a');}
 cyl(g,-w/2+.14,h/2,d/2+.17,.045,.045,h,'#a6b2a9',6);
 box(g,-w*.34,.7,d/2+.4,.95,.65,.4,'#d6d6cb');for(let j=0;j<5;j++)box(g,-w*.34,.47+j*.1,d/2+.62,.7,.025,.025,'#8c9a93');
 planter(g,-w*.35,d/2+.96,.8);planter(g,w*.35,d/2+.95,.65);
 box(g,0,.45,d/2+1.75,w+.4,.9,.18,'#c8cabe');box(g,0,.95,d/2+1.75,w+.45,.12,.25,'#b6bcb0');
 // Gate opening keeps the entrance readable.
 box(g,0,.5,d/2+1.78,1.2,.95,.22,'#84978d');for(let j=-3;j<=3;j++)box(g,j*.15,.52,d/2+1.91,.04,.73,.035,'#b3bfb2');
 return g;
}
function wheel(p,x,y,z){const tire=cyl(p,x,y,z,.31,.31,.22,'#334247',14);tire.rotation.z=Math.PI/2;const hub=cyl(p,x+(x>0?.125:-.125),y,z,.18,.18,.015,'#bac1bc',12);hub.rotation.z=Math.PI/2;const center=cyl(p,x+(x>0?.138:-.138),y,z,.07,.07,.02,'#74868a',10);center.rotation.z=Math.PI/2;}
export function makeVan(){const g=new THREE.Group();g.name='parked-van';round(g,0,.64,0,1.8,.62,4.1,.12,'#dee2da');round(g,0,1.35,.25,1.83,1.7,3.65,.11,'#f2efdf');round(g,0,1.42,-1.35,1.79,1.48,1.15,.13,'#eeecdf');
 // Rear, side and front glazing.
 round(g,0,1.72,2.065,1.52,.62,.045,.055,'#698995');box(g,0,1.72,2.1,.06,.65,.025,'#e1e6de');
 for(const sign of [-1,1]){round(g,sign*.92,1.68,-.07,.035,.72,2.25,.045,'#77939a');round(g,sign*.92,1.65,-1.37,.035,.73,.7,.04,'#79979e');box(g,sign*.94,1.32,-.95,.02,1.12,.04,'#adb7b0');box(g,sign*.94,1.22,-.7,.035,.055,.25,'#6c817f');round(g,sign*1.03,1.5,-1.68,.23,.23,.18,.04,'#cbd6d1');wheel(g,sign*.91,.33,-1.25);wheel(g,sign*.91,.33,1.35);round(g,sign*.72,.89,2.09,.2,.47,.06,.025,'#bf6b5a');box(g,sign*.72,.95,2.13,.18,.095,.018,'#e9bd73');}
 round(g,0,1.65,-1.965,1.5,.66,.04,.05,'#7b9ca5');box(g,0,.55,2.14,1.75,.19,.12,'#a7b2ad');box(g,0,.9,2.11,.028,1.1,.025,'#a8b4ad');box(g,.12,1.14,2.14,.25,.05,.055,'#687d7b');box(g,0,.65,2.215,.55,.25,.02,'#e1d291');box(g,0,.64,2.232,.3,.035,.008,'#60766e');
 for(const sign of [-1,1])box(g,sign*.69,.99,-2.03,.38,.2,.05,'#e4d4a0');
 return g;}
export function makeChild(){const g=new THREE.Group();g.name='child';const shirt=mat('#e6ae4b'),skin=mat('#ddb597'),navy=mat('#566d7a');const torso=round(g,0,.77,0,.34,.42,.24,.05,shirt);sphere(g,0,1.12,0,.16,skin,[.9,1,1]);sphere(g,0,1.23,0,.17,'#e4c063',[1,.45,1]);cyl(g,0,1.18,.025,.21,.21,.025,'#eccb73',14);round(g,0,.82,.17,.29,.33,.13,.035,'#aa6d58');
 const legs=[],arms=[];for(const sign of [-1,1]){const l=new THREE.Group();l.position.set(sign*.095,.59,0);g.add(l);round(l,0,-.22,0,.115,.43,.13,.035,navy);round(l,0,-.44,-.04,.13,.1,.23,.035,'#f0ebdb');legs.push(l);const a=new THREE.Group();a.position.set(sign*.22,.9,0);g.add(a);round(a,0,-.12,0,.09,.26,.11,.025,shirt);sphere(a,0,-.29,0,.05,skin);arms.push(a);}
 g.rotation.y=-Math.PI/2;g.userData={legs,arms};return g;}
// Shared rounded figures and materials keep all three exercises visually consistent.
export function makeAdult({cycling=false}={}){
 const g=new THREE.Group();g.name=cycling?'cyclist':'pedestrian';
 round(g,0,1.05,0,.46,.58,.29,.06,'#7396b1');
 sphere(g,0,1.55,0,.19,'#ddb597',[.92,1,1]);sphere(g,0,1.66,.025,.195,'#56616a',[1,.55,1]);
 if(cycling){sphere(g,0,1.72,0,.21,'#e8e4d3',[1,.55,1]);box(g,0,1.78,-.02,.025,.03,.32,'#7c9198');}
 const legs=[],arms=[];
 for(const side of [-1,1]){
  const l=new THREE.Group();l.position.set(side*.12,.8,0);g.add(l);round(l,0,-.31,0,.15,.62,.17,.035,'#4f6574');round(l,0,-.64,-.06,.17,.12,.28,.035,'#eee9dc');legs.push(l);
  const a=new THREE.Group();a.position.set(side*.28,1.27,0);g.add(a);round(a,0,-.23,0,.12,.46,.14,.03,'#7396b1');sphere(a,0,-.48,0,.065,'#ddb597');arms.push(a);
 }
 if(!cycling)round(g,.32,.66,.02,.22,.3,.18,.035,'#bd9372');
 g.rotation.y=-Math.PI/2;g.userData={legs,arms};return g;
}
export function makeBicycle(){
 const g=new THREE.Group();g.name='bicycle';const wheels=[];
 for(const x of [-.72,.72]){
  const w=new THREE.Group();w.position.set(x,.42,0);g.add(w);
  mesh(w,new THREE.TorusGeometry(.4,.045,8,24),'#354952');mesh(w,new THREE.TorusGeometry(.35,.016,5,24),'#b6c2c1');
  for(let i=0;i<8;i++){const a=i*Math.PI/4;line(w,[[0,0,0],[Math.cos(a)*.35,Math.sin(a)*.35,0]],.008,'#aab9b7');}wheels.push(w);
 }
 const pts=[[-.72,.42,0],[-.15,.95,0],[.08,.4,0],[.5,1.02,0],[.72,.42,0]];
 for(const [a,b] of [[0,1],[1,2],[2,0],[1,3],[3,2],[3,4],[2,4]])line(g,[pts[a],pts[b]],.035,'#698e85');
 line(g,[[-.15,.95,0],[-.2,1.14,0]],.025,'#b4bdb6');round(g,-.2,1.15,0,.32,.07,.2,.025,'#3f5258');
 line(g,[[.5,1.02,0],[.48,1.34,0],[.32,1.34,.22]],.025,'#adbcb9');line(g,[[.48,1.34,0],[.32,1.34,-.22]],.025,'#adbcb9');
 round(g,.74,1.1,0,.4,.3,.38,.025,'#a6b8b0');
 const rider=makeAdult({cycling:true});rider.position.set(-.17,.43,0);rider.scale.setScalar(.8);rider.rotation.y=-Math.PI/2;
 rider.userData.arms.forEach(a=>a.rotation.x=-.95);rider.userData.legs.forEach((l,i)=>l.rotation.x=i?.4:-.4);g.add(rider);
 // Reverse the complete model: the rider, basket and front wheel face left.
 g.rotation.y=Math.PI;g.userData={wheels,rider};return g;
}
function stopSign(parent,textures){
 cyl(parent,-4.1,1.7,-93,.055,.055,3.4,'#a8b6ad',8);
 const shape=new THREE.Shape();shape.moveTo(-.49,.3);shape.lineTo(.49,.3);shape.lineTo(0,-.55);shape.closePath();
 const geo=new THREE.ExtrudeGeometry(shape,{depth:.06,bevelEnabled:false});const sign=mesh(parent,geo,'#c35e54',-4.1,3,-93);
 if(textures)label(parent,-4.1,3,-92.93,.65,.26,'止まれ','#c35e54','#fff8e8');
 return sign;
}
function makeCockpit(){const g=new THREE.Group();g.name='cockpit';round(g,-.25,-.65,-1.3,2,.3,.9,.12,'#344b59');round(g,-.22,-.62,-2.1,1.8,.3,1.4,.1,'#d8e3df');const w=new THREE.Group();w.position.set(.12,-.48,-.85);w.scale.setScalar(.85);w.rotation.x=-.18;g.add(w);mesh(w,new THREE.TorusGeometry(.22,.027,8,36),'#334955');round(w,0,0,0,.18,.11,.065,.04,'#4e6470');for(const a of [-.45,.45,Math.PI]){const spoke=box(w,Math.sin(a)*.1,Math.cos(a)*.1,0,.025,.22,.025,'#71828a');spoke.rotation.z=-a;}box(g,-.08,-.5,-1.04,.32,.09,.025,'#172e3d');for(let j=0;j<5;j++)box(g,-.21+j*.055,-.48,-1.022,.025,.015,.006,'#97bdc6');g.userData.wheel=w;g.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false;}});return g;}
function mergeEnvironment(root){root.updateMatrixWorld(true);const groups=new Map();root.traverse(o=>{if(!o.isMesh)return;let geom=o.geometry.clone();if(geom.index)geom=geom.toNonIndexed();geom.applyMatrix4(o.matrixWorld);for(const k of Object.keys(geom.attributes))if(!['position','normal','uv'].includes(k))geom.deleteAttribute(k);const list=groups.get(o.material)||[];list.push(geom);groups.set(o.material,list);});const merged=new THREE.Group();merged.name='environment';for(const [material,geometries] of groups){const geo=mergeGeometries(geometries,false);if(geo){const m=new THREE.Mesh(geo,material);m.castShadow=true;m.receiveShadow=true;merged.add(m);}geometries.forEach(g=>g.dispose());}root.traverse(o=>{if(o.isMesh)o.geometry.dispose();});return merged;}
export function createWorld({merged=true,textures=true,index=0}={}){
 const hazard=[88,94,100][index];const intersection=index===2;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#c9e2ec');scene.fog=new THREE.Fog('#d4e5e5',70,195);
 const camera=new THREE.PerspectiveCamera(54,1,.08,250);camera.rotation.order='YXZ';scene.add(camera);const cockpit=makeCockpit();camera.add(cockpit);
 const hemisphere=new THREE.HemisphereLight('#e8f5ff','#aaae8d',2.25);scene.add(hemisphere);const sun=new THREE.DirectionalLight('#fff0d8',3.0);sun.position.set(-26,45,25);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-28;sun.shadow.camera.right=28;sun.shadow.camera.top=42;sun.shadow.camera.bottom=-38;sun.shadow.camera.near=1;sun.shadow.camera.far=125;sun.shadow.bias=-.00035;sun.shadow.normalBias=.035;sun.shadow.radius=3;scene.add(sun,sun.target);
 let env=new THREE.Group();env.name='environment';
 box(env,0,-.18,-90,160,.22,370,'#bac7a6');
 let asphalt=mat('#87928e');
 if(textures&&typeof document!=='undefined'){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');if(ctx){let seed=132;const img=ctx.createImageData(128,128);for(let i=0;i<img.data.length;i+=4){seed=(seed*1664525+1013904223)>>>0;const n=125+(seed%24);img.data[i]=n;img.data[i+1]=n+5;img.data[i+2]=n+4;img.data[i+3]=255;}ctx.putImageData(img,0,0);const tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(3,75);tex.colorSpace=THREE.SRGBColorSpace;asphalt=new THREE.MeshStandardMaterial({map:tex,color:'#b0bab8',roughness:1});}}
 box(env,0,-.045,-100,7.1,.09,310,asphalt);
 if(intersection)box(env,0,-.035,-hazard,100,.08,8,asphalt);
 for(const side of [-1,1]){
  const ranges=intersection?[[-255,-hazard-4],[-hazard+4,55]]:[[-255,55]];
  for(const [from,to] of ranges){const mid=(from+to)/2,len=to-from;box(env,side*4.25,.04,mid,1.4,.16,len,'#dddccc');box(env,side*3.58,.06,mid,.14,.19,len,'#eeeadc');box(env,side*3.35,.009,mid,.1,.014,len,'#efeddf');}
  for(let z=0;z<210;z+=7){if(Math.abs(z-hazard)<5&&index>0)continue;box(env,side*3.65,.145,-z,.15,.018,.44,'#8c9c96');for(let j=0;j<3;j++)box(env,side*3.65,.157,-z-.12+j*.12,.13,.01,.025,'#506c67');}
 }
 for(let z=-5;z<210;z+=8){if(index>0&&Math.abs(z-hazard)<9)continue;box(env,0,.012,-z,.075,.015,3.4,'#e9e5cf');}
 if(index===1){
  for(let x=-3;x<=3;x+=.8)box(env,x,.018,-hazard,.45,.02,3.3,'#f2eddf');
  box(env,-1.72,.02,-hazard+6,3.1,.025,.35,'#f2eddf');
  // Lowered pavement at the crossing and tactile paving on both approaches.
  for(const side of [-1,1]){box(env,side*4.2,.135,-hazard,1.25,.035,1.8,'#d9bf70');
   for(let j=0;j<4;j++)for(let k=0;k<5;k++)sphere(env,side*4.2-.42+j*.28,.16,-hazard-.6+k*.3,.035,'#b9a265',[1,.4,1]);
   cyl(env,side*4.8,1.7,-hazard+2.8,.045,.045,3.4,'#a9b5b0',8);box(env,side*4.8,3,-hazard+2.8,.72,.65,.06,'#557fa2');
   if(textures)label(env,side*4.8,3,-hazard+2.84,.66,.5,'横断歩道','#557fa2','#fff8e8');}
 }
 if(intersection){box(env,-1.72,.02,-hazard+7,3.1,.025,.4,'#f2eddf');
  if(textures){const roadText=label(env,-1.7,.025,-hazard+15,1.5,4,'止まれ','#87928e','#fff8e8');roadText.rotation.x=-Math.PI/2;}
 }
 for(let i=0;i<17;i++){const z=6+i*12.7;for(const side of [-1,1]){if((index===0&&side<0&&Math.abs(z-88)<12)||(index>0&&Math.abs(z-hazard)<14))continue;house(env,side*(8.1+(i%2)*.3),-z,i+(side>0?2:0));if(i%3===0)tree(env,side*5.35,-z-6,.8+(i%2)*.12);}}
 // A quiet garden wall leaves a genuine occluded area behind the parked van.
 if(index===0){box(env,-5.35,.75,-87.6,.22,1.5,15,'#c9cab9');box(env,-5.35,1.55,-87.6,.3,.1,15,'#abb69f');for(let j=0;j<7;j++)sphere(env,-5.8,2,-81-j*2,.9,'#8eaa7c',[.8,.8,1.1]);}
 for(let z=8;z<205;z+=28){if(intersection&&Math.abs(z-hazard)<7)continue;cyl(env,-4.9,4.8,-z,.105,.16,9.6,'#9caaa4',8);box(env,-4.9,8.8,-z,1.7,.08,.08,'#7e908a');for(const dx of [-.65,0,.65]){cyl(env,-4.9+dx,8.94,-z,.075,.075,.2,'#dbdfd2',6);line(env,[[-4.9+dx,8.9,-z],[-4.9+dx,8.4,-z-14],[-4.9+dx,8.9,-z-28]],.018,'#697d78');}line(env,[[-4.9,6.9,-z],[-4.2,7,-z],[-3.8,6.9,-z]],.055,'#9caaa4');round(env,-3.8,6.84,-z,.45,.12,.2,.04,'#eee6cf');}
 // Utility box, corner mirror and a school-route placard.
 round(env,5.1,.75,-56,.6,1.5,.5,.04,'#b5c5bd');cyl(env,-4.7,1.7,-68,.055,.055,3.4,'#b2b9a3',8);box(env,-4.7,3,-68,.68,.7,.07,'#d0ad55');if(textures)label(env,-4.7,3,-67.95,.62,.55,'通学路','#edcf76','#4d655d');
 for(let j=0;j<7;j++)sphere(env,-50+j*18,2,-230,35,'#b4c9b7',[1,.5,1]);
 scene.add(env);if(merged){scene.remove(env);env=mergeEnvironment(env);scene.add(env);}
 const van=makeVan();van.position.set(index===0?-3.7:4.4,0,index===0?-85.3:-145);scene.add(van);
 const child=index===0?makeChild():index===1?makeAdult():makeBicycle();scene.add(child);
 const corner=new THREE.Group();corner.name='blind-corner';
 if(intersection){
  box(corner,6,2.25,-91.8,4.8,4.5,7.6,'#d9d2c1');box(corner,6,4.55,-91.8,5,.15,7.8,'#8d9b94');
  for(let z=-94;z<=-89;z+=2){const win=box(corner,3.57,2.8,z,.04,1.2,1.1,'#819fa7');box(corner,3.53,2.8,z,.03,1.2,.04,'#d6dfd8');}
  box(corner,3.57,.5,-91.8,.12,1,7.6,'#bdc1b5');stopSign(corner,textures);scene.add(corner);
  const mirror=new THREE.Group();cyl(mirror,-4.6,2,-104.7,.045,.045,4,'#c18a5e',8);const disc=mesh(mirror,new THREE.CircleGeometry(.44,24),'#acbfc0',-4.6,3.65,-104.65);mesh(mirror,new THREE.TorusGeometry(.44,.045,6,24),'#cf975f',-4.6,3.65,-104.62);scene.add(mirror);
 }
 const targets=index===0?[van,child]:index===1?[child]:[corner,child];
 const occluders=[env,van,child,...(intersection?[corner]:[])];
 const marker=new THREE.Mesh(new THREE.TorusGeometry(1.55,.025,6,40),new THREE.MeshBasicMaterial({color:'#e5b354',depthTest:false,transparent:true,opacity:.9}));marker.renderOrder=9;marker.visible=false;scene.add(marker);
 return{scene,camera,environment:env,van,child,cockpit,sun,marker,index,targets,occluders,corner};
}
export function updateWorld(world,drive,{yaw=0,still=false,reducedMotion=false}={}){
 const {camera,child,cockpit,sun,marker}=world;const movement=drive.phase==='running'&&!still&&!reducedMotion;const bob=movement?Math.sin(drive.z*2.8)*.004*Math.min(drive.speed/25,1):0;const pitch=movement?(drive.input.brake?-.008:drive.input.gas?.004:0):0;
 camera.position.set(-1.38,1.58+bob,-drive.z);camera.rotation.set(-.025+pitch,yaw,0,'YXZ');
 // World coordinates follow the engine; the child begins directly behind the van.
 const x=world.index===0?-3.7+Math.max(0,drive.actorX+5.05)*.86:world.index===1?-4.3+Math.max(0,drive.actorX+5.05)*.91:drive.actorX;
 child.position.set(x,world.index===1&&Math.abs(x)>3.6?.13:0,-drive.scene.hazard);child.visible=!drive.actorClear;
 const walk=drive.eventTime!==null&&!still?Math.sin(Math.max(0,drive.eventTime-.85)*8)*.42:0;
 if(world.index===2){child.userData.wheels.forEach(w=>w.rotation.z=drive.eventTime===null?0:-drive.eventTime*5);child.userData.rider.userData.legs.forEach((l,i)=>l.rotation.x=(i?1:-1)*walk*.8);}else{child.userData.legs.forEach((l,i)=>l.rotation.x=i?walk:-walk);child.userData.arms.forEach((a,i)=>a.rotation.x=i?-walk:walk);}
 cockpit.userData.wheel.rotation.z=movement?Math.sin(drive.z*.09)*.012:0;
 sun.position.set(-26,45,25-drive.z);sun.target.position.set(0,0,-drive.z-23);sun.target.updateMatrixWorld();
 marker.visible=!!drive.detected;if(world.index===0)marker.position.set(-3.7,1.25,-83.1);else if(world.index===1)marker.position.set(x,1,-drive.scene.hazard+.3);else marker.position.set(3.6,2,-88);marker.scale.setScalar(world.index===1?.55:1);marker.quaternion.copy(camera.quaternion);world.scene.updateMatrixWorld(true);
}
