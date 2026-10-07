// Original dimensional probe, Copyright (c) 2026 JM. MIT, see ../../LICENSE.
// Uses public fixture dimensions only. No image assets, production adapter or renderer.
import test from 'node:test';
import assert from 'node:assert/strict';
import {StableLayout} from './layout.mjs';

export const provenance={
 author:'Toutazimuth contributors (Codex, authorized by Toutazimuth)',
 source:'https://github.com/arnegiacomo/fugleramme/discussions/108#discussioncomment-18799950',
 archive:'https://github.com/user-attachments/files/33171292/fugleramme-real-artwork-study.zip',
 sha256:'d942b2ecc74a6d2cf50e0369c58da2f46f75930593264e8332bf57a74a77bf7c',
 upstream:'79e7ede98fd8abfa40f01b0bdcd665dca7486583',
 rights:'Fixture code MIT; derived image layers CC BY-SA 4.0 with the archive credits. No images distributed by this probe.'
};
// Unions of the padded bird rectangle and two-line raster label in variant 0.
// Their relative offsets are retained; dimensions include transparent/feather margins.
export const items=[
 ['Erithacus rubecula',312,341],['Parus major',280,378],
 ['Cyanistes caeruleus',207,380],['Turdus merula',248,378],
 ['Carduelis carduelis',207,380],['Fringilla coelebs',207,378]
].map(([species,width,height],i)=>({id:'bird_'+i,species,width,height}));

// A bounded edge-first comparison, not a density optimizer. Its logical region is
// y=100..960 on the fixture's 800x1000 plate, reserving header/footer bands.
// An actual renderer must add y=100 to placements and re-export each newcomer there.
class EdgeAdmission{
 placed=new Map();width=800;height=860;padding=24;gap=12;step=12;
 update(next){
  const eligible=new Set(next.map(i=>i.id));
  for(const id of this.placed.keys())if(!eligible.has(id))this.placed.delete(id);
  const entered=[],queued=[];
  for(const item of next){if(this.placed.has(item.id))continue;let spot=null;
   search:for(let y=this.padding;y+item.height<=this.height-this.padding;y+=this.step)
    for(let x=this.padding;x+item.width<=this.width-this.padding;x+=this.step)
     if([...this.placed.values()].every(p=>x+item.width+this.gap<=p.x||p.x+p.width+this.gap<=x||y+item.height+this.gap<=p.y||p.y+p.height+this.gap<=y)){spot={id:item.id,x,y,width:item.width,height:item.height};break search;}
   if(spot){this.placed.set(item.id,Object.freeze(spot));entered.push(item.id);}else queued.push(item.id);
  }
  return{placements:[...this.placed.values()],entered,queued};
 }
}
function check(scene,result){
 for(const p of result.placements){
  assert.ok(p.x>=scene.padding&&p.y>=scene.padding&&p.x+p.width<=scene.width-scene.padding&&p.y+p.height<=scene.height-scene.padding);
  for(const q of result.placements)if(p.id!==q.id)assert.ok(p.x+p.width+scene.gap<=q.x||q.x+q.width+scene.gap<=p.x||p.y+p.height+scene.gap<=q.y||q.y+q.height+scene.gap<=p.y,'Padded artwork/label union collision');
 }
}
test('actual fixture unions expose center-first fragmentation; edge admission improves this ordered sample',()=>{
 const center=new StableLayout({width:800,height:860}),edge=new EdgeAdmission();
 const a=center.update(items),b=edge.update(items);check(center,a);check(edge,b);
 assert.ok(b.placements.length>a.placements.length);
 console.log(JSON.stringify({source:provenance.source,center_visible:a.placements.length,edge_visible:b.placements.length,edge_pending:b.queued.map(id=>items.find(i=>i.id===id).species),region:{width:800,height:860,offset_y:100},scope:'Numeric rectangle model only; no image movement, asset decode or upstream integration.'}));
});
test('removal admits a queued real footprint while surviving geometry stays exact',()=>{
 const edge=new EdgeAdmission(),first=edge.update(items),remove='bird_1';
 assert.ok(first.placements.some(p=>p.id===remove));
 assert.ok(first.queued.length>0);
 const next=edge.update(items.filter(i=>i.id!==remove));
 for(const p of first.placements)if(p.id!==remove)assert.deepEqual(next.placements.find(q=>q.id===p.id),p);
 assert.ok(next.entered.length>0);check(edge,next);
});
test('500 changing selections retain geometry and reserve bird plus multiline-label margins',()=>{
 const edge=new EdgeAdmission();let previous={placements:[]},seed=31;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
 for(let turn=0;turn<500;turn++){
  const chosen=items.filter(()=>random()>.22).map(i=>({...i}));
  for(let i=chosen.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[chosen[i],chosen[j]]=[chosen[j],chosen[i]];}
  const next=edge.update(chosen),ids=new Set(chosen.map(i=>i.id));
  for(const p of previous.placements)if(ids.has(p.id))assert.deepEqual(next.placements.find(q=>q.id===p.id),p);
  check(edge,next);previous=next;
 }
});
