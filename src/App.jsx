import{useState,useEffect,useRef}from”react”;
const F=[{h:1,p:4},{h:2,p:3},{h:3,p:4},{h:4,p:4},{h:5,p:5},{h:6,p:4},{h:7,p:5},{h:8,p:3},{h:9,p:4}];
const K=[{h:10,p:5,scramble:1},{h:11,p:4},{h:12,p:3,ctp:1},{h:13,p:5},{h:14,p:3,ctp:1},{h:15,p:4},{h:16,p:4},{h:17,p:4},{h:18,p:4}];
const PL=[“Eric”,“Keith”,“Stephen”,“Will”,“Mat”,“Tim”,“Kyle”,“Frankie”,“Mike Barr”,“Drew”,“Alex”,“Bryan”,“Bobby”,“Dami”,“Casey”,“Harry”];
const CAPS=[“Keith”,“Stephen”];
const THU_OK=[“Eric”,“Keith”,“Stephen”,“Will”,“Mat”,“Tim”,“Kyle”,“Frankie”,“Mike Barr”,“Bryan”,“Dami”,“Casey”];
const PINS={“Eric”:“1000”,“Keith”:“1007”,“Stephen”:“1014”,“Will”:“1021”,“Mat”:“1028”,“Tim”:“1035”,“Kyle”:“1042”,“Frankie”:“1049”,“Mike Barr”:“1056”,“Drew”:“1063”,“Alex”:“1070”,“Bryan”:“1077”,“Bobby”:“1084”,“Dami”:“1091”,“Casey”:“1098”,“Harry”:“1105”};
const CA=”#c0392b”,CB=”#2471a3”;
const mkM=(pA,pB)=>({front:{pA,pB,sA:{},sB:{}},back:{pA:[…pA],pB:[…pB],sA:{},sB:{}}});
const S0=()=>({tA:“Team Keith”,tB:“Team Stephen”,pA:[“Keith”],pB:[“Stephen”],teamsSet:false,thu:[],fri:[],ctp:{12:{w:””,par:””,dist:””,photo:null},14:{w:””,par:””,dist:””,photo:null}},notifs:[],prefs:{eagle:true,birdie:true,par:false}});
const getScore=(sc,pair,h,isScramble)=>{
if(isScramble)return sc?.[pair?.[0]]?.[h]??null;
const v=(pair||[]).map(p=>sc?.[p]?.[h]).filter(x=>x>0);
return v.length?Math.min(…v):null;
};
const isThuScr=(hNum)=>hNum===10;
const sc_col=d=>d<=-2?”#9a7d0a”:d===-1?”#7b241c”:d===0?”#2a2a2a”:d===1?”#154360”:”#0d0d0d”;
const calcM=(m,hs,isFri)=>{
if(!m?.pA||!m?.pB)return{w:null,lbl:“Not started”};
let a=0,b=0,pl=0;
hs.forEach(h=>{
const scr=isFri||isThuScr(h.h);
const va=getScore(m.sA,m.pA,h.h,scr),vb=getScore(m.sB,m.pB,h.h,scr);
if(va&&vb){pl++;if(va<vb)a++;else if(vb<va)b++;}
});
const rem=hs.length-pl,d=a-b;
if(!pl)return{w:null,lbl:“Not started”};
if(rem===0){if(d>0)return{w:“A”,lbl:`A wins ${a}-${b}`};if(d<0)return{w:“B”,lbl:`B wins ${b}-${a}`};return{w:“tie”,lbl:“Halved”};}
if(Math.abs(d)>rem)return{w:d>0?“A”:“B”,lbl:`${d>0?"A":"B"} wins (${Math.max(a,b)}&${rem})`};
return{w:null,lbl:d===0?`AS — ${rem} left`:`${d>0?"A":"B"} ${Math.abs(d)}UP — ${rem} left`};
};
function Pip({s,p}){
if(!s)return<div style={{width:26,height:26,borderRadius:“50%”,border:“1px dashed #222”,display:“flex”,alignItems:“center”,justifyContent:“center”,color:”#222”,fontSize:9}}>·</div>;
const d=s-p;
return<div style={{width:26,height:26,borderRadius:d<=0?“50%”:3,background:sc_col(d),border:d===1?“1.5px solid #1a5276”:“none”,display:“flex”,alignItems:“center”,justifyContent:“center”,fontWeight:700,fontSize:10,color:d===0?”#aaa”:”#fff”}}>{s}</div>;
}
function Toast({n,dismiss}){
if(!n)return null;
const col=n.t===“match”?”#c9a227”:n.t===“eagle”?”#f4d03f”:n.t===“birdie”?”#e74c3c”:”#2d6a4f”;
const ico=n.t===“match”?“🏆”:n.t===“eagle”?“🦅”:n.t===“birdie”?“🐦”:“⛳”;
return<div style={{position:“fixed”,top:68,left:“50%”,transform:“translateX(-50%)”,zIndex:999,maxWidth:340,width:“90%”}}><div style={{background:”#0a0a0a”,border:“1px solid “+col,borderRadius:10,padding:“10px 14px”,display:“flex”,gap:10,alignItems:“flex-start”,boxShadow:“0 8px 24px #000c”}}><span style={{fontSize:20}}>{ico}</span><div style={{flex:1,fontSize:12,color:”#ddd”}}>{n.msg}</div><span onClick={dismiss} style={{color:”#444”,cursor:“pointer”,fontSize:16}}>✕</span></div></div>;
}
function Tracker({holes,sA,pA,sB,pB,tA,tB,isFri}){
let a=0,b=0;const rows=[];
holes.forEach(h=>{
const scr=isFri||isThuScr(h.h);
const va=getScore(sA,pA,h.h,scr),vb=getScore(sB,pB,h.h,scr);
if(va!==null&&vb!==null){if(va<vb)a++;else if(vb<va)b++;}
rows.push({h:h.h,p:h.p,va,vb,a,b,ctp:h.ctp,scr:h.scramble});
});
const played=rows.filter(r=>r.va!==null&&r.vb!==null);
if(!played.length)return null;
const last=played[played.length-1],diff=last.a-last.b,rem=holes.length-played.length;
let txt,col;
if(diff===0){txt=“All Square”;col=”#888”;}
else{const ldr=diff>0?tA:tB;col=diff>0?CA:CB;if(rem===0)txt=`${ldr} wins ${Math.max(last.a,last.b)}-${Math.min(last.a,last.b)}`;else if(Math.abs(diff)>rem)txt=`${ldr} wins ${Math.abs(diff)}&${rem}`;else txt=`${ldr} ${Math.abs(diff)}UP thru ${played.length}`;}
return(
<div style={{marginBottom:10}}>
<div style={{background:”#080808”,border:“1px solid “+col+“44”,borderRadius:8,padding:“7px 14px”,marginBottom:8,display:“flex”,alignItems:“center”,justifyContent:“space-between”}}>
<span style={{color:CA,fontWeight:700,fontSize:12}}>{tA}</span>
<span style={{color:col,fontWeight:900,fontSize:13}}>{txt}</span>
<span style={{color:CB,fontWeight:700,fontSize:12}}>{tB}</span>
</div>
<div style={{overflowX:“auto”}}>
<div style={{display:“flex”,gap:2,minWidth:“max-content”}}>
{rows.map(r=>{
const done=r.va!==null&&r.vb!==null;
const w=!done?null:r.va<r.vb?“A”:r.vb<r.va?“B”:“tie”;
const wc=w===“A”?CA:w===“B”?CB:w===“tie”?”#666”:”#1a1a1a”;
const d=done?r.a-r.b:null;
const ds=d===null?””:d===0?“AS”:(d>0?“A”:“B”)+Math.abs(d);
const dc=d===null?”#333”:d>0?CA:d<0?CB:”#888”;
const topCol=r.ctp?”#c9a227”:r.scr?”#2d6a4f”:”#333”;
return(
<div key={r.h} style={{display:“flex”,flexDirection:“column”,alignItems:“center”,gap:1}}>
<div style={{fontSize:8,color:topCol,width:28,textAlign:“center”,fontWeight:r.ctp||r.scr?700:400}}>{r.h}{r.ctp?“⚑”:r.scr?”~”:””}</div>
<div style={{fontSize:8,color:”#333”,width:28,textAlign:“center”}}>p{r.p}</div>
<div style={{fontSize:9,color:CA,fontWeight:700,width:28,textAlign:“center”,background:”#0a0a0a”,borderRadius:3,padding:“1px 0”}}>{r.va||”–”}</div>
<div style={{fontSize:9,color:CB,fontWeight:700,width:28,textAlign:“center”,background:”#0a0a0a”,borderRadius:3,padding:“1px 0”}}>{r.vb||”–”}</div>
<div style={{width:28,height:11,background:done?wc+“22”:“transparent”,borderRadius:3,border:done?“1px solid “+wc+“44”:“1px solid #111”,display:“flex”,alignItems:“center”,justifyContent:“center”}}>{done&&<div style={{width:6,height:6,borderRadius:“50%”,background:wc}}/>}</div>
<div style={{fontSize:8,color:dc,fontWeight:700,width:28,textAlign:“center”}}>{ds}</div>
</div>
);
})}
</div>
</div>
<div style={{display:“flex”,gap:10,marginTop:4,flexWrap:“wrap”}}>
<div style={{display:“flex”,alignItems:“center”,gap:3}}><div style={{width:7,height:7,borderRadius:“50%”,background:CA}}/><span style={{fontSize:8,color:”#555”}}>{tA}</span></div>
<div style={{display:“flex”,alignItems:“center”,gap:3}}><div style={{width:7,height:7,borderRadius:“50%”,background:CB}}/><span style={{fontSize:8,color:”#555”}}>{tB}</span></div>
<span style={{fontSize:8,color:”#555”}}>⚑=CTP ~=scramble · running score below dot</span>
</div>
</div>
);
}
function ThuCard({holes,pA,pB,sA,sB,me,onScore}){
const [ed,setEd]=useState(null),[v,setV]=useState(””);
const commit=(p,h,t,pair)=>{const n=parseInt(v);if(!isNaN(n)&&n>0)onScore(p,h,n,t,pair);else if(v===””)onScore(p,h,null,t,pair);setEd(null);setV(””);};
const hw=h=>{const scr=isThuScr(h.h);const va=getScore(sA,pA,h.h,scr),vb=getScore(sB,pB,h.h,scr);if(!va||!vb)return null;return va<vb?“A”:vb<va?“B”:“tie”;};
const th={padding:“4px 2px”,textAlign:“center”,fontSize:9,color:”#444”,borderRight:“1px solid #0a0a0a”,fontWeight:400};
const td={padding:“2px 2px”,textAlign:“center”,borderRight:“1px solid #080808”};
const rows=[…pA.map(p=>({p,t:“A”})),…pB.map(p=>({p,t:“B”}))];
return(
<div style={{overflowX:“auto”,borderRadius:6,border:“1px solid #111”,marginBottom:10}}>
<table style={{borderCollapse:“collapse”,width:“100%”}}>
<thead>
<tr style={{background:”#0a0a0a”}}>
<th style={{…th,textAlign:“left”,paddingLeft:6,width:52}}>Plyr</th>
{holes.map(h=>{const w=hw(h),wc=w===“A”?CA:w===“B”?CB:w===“tie”?”#555”:“transparent”,scr=isThuScr(h.h);return<th key={h.h} style={{…th,background:h.ctp?”#1a0f00”:scr?”#0a1a0a”:w?wc+“18”:”#0a0a0a”,color:h.ctp?”#c9a227”:scr?”#2d6a4f”:w?wc:”#333”}}>{h.h}{h.ctp?“⚑”:scr?”~”:””}{w&&<div style={{width:5,height:5,borderRadius:“50%”,background:wc,margin:“1px auto 0”}}/>}</th>;})}
<th style={{...th}}>Tot</th>
</tr>
<tr style={{background:”#070707”}}>
<td style={{…td,textAlign:“left”,paddingLeft:6,color:”#555”,fontSize:8,fontWeight:700}}>best</td>
{holes.map(h=>{const scr=isThuScr(h.h);const w=hw(h),va=getScore(sA,pA,h.h,scr),vb=getScore(sB,pB,h.h,scr),wc=w===“A”?CA:w===“B”?CB:w===“tie”?”#888”:”#333”;return<td key={h.h} style={{...td,fontSize:9,fontWeight:700,color:wc}}>{va||”–”}/{vb||”–”}</td>;})}
<td style={{...td}}/>
</tr>
<tr style={{background:”#060606”}}>
<td style={{…td,textAlign:“left”,paddingLeft:6,color:”#222”,fontSize:8}}>par</td>
{holes.map(h=><td key={h.h} style={{…td,color:”#222”,fontSize:8}}>{h.p}</td>)}
<td style={{…td,color:”#222”,fontSize:8}}>{holes.reduce((s,h)=>s+h.p,0)}</td>
</tr>
</thead>
<tbody>
{rows.map(({p,t})=>{
const sc=t===“A”?sA:sB,pt=holes.reduce((s,h)=>s+h.p,0),tot=holes.reduce((s,h)=>s+(sc?.[p]?.[h.h]||0),0);
const isMe=p===me;
const getBest=h=>{const scr=isThuScr(h.h);return getScore(sc,t===“A”?pA:pB,h.h,scr);};
return(
<tr key={p} style={{borderBottom:“1px solid #0a0a0a”,background:isMe?”#0c0c16”:“transparent”}}>
<td style={{…td,textAlign:“left”,paddingLeft:6,color:isMe?”#fff”:t===“A”?CA:CB,fontWeight:isMe?700:400,fontSize:isMe?11:9,whiteSpace:“nowrap”}}>{p.split(” “)[0]}{isMe?” ★”:””}</td>
{holes.map(h=>{
const scr=isThuScr(h.h);
const myPair=t===“A”?pA:pB;
const canEdit=isMe&&(!scr||myPair[0]===p);
const s=sc?.[p]?.[h.h]??null,isEd=ed?.p===p&&ed?.h===h.h,isBest=s!==null&&s===getBest(h);
return(
<td key={h.h} style={{…td,padding:2,background:isBest?(t===“A”?CA:CB)+“14”:“transparent”}}>
{canEdit?(isEd
?<input autoFocus value={v} onChange={e=>setV(e.target.value.replace(/\D/g,””))} onBlur={()=>commit(p,h.h,t,scr?myPair:null)} onKeyDown={e=>{if(e.key===“Enter”)commit(p,h.h,t,scr?myPair:null);if(e.key===“Escape”){setEd(null);setV(””);}}} style={{width:26,textAlign:“center”,background:”#111”,color:”#fff”,border:“1.5px solid “+(t===“A”?CA:CB),borderRadius:3,fontSize:13,fontWeight:700,padding:1,outline:“none”}}/>
:<div onClick={()=>{setEd({p,h:h.h});setV(s?.toString()||””);}} style={{cursor:“pointer”,display:“flex”,alignItems:“center”,justifyContent:“center”,minWidth:26,minHeight:26}}><Pip s={s} p={h.p}/></div>)
:<div style={{display:“flex”,alignItems:“center”,justifyContent:“center”}}><Pip s={s} p={h.p}/></div>}
</td>
);
})}
<td style={{…td,fontWeight:700,fontSize:10,color:tot?(tot-pt<0?CA:tot-pt>0?CB:”#666”):”#333”}}>{tot||”–”}</td>
</tr>
);
})}
</tbody>
</table>
</div>
);
}
function FriCard({holes,pA,pB,sA,sB,me,onScore}){
const [ed,setEd]=useState(null),[v,setV]=useState(””);
const commit=(pair,h,t)=>{const n=parseInt(v);if(!isNaN(n)&&n>0)onScore(pair,h,n,t);else if(v===””)onScore(pair,h,null,t);setEd(null);setV(””);};
const hw=h=>{const va=getScore(sA,pA,h.h,true),vb=getScore(sB,pB,h.h,true);if(!va||!vb)return null;return va<vb?“A”:vb<va?“B”:“tie”;};
const th={padding:“4px 2px”,textAlign:“center”,fontSize:9,color:”#444”,borderRight:“1px solid #0a0a0a”,fontWeight:400};
const td={padding:“2px 2px”,textAlign:“center”,borderRight:“1px solid #080808”};
const meInA=pA.includes(me),meInB=pB.includes(me);
const pairs=[{pair:pA,t:“A”,sc:sA,isMe:meInA},{pair:pB,t:“B”,sc:sB,isMe:meInB}];
return(
<div style={{overflowX:“auto”,borderRadius:6,border:“1px solid #111”,marginBottom:10}}>
<table style={{borderCollapse:“collapse”,width:“100%”}}>
<thead>
<tr style={{background:”#0a0a0a”}}>
<th style={{…th,textAlign:“left”,paddingLeft:6,width:90}}>Pair</th>
{holes.map(h=>{const w=hw(h),wc=w===“A”?CA:w===“B”?CB:w===“tie”?”#555”:“transparent”;return<th key={h.h} style={{…th,background:h.ctp?”#1a0f00”:w?wc+“18”:”#0a0a0a”,color:h.ctp?”#c9a227”:w?wc:”#333”}}>{h.h}{h.ctp?“⚑”:””}{w&&<div style={{width:5,height:5,borderRadius:“50%”,background:wc,margin:“1px auto 0”}}/>}</th>;})}
<th style={{...th}}>Tot</th>
</tr>
<tr style={{background:”#060606”}}>
<td style={{…td,textAlign:“left”,paddingLeft:6,color:”#222”,fontSize:8}}>par</td>
{holes.map(h=><td key={h.h} style={{…td,color:”#222”,fontSize:8}}>{h.p}</td>)}
<td style={{…td,color:”#222”,fontSize:8}}>{holes.reduce((s,h)=>s+h.p,0)}</td>
</tr>
</thead>
<tbody>
{pairs.map(({pair,t,sc,isMe})=>{
const pt=holes.reduce((s,h)=>s+h.p,0),tot=holes.reduce((s,h)=>s+(getScore(sc,pair,h.h,true)||0),0);
return(
<tr key={t} style={{borderBottom:“1px solid #0a0a0a”,background:isMe?”#0c0c16”:“transparent”}}>
<td style={{…td,textAlign:“left”,paddingLeft:6,color:isMe?”#fff”:t===“A”?CA:CB,fontWeight:700,fontSize:isMe?11:10,whiteSpace:“nowrap”}}>{pair.map(p=>p.split(” “)[0]).join(” & “)}{isMe?” ★”:””}</td>
{holes.map(h=>{
const s=getScore(sc,pair,h.h,true),isEd=ed?.t===t&&ed?.h===h.h;
return(
<td key={h.h} style={{...td,padding:2}}>
{isMe?(isEd
?<input autoFocus value={v} onChange={e=>setV(e.target.value.replace(/\D/g,””))} onBlur={()=>commit(pair,h.h,t)} onKeyDown={e=>{if(e.key===“Enter”)commit(pair,h.h,t);if(e.key===“Escape”){setEd(null);setV(””);}}} style={{width:26,textAlign:“center”,background:”#111”,color:”#fff”,border:“1.5px solid “+(t===“A”?CA:CB),borderRadius:3,fontSize:13,fontWeight:700,padding:1,outline:“none”}}/>
:<div onClick={()=>{setEd({t,h:h.h});setV(s?.toString()||””);}} style={{cursor:“pointer”,display:“flex”,alignItems:“center”,justifyContent:“center”,minWidth:26,minHeight:26}}><Pip s={s} p={h.p}/></div>)
:<div style={{display:“flex”,alignItems:“center”,justifyContent:“center”}}><Pip s={s} p={h.p}/></div>}
</td>
);
})}
<td style={{…td,fontWeight:700,fontSize:10,color:tot?(tot-pt<0?CA:tot-pt>0?CB:”#666”):”#333”}}>{tot||”–”}</td>
</tr>
);
})}
</tbody>
</table>
</div>
);
}
function PairEdit({ms,mi,side,day,st,save,isThu}){
const [open,setOpen]=useState(false);
const m=ms[mi]||{},sd=m[side]||{};
const pool=t=>(t===“A”?st.pA:st.pB).filter(n=>!isThu||THU_OK.includes(n));
const set=(t,pair)=>{const arr=[…st[day]];arr[mi]={…arr[mi],[side]:{…arr[mi][side],[“p”+t]:pair}};save({…st,[day]:arr});};
if(!open)return<div onClick={()=>setOpen(true)} style={{display:“inline-flex”,alignItems:“center”,gap:5,background:”#1a0a00”,border:“1px solid #3a2000”,borderRadius:6,padding:“5px 10px”,cursor:“pointer”,marginBottom:8}}><span>🔁</span><span style={{fontSize:9,color:”#c9a227”,fontWeight:700}}>CAPTAIN: CHANGE PAIRINGS</span></div>;
return(
<div style={{background:”#0d0900”,border:“1px solid #3a2800”,borderRadius:10,padding:12,marginBottom:10}}>
<div style={{display:“flex”,justifyContent:“space-between”,marginBottom:10}}><span style={{fontSize:11,color:”#c9a227”,fontWeight:700}}>{side===“front”?“FRONT”:“BACK”} 9 — M{mi+1}</span><span onClick={()=>setOpen(false)} style={{color:”#555”,cursor:“pointer”,fontSize:18}}>✕</span></div>
{[“A”,“B”].map(t=>{
const cur=sd[“p”+t]||[],pl=pool(t);
const taken=n=>!cur.includes(n)&&ms.some((mm,i)=>i!==mi&&((mm[side]?.pA||[]).includes(n)||(mm[side]?.pB||[]).includes(n)));
return(
<div key={t} style={{marginBottom:10}}>
<div style={{fontSize:9,color:t===“A”?CA:CB,fontWeight:700,marginBottom:5}}>{t===“A”?st.tA:st.tB}: {cur.join(” & “)||“pick 2”}</div>
<div style={{display:“flex”,flexWrap:“wrap”,gap:5}}>
{pl.map(n=>{const sel=cur.includes(n),tk=taken(n);return<div key={n} onClick={()=>{if(tk)return;const np=sel?cur.filter(x=>x!==n):cur.length<2?[…cur,n]:[cur[1],n];set(t,np);}} style={{fontSize:11,padding:“4px 8px”,borderRadius:4,cursor:tk?“default”:“pointer”,border:“1px solid “+(sel?t===“A”?CA:CB:tk?”#111”:”#222”),background:sel?(t===“A”?CA:CB)+“22”:tk?”#080808”:”#111”,color:sel?t===“A”?CA:CB:tk?”#222”:”#666”}}>{n.split(” “)[0]}</div>;})}
</div>
</div>
);
})}
</div>
);
}
function DraftScreen({st,save}){
const unassigned=PL.filter(p=>!st.pA.includes(p)&&!st.pB.includes(p)&&!CAPS.includes(p));
const totalPicked=st.pA.length+st.pB.length-2;
const snakeTeam=pick=>{const round=Math.floor(pick/2);return(round%2===0)?[“A”,“B”][pick%2]:[“B”,“A”][pick%2];};
const nextTeam=snakeTeam(totalPicked);
const assign=(name,team)=>{
if(CAPS.includes(name))return;
const pA=st.pA.filter(p=>p!==name),pB=st.pB.filter(p=>p!==name);
if(team===“A”)save({…st,pA:[…pA,name],pB});
else if(team===“B”)save({…st,pA,pB:[…pB,name]});
else save({…st,pA,pB});
};
const build=()=>{
const thuA=st.pA.filter(p=>THU_OK.includes(p)).slice(0,6);
const thuB=st.pB.filter(p=>THU_OK.includes(p)).slice(0,6);
const thu=[mkM([thuA[0],thuA[1]],[thuB[0],thuB[1]]),mkM([thuA[2],thuA[3]],[thuB[2],thuB[3]]),mkM([thuA[4],thuA[5]],[thuB[4],thuB[5]])];
const fri=[mkM([st.pA[0],st.pA[1]],[st.pB[0],st.pB[1]]),mkM([st.pA[2],st.pA[3]],[st.pB[2],st.pB[3]]),mkM([st.pA[4],st.pA[5]],[st.pB[4],st.pB[5]]),mkM([st.pA[6],st.pA[7]],[st.pB[6],st.pB[7]])];
save({…st,thu,fri,teamsSet:true});
};
const ready=st.pA.length===8&&st.pB.length===8;
return(
<div style={{padding:“14px 14px 80px”}}>
<div style={{fontSize:11,color:”#888”,fontWeight:700,letterSpacing:2,marginBottom:10}}>CAPTAIN DRAFT — SNAKE FORMAT</div>
{unassigned.length>0&&(
<div style={{background:nextTeam===“A”?CA+“18”:CB+“18”,border:“1px solid “+(nextTeam===“A”?CA:CB)+“44”,borderRadius:8,padding:“8px 12px”,marginBottom:12,display:“flex”,alignItems:“center”,gap:8}}>
<span style={{fontSize:18}}>🏌️</span>
<div>
<div style={{fontSize:11,color:nextTeam===“A”?CA:CB,fontWeight:700}}>{nextTeam===“A”?“Keith”:“Stephen”} is on the clock — Pick #{totalPicked+1}</div>
<div style={{fontSize:9,color:”#555”}}>Snake draft · {14-totalPicked} picks remaining</div>
</div>
</div>
)}
<div style={{display:“flex”,gap:10,marginBottom:14}}>
{[“A”,“B”].map(t=>(
<div key={t} style={{flex:1,background:”#0a0a0a”,border:“1px solid “+(t===“A”?CA:CB)+“33”,borderRadius:10,padding:12}}>
<div style={{fontSize:10,color:t===“A”?CA:CB,fontWeight:700,marginBottom:2}}>{t===“A”?st.tA:st.tB}</div>
<div style={{fontSize:8,color:”#444”,marginBottom:8}}>Cap: {t===“A”?“Keith”:“Stephen”} · {(t===“A”?st.pA:st.pB).length}/8</div>
{(t===“A”?st.pA:st.pB).map((name,i)=>{
const isCap=CAPS.includes(name);
return<div key={name} style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,padding:“4px 0”,borderBottom:“1px solid #111”}}><span style={{fontSize:10,color:isCap?”#c9a227”:”#ccc”,fontWeight:isCap?700:400}}>{i+1}. {name}{isCap?” ⚑”:””}</span>{isCap?<span style={{fontSize:8,color:”#4a3200”}}>LOCKED</span>:<span onClick={()=>assign(name,null)} style={{color:”#333”,cursor:“pointer”,fontSize:14}}>×</span>}</div>;
})}
</div>
))}
</div>
{unassigned.length>0&&(
<>
<div style={{fontSize:10,color:”#555”,fontWeight:700,letterSpacing:2,marginBottom:8}}>AVAILABLE</div>
{unassigned.map(name=>{
const avail=[“Drew”,“Alex”,“Bobby”,“Harry”].includes(name)?“Fri only”:name===“Mike Barr”?“Fri+maybe Thu”:“Both days”;
return<div key={name} style={{display:“flex”,alignItems:“center”,background:”#0a0a0a”,border:“1px solid #1a1a1a”,borderRadius:8,padding:“10px 12px”,marginBottom:6,gap:10}}><div style={{flex:1}}><div style={{fontSize:13,color:”#ddd”,fontWeight:700}}>{name}</div><div style={{fontSize:9,color:”#444”,marginTop:2}}>{avail}</div></div><button onClick={()=>assign(name,“A”)} style={{background:CA+“22”,border:“1px solid “+CA+(nextTeam===“A”?“99”:“33”),color:CA,borderRadius:5,padding:“5px 12px”,fontSize:11,fontWeight:700,cursor:“pointer”}}>A</button><button onClick={()=>assign(name,“B”)} style={{background:CB+“22”,border:“1px solid “+CB+(nextTeam===“B”?“99”:“33”),color:CB,borderRadius:5,padding:“5px 12px”,fontSize:11,fontWeight:700,cursor:“pointer”}}>B</button></div>;
})}
</>
)}
{ready&&<button onClick={build} style={{width:“100%”,background:CA,border:“none”,borderRadius:8,padding:“14px”,color:”#fff”,fontSize:15,fontWeight:700,cursor:“pointer”,marginTop:8}}>BUILD MATCHUPS & START →</button>}
{st.teamsSet&&<div style={{fontSize:9,color:”#2d6a4f”,textAlign:“center”,marginTop:8,fontWeight:700}}>✓ Teams set — matchups built</div>}
</div>
);
}
function CTPSec({st,save,pushN}){
const refs=useRef({});
return(
<div style={{background:”#0e0800”,border:“1px solid #2a1600”,borderRadius:10,padding:“12px 14px”,marginTop:14}}>
<div style={{fontSize:11,color:”#c9a227”,fontWeight:700,marginBottom:4}}>⚑ CTP — H12 & H14</div>
<div style={{fontSize:9,color:”#444”,marginBottom:12}}>Fri · hit green · closest wins</div>
{[12,14].map(h=>{
const c=st.ctp[h]||{};
return(
<div key={h} style={{background:”#0a0a0a”,border:“1px solid #1a1200”,borderRadius:8,padding:12,marginBottom:10}}>
<div style={{fontSize:12,color:”#c9a227”,fontWeight:700,marginBottom:8}}>HOLE {h}</div>
<div style={{display:“flex”,gap:6,marginBottom:6}}>
<input placeholder=“Winner” value={c.w||””} onChange={e=>save({…st,ctp:{…st.ctp,[h]:{…c,w:e.target.value}}})} style={{flex:1,background:”#0d0d0d”,border:“1px solid #222”,borderRadius:5,padding:“6px 8px”,color:”#ccc”,fontSize:11,outline:“none”}}/>
<input placeholder=“Partner” value={c.par||””} onChange={e=>save({…st,ctp:{…st.ctp,[h]:{…c,par:e.target.value}}})} style={{flex:1,background:”#0d0d0d”,border:“1px solid #222”,borderRadius:5,padding:“6px 8px”,color:”#ccc”,fontSize:11,outline:“none”}}/>
</div>
<input placeholder=“Distance (e.g. 4ft 2in)” value={c.dist||””} onChange={e=>save({…st,ctp:{…st.ctp,[h]:{…c,dist:e.target.value}}})} style={{width:“100%”,background:”#0d0d0d”,border:“1px solid #222”,borderRadius:5,padding:“6px 8px”,color:”#ccc”,fontSize:11,outline:“none”,boxSizing:“border-box”,marginBottom:8}}/>
{c.photo?<div><img src={c.photo} alt=”” style={{width:“100%”,borderRadius:6,maxHeight:180,objectFit:“cover”,border:“1px solid #2a1600”}}/><button onClick={()=>refs.current[h]?.click()} style={{width:“100%”,marginTop:6,background:”#1a1000”,border:“1px solid #3a2000”,borderRadius:5,color:”#c9a227”,fontSize:10,fontWeight:700,padding:“6px 0”,cursor:“pointer”}}>📷 Replace</button></div>
:<button onClick={()=>refs.current[h]?.click()} style={{width:“100%”,background:”#0d0d0d”,border:“2px dashed #2a1600”,borderRadius:8,padding:“14px 0”,color:”#4a3200”,fontSize:12,fontWeight:700,cursor:“pointer”}}>📷 ADD PHOTO</button>}
<input ref={el=>refs.current[h]=el} type=“file” accept=“image/*” capture=“environment” onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{const ns={…st,ctp:{…st.ctp,[h]:{…(st.ctp[h]||{}),photo:ev.target.result}}};save(pushN(ns,“📍 CTP photo Hole “+h,“ctp”));};r.readAsDataURL(f);}} style={{display:“none”}}/>
</div>
);
})}
</div>
);
}
function BoardTab({st}){
let aP=0,bP=0;const rows=[];
(st.thu||[]).forEach((m,i)=>[“front”,“back”].forEach(sd=>{const r=calcM(m[sd],sd===“front”?F:K,false);if(r.w===“A”)aP+=.75;else if(r.w===“B”)bP+=.75;else if(r.w===“tie”){aP+=.375;bP+=.375;}rows.push({day:“THU”,lbl:`F${i+1} ${sd==="front"?"Frt":"Bck"}`,r});}));
(st.fri||[]).forEach((m,i)=>[“front”,“back”].forEach(sd=>{const r=calcM(m[sd],sd===“front”?F:K,true);if(r.w===“A”)aP+=1;else if(r.w===“B”)bP+=1;else if(r.w===“tie”){aP+=.5;bP+=.5;}rows.push({day:“FRI”,lbl:`M${i+1} ${sd==="front"?"Frt":"Bck"}`,r});}));
const aW=aP>=6.5,bW=bP>=6.5;
return(
<div style={{padding:“14px 14px 80px”}}>
<div style={{background:“linear-gradient(160deg,#130203,#020310)”,border:“1px solid #1a1a1a”,borderRadius:14,padding:20,marginBottom:16,textAlign:“center”}}>
<div style={{fontSize:9,color:”#222”,letterSpacing:4,marginBottom:10}}>THE CUP · FIRST TO 6.5</div>
<div style={{display:“flex”,justifyContent:“center”,gap:16,marginBottom:8}}>
<div style={{flex:1,textAlign:“center”}}><div style={{fontSize:52,color:CA,fontWeight:900,lineHeight:1}}>{aP}</div><div style={{color:CA,fontSize:10,fontWeight:700,marginTop:3}}>{st.tA}</div></div>
<div style={{flex:1,textAlign:“center”}}><div style={{fontSize:52,color:CB,fontWeight:900,lineHeight:1}}>{bP}</div><div style={{color:CB,fontSize:10,fontWeight:700,marginTop:3}}>{st.tB}</div></div>
</div>
{(aW||bW)&&<div style={{fontSize:18,fontWeight:900,color:aW?CA:CB,letterSpacing:2}}>🏆 {aW?st.tA:st.tB} WINS THE CUP!</div>}
{!aW&&!bW&&aP+bP>0&&<div style={{fontSize:10,color:”#444”}}>{aP===bP?“All Square”:aP>bP?st.tA+” leads”:st.tB+” leads”} by {Math.abs(aP-bP).toFixed(2)}pts</div>}
</div>
{rows.length===0&&<div style={{textAlign:“center”,color:”#333”,padding:20,fontSize:11}}>No matches yet</div>}
{rows.map((row,i)=>{const col=row.r.w===“A”?CA:row.r.w===“B”?CB:”#333”;return<div key={i} style={{display:“flex”,alignItems:“center”,gap:8,background:”#080808”,border:“1px solid “+col+“18”,borderRadius:5,padding:“6px 10px”,marginBottom:4}}><span style={{fontSize:8,color:”#fff”,background:row.day===“THU”?”#1a3a24”:”#2d1a38”,padding:“2px 5px”,borderRadius:3,fontWeight:700}}>{row.day}</span><span style={{color:”#333”,fontSize:10,flex:1}}>{row.lbl}</span><span style={{color:col,fontSize:10,fontWeight:700}}>{row.r.lbl}</span></div>;})}
{[12,14].map(h=>{const c=st.ctp?.[h];if(!c?.w)return null;return<div key={h} style={{background:”#080808”,border:“1px solid #1a1000”,borderRadius:8,padding:12,marginTop:6}}><div style={{display:“flex”,gap:8,alignItems:“center”,marginBottom:c.photo?8:0}}><span style={{fontSize:8,color:”#c9a227”,background:”#1a1000”,padding:“2px 6px”,borderRadius:3,fontWeight:700}}>CTP H{h}</span><span style={{color:”#aaa”,fontSize:11,flex:1}}>{c.w} & {c.par}</span>{c.dist&&<span style={{color:”#c9a227”,fontSize:9}}>{c.dist}</span>}</div>{c.photo&&<img src={c.photo} alt=”” style={{width:“100%”,borderRadius:6,maxHeight:160,objectFit:“cover”}}/>}</div>;})}
</div>
);
}
function SettingsTab({st,save,user,uTeam,setUser,isCap}){
const [confirmReset,setConfirmReset]=useState(false);
const prefs=st.prefs||{eagle:true,birdie:true,par:false};
return(
<div style={{padding:“14px 14px 80px”}}>
<div style={{background:”#0a0a0a”,border:“1px solid #1a1a1a”,borderRadius:10,padding:“12px 14px”,marginBottom:14}}>
<div style={{fontSize:11,color:”#888”,fontWeight:700,letterSpacing:2,marginBottom:10}}>SHOT NOTIFICATIONS</div>
{[{k:“eagle”,lbl:“Eagle 🦅”},{k:“birdie”,lbl:“Birdie 🐦”},{k:“par”,lbl:“Par ⛳”}].map(o=>(
<div key={o.k} style={{display:“flex”,alignItems:“center”,justifyContent:“space-between”,padding:“9px 0”,borderBottom:“1px solid #111”}}>
<span style={{fontSize:13,color:”#ddd”}}>{o.lbl}</span>
<div onClick={()=>save({…st,prefs:{…prefs,[o.k]:!prefs[o.k]}})} style={{width:42,height:24,borderRadius:12,background:prefs[o.k]?CA:”#1a1a1a”,border:“1px solid “+(prefs[o.k]?CA:”#2a2a2a”),cursor:“pointer”,position:“relative”}}>
<div style={{width:18,height:18,borderRadius:“50%”,background:”#fff”,position:“absolute”,top:2,left:prefs[o.k]?20:2,transition:“left .2s”}}/>
</div>
</div>
))}
</div>
<div style={{background:”#0a0a0a”,border:“1px solid #1a1a1a”,borderRadius:10,padding:“12px 14px”,marginBottom:isCap?14:0}}>
<div style={{fontSize:11,color:”#888”,fontWeight:700,letterSpacing:2,marginBottom:10}}>ACCOUNT</div>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”}}>
<div><div style={{fontSize:13,color:”#ddd”,fontWeight:700}}>{user}</div><div style={{fontSize:9,color:”#444”,marginTop:2}}>{uTeam?(uTeam===“A”?st.tA:st.tB):“Unassigned”}{isCap?” · Captain ⚑”:””}</div></div>
<button onClick={()=>setUser(null)} style={{background:”#1a0808”,border:“1px solid #2a1010”,borderRadius:5,color:”#888”,fontSize:11,fontWeight:700,padding:“6px 14px”,cursor:“pointer”}}>Sign Out</button>
</div>
</div>
{isCap&&(
<div style={{background:”#0a0a0a”,border:“1px solid #1a1a1a”,borderRadius:10,padding:“12px 14px”}}>
<div style={{fontSize:11,color:”#888”,fontWeight:700,letterSpacing:2,marginBottom:10}}>CAPTAIN CONTROLS</div>
<div style={{display:“flex”,gap:8,marginBottom:10}}>
<input value={st.tA} onChange={e=>save({…st,tA:e.target.value})} style={{flex:1,background:”#111”,border:“1px solid “+CA+“44”,borderRadius:6,padding:“8px”,color:CA,fontSize:12,fontWeight:700,outline:“none”,boxSizing:“border-box”}}/>
<input value={st.tB} onChange={e=>save({…st,tB:e.target.value})} style={{flex:1,background:”#111”,border:“1px solid “+CB+“44”,borderRadius:6,padding:“8px”,color:CB,fontSize:12,fontWeight:700,outline:“none”,boxSizing:“border-box”}}/>
</div>
{!confirmReset
?<button onClick={()=>setConfirmReset(true)} style={{width:“100%”,background:”#1a0808”,border:“1px solid #2a1010”,borderRadius:6,color:CA,fontSize:11,fontWeight:700,padding:“8px”,cursor:“pointer”}}>↺ Reset Teams & Matchups</button>
:<div style={{background:”#1a0808”,border:“1px solid “+CA,borderRadius:8,padding:12}}>
<div style={{fontSize:12,color:”#ddd”,marginBottom:10,textAlign:“center”}}>⚠️ Wipes all teams and scores. Sure?</div>
<div style={{display:“flex”,gap:8}}>
<button onClick={()=>{save({…st,pA:[“Keith”],pB:[“Stephen”],teamsSet:false,thu:[],fri:[]});setConfirmReset(false);}} style={{flex:1,background:CA,border:“none”,borderRadius:5,color:”#fff”,fontSize:12,fontWeight:700,padding:“8px”,cursor:“pointer”}}>Yes, Reset</button>
<button onClick={()=>setConfirmReset(false)} style={{flex:1,background:”#111”,border:“1px solid #333”,borderRadius:5,color:”#aaa”,fontSize:12,fontWeight:700,padding:“8px”,cursor:“pointer”}}>Cancel</button>
</div>
</div>
}
</div>
)}
</div>
);
}
function Login({onLogin}){
const [name,setName]=useState(””),[pin,setPin]=useState(””),[err,setErr]=useState(””),[show,setShow]=useState(false);
const go=()=>{if(!PINS[name]){setErr(“Pick your name”);return;}if(PINS[name]===pin)onLogin(name);else setErr(“Wrong PIN”);};
return(
<div style={{minHeight:“100vh”,background:”#080808”,display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”,padding:“0 24px”}}>
<div style={{fontSize:34,color:CA,fontWeight:900,letterSpacing:4,marginBottom:4}}>⛳ THE CUP</div>
<div style={{fontSize:9,color:”#333”,letterSpacing:3,marginBottom:32}}>BACHELOR PARTY · MONTAUK DOWNS</div>
<div style={{width:“100%”,maxWidth:300}}>
<select value={name} onChange={e=>setName(e.target.value)} style={{width:“100%”,background:”#111”,border:“1px solid #222”,borderRadius:8,padding:“12px”,color:name?”#ddd”:”#444”,fontSize:14,marginBottom:12,outline:“none”,boxSizing:“border-box”}}>
<option value="">Select your name…</option>
{PL.map(p=><option key={p} value={p}>{p}{CAPS.includes(p)?” ⚑”:””}</option>)}
</select>
<input type=“tel” inputMode=“numeric” maxLength={4} value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,””))} placeholder=“PIN” onKeyDown={e=>e.key===“Enter”&&go()} style={{width:“100%”,background:”#111”,border:“1px solid #222”,borderRadius:8,padding:“12px”,color:”#ddd”,fontSize:24,textAlign:“center”,letterSpacing:12,marginBottom:12,outline:“none”,boxSizing:“border-box”}}/>
{err&&<div style={{color:CA,textAlign:“center”,fontSize:12,marginBottom:8}}>{err}</div>}
<button onClick={go} style={{width:“100%”,background:CA,border:“none”,borderRadius:8,padding:“14px”,color:”#fff”,fontSize:16,fontWeight:700,cursor:“pointer”,marginBottom:14}}>SIGN IN →</button>
<div onClick={()=>setShow(!show)} style={{fontSize:9,color:”#222”,textAlign:“center”,cursor:“pointer”,marginBottom:6}}>{show?“▲”:“▼”} demo PINs</div>
{show&&<div style={{display:“grid”,gridTemplateColumns:“1fr 1fr”,gap:3}}>{PL.map(p=><div key={p} onClick={()=>{setName(p);setPin(PINS[p]);}} style={{display:“flex”,justifyContent:“space-between”,padding:“4px 7px”,background:”#111”,borderRadius:4,cursor:“pointer”}}><span style={{color:”#666”,fontSize:10}}>{p}</span><span style={{color:”#c9a227”,fontSize:10}}>{PINS[p]}</span></div>)}</div>}
</div>
</div>
);
}
export default function App(){
const [st,setSt]=useState(null),[loading,setLoading]=useState(true),[user,setUser]=useState(null),[tab,setTab]=useState(“thu”),[mi,setMi]=useState(0),[side,setSide]=useState(“front”),[toast,setToast]=useState(null),[saved,setSaved]=useState(””);
const prev=useRef(null);const KEY=“ryder-v14”;
useEffect(()=>{(async()=>{try{const r=await window.storage.get(KEY,true);setSt(r?.value?JSON.parse(r.value):S0());}catch{setSt(S0());}setLoading(false);})();},[]);
useEffect(()=>{if(!st)return;const id=setInterval(async()=>{try{const r=await window.storage.get(KEY,true);if(!r?.value)return;const fresh=JSON.parse(r.value);const pIds=new Set((prev.current?.notifs||[]).map(n=>n.id));const newN=(fresh.notifs||[]).find(n=>!pIds.has(n.id));if(newN){setToast(newN);setTimeout(()=>setToast(t=>t?.id===newN.id?null:t),6000);}setSt(fresh);prev.current=fresh;}catch{}},8000);return()=>clearInterval(id);},[st]);
const save=async ns=>{setSt(ns);prev.current=ns;try{await window.storage.set(KEY,JSON.stringify(ns),true);setSaved(“✓”);setTimeout(()=>setSaved(””),1000);}catch{setSaved(“⚠”);}};
const pushN=(ns,msg,type)=>{const n={id:Date.now()+Math.random(),msg,ts:Date.now(),t:type};setToast(n);setTimeout(()=>setToast(t=>t?.id===n.id?null:t),6000);return{…ns,notifs:[…(ns.notifs||[]).slice(-49),n]};};
if(loading||!st)return<div style={{background:”#080808”,minHeight:“100vh”,display:“flex”,alignItems:“center”,justifyContent:“center”,color:CA,fontSize:20,fontWeight:700}}>LOADING…</div>;
if(!user)return<Login onLogin={setUser}/>;
const isCap=CAPS.includes(user),uTeam=st.pA.includes(user)?“A”:st.pB.includes(user)?“B”:null,prefs=st.prefs||{eagle:true,birdie:true,par:false};
const handleScore=(pl,hole,score,team,pair,day)=>{
const hs=side===“front”?F:K,isThu=day===“thu”;
const isScr=!isThu||isThuScr(hole);
const arr=[…st[day]];const mm={…arr[mi]};const sd={…mm[side]};
const k=team===“A”?“sA”:“sB”;
if(isScr){
const up={…sd[k]};
(pair||[pl]).forEach(p=>{if(score===null){const copy={…(up[p]||{})};delete copy[hole];up[p]=copy;}else{up[p]={…(up[p]||{}),[hole]:score};}});
sd[k]=up;
}else{
if(score===null){const copy={…(sd[k][pl]||{})};delete copy[hole];sd[k]={…sd[k],[pl]:copy};}
else{sd[k]={…sd[k],[pl]:{…(sd[k]?.[pl]||{}),[hole]:score}};}
}
mm[side]=sd;arr[mi]=mm;
let ns={…st,[day]:arr};
if(score!==null){
const hd=hs.find(h=>h.h===hole),d=score-(hd?.p||4);
if(d<=-2&&prefs.eagle)ns=pushN(ns,“🦅 EAGLE! “+(pair?pair.join(” & “):pl)+” — hole “+hole+” (par “+hd?.p+”)”,“eagle”);
else if(d===-1&&prefs.birdie)ns=pushN(ns,“🐦 Birdie! “+(pair?pair.join(” & “):pl)+” — hole “+hole,“birdie”);
else if(d===0&&prefs.par)ns=pushN(ns,“⛳ Par — hole “+hole,“par”);
}
const upd=ns[day][mi][side];
const va=getScore(upd.sA,upd.pA,hole,isScr),vb=getScore(upd.sB,upd.pB,hole,isScr);
if(va&&vb){
const w=va<vb?“A”:vb<va?“B”:“tie”,pAn=(upd.pA||[]).join(” & “),pBn=(upd.pB||[]).join(” & “);
ns=pushN(ns,w===“tie”?“Hole “+hole+” halved (”+va+”) — “+pAn+” vs “+pBn:“Hole “+hole+”: “+(w===“A”?st.tA:st.tB)+” wins! “+va+” vs “+vb+” — “+pAn+” vs “+pBn,“hole”);
let a=0,b=0,ties=0;
hs.forEach(h=>{const scr2=!isThu||isThuScr(h.h);const ha=getScore(upd.sA,upd.pA,h.h,scr2),hb=getScore(upd.sB,upd.pB,h.h,scr2);if(ha&&hb){if(ha<hb)a++;else if(hb<ha)b++;else ties++;}});
const rem=hs.length-(a+b+ties),diff=a-b;
if(rem===0||Math.abs(diff)>rem)ns=pushN(ns,“🏆 MATCH OVER — “+(diff===0?“Halved”:diff>0?st.tA:st.tB)+” · “+pAn+” vs “+pBn,“match”);
}
save(ns);
};
const ScoreTab=({day})=>{
const isThu=day===“thu”,isFri=!isThu,ms=st[day]||[];
if(!ms.length)return<div style={{padding:40,textAlign:“center”,color:”#333”,fontSize:12}}>{isCap?“Go to DRAFT tab.”:“Waiting for captains to set teams.”}</div>;
const ci=Math.min(mi,ms.length-1),m=ms[ci]||{},sd=m[side]||{},hs=side===“front”?F:K;
const r=calcM(sd,hs,isFri);
const uMi=ms.findIndex(m2=>(m2.front?.pA||[]).includes(user)||(m2.front?.pB||[]).includes(user)||(m2.back?.pA||[]).includes(user)||(m2.back?.pB||[]).includes(user));
const uIn=(sd.pA||[]).includes(user)||(sd.pB||[]).includes(user);
return(
<div>
<div style={{padding:“10px 14px 0”,background:”#060606”,borderBottom:“1px solid #0a0a0a”}}>
<div style={{fontSize:8,color:”#2a2a2a”,letterSpacing:2,marginBottom:6}}>{isThu?“THURSDAY — BETTER BALL · 0.75pts”:“FRIDAY — SCRAMBLE · 1pt”}</div>
{uMi>=0&&uMi!==ci&&<div onClick={()=>{setMi(uMi);setSide(“front”);}} style={{fontSize:10,color:”#c9a227”,cursor:“pointer”,marginBottom:6,fontWeight:700}}>⚑ Jump to my match (M{uMi+1})</div>}
<div style={{display:“flex”,gap:5,marginBottom:6}}>
{ms.map((_,i)=><button key={i} onClick={()=>setMi(i)} style={{background:ci===i?(isThu?”#6b1620”:”#251535”):”#0d0d0d”,border:ci===i?“none”:“1px solid “+(i===uMi?”#4a3200”:”#111”),borderRadius:5,color:”#fff”,fontSize:11,fontWeight:700,padding:“4px 12px”,cursor:“pointer”}}>M{i+1}{i===uMi?“★”:””}</button>)}
</div>
<div style={{display:“flex”,gap:5,marginBottom:10}}>
<button onClick={()=>setSide(“front”)} style={{background:side===“front”?”#0f2a1a”:”#0d0d0d”,border:side===“front”?“none”:“1px solid #111”,borderRadius:5,color:”#fff”,fontSize:11,fontWeight:700,padding:“4px 12px”,cursor:“pointer”}}>FRONT 9</button>
<button onClick={()=>setSide(“back”)} style={{background:side===“back”?”#0f2a1a”:”#0d0d0d”,border:side===“back”?“none”:“1px solid #111”,borderRadius:5,color:”#fff”,fontSize:11,fontWeight:700,padding:“4px 12px”,cursor:“pointer”}}>BACK 9</button>
</div>
</div>
<div style={{padding:“10px 14px 80px”}}>
{isCap&&<PairEdit ms={ms} mi={ci} side={side} day={day} st={st} save={save} isThu={isThu}/>}
<Tracker holes={hs} sA={sd.sA||{}} pA={sd.pA||[]} sB={sd.sB||{}} pB={sd.pB||[]} tA={st.tA} tB={st.tB} isFri={isFri}/>
{!uIn&&!isCap&&<div style={{fontSize:9,color:”#333”,textAlign:“center”,marginBottom:8}}>View only</div>}
{isThu
?<ThuCard holes={hs} pA={sd.pA||[]} pB={sd.pB||[]} sA={sd.sA||{}} sB={sd.sB||{}} me={user} onScore={(p,h,s,t,pair)=>handleScore(p,h,s,t,pair,day)}/>
:<FriCard holes={hs} pA={sd.pA||[]} pB={sd.pB||[]} sA={sd.sA||{}} sB={sd.sB||{}} me={user} onScore={(pair,h,s,t)=>handleScore(pair[0],h,s,t,pair,day)}/>
}
{isThu&&side===“front”&&<div style={{background:”#100d00”,border:“1px solid #2a2000”,borderRadius:8,padding:“9px 12px”,marginTop:6}}><div style={{fontSize:10,color:”#c9a227”,fontWeight:700}}>⛳ HOLE 10 — MINI SCRAMBLE</div><div style={{fontSize:8,color:”#333”,marginTop:3}}>Play best shot each time with your partner. Captains tap 🔁 to set Back 9 pairings.</div></div>}
{isFri&&side===“back”&&<CTPSec st={st} save={save} pushN={pushN}/>}
</div>
</div>
);
};
const TABS=[{id:“draft”,lbl:“DRAFT”,cap:true},{id:“thu”,lbl:“THU”},{id:“fri”,lbl:“FRI”},{id:“notifs”,lbl:“🔔”},{id:“board”,lbl:“🏆”},{id:“settings”,lbl:“⚙”}];
const vis=TABS.filter(t=>!t.cap||isCap);
const recent=(st.notifs||[]).filter(n=>n.ts>Date.now()-7200000).length;
return(
<div style={{background:”#080808”,minHeight:“100vh”,fontFamily:“sans-serif”,color:”#ddd”,maxWidth:480,margin:“0 auto”}}>
<Toast n={toast} dismiss={()=>setToast(null)}/>
<div style={{background:”#060606”,borderBottom:“1px solid #111”,padding:“10px 14px 0”,position:“sticky”,top:0,zIndex:100}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,marginBottom:8}}>
<div><div style={{fontSize:20,color:CA,fontWeight:900,letterSpacing:4,lineHeight:1}}>⛳ THE CUP</div><div style={{fontSize:7,color:”#222”,letterSpacing:2}}>MONTAUK DOWNS</div></div>
<div style={{display:“flex”,alignItems:“center”,gap:6}}>
{saved&&<span style={{fontSize:9,color:”#1a5e34”,fontWeight:700}}>{saved}</span>}
{isCap&&<span style={{fontSize:8,color:”#c9a227”,background:”#1a1000”,border:“1px solid #3a2000”,borderRadius:4,padding:“2px 6px”,fontWeight:700}}>⚑ CAP</span>}
<div style={{background:uTeam?(uTeam===“A”?CA:CB)+“18”:”#111”,border:“1px solid “+(uTeam?(uTeam===“A”?CA:CB)+“44”:”#222”),borderRadius:20,padding:“3px 10px”,display:“flex”,alignItems:“center”,gap:6}}>
<span style={{fontSize:11,color:uTeam?(uTeam===“A”?CA:CB):”#888”,fontWeight:700}}>{user.split(” “)[0]}</span>
<span onClick={()=>setUser(null)} style={{fontSize:10,color:”#333”,cursor:“pointer”}}>✕</span>
</div>
</div>
</div>
<div style={{display:“flex”,gap:4,paddingBottom:10,overflowX:“auto”}}>
{vis.map(t=><button key={t.id} onClick={()=>{setTab(t.id);setMi(0);setSide(“front”);}} style={{background:tab===t.id?CA:”#0d0d0d”,border:tab===t.id?“none”:“1px solid #111”,borderRadius:5,color:”#fff”,fontSize:10,fontWeight:700,padding:“5px 12px”,cursor:“pointer”,flexShrink:0,position:“relative”}}>{t.lbl}{t.id===“notifs”&&recent>0?<span style={{position:“absolute”,top:-4,right:-4,background:”#c9a227”,borderRadius:“50%”,width:14,height:14,fontSize:8,display:“flex”,alignItems:“center”,justifyContent:“center”,color:”#000”,fontWeight:700}}>{recent>9?“9+”:recent}</span>:null}</button>)}
</div>
{uTeam&&<div style={{borderTop:“1px solid #111”,padding:“3px 0 8px”,fontSize:8,color:uTeam===“A”?CA:CB,fontWeight:700,letterSpacing:1}}>{uTeam===“A”?st.tA:st.tB}{isCap?” · 🔁 change pairings at turn”:”· tap ★ to score”}</div>}
</div>
{tab===“draft”&&isCap&&<DraftScreen st={st} save={save}/>}
{tab===“thu”&&<ScoreTab day="thu"/>}
{tab===“fri”&&<ScoreTab day="fri"/>}
{tab===“notifs”&&<div style={{padding:“12px 14px 80px”}}>{!(st.notifs?.length)?<div style={{textAlign:“center”,color:”#222”,padding:32,fontWeight:700,letterSpacing:2}}>NO NOTIFICATIONS YET</div>:[…st.notifs].reverse().map(n=><div key={n.id} style={{display:“flex”,gap:10,background:”#080808”,border:“1px solid #111”,borderRadius:8,padding:“10px 12px”,marginBottom:6}}><span style={{fontSize:18}}>{n.t===“match”?“🏆”:n.t===“eagle”?“🦅”:n.t===“birdie”?“🐦”:n.t===“ctp”?“📍”:“⛳”}</span><div style={{flex:1}}><div style={{fontSize:11,color:”#ddd”}}>{n.msg}</div><div style={{fontSize:8,color:”#2a2a2a”,marginTop:2}}>{new Date(n.ts).toLocaleTimeString([],{hour:“2-digit”,minute:“2-digit”})}</div></div></div>)}</div>}
{tab===“board”&&<BoardTab st={st}/>}
{tab===“settings”&&<SettingsTab st={st} save={save} user={user} uTeam={uTeam} setUser={setUser} isCap={isCap}/>}
</div>
);
}
