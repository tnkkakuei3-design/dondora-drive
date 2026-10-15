import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
await mkdir('dist/vendor',{recursive:true});
for(const f of ['three.module.min.js','three.core.min.js'])await copyFile('node_modules/three/build/'+f,'dist/vendor/'+f);
await copyFile('node_modules/three/LICENSE','dist/vendor/THREE-LICENSE.txt');
const merge=await readFile('node_modules/three/examples/jsm/utils/BufferGeometryUtils.js','utf8');
await writeFile('dist/vendor/BufferGeometryUtils.js',merge.replace(/from 'three'/g,"from './three.module.min.js'"));
console.log('Three.js 0.180.0 vendored locally with MIT license.');

for(const name of ['loaders/GLTFLoader.js','utils/SkeletonUtils.js']){
 const source=await readFile('node_modules/three/examples/jsm/'+name,'utf8');
 await writeFile('dist/vendor/'+name.split('/').pop(),source.replace(/from 'three'/g,"from './three.module.min.js'").replace("from '../utils/BufferGeometryUtils.js'","from './BufferGeometryUtils.js'"));
}
