"use client";
import { useEffect, useState } from "react";
import model from "./model.json";
import styles from "./page.module.css";
const graphs=model.graphs;
const links=[{label:"Исходный регламент CRM v13",url:model.source},{label:"Отчёт RetailCRM",url:"https://docs.google.com/spreadsheets/d/1VqepNMGDuTEtrudX94nnrXuTLC9CdSmhw8Y_fZimm1Q/edit"},{label:"Документы CRM",url:"https://drive.google.com/drive/folders/1nYPoOF5JKkRBpVzGASUE8e6fWw1LCC8e"}];
function lines(value:string,max=24){const words=value.split(' ');const result:string[]=[];let line='';for(const w of words){if((line+' '+w).length>max&&line){result.push(line);line=w;}else line+=(line?' ':'')+w;}if(line)result.push(line);return result;}
export default function CRMProcess(){
 const [graphId,setGraphId]=useState('main'); const [selectedId,setSelectedId]=useState('start');
 const [done,setDone]=useState<Record<string,boolean>>({});const [ready,setReady]=useState(false);const [zoom,setZoom]=useState(1);
 const graph=graphs.find(g=>g.id===graphId)!;const selected=graph.nodes.find(n=>n.id===selectedId)??graph.nodes[0];
 useEffect(()=>{try{const value=JSON.parse(localStorage.getItem('raschini-crm-v13-guide')??'{}');if(value&&typeof value==='object'&&!Array.isArray(value))setDone(value);}catch{}setReady(true);},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem('raschini-crm-v13-guide',JSON.stringify(done));}catch{}},[done,ready]);
 const open=(id:string)=>{const g=graphs.find(g=>g.id===id)!;setGraphId(id);setSelectedId(g.nodes[0].id);};
 useEffect(()=>{document.getElementById('crm-node-'+selectedId)?.scrollIntoView({block:'nearest',inline:'nearest'});},[selectedId,graphId]);
 const edges=graph.edges.filter(e=>e.source===selected.id);
 const height=Math.max(...graph.nodes.map(n=>n.y))+160;
 return <main className={styles.page}>
 <header><p className={styles.kicker}>RASCHINI / ПРОЦЕССЫ / CRM</p><h1>От контакта до повторной покупки</h1><p>Раскройте подпроцесс, выполните действия и выберите следующую ветку по результату.</p>
 <nav><a href="/processes/marketing">Маркетинг</a>{links.map(l=><a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>)}<a href="/processes/crm-acquisition.bpmn" download>BPMN 2.0 ↓</a></nav></header>
 <div className={styles.toolbar}><button onClick={()=>open('main')} aria-pressed={graphId==='main'}>Общая карта</button><button onClick={()=>open('control')} aria-pressed={graphId==='control'}>Контроль управляющего</button><span>{model.version}</span></div>
 <section className={styles.layout}>
 <div className={styles.canvas}><div className={styles.canvasHead}><div><span className={styles.kicker}>BPMN · {graphId==='main'?'ОБЩИЙ ПРОЦЕСС':'ПОДПРОЦЕСС'}</span><h2>{graph.title}</h2></div><div><button aria-label="Уменьшить" onClick={()=>setZoom(z=>Math.max(.5,z-.1))}>−</button><button onClick={()=>setZoom(1)}>{Math.round(zoom*100)}%</button><button aria-label="Увеличить" onClick={()=>setZoom(z=>Math.min(1.5,z+.1))}>+</button></div></div>
 <div className={styles.scroll}><svg role="group" aria-label={graph.title} viewBox={`0 0 970 ${height}`} style={{width:970*zoom,height:height*zoom}}>
 <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#8c746a"/></marker></defs>
 {graph.edges.map((e,i)=>{const a=graph.nodes.find(n=>n.id===e.source)!;const b=graph.nodes.find(n=>n.id===e.target)!;const reverse=b.y<=a.y;const ax=a.x+110,ay=a.y+100,bx=b.x+110,by=b.y;const mid=(ay+by)/2;const side=12+(i%4)*6;const d=reverse?`M${a.x} ${a.y+50} H${side} V${b.y+50} H${b.x}`:`M${ax} ${ay} V${mid} H${bx} V${by}`;return <g key={e.id}><path d={d} fill="none" stroke="#8c746a" strokeWidth="1.8" markerEnd="url(#arrow)"/>{e.label&&<text className={styles.edgeLabel} x={reverse?side+8:(ax+bx)/2+7} y={reverse?(a.y+b.y)/2:mid-6}>{e.label}</text>}</g>;})}
 {graph.nodes.map(n=>{const event=['start','end','timer'].includes(n.type);const active=selected.id===n.id;const cls=active?'#f8e8ec':'#fff';return <g id={"crm-node-"+n.id} key={n.id} role="button" tabIndex={0} aria-label={`${n.title}; ${n.role}${n.sub?'; раскрыть подпроцесс':''}`} aria-pressed={active} onClick={()=>setSelectedId(n.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelectedId(n.id);}}} className={styles.node}>
 {n.type==='gateway'?<polygon points={`${n.x+110},${n.y} ${n.x+220},${n.y+50} ${n.x+110},${n.y+100} ${n.x},${n.y+50}`} fill={active?'#f8e8ec':'#fcf5e6'} stroke={active?'#822a43':'#b08c4e'} strokeWidth="2"/>:event?<><circle cx={n.x+110} cy={n.y+50} r="48" fill={cls} stroke={active?'#822a43':'#8c746a'} strokeWidth={n.type==='end'?4:2}/>{n.type==='timer'&&<circle cx={n.x+110} cy={n.y+50} r="44" fill="none" stroke="#8c746a"/>}</>:<rect x={n.x} y={n.y} width="220" height="100" rx="12" fill={cls} stroke={active?'#822a43':'#8c746a'} strokeWidth="2"/>}
 {lines(n.title,event?12:24).map((l,i,arr)=><text key={i} x={n.x+110} y={n.y+43-(arr.length-1)*8+i*16} textAnchor="middle" className={styles.nodeText}>{l}</text>)}
 {n.type==='gateway'&&<text x={n.x+110} y={n.y+82} textAnchor="middle">×</text>}{n.sub&&<><rect x={n.x+102} y={n.y+79} width="16" height="16" fill="white" stroke="#8c746a"/><text x={n.x+110} y={n.y+91} textAnchor="middle">+</text></>}
 <text x={n.x+110} y={n.y-9} textAnchor="middle" className={styles.role}>{n.role}</text></g>;})}
 </svg></div><p className={styles.legend}>○ событие · ◎ таймер · ◇ выбор · ▢ действие · ⊞ раскрываемый подпроцесс. Нажмите на блок для инструкции.</p></div>
 <aside className={styles.panel} aria-live="polite"><span className={styles.kicker}>ТЕКУЩИЙ ШАГ</span><h2>{selected.title}</h2><p className={styles.roleBadge}>{selected.role}</p>{selected.status&&<p className={styles.status}>{selected.status}</p>}
 {selected.checks.length>0&&<div className={styles.checks}><h3>Что сделать</h3>{selected.checks.map((c,i)=>{const key=selected.id+'_'+i;return <label key={key}><input type="checkbox" checked={done[key]===true} onChange={e=>setDone(d=>({...d,[key]:e.target.checked}))}/><span>{c}</span></label>;})}</div>}
 {selected.note&&<div className={styles.note}><strong>Требует внимания</strong><p>{selected.note}</p></div>}
 {selected.sub&&<button className={styles.primary} onClick={()=>open(selected.sub)}>Раскрыть подпроцесс →</button>}
 <h3>Следующий шаг</h3>{edges.length?edges.map(e=><button className={styles.next} key={e.id} onClick={()=>setSelectedId(e.target)}>{e.label?e.label+' → ':''}{graph.nodes.find(n=>n.id===e.target)?.title}</button>):<button className={styles.next} onClick={()=>{const parent=graphs[0].nodes.find(n=>n.sub===graphId);open('main');if(parent)setSelectedId(parent.id);}}>Вернуться к общей карте</button>}
 <h3>Документы</h3>{links.map(l=><a className={styles.doc} key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>)}
 <p className={styles.local}>Чек-лист сохраняется только в этом браузере. Он помогает пройти инструкцию и не изменяет задачи, клиентов или выплаты в CRM.</p><button className={styles.reset} onClick={()=>{if(window.confirm('Очистить локальные отметки выполнения?'))setDone({});}}>Сбросить отметки</button>
 </aside></section>
 <footer><strong>Контрольные сроки:</strong> напоминание за 2 часа до встречи · звонок управляющего через 5 дней после резкого отказа · обратная связь через 14 дней · окно CRM-привлечения 12 часов–14 дней до покупки.<br/>Карта отражает регламент v13; спорные правила отмечены в шагах. Она не подтверждает, что описанная в регламенте автоматика уже реализована.</footer>
 </main>;
}
