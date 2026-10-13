import * as THREE from './vendor/three.module.js';
export const LAMP_TYPES=['mushroomlamp','floorlamp','paperlantern','lamptable'];
// Artistic light levels in the scene's inch units; these are not measured lux.
export function lightColor(kelvin=2700){
 const t=Math.max(1800,Math.min(6500,kelvin))/100;
 const r=t<=66?255:329.698727446*Math.pow(t-60,-.1332047592);
 const g=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*Math.pow(t-60,-.0755148492);
 const b=t>=66?255:t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307;
 return new THREE.Color().setRGB(...[r,g,b].map(v=>Math.max(0,Math.min(255,v))/255),THREE.SRGBColorSpace);
}
export function populateLamp(g,i,{elevation=0,ceiling=96,enabled=true}={}){
 const {w,d,h}=i,on=enabled&&i.lightOn!==false,brightness=Math.max(0,Math.min(200,i.brightness??100))/100;
 const glow=lightColor(i.kelvin),shade=new THREE.MeshStandardMaterial({color:i.color,roughness:.7,emissive:glow,emissiveIntensity:on?brightness*.8:0,side:THREE.DoubleSide});
 const metal=new THREE.MeshStandardMaterial({color:'#605c52',roughness:.45,metalness:.5}),wood=new THREE.MeshStandardMaterial({color:'#b4936d',roughness:.8});
 const mesh=(geo,x,y,z,material=metal,shadow=true)=>{const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=shadow;g.add(m);return m;};
 const cylinder=(r1,r2,height,y,material=metal,shadow=true)=>mesh(new THREE.CylinderGeometry(r1,r2,height,40),0,y,0,material,shadow);
 const box=(ww,hh,dd,x,y,z)=>mesh(new THREE.BoxGeometry(ww,hh,dd),x,y,z,wood);
 let sourceY,power;
 const mushroom=(width,depth,height,bottom)=>{
  const base=cylinder(width*.25,width*.29,height*.09,bottom+height*.045,shade);base.scale.z=depth/width;
  cylinder(width*.075,width*.12,height*.63,bottom+height*.36,shade);
  const cap=mesh(new THREE.SphereGeometry(1,40,24,0,Math.PI*2,0,Math.PI/2),0,bottom+height*.67,0,shade,false);cap.scale.set(width/2,height*.33,depth/2);
  const diffuser=cylinder(width*.495,width*.495,height*.015,bottom+height*.67,shade,false);diffuser.scale.z=depth/width;
  return bottom+height*.70;
 };
 if(i.type==='mushroomlamp'){sourceY=mushroom(w,d,h,0);power=4200;}
 if(i.type==='lamptable'){
  const top=h*2/3,thick=Math.min(1.5,top*.1);box(w,thick,d,0,top-thick/2,0);
  for(const x of[-1,1])for(const z of[-1,1])box(Math.min(1.5,w*.08),top-thick,Math.min(1.5,d*.08),x*w*.4,(top-thick)/2,z*d*.4);
  sourceY=mushroom(w*.56,d*.56,h/3,top);power=4200;
 }
 if(i.type==='floorlamp'){
  const base=cylinder(w*.30,w*.33,h*.025,h*.0125);base.scale.z=d/w;
  cylinder(Math.min(.65,w*.04),Math.min(.85,w*.05),h*.79,h*.405);
  const cover=cylinder(w*.36,w/2,h*.25,h*.875,shade,false);cover.scale.z=d/w;
  sourceY=h*.83;power=12000;
 }
 if(i.type==='paperlantern'){
  const sphere=mesh(new THREE.SphereGeometry(1,48,32),0,h/2,0,shade,false);sphere.scale.set(w/2,h/2,d/2);
  const ribMaterial=new THREE.MeshStandardMaterial({color:'#c8bfa9',roughness:1,emissive:glow,emissiveIntensity:on?brightness*.15:0});
  for(let n=1;n<12;n++){const angle=n*Math.PI/12,r=Math.sin(angle),ring=mesh(new THREE.TorusGeometry(.993,.005,4,64),0,h/2+Math.cos(angle)*h/2,0,ribMaterial,false);ring.rotation.x=Math.PI/2;ring.scale.set(w/2*r,d/2*r,Math.min(w,d)/2);}
  const cord=Math.max(0,ceiling-elevation-h);if(cord>0)cylinder(.12,.12,cord,h+cord/2);
  sourceY=h/2;power=16000;
 }
 const light=new THREE.PointLight(glow,on?power*brightness:0,360,2);light.position.y=sourceY;light.castShadow=true;light.shadow.mapSize.set(512,512);light.shadow.camera.near=.25;light.shadow.camera.far=360;light.shadow.bias=-.00008;light.shadow.normalBias=.08;light.shadow.radius=2;g.add(light);g.userData.lamp=light;
}
