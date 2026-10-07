/* v1.14.0 -> v1.14.1 (WIP in wip/, not released until the user gives the go). Reader: pin roles. DITL page untouched. */
const fs=require('fs');let h=fs.readFileSync('logic-sim-v1.14.0.html','utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>Logic Sim v1.14.0</title>','<title>Logic Sim v1.14.1</title>');
/* 1. a 2-pin block drawn VERTICALLY with no input found (ABC-002 F(X) LN5, fed from a numbered circle above): the upper pin is the input */
rep(`else if(b.pins.length===2){const[p,q]=b.pins;if(Math.abs(p.x-q.x)>Math.abs(p.y-q.y)+1)(p.x<q.x?p:q).role='in'}}`,`else if(b.pins.length===2){const[p,q]=b.pins;if(Math.abs(p.x-q.x)>Math.abs(p.y-q.y)+1)(p.x<q.x?p:q).role='in';else if(Math.abs(p.y-q.y)>Math.abs(p.x-q.x)+1)(p.y>q.y?p:q).role='in'}}`);
/* 2. a T (SW / AMT) with two OUT pins: the one labelled "a" / "A" is the A-leg INPUT (ABC-004A x2, 010 x3, 011, 012) */
rep(` /* side of every pin relative to the block centre */`,` for(const b of blk)if((b.k==='SW'||b.k==='AMT')&&b.pins.filter(p=>p.role==='out').length>1){for(const p of b.pins)if(p.role==='out'&&/^a$/i.test(p.lab||''))p.role='in'}
 /* side of every pin relative to the block centre */`);
fs.writeFileSync('wip/logic-sim-v1.14.1.html',h);console.log('wip written',h.length);
