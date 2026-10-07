import test from 'node:test';
import assert from 'node:assert/strict';
import {StableLayout} from './layout.mjs';
const item=(id,width=180,height=130)=>({id,width,height});
const indexed=result=>new Map(result.placements.map(p=>[p.id,p]));
function valid(scene,result) {
  for (const p of result.placements) {
    assert.ok(p.x>=scene.padding&&p.y>=scene.padding&&p.x+p.width<=scene.width-scene.padding&&p.y+p.height<=scene.height-scene.padding);
    for (const q of result.placements) if (p.id!==q.id) assert.ok(p.x+p.width+scene.gap<=q.x||q.x+q.width+scene.gap<=p.x||p.y+p.height+scene.gap<=q.y||q.y+q.height+scene.gap<=p.y,'Footprints including labels must not collide');
  }
}
test('new arrivals keep old x/y and size; reordered input never replays them',()=>{
  const scene=new StableLayout(),a=scene.update([item('a'),item('b')]);
  const next=scene.update([item('b',220,180),item('c'),item('a',220,180)]),map=indexed(next);
  for (const p of a.placements) assert.deepEqual(map.get(p.id),p);
  assert.deepEqual(next.entered,['c']); valid(scene,next);
});
test('a full frame queues newcomers instead of shrinking old birds',()=>{
  const scene=new StableLayout(),a=scene.update([item('full',672,432)]);
  const next=scene.update([item('full',12,12),item('waiting')]);
  assert.deepEqual(next.placements,a.placements); assert.deepEqual(next.queued,['waiting']); assert.deepEqual(next.entered,[]);
});
test('removing one layer frees space while surviving placements remain frozen',()=>{
  const scene=new StableLayout(),a=scene.update([item('a'),item('b'),item('c')]);
  const next=scene.update([item('a'),item('c'),item('d')]),map=indexed(next);
  for (const p of a.placements.filter(p=>p.id!=='b')) assert.deepEqual(map.get(p.id),p);
  assert.deepEqual(next.removed,['b']); valid(scene,next);
});
test('invalid input rejects atomically and cannot erase the current composition',()=>{
  const scene=new StableLayout(),a=scene.update([item('a')]);
  for (const bad of [[item('b'),item('b')],[item('b',NaN)],[item('b',0)],[item('<script>')]]) assert.throws(()=>scene.update(bad));
  assert.deepEqual(scene.update([item('a')]).placements,a.placements);
});
test('only an explicit reset starts a new composition',()=>{
  const scene=new StableLayout(); scene.update([item('a')]); scene.reset();
  assert.deepEqual(scene.update([item('a')]).entered,['a']);
});
test('100 deterministic changing detection sets preserve retained geometry and never collide',()=>{
  const scene=new StableLayout(); let previous={placements:[]},seed=17;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
  for (let turn=0;turn<100;turn++) {
    const items=Array.from({length:24},(_,i)=>item('bird_'+i,96+(i%4)*24,84+(i%3)*24)).filter(()=>random()>.35).sort(()=>random()-.5);
    const desired=new Set(items.map(i=>i.id)),next=scene.update(items),map=indexed(next);
    for (const p of previous.placements) if (desired.has(p.id)) assert.deepEqual(map.get(p.id),p);
    valid(scene,next); previous=next;
  }
});
