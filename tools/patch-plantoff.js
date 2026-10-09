/* v1.20.7: the PLANT MODEL (process model: PV follows the controller output, writes the transmitters) is OFF by default and has its own on / off button "Plant model" (user 2026-10-10: "idisable mo muna function na plant model at lagyan ng on off button, para focus muna sa simulation debugging"). OFF = every AI / PV is a free input of the drawing and only the drawn logic runs. The choice is kept in this browser (localStorage ls-plantmodel). AN.procDefault (tests) still overrides. */
module.exports=(rep)=>{
rep(String.raw`if(AN.procDefault!==false)for(const b of S.procs)b.proc.on=true;`,String.raw`if(AN.procDefault===true||(AN.procDefault===undefined&&AN.plantOn===true))for(const b of S.procs)b.proc.on=true;`);
rep(String.raw`else{b.proc.on=q.on;b.proc.dist=q.dist||0}}}`,String.raw`else{b.proc.on=q.on;b.proc.dist=q.dist||0}if(!(AN.procDefault===true||(AN.procDefault===undefined&&AN.plantOn===true)))b.proc.on=false}}`);
rep(String.raw`function procRemote(x){const S=x.S;`,String.raw`function procRemote(x){if(!(AN.procDefault===true||(AN.procDefault===undefined&&AN.plantOn===true)))return;const S=x.S;`);
rep(String.raw`function plOpen(){if(AN.plantUi.open){try{plWin&&plWin.focus()}catch(e){}return}`,String.raw`function plOpen(){if(AN.plantUi.open){try{plWin&&plWin.focus()}catch(e){}return}if(AN.plantOn!==true&&AN.procDefault!==true){msg('Plant model is OFF (button "Plant model"): switch it on to use the Plant window');return}`);
rep(String.raw`bPl=h$('button',{txt:'Plant',title:'Plant window`,String.raw`bPm=h$('button',{txt:'Plant model: OFF',title:'OFF = every transmitter / PV is a free input and only the drawn logic runs (simulation debugging). ON = the process model makes the PV follow the controller output.'}),bPl=h$('button',{txt:'Plant',title:'Plant window`);
rep(String.raw`bDs,bPl,bPn,lImp,shb,tClk);`,String.raw`bDs,bPm,bPl,bPn,lImp,shb,tClk);`);
rep(String.raw`bPl.onclick=()=>{if(AN.plantUi.open)plClose();else plOpen()};`,String.raw`bPl.onclick=()=>{if(AN.plantUi.open)plClose();else plOpen()};
function plantSwitch(on,quiet){AN.plantOn=!!on;try{localStorage.setItem('ls-plantmodel',on?'1':'0')}catch(e){}
 for(const sh of AN.sheets){if(!sh.S)continue;for(const b of sh.S.procs||[])if(b.proc)b.proc.on=!!on;if(!on){sh.S.rt.pm={};sh.S.plantT=null;sh.S._rem=0}}
 bPm.textContent='Plant model: '+(on?'ON':'OFF');bPm.classList.toggle('on',!!on);if(!on&&AN.plantUi.open)plClose();
 try{settle()}catch(e){}try{buildPanel();panelUpd(true)}catch(e){}if(!quiet)msg(on?'Plant model ON: the PV follows the controller output':'Plant model OFF: transmitters / PV are free inputs, only the drawn logic runs')}
bPm.onclick=()=>plantSwitch(!AN.plantOn);
{let v=null;try{v=localStorage.getItem('ls-plantmodel')}catch(e){}AN.plantOn=v==='1';bPm.textContent='Plant model: '+(AN.plantOn?'ON':'OFF');bPm.classList.toggle('on',AN.plantOn)}`);
rep(String.raw`plOpen,plClose,plAIs,plRes,plVal,dsGoRef`,String.raw`plOpen,plClose,plAIs,plRes,plVal,plantSwitch,dsGoRef`);
};
