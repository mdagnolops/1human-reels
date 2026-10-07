// Original example, Copyright (c) 2026 JM. MIT (see ../../LICENSE).
// Rectangle footprints are deliberately conservative; this is not Fugleramme's packer.
export class StableLayout {
  #placed = new Map();
  constructor({width=720,height=480,padding=24,gap=12,step=12}={}) {
    if (![width,height,padding,gap,step].every(Number.isInteger) || width<64 || height<64 || width>2048 || height>2048 || padding<0 || padding*2>=Math.min(width,height) || gap<0 || gap>128 || step<4 || step>64) throw new Error('Invalid scene bounds');
    Object.assign(this,{width,height,padding,gap,step});
  }
  reset() { this.#placed.clear(); }
  update(items) {
    if (!Array.isArray(items) || items.length>64) throw new Error('At most 64 layers');
    const ids=new Set();
    for (const item of items) {
      if (!item || typeof item.id!=='string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(item.id) || ids.has(item.id) || ![item.width,item.height].every(v=>Number.isInteger(v)&&v>=12&&v<=4096)) throw new Error('Unique IDs and finite integer footprints required');
      ids.add(item.id);
    }
    const removed=[];
    for (const id of this.#placed.keys()) if (!ids.has(id)) { this.#placed.delete(id); removed.push(id); }
    const entered=[],queued=[];
    for (const item of items) {
      // Geometry of an existing identity is frozen even if the input order/size changes.
      if (this.#placed.has(item.id)) continue;
      const spot=this.#find(item.width,item.height);
      if (!spot) { queued.push(item.id); continue; }
      this.#placed.set(item.id,Object.freeze({id:item.id,...spot,width:item.width,height:item.height}));
      entered.push(item.id);
    }
    return Object.freeze({placements:Object.freeze([...this.#placed.values()]),entered:Object.freeze(entered),removed:Object.freeze(removed),queued:Object.freeze(queued)});
  }
  #find(width,height) {
    const choices=[];
    for (let y=this.padding;y+height<=this.height-this.padding;y+=this.step)
      for (let x=this.padding;x+width<=this.width-this.padding;x+=this.step)
        choices.push({x,y,score:Math.abs(x+width/2-this.width/2)+Math.abs(y+height/2-this.height/2)});
    choices.sort((a,b)=>a.score-b.score||a.y-b.y||a.x-b.x);
    for (const {x,y} of choices) {
      const clear=[...this.#placed.values()].every(p=>x+width+this.gap<=p.x||p.x+p.width+this.gap<=x||y+height+this.gap<=p.y||p.y+p.height+this.gap<=y);
      if (clear) return {x,y};
    }
    return null; // No shrinking or moving already visible layers to force a fit.
  }
}
