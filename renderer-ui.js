import {drawScene,validateScene} from './studio-renderer.js';
const canvas=document.querySelector('#preview'),ctx=canvas.getContext('2d'),input=document.querySelector('#scene'),status=document.querySelector('#status'),play=document.querySelector('#play'),exportButton=document.querySelector('#export');
let scene=validateScene({theme:'signal',background:'#161616',foreground:'#ffffff',accent:'#b9ff52',duration:12,speed:1,count:16,label:'See it. Learn it. Make it yours.'}),frame=0,running=false,start=0,exporting=false,videoUrl='';
let provenance={source:'https://reels.1human.tech/post/demo-signal',post_id:'demo-signal',license:'CC0-1.0',recipe:'Original JM motion poster. Shared MIT Canvas renderer; no external assets.'};
const provenanceBox=document.createElement('p');document.querySelector('#scene').after(provenanceBox);
const downloadRecipe=document.createElement('button');downloadRecipe.textContent='Download scene + source';document.querySelector('#export').after(downloadRecipe);
const videoLink=document.createElement('a');videoLink.textContent='Download WebM';videoLink.hidden=true;videoLink.className='file';downloadRecipe.after(videoLink);
function describe(){provenanceBox.textContent='Source: '+(provenance.source??'Not provided')+' | License: '+(provenance.license??'Not provided — check rights before publishing.');}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
downloadRecipe.addEventListener('click',()=>{try{const next=validateScene(JSON.parse(input.value));downloadBlob(new Blob([JSON.stringify({...provenance,remix_of:provenance.post_id,scene:next},null,2)],{type:'application/json'}),'1human-scene-and-source.json');}catch(e){show(e.message??'Invalid scene.');}});
const show=message=>{status.textContent=message;};
function pause(){running=false;cancelAnimationFrame(frame);play.textContent='Play';}
function draw(time){drawScene(ctx,scene,(time-start)/1000);if(running)frame=requestAnimationFrame(draw);}
function load(value){pause();scene=validateScene(value.scene??value);if(value.scene){provenance={};for(const key of ['source','post_id','license','recipe','task'])if(typeof value[key]==='string')provenance[key]=value[key].slice(0,key==='recipe'?6000:400);}input.value=JSON.stringify(scene,null,2);describe();drawScene(ctx,scene,scene.duration*.15);show('Recipe loaded. Change parameters or export.');}
load(scene);show('Paused. Press Play to preview.');
play.addEventListener('click',()=>{if(running){pause();show('Paused.');}else{running=true;start=performance.now();play.textContent='Pause';frame=requestAnimationFrame(draw);show('Preview playing.');}});
document.querySelector('#apply').addEventListener('click',()=>{try{load(JSON.parse(input.value));}catch(e){show(e.message??'Invalid recipe.');}});
document.querySelector('#file').addEventListener('change',async event=>{try{const file=event.target.files[0];if(!file)return;if(file.size>24576)throw new Error('Recipe JSON must be at most 24 KiB.');load(JSON.parse(await file.text()));}catch(e){show(e.message??'Invalid recipe.');}});
exportButton.addEventListener('click',async()=>{
 if(exporting)return;
 if(!window.MediaRecorder||!canvas.captureStream||!MediaRecorder.isTypeSupported('video/webm')){show('WebM recording is unavailable in this browser. Use a current Chromium or Firefox browser.');return;}
 try{scene=validateScene(JSON.parse(input.value));}catch(e){show(e.message??'Invalid scene.');return;}
 pause();exporting=true;exportButton.disabled=true;play.disabled=true;document.querySelector('#apply').disabled=true;document.querySelector('#file').disabled=true;
 const stream=canvas.captureStream(30),chunks=[];
 try{
  const recorder=new MediaRecorder(stream,{mimeType:'video/webm',videoBitsPerSecond:850000});
  recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};
  const done=new Promise((resolve,reject)=>{recorder.onstop=resolve;recorder.onerror=()=>reject(new Error('Recording failed.'));});
  start=performance.now();running=true;draw(start);recorder.start();show('Recording '+scene.duration+' seconds. Keep this tab visible.');
  await new Promise(resolve=>setTimeout(resolve,scene.duration*1000));recorder.stop();await done;pause();
  const blob=new Blob(chunks,{type:'video/webm'});if(blob.size>4*1024*1024)throw new Error('Export exceeds 4 MiB. Shorten duration and try again.');
  if(videoUrl)URL.revokeObjectURL(videoUrl);videoUrl=URL.createObjectURL(blob);videoLink.href=videoUrl;videoLink.download='1human-'+scene.theme+'.webm';videoLink.hidden=false;show('Recorded '+(blob.size/1024).toFixed(0)+' KiB. Download the WebM and source JSON; review before publishing.');
 }catch(e){pause();show(e.message??'Export failed.');}finally{stream.getTracks().forEach(track=>track.stop());exporting=false;exportButton.disabled=false;play.disabled=false;document.querySelector('#apply').disabled=false;document.querySelector('#file').disabled=false;}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!exporting){pause();show('Paused while the tab is hidden.');}});
