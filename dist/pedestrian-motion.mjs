// Shared by physics and animation. Distances are metres, time is seconds.
export const PREPARE=1.1,ACCEL_TIME=.45,RUN_SPEED=3.2;
export function pedestrianMotion(elapsed){
 const t=Math.max(0,(elapsed??0)-PREPARE),u=Math.min(t,ACCEL_TIME);
 const travel=RUN_SPEED*(u*u/(2*ACCEL_TIME)+Math.max(0,t-ACCEL_TIME));
 return {x:-4.3+travel,travel,speed:RUN_SPEED*Math.min(t/ACCEL_TIME,1),towardCar:travel*.15,runTime:t};
}
export function pedestrianArrival(x=-1.38){return PREPARE+ACCEL_TIME/2+(x+4.3)/RUN_SPEED;}
