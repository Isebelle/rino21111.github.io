// NOAA/Meeus solar coordinates. Sources and limits: LIGHTING.md.
export const LOCATION={latitude:40.74642,longitude:-74.1571,timeZone:'America/New_York'};
const rad=Math.PI/180,deg=180/Math.PI,wrap=(x,n=360)=>(x%n+n)%n;
export function solarPosition(date,latitude=LOCATION.latitude,longitude=LOCATION.longitude){
 const jd=date.getTime()/86400000+2440587.5,t=(jd-2451545)/36525;
 const L=wrap(280.46646+t*(36000.76983+t*.0003032)),M=357.52911+t*(35999.05029-.0001537*t),e=.016708634-t*(.000042037+.0000001267*t);
 const C=Math.sin(M*rad)*(1.914602-t*(.004817+.000014*t))+Math.sin(2*M*rad)*(.019993-.000101*t)+Math.sin(3*M*rad)*.000289;
 const omega=125.04-1934.136*t,lambda=L+C-.00569-.00478*Math.sin(omega*rad);
 const eps0=23+(26+(21.448-t*(46.815+t*(.00059-t*.001813)))/60)/60,eps=eps0+.00256*Math.cos(omega*rad);
 const decl=Math.asin(Math.sin(eps*rad)*Math.sin(lambda*rad)),y=Math.tan(eps*rad/2)**2;
 const eqtime=4*deg*(y*Math.sin(2*L*rad)-2*e*Math.sin(M*rad)+4*e*y*Math.sin(M*rad)*Math.cos(2*L*rad)-.5*y*y*Math.sin(4*L*rad)-1.25*e*e*Math.sin(2*M*rad));
 const utcMinutes=date.getUTCHours()*60+date.getUTCMinutes()+date.getUTCSeconds()/60+date.getUTCMilliseconds()/60000;
 const hourAngle=(wrap(utcMinutes+eqtime+4*longitude,1440)/4-180)*rad,lat=latitude*rad;
 const elevation=Math.asin(Math.max(-1,Math.min(1,Math.sin(lat)*Math.sin(decl)+Math.cos(lat)*Math.cos(decl)*Math.cos(hourAngle))))*deg;
 const azimuth=wrap(Math.atan2(Math.sin(hourAngle),Math.cos(hourAngle)*Math.sin(lat)-Math.tan(decl)*Math.cos(lat))*deg+180);
 const tangent=Math.tan(elevation*rad);let refraction=0;
 if(elevation<=85&&elevation>5)refraction=(58.1/tangent-.07/tangent**3+.000086/tangent**5)/3600;
 else if(elevation<=5&&elevation>-.575)refraction=(1735+elevation*(-518.2+elevation*(103.4+elevation*(-12.79+elevation*.711))))/3600;
 else if(elevation<=-.575)refraction=-20.774/tangent/3600;
 return{azimuth,elevation,apparentElevation:elevation+refraction,declination:decl*deg,equationOfTime:eqtime};
}
// Original plan up is WEST: world +X is north, +Z east, -X south, -Z west.
export function sunDirection(azimuth,elevation){const a=azimuth*rad,h=elevation*rad;return{x:Math.cos(a)*Math.cos(h),y:Math.sin(h),z:Math.sin(a)*Math.cos(h)};}
const dateFormatter=new Intl.DateTimeFormat('en-CA',{timeZone:LOCATION.timeZone,year:'numeric',month:'2-digit',day:'2-digit'});
const partsFormatter=new Intl.DateTimeFormat('en-US',{timeZone:LOCATION.timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
export function dateInHarrison(date=new Date()){const p=Object.fromEntries(dateFormatter.formatToParts(date).map(p=>[p.type,p.value]));return`${p.year}-${p.month}-${p.day}`;}
export function localMidnight(ymd){if(!/^\d{4}-\d{2}-\d{2}$/.test(ymd))throw Error('Invalid date');const[y,m,d]=ymd.split('-').map(Number),target=Date.UTC(y,m-1,d);let guess=target;for(let i=0;i<3;i++){const p=Object.fromEntries(partsFormatter.formatToParts(new Date(guess)).map(p=>[p.type,Number(p.value)]));const shown=Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);guess+=target-shown;}return new Date(guess);}
export function dayBounds(ymd){const[y,m,d]=ymd.split('-').map(Number),next=new Date(Date.UTC(y,m-1,d+1)).toISOString().slice(0,10);const start=localMidnight(ymd),end=localMidnight(next);return{start,end,minutes:(end-start)/60000};}
export function timeLabel(date,withZone=false){return new Intl.DateTimeFormat('en-US',{timeZone:LOCATION.timeZone,hour:'numeric',minute:'2-digit',...(withZone?{timeZoneName:'short'}:{})}).format(date);}
export function solarEvents(ymd){const{start,end}=dayBounds(ymd);let sunrise=null,sunset=null,noon=null,max=-90,previous=solarPosition(start).elevation+.833,prevTime=+start;
 for(let ms=+start+60000;ms<=+end;ms+=60000){const alt=solarPosition(new Date(ms)).elevation,now=alt+.833;if(alt>max){max=alt;noon=new Date(ms)}if(previous<0&&now>=0)sunrise=new Date(prevTime+(ms-prevTime)*(-previous)/(now-previous));if(previous>=0&&now<0)sunset=new Date(prevTime+(ms-prevTime)*(-previous)/(now-previous));previous=now;prevTime=ms;}return{sunrise,sunset,noon,maxElevation:max};}
export function compassPoint(azimuth){return['N','NE','E','SE','S','SW','W','NW'][Math.round(azimuth/45)%8];}
export function panVector(camera,target,keys,seconds,speed=100){
 // Forward is the camera's ground-plane heading, including in near-overhead views.
 let fx=target.x-camera.x,fz=target.z-camera.z,len=Math.hypot(fx,fz);if(len<1e-6){fx=0;fz=-1;len=1}fx/=len;fz/=len;
 const forward=(keys.has('w')?1:0)-(keys.has('s')?1:0),right=(keys.has('d')?1:0)-(keys.has('a')?1:0),norm=Math.hypot(forward,right)||1,step=seconds*speed/norm;
 return{x:(fx*forward-fz*right)*step,z:(fz*forward+fx*right)*step};
}
