import * as THREE from './vendor/three.module.js';
import {LAMP_TYPES,populateLamp} from './lamps3d.js';
export const PLAN_CENTER={x:472,y:1060};
export const DEFAULT_SCALE=303/155;
export const DEFAULT_HEIGHTS={sofa:34,chair:34,table:18,rug:.5,bed:42,cabinet:30,desk:30,dining:30,round:30,plant:48,custom:30,officechair:42,eggtable:30,mushroomlamp:12,floorlamp:62,paperlantern:18,sidetable:24,lamptable:36};
export function heightOf(i){return Number.isFinite(i.h)&&i.h>0?i.h:DEFAULT_HEIGHTS[i.type]||30;}
export const floorOutline=[[24,603],[732,603],[732,735],[808,812],[920,812],[920,1518],[24,1518]];
export const balconyOutline=[[535,603],[732,603],[732,735],[808,812],[920,812],[920,1009],[731,1009],[535,808]];
// Openings are separate spans, so a door is an actual opening in the 3D wall.
export const solidWalls=[
[24,603,529,603],[24,603,24,1518],[24,1518,328,1518],[401,1518,920,1518],[920,1011,920,1518],
[210,608,210,654],[210,736,210,857],[210,930,210,1023],[29,744,210,744],[29,1023,230,1023],
[309,1023,360,1023],[360,1023,360,982],[360,982,529,813],[529,773,529,813],[529,603,529,638],
[529,806,572,850],[688,968,731,1011],[731,1011,760,1011],[893,1011,920,1011],
[728,1020,539,1204],[539,1204,568,1204],[628,1204,635,1204],[635,1110,635,1225],
[635,1300,635,1319],[427,1319,547,1319],[617,1319,752,1319],[427,1319,427,1330],
[429,1408,429,1435],[429,1502,429,1518],[429,1418,526,1418],[526,1324,526,1515],
[752,1319,752,1343],[752,1343,784,1343],[860,1343,918,1343],[750,1343,750,1512],
[88,1321,88,1338],[89,1430,89,1518],[93,1466,170,1466],[170,1466,170,1516]
];
export const openings=[
{p:[210,654,210,736],type:'door'},{p:[210,857,210,930],type:'door'},
{p:[230,1023,309,1023],type:'door'},{p:[568,1204,628,1204],type:'door'},
{p:[635,1225,635,1300],type:'door'},{p:[547,1319,617,1319],type:'door'},
{p:[427,1330,429,1408],type:'door'},{p:[429,1435,429,1502],type:'door'},
{p:[784,1343,860,1343],type:'door'},{p:[88,1338,89,1430],type:'door'},
{p:[328,1518,401,1518],type:'door'},{p:[529,638,529,773],type:'window'},
{p:[572,850,688,968],type:'slider'},{p:[760,1011,893,1011],type:'window'}
];
function mat(color,extra={}){return new THREE.MeshStandardMaterial({color,roughness:.82,...extra});}
function box(g,w,h,d,x,y,z,material){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function cylinder(g,r1,r2,h,x,y,z,material,n=24){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,n),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
export function planToWorld(x,y,scale){return new THREE.Vector3((x-PLAN_CENTER.x)/scale,0,(y-PLAN_CENTER.y)/scale);}
export function worldToPlan(v,scale){return{x:v.x*scale+PLAN_CENTER.x,y:v.z*scale+PLAN_CENTER.y};}
function slab(group,points,scale,material,elevation=0,depth=3){const shape=new THREE.Shape();points.forEach(([x,y],k)=>{const p=planToWorld(x,y,scale);if(k)shape.lineTo(p.x,-p.z);else shape.moveTo(p.x,-p.z)});shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false});geo.rotateX(-Math.PI/2);const m=new THREE.Mesh(geo,material);m.position.y=elevation-depth;m.receiveShadow=true;group.add(m);return m;}
export function wallThickness(p,scale){return (p[0]===529&&p[2]===529?20:p[0]===210&&p[2]===210?12:p[1]===603&&p[3]===603&&p[2]===529?14:10)/scale;}
function span(group,p,scale,height,y,material,thickness=wallThickness(p,scale)){const a=planToWorld(p[0],p[1],scale),b=planToWorld(p[2],p[3],scale),length=a.distanceTo(b);const m=box(group,length,height,thickness,(a.x+b.x)/2,y,(a.z+b.z)/2,material);m.rotation.y=-Math.atan2(b.z-a.z,b.x-a.x);return m;}
export function createApartment({scale=DEFAULT_SCALE,ceiling=96,wallMode='cutaway',floorMaterial=null}={}){
const root=new THREE.Group(),walls=new THREE.Group(),fixed=new THREE.Group();root.add(walls,fixed);root.userData={walls,fixed};const plaster=mat('#edece3'),trim=mat('#b4bbad'),floor=floorMaterial||mat('#d9c8ac'),tile=mat('#d3ddd5'),stone=mat('#ebe5d7'),cabinet=mat('#acb39e'),dark=mat('#4d6059'),white=mat('#f4f1e5');
slab(root,floorOutline,scale,floor,0,4);slab(root,balconyOutline,scale,mat('#c6cfba'),.25,.25);
slab(root,[[29,751],[204,751],[204,1018],[29,1018]],scale,tile,.3,.3);slab(root,[[533,1325],[749,1325],[749,1505],[533,1505]],scale,tile,.3,.3);
const visibleHeight=wallMode==='full'?ceiling:wallMode==='hidden'?0:Math.min(30,ceiling);
if(visibleHeight){solidWalls.forEach(p=>{span(walls,p,scale,visibleHeight,visibleHeight/2,plaster);span(walls,p,scale,.6,visibleHeight+.3,trim,wallThickness(p,scale)+.6)});
for(const o of openings){const sill=o.type==='window'?30:0,top=Math.min(o.type==='door'?80:84,ceiling);if(sill)span(walls,o.p,scale,Math.min(sill,visibleHeight),Math.min(sill,visibleHeight)/2,plaster);if(visibleHeight>top)span(walls,o.p,scale,visibleHeight-top,(visibleHeight+top)/2,plaster);if(o.type!=='door'&&visibleHeight>sill){const actualTop=Math.min(top,visibleHeight),glass=mat('#b3d1cb',{transparent:true,opacity:.25,depthWrite:false,side:THREE.DoubleSide});span(walls,o.p,scale,actualTop-sill,(actualTop+sill)/2,glass,1).castShadow=false;span(walls,o.p,scale,1.5,actualTop,dark,2);const [x1,z1,x2,z2]=o.p;for(const t of[0,.5,1]){const p=planToWorld(x1+(x2-x1)*t,z1+(z2-z1)*t,scale);box(walls,1.5,actualTop-sill,2,p.x,(actualTop+sill)/2,p.z,dark);}}}}
const railPoints=[[535,603],[732,603],[732,735],[808,812],[920,812],[920,1009]];if(wallMode!=='hidden')for(let i=1;i<railPoints.length;i++){const p=[...railPoints[i-1],...railPoints[i]],height=wallMode==='full'?42:24;span(walls,p,scale,2,height,trim,2);span(walls,p,scale,height/2,height/2,mat('#b9c8b5',{transparent:true,opacity:.22,depthWrite:false}),1);for(const t of[0,.5,1]){const pos=planToWorld(p[0]+(p[2]-p[0])*t,p[1]+(p[3]-p[1])*t,scale);box(walls,1.5,height,1.5,pos.x,height/2,pos.z,trim);}}
const at=(x,z,w,d,h,material=white)=>{const p=planToWorld(x,z,scale);return box(fixed,w/scale,h,d/scale,p.x,h/2,p.z,material)};
// Built-in footprints follow the screenshot; vertical dimensions are typical estimates.
at(194.5,1264,73,172,35,cabinet);const island=at(194.5,1264,76,175,1.5,stone);island.position.y=35.75;
at(54,1174,48,288,35,cabinet);const counter=at(54,1174,51,291,1.5,stone);counter.position.y=35.75;
at(115,1059,73,52,35,cabinet);at(184,1056,67,56,70,white);
at(66,882,45,118,34,cabinet);const vanity=at(66,882,48,121,1.5,stone);vanity.position.y=34.75;
at(641,1475,68,45,33,cabinet);at(711,1386,48,111,21,white);
const stove=at(57,1138,45,53,1,dark);stove.position.y=37;const sink=at(55,1232,28,37,1,mat('#8c9e9a'));sink.position.y=37;
at(487,1467,46,47,39,white);
for(const [x,z]of[[80,787],[569,1465]]){const p=planToWorld(x,z,scale);const wc=cylinder(fixed,10,7,17,p.x,8.5,p.z,white);wc.scale.z=1.3;box(fixed,17,22,6,p.x,11,p.z-12,white);}
return root;
}
export function createFurniture(i,scale=DEFAULT_SCALE,options={}){
const g=new THREE.Group(),w=i.w,d=i.d,h=heightOf(i),color=mat(i.color),wood=mat('#a98762'),white=mat('#f0eee5'),metal=mat('#626b67'),dark=mat('#35453d');g.userData.itemId=i.id;const p=planToWorld(i.x,i.y,scale);g.position.copy(p);g.rotation.y=-i.angle*Math.PI/180;
const b=(ww,hh,dd,x,y,z,m=color)=>box(g,ww,hh,dd,x,y,z,m);
const legs=(top,spread=.39)=>{for(const x of[-1,1])for(const z of[-1,1])b(Math.min(2,w*.07),top,Math.min(2,d*.07),x*w*spread,top/2,z*d*spread,wood)};
if(LAMP_TYPES.includes(i.type)){populateLamp(g,{...i,h},options);}
else if(i.type==='rug'){b(w,h,d,0,h/2,0);}
else if(i.type==='bed'){b(w,Math.max(1,h*.18),d,0,h*.14,0,wood);b(w*.98,h*.28,d*.94,0,h*.35,d*.01,white);b(w*.97,h*.12,d*.66,0,h*.50,d*.15);b(w,h,d*.035,0,h/2,-d*.482,wood);for(const x of[-1,1])b(w*.4,h*.07,d*.17,x*w*.24,h*.525,-d*.32,white);}
else if(i.type==='sofa'||i.type==='chair'){b(w,h*.45,d,0,h*.30,0);b(w,h*.85,d*.16,0,h*.575,-d*.42);for(const x of[-1,1])b(w*.09,h*.66,d,x*w*.455,h*.43,0);const n=i.type==='sofa'?3:1;for(let a=0;a<n;a++)b(w*.8/n-.4,h*.12,d*.76,-w*.4+w*.8/n*(a+.5),h*.575,d*.07,mat(new THREE.Color(i.color).lerp(new THREE.Color('#ffffff'),.09)));}
else if(['table','desk','dining','round','eggtable','sidetable'].includes(i.type)){const thick=Math.min(2,h*.12);legs(h-thick);if(i.type==='round'){const top=cylinder(g,w/2,w/2,thick,0,h-thick/2,0,color,48);top.scale.z=d/w;}else if(i.type==='eggtable'){const s=new THREE.Shape();s.moveTo(-w*.12,-d*.5);s.bezierCurveTo(w*.2,-d*.5,w*.5,-d*.22,w*.5,0);s.bezierCurveTo(w*.5,d*.22,w*.2,d*.5,-w*.12,d*.5);s.bezierCurveTo(-w*.39,d*.5,-w*.5,d*.28,-w*.5,0);s.bezierCurveTo(-w*.5,-d*.28,-w*.39,-d*.5,-w*.12,-d*.5);const geo=new THREE.ExtrudeGeometry(s,{depth:thick,bevelEnabled:false,curveSegments:32});geo.rotateX(Math.PI/2);const top=new THREE.Mesh(geo,color);top.position.y=h;top.castShadow=true;top.receiveShadow=true;g.add(top);}else b(w,thick,d,0,h-thick/2,0);}
else if(i.type==='officechair'){cylinder(g,w*.06,w*.09,h*.40,0,h*.20,0,metal);for(let a=0;a<5;a++){const ang=a*Math.PI*2/5,rad=Math.min(w,d)*.42;const arm=b(rad,Math.min(2,h*.04),Math.min(2,d*.04),Math.cos(ang)*rad/2,h*.045,Math.sin(ang)*rad/2,metal);arm.rotation.y=-ang;cylinder(g,Math.min(w,d)*.045,Math.min(w,d)*.045,h*.07,Math.cos(ang)*rad,h*.035,Math.sin(ang)*rad,dark,12);}b(w*.65,h*.1,d*.62,0,h*.45,0);b(w*.65,h*.50,d*.10,0,h*.75,-d*.32);for(const x of[-1,1]){b(w*.05,h*.2,d*.045,x*w*.37,h*.56,0,metal);b(w*.12,h*.05,d*.45,x*w*.37,h*.675,0);}}
else if(i.type==='plant'){cylinder(g,w*.34,w*.24,h*.4,0,h*.2,0,wood).scale.z=d/w;cylinder(g,w*.30,w*.42,h*.52,0,h*.66,0,color,8).scale.z=d/w;const leaf=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),color);leaf.scale.set(w*.48,h*.2,d*.48);leaf.position.y=h*.8;leaf.castShadow=true;g.add(leaf);}
else{b(w,h,d,0,h/2,0);if(i.type==='cabinet')for(let n=1;n<=3;n++){b(w*.94,.35,.35,0,h*n/4,d/2-.2,wood);b(w*.15,1,.7,0,h*n/4+2,d/2-.35,metal);}}
g.traverse(o=>{if(o.isMesh)o.userData.itemId=i.id});return g;
}
export function disposeGroup(group){const geometries=new Set(),materials=new Set();group.traverse(o=>{if(o.isLight&&o.shadow)o.shadow.dispose();if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m))});geometries.forEach(x=>x.dispose());materials.forEach(x=>x.dispose());}
// Invisible full-height shell for sunlight: cutaway viewing must not open the roof to the sun.
export function createSunOccluders({scale=DEFAULT_SCALE,ceiling=96}={}){
 const root=new THREE.Group(),block=new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false,side:THREE.DoubleSide});
 solidWalls.forEach(p=>span(root,p,scale,ceiling,ceiling/2,block));
 for(const o of openings){const sill=o.type==='window'?30:0,top=Math.min(o.type==='door'?80:84,ceiling);if(sill)span(root,o.p,scale,sill,sill/2,block);if(top<ceiling)span(root,o.p,scale,ceiling-top,(ceiling+top)/2,block);if(o.type==='window'||o.type==='slider'){span(root,o.p,scale,1.5,top,block,2);for(const t of[0,.5,1]){const p=planToWorld(o.p[0]+(o.p[2]-o.p[0])*t,o.p[1]+(o.p[3]-o.p[1])*t,scale);box(root,1.5,top-sill,2,p.x,(top+sill)/2,p.z,block);}}}
 // Entry door closed: this opening faces an unmodeled interior corridor, not open sky.
 span(root,[328,1518,401,1518],scale,Math.min(80,ceiling),Math.min(80,ceiling)/2,block);
 const roof=slab(root,[[24,603],[535,603],[535,808],[731,1009],[920,1009],[920,1518],[24,1518]],scale,block,ceiling+4,4);roof.castShadow=true;
 root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=false;o.userData.sunOccluder=true;}});return root;
}
