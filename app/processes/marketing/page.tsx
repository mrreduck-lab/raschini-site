"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Doc = { label: string; url: string; status?: string };
type Step = {
  id: string; title: string; role: string; action: string; output: string;
  docs?: Doc[]; type?: "event" | "gateway" | "parallel" | "end";
  branches?: string[];
};
type Stage = { id: string; title: string; role: string; summary: string; steps: Step[] };

const folder = "https://drive.google.com/drive/folders/1pkN1pejSe1Y6_MHMoIwllIeQOOrAnpPx";
const rules = "https://docs.google.com/document/d/11V3uDw2dIn9WMyK6XPbro64yM37vpvMChWjZWOwwJOo/edit";
const instruction = "https://docs.google.com/document/d/15mtKqY3jfdHK7uEY3tgScw730WT0Qhc94XvhH923TFY/edit";
const budget = "https://docs.google.com/spreadsheets/d/1V1GiCOuRp3qecUxt6T8xG3p9ExIveFrThuvDsTX6XmE/edit";
const plan = "https://docs.google.com/spreadsheets/d/1w0ku7FxFU8AlI45-6U-kqO0RDQFx7qAqmG8UsjjsZQU/edit";
const august = "https://docs.google.com/spreadsheets/d/1cgDWYhKFcLufiE-1BRyn_LSj9K_B1V8Zi45CeIkUOuU/edit";
const doc = (label: string, url: string, status?: string): Doc => ({ label, url, status });

const stages: Stage[] = [
  { id:"strategy", title:"Стратегия", role:"Директор по маркетингу / CEO", summary:"Определить цели, аудитории, позиционирование, каналы и критерии результата.", steps:[
    {id:"context",title:"Собрать бизнес-контекст",role:"Директор по маркетингу",action:"Получить цели продаж, ассортимент и результаты прошлого периода; выделить ограничения и возможности.",output:"Входные данные и гипотезы для стратегии."},
    {id:"draft",title:"Разработать стратегию",role:"Директор по маркетингу",action:"Описать аудитории, продуктовые приоритеты, позиционирование, каналы, KPI и правила оценки.",output:"Проект стратегии. Ссылка появится после создания документа.",docs:[doc("Папка процессов",folder,"Стратегия пока не создана")]},
    {id:"approve",title:"Утвердить стратегию?",role:"CEO",action:"Проверить связь с бизнес-целями и распределение ресурсов.",output:"Утверждённая версия или список правок.",type:"gateway",branches:["Да → бюджет и календарь","Нет → доработать стратегию"]}
  ]},
  { id:"annual", title:"Бюджет и календарь", role:"Маркетинг / финансы / CEO", summary:"Перевести стратегию в лимиты, проекты, сроки и KPI.", steps:[
    {id:"limits",title:"Собрать бюджет",role:"Директор по маркетингу + финансы",action:"Разнести плановые суммы и оплаты по статьям и месяцам; согласовать лимиты.",output:"Проект бюджета.",docs:[doc("Открыть бюджет",budget)]},
    {id:"calendar",title:"Составить календарь",role:"Директор по маркетингу",action:"Для каждой активности указать ID проекта, дату, цель, KPI, ответственного и плановый бюджет.",output:"Сводный календарь проектов.",docs:[doc("Пример маркетингового плана",plan,"Пример, не действующий календарь"),doc("Инструкция к плану",instruction)]},
    {id:"planApproval",title:"План утверждён?",role:"CEO",action:"Согласовать календарь и бюджет как базовую версию.",output:"Утверждённый план или правки.",type:"gateway",branches:["Да → планировать месяц","Нет → вернуть на корректировку"]}
  ]},
  { id:"month",title:"Планирование месяца",role:"Директор по маркетингу / команда",summary:"Уточнить проекты и разбить их на исполнимые задачи.",steps:[
    {id:"prioritize",title:"Уточнить проекты месяца",role:"Директор по маркетингу",action:"Выбрать проекты из календаря, проверить сроки, сумму, KPI и единый ID.",output:"Согласованный набор проектов месяца.",docs:[doc("Пример плана",plan,"Шаблон для действующего календаря")]},
    {id:"tasks",title:"Назначить задачи",role:"Владелец проекта",action:"Записать действие, исполнителя, срок и результат в единый реестр; использовать фильтр по месяцу.",output:"Задачи со сроками и ответственными.",docs:[doc("Пример структуры задач",plan,"Шаблон"),doc("Инструкция",instruction)]},
    {id:"ready",title:"Ресурсы готовы?",role:"Директор по маркетингу",action:"Проверить материалы, подрядчиков, согласования и доступный лимит.",output:"Допуск к запуску или список блокеров.",type:"gateway",branches:["Да → реализация","Нет → скорректировать задачи"]}
  ]},
  { id:"execute",title:"Реализация",role:"Маркетинговая команда",summary:"Выполнить публикации, кампании, CRM-коммуникации и мероприятия.",steps:[
    {id:"brief",title:"Подготовить проект",role:"Владелец проекта",action:"Утвердить бриф, материалы, площадку и измеримые метки проекта.",output:"Готовый к запуску проект и ID."},
    {id:"launch",title:"Запустить активность",role:"Исполнитель",action:"Опубликовать или провести мероприятие; сохранить фактические даты и ссылки.",output:"Публикация, кампания или мероприятие."},
    {id:"check",title:"Проверить исполнение",role:"Владелец проекта",action:"Сверить факт с планом и зафиксировать отклонения.",output:"Статус проекта и перечень корректировок."}
  ]},
  { id:"fact",title:"Сбор факта",role:"Финансы / маркетинг / аналитика",summary:"Два параллельных потока данных соединяются по ID проекта.",steps:[
    {id:"split",title:"Параллельно собрать факт",role:"Маркетинг + финансы",action:"После запуска открыть финансовую и результативную ветки.",output:"Два потока первичных данных.",type:"parallel",branches:["Расходы и оплаты","Активности и продажи"]},
    {id:"expense",title:"Внести расход и оплату",role:"Финансы + маркетинг",action:"Для каждой операции записать ID проекта, сумму, статью, дату расхода и дату оплаты отдельно.",output:"Реестр расходов по дате расхода и оплат по дате оплаты.",docs:[doc("Августовский отчёт: лист расходов",august,"Действующий файл требует сверки"),doc("Бюджет",budget)]},
    {id:"result",title:"Внести результат активности",role:"Маркетинг + аналитика",action:"По ID проекта записать дату публикации, охват, обращения, визиты, покупки и подтверждённую выручку.",output:"Реестр активностей, связанный с расходами по ID.",docs:[doc("Августовский отчёт: активности",august,"Действующий файл требует сверки")]},
    {id:"join",title:"Данные сведены?",role:"Директор по маркетингу",action:"Проверить ID, периоды, подтверждение продаж и полноту двух потоков.",output:"Проверенная основа для аналитики.",type:"gateway",branches:["Да → анализ","Нет → вернуть на дозаполнение"]}
  ]},
  { id:"analysis",title:"Два вида анализа",role:"Директор по маркетингу",summary:"Месяц и отдельный проект используют разные правила отнесения расходов.",steps:[
    {id:"analysisSplit",title:"Рассчитать два среза",role:"Директор по маркетингу",action:"Параллельно подготовить месячный итог и анализ проектов.",output:"Две несмешиваемые аналитические выборки.",type:"parallel",branches:["Месяц → по оплатам","Проект → все затраты"]},
    {id:"monthly",title:"Месячный ДРР / ROMI",role:"Директор по маркетингу",action:"Для свода взять оплаты с датой в отчётном месяце и соответствующую маркетинговую выручку; указать определение ROMI.",output:"Месячные показатели, план-факт и дата среза.",docs:[doc("Отчёт за август",august,"Методология и формулы требуют сверки"),doc("Бюджет",budget)]},
    {id:"project",title:"Анализ проекта",role:"Владелец проекта",action:"Сложить все расходы по ID мероприятия или публикации независимо от месяца расхода и оплаты; сопоставить с результатами.",output:"Полная стоимость проекта и вывод о результате.",docs:[doc("Отчёт за август",august,"Проектную карточку предстоит оформить")]},
    {id:"consolidate",title:"Сверить оба среза",role:"Директор по маркетингу",action:"Сопоставить план-факт, исключить дубли и пояснить расхождения во времени.",output:"Основание для финального листа."}
  ]},
  { id:"report",title:"Отчёт и решение",role:"Директор по маркетингу / CEO",summary:"Закрыть месяц, принять решения и обновить план следующего цикла.",steps:[
    {id:"dashboard",title:"Собрать финальный лист",role:"Директор по маркетингу",action:"Вывести план, факт, динамику, ДРР/ROMI, выводы и ссылки на источники. Указать период и дату актуальности.",output:"Финальный лист «Показатели».",docs:[doc("Отчёт за август",august,"Исходная версия требует исправлений")]},
    {id:"review",title:"Разобрать результаты",role:"CEO + директор по маркетингу",action:"Выбрать проекты для продолжения, изменения или остановки; записать владельца решения и срок.",output:"Протокол решений."},
    {id:"change",title:"Менять стратегию?",role:"CEO",action:"Определить, достаточно ли обновить тактический план или нужен пересмотр стратегии.",output:"Направление следующего цикла.",type:"gateway",branches:["Нет → обновить бюджет и календарь месяца","Да → квартальный пересмотр стратегии"]},
    {id:"next",title:"Следующий цикл",role:"Директор по маркетингу",action:"Перенести утверждённые изменения в общий календарь и задачи.",output:"План следующего месяца.",type:"end",docs:[doc("Папка документов",folder)]}
  ]}
];

const overview: Step[] = [
  {id:"start",title:"Начало цикла",role:"CEO",action:"Установить цели и ограничения.",output:"Вход для стратегии.",type:"event"},
  ...stages.map(s=>({id:s.id,title:s.title,role:s.role,action:s.summary,output:"Открыть подпроцесс и выполнить шаги."})),
  {id:"loop",title:"Следующий месяц",role:"Маркетинг",action:"С учётом решений повторить месячный цикл.",output:"Обновлённый план.",type:"end"}
];

function Shape({item,active,click,expand}:{item:Step;active:boolean;click:()=>void;expand?:boolean}) {
  const cls = [styles.shape, item.type==="gateway"?styles.gateway:"",item.type==="parallel"?styles.parallel:"",item.type==="event"||item.type==="end"?styles.event:"",active?styles.selected:""].filter(Boolean).join(" ");
  return <button type="button" onClick={click} className={cls} aria-pressed={active}>
    {item.type==="gateway"?<span className={styles.symbol}>×</span>:item.type==="parallel"?<span className={styles.symbol}>＋</span>:null}
    <strong>{item.title}</strong>
    <small>{item.role}</small>
    {expand&&<span className={styles.expand}>＋ раскрыть</span>}
  </button>;
}

export default function MarketingProcessesPage() {
  const [stageId,setStageId]=useState<string|null>(null);
  const [selectedId,setSelectedId]=useState("start");
  const stage=stages.find(s=>s.id===stageId);
  const steps=stage?.steps??overview;
  const selected=steps.find(s=>s.id===selectedId)??steps[0];
  const enter=(id:string)=>{setStageId(id);setSelectedId(stages.find(s=>s.id===id)?.steps[0].id??"start")};
  const leave=()=>{setStageId(null);setSelectedId(stageId??"start")};
  return <main className={styles.page}>
    <header className={styles.header}>
      <p className={styles.kicker}>RASCHINI / ПРОЦЕССЫ</p>
      <h1>Управление маркетингом</h1>
      <p>Идите по схеме: откройте подпроцесс, выберите действие и перейдите к его документу.</p>
      <nav className={styles.links}><a href={folder} target="_blank" rel="noreferrer">Папка документов ↗</a><a href={rules} target="_blank" rel="noreferrer">Регламент ↗</a><a href="/processes/marketing-management.bpmn" download>Исходная BPMN 2.0 ↧</a></nav>
    </header>
    <div className={styles.breadcrumb}><button onClick={leave} disabled={!stage}>Общий процесс</button>{stage&&<><span>›</span><strong>{stage.title}</strong></>}</div>
    <div className={styles.layout}>
      <section className={styles.canvas} aria-label={stage?stage.title:"Общий процесс"}>
        <div className={styles.canvasHead}><div><span>{stage?"РАСКРЫТЫЙ ПОДПРОЦЕСС":"ОБЩАЯ BPMN-КАРТА"}</span><h2>{stage?.title??"От стратегии до следующего месяца"}</h2><p>{stage?.summary??"Нажмите на блок с «＋ раскрыть», чтобы перейти к конкретным действиям."}</p></div><span className={styles.count}>{steps.length} элементов</span></div>
        <div className={styles.diagram}>
          {steps.map((step,index)=><div key={step.id} className={styles.nodeRow}>
            <div className={styles.lane}>{step.role}</div>
            <div className={styles.nodeColumn}>
              <Shape item={step} active={selected.id===step.id} expand={!stage&&stages.some(s=>s.id===step.id)} click={()=>{setSelectedId(step.id)}}/>
              {step.branches&&<div className={styles.branches}>{step.branches.map(b=><span key={b}>{b}</span>)}</div>}
              {index<steps.length-1&&<div className={styles.connector} aria-hidden="true">↓</div>}
            </div>
          </div>)}
          {!stage&&<div className={styles.returnFlow}>↺ Решения возвращаются к планированию месяца; пересмотр стратегии — к стратегии.</div>}
        </div>
        <div className={styles.legend}><span>◯ событие</span><span>▢ действие / подпроцесс ＋</span><span>◇ шлюз × — выбор</span><span>◇ шлюз ＋ — параллельные ветки</span></div>
      </section>
      <aside className={styles.panel} aria-live="polite">
        <span className={styles.panelKicker}>ВЫБРАННЫЙ ЭЛЕМЕНТ</span><h2>{selected.title}</h2>
        <dl><dt>Ответственный</dt><dd>{selected.role}</dd><dt>Что сделать</dt><dd>{selected.action}</dd><dt>Результат шага</dt><dd>{selected.output}</dd></dl>
        {selected.branches&&<div className={styles.decision}>{selected.branches.map(b=><p key={b}>{b}</p>)}</div>}
        {selected.docs?.length?<div className={styles.docList}><h3>Документы для шага</h3>{selected.docs.map(d=><div key={d.label}><a href={d.url} target="_blank" rel="noreferrer">{d.label} ↗</a>{d.status&&<small>{d.status}</small>}</div>)}</div>:<p className={styles.noDoc}>Отдельного документа для этого шага пока нет.</p>}
        {!stage&&stages.some(s=>s.id===selected.id)&&<button className={styles.enter} onClick={()=>enter(selected.id)}>Раскрыть подпроцесс →</button>}
        {stage&&<div className={styles.stepNav}><button disabled={steps.indexOf(selected)===0} onClick={()=>setSelectedId(steps[steps.indexOf(selected)-1].id)}>← Назад</button><button disabled={steps.indexOf(selected)===steps.length-1} onClick={()=>setSelectedId(steps[steps.indexOf(selected)+1].id)}>Следующее действие →</button></div>}
      </aside>
    </div>
    <footer className={styles.footer}>Расходы: по дате расхода. Месячный ДРР/ROMI: по дате оплаты. Проект: по всем расходам его ID независимо от периода. Карта открывает документы; статус выполнения и согласования фиксируется в них.</footer>
  </main>;
}
