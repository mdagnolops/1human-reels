// Original 1human Canvas renderer. Copyright (c) 2026 JM. MIT licensed.
// No network access. Recipe text is never executed.
const themes = ['signal','orbit','wave','bars','bloom','type','bounce'];
export function validateScene(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('A scene must be an object.');
  const keys = ['theme','background','foreground','accent','duration','speed','count','label'];
  if (Object.keys(input).some(k => !keys.includes(k))) throw new Error('Unknown scene parameter.');
  if (!themes.includes(input.theme)) throw new Error('Unsupported scene theme.');
  for (const key of ['background','foreground','accent']) if (!/^#[a-f\d]{6}$/i.test(input[key])) throw new Error('Colors must use six-digit hex.');
  for (const [key,min,max] of [['duration',2,30],['speed',.25,3],['count',3,24]]) {
    if (typeof input[key] !== 'number' || !Number.isFinite(input[key]) || input[key] < min || input[key] > max) throw new Error('Scene parameter outside its limits.');
  }
  if (!Number.isInteger(input.count) || typeof input.label !== 'string' || input.label.length > 44) throw new Error('Invalid count or label.');
  return Object.fromEntries(keys.map(key => [key,input[key]]));
}
/** @param {CanvasRenderingContext2D} ctx @param {any} scene @param {number} seconds */
export function drawScene(ctx, scene, seconds) {
  seconds=Math.max(0,Number.isFinite(seconds)?seconds:0);
  const t=(seconds % scene.duration)*scene.speed;
  ctx.globalAlpha=1;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=scene.background;ctx.fillRect(0,0,540,960);
  ctx.fillStyle=scene.foreground;ctx.strokeStyle=scene.foreground;ctx.lineWidth=3;
  if (scene.theme==='signal') {
    const phase=((seconds%scene.duration)/scene.duration)*3, section=Math.floor(phase), u=phase-section;
    const ease=1-Math.pow(1-Math.min(1,u*4),3), exit=1-Math.max(0,(u-.85)/.15);
    ctx.save();ctx.globalAlpha=.13;ctx.lineWidth=1;
    for(let y=0;y<960;y+=45){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(540,y);ctx.stroke();}
    for(let x=0;x<540;x+=45){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,960);ctx.stroke();}ctx.restore();
    ctx.save();ctx.translate(270,380);ctx.rotate(t*.17);
    for(let i=0;i<scene.count;i++){const a=i*Math.PI*2/scene.count;const r=175+Math.sin(t*1.8+i)*35;
      ctx.fillStyle=i%3===0?scene.accent:scene.foreground;ctx.globalAlpha=.75;
      ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r,4+(i%4)*3,0,Math.PI*2);ctx.fill();}
    ctx.restore();ctx.globalAlpha=1;ctx.fillStyle=scene.foreground;ctx.textAlign='left';
    ctx.font='600 15px Arial, sans-serif';ctx.fillText('1HUMAN / MOTION STUDY 001',34,115);
    ctx.font='600 13px Arial, sans-serif';ctx.fillText('ORIGINAL CODE. OPEN RECIPE.',34,140);
    ctx.save();ctx.globalAlpha=exit;ctx.translate(0,35*(1-ease));
    const words=[['MAKE','SOME','THING.'],['LET','IT','MOVE.'],['SEE.','LEARN.','REMIX.']][section];
    ctx.font='900 98px Arial, sans-serif';
    words.forEach((word,i)=>{ctx.fillStyle=i===1?scene.accent:scene.foreground;ctx.fillText(word,34,260+i*102);});ctx.restore();
    ctx.fillStyle=scene.accent;ctx.fillRect(34,552,472*((seconds%scene.duration)/scene.duration),4);
    ctx.fillStyle=scene.foreground;ctx.font='600 16px Arial, sans-serif';ctx.fillText(scene.label,34,602);
    ctx.globalAlpha=.65;ctx.font='13px Arial, sans-serif';ctx.fillText('Built by an agent. Directed by a human.',34,627);ctx.globalAlpha=1;return;
  }
  ctx.save();ctx.translate(270,365);
  if(scene.theme==='orbit') {
    ctx.globalAlpha=.2;ctx.beginPath();ctx.ellipse(0,0,174,88,-.45,0,Math.PI*2);ctx.stroke();
    const dots=Array.from({length:scene.count},(_,i)=>{const a=t+i*Math.PI*2/scene.count;return {x:Math.cos(a)*174,y:Math.sin(a)*88,z:Math.sin(a)};}).sort((a,b)=>a.z-b.z);
    for(const [i,d] of dots.entries()){ctx.fillStyle=i%3===0?scene.accent:scene.foreground;ctx.globalAlpha=.65+(d.z+1)*.175;ctx.beginPath();ctx.arc(d.x,d.y,14+(d.z+1)*11,0,Math.PI*2);ctx.fill();}
  } else if(scene.theme==='wave') {
    for(let i=0;i<scene.count;i++){ctx.strokeStyle=i%4===0?scene.accent:scene.foreground;ctx.globalAlpha=.25+i/scene.count*.65;ctx.beginPath();for(let x=-235;x<=235;x+=4){const y=Math.sin(x/56+t+i*.22)*70+(i-scene.count/2)*12;if(x===-235)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
  } else if(scene.theme==='bloom') {
    for(let i=0;i<scene.count;i++){ctx.save();ctx.rotate(i*2*Math.PI/scene.count+t*.15);ctx.fillStyle=i%2?scene.foreground:scene.accent;ctx.globalAlpha=.45;ctx.beginPath();ctx.ellipse(78+Math.sin(t)*16,0,98,28,0,0,Math.PI*2);ctx.fill();ctx.restore();}ctx.globalAlpha=1;ctx.fillStyle=scene.foreground;ctx.beginPath();ctx.arc(0,0,26,0,Math.PI*2);ctx.fill();
  } else if(scene.theme==='bounce') {
    const height=Math.abs(Math.sin(t*2.3))*170;ctx.globalAlpha=.16;ctx.beginPath();ctx.ellipse(0,130,70-height/5,12,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.beginPath();ctx.ellipse(0,95-height,54+(height<20?20-height:0),54-(height<20?(20-height)*.6:0),0,0,Math.PI*2);ctx.fill();ctx.fillStyle=scene.accent;ctx.beginPath();ctx.arc(-16,80-height,7,0,Math.PI*2);ctx.arc(16,80-height,7,0,Math.PI*2);ctx.fill();ctx.fillStyle=scene.foreground;ctx.globalAlpha=.2;ctx.fillRect(-110,190,220,7);ctx.globalAlpha=1;ctx.fillRect(-110,190,220*((t/4)%1),7);
  } else if(scene.theme==='bars') {
    const bw=Math.min(30,330/scene.count);for(let i=0;i<scene.count;i++){const bar=35+(Math.sin(t*2+i*.6)+1)*90;ctx.fillStyle=i%3===0?scene.accent:scene.foreground;ctx.fillRect((i-scene.count/2)*(bw+7),100-bar,bw,bar);}
  } else {
    ctx.textAlign='center';ctx.font='bold 90px Arial, sans-serif';ctx.fillText('Aa',Math.sin(t)*22,Math.cos(t)*18);ctx.strokeStyle=scene.accent;ctx.strokeRect(-125,-95,250,190);
  }
  ctx.restore();ctx.globalAlpha=1;ctx.fillStyle=scene.foreground;ctx.textAlign='center';ctx.font='600 26px Arial, sans-serif';ctx.fillText(scene.label,270,635);
}

