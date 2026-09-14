"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type DocLink = { label: string; url: string };
type Item = {
  id: string;
  title: string;
  subtitle: string;
  owner: string;
  purpose: string;
  rules: string[];
  docs?: DocLink[];
};

const driveFolder = "https://drive.google.com/drive/folders/1pkN1pejSe1Y6_MHMoIwllIeQOOrAnpPx";
const processRules = "https://docs.google.com/document/d/11V3uDw2dIn9WMyK6XPbro64yM37vpvMChWjZWOwwJOo/edit";
const instruction = "https://docs.google.com/document/d/15mtKqY3jfdHK7uEY3tgScw730WT0Qhc94XvhH923TFY/edit";
const budget = "https://docs.google.com/spreadsheets/d/1V1GiCOuRp3qecUxt6T8xG3p9ExIveFrThuvDsTX6XmE/edit";
const plan = "https://docs.google.com/spreadsheets/d/1w0ku7FxFU8AlI45-6U-kqO0RDQFx7qAqmG8UsjjsZQU/edit";
const august = "https://docs.google.com/spreadsheets/d/1cgDWYhKFcLufiE-1BRyn_LSj9K_B1V8Zi45CeIkUOuU/edit";

const hierarchy: { level: string; items: Item[] }[] = [
  { level: "1. Бизнес-контекст", items: [
    { id: "business", title: "Бизнес-цели и план продаж", subtitle: "Выручка, маржа, клиенты, бутики", owner: "CEO / коммерческий блок", purpose: "Определяет коммерческие цели, которые должен поддержать маркетинг.", rules: ["Вход для стратегии", "Используется в финальном отчёте"] },
    { id: "assortment", title: "План ассортимента и поставок", subtitle: "Коллекции и коммерческие поводы", owner: "Коммерческий блок / продукт", purpose: "Определяет товары и сроки, которые поддерживает маркетинг.", rules: ["Вход для календаря", "Основа контентных поводов"] }
  ]},
  { level: "2. Стратегия", items: [
    { id: "strategy", title: "Маркетинговая стратегия", subtitle: "Аудитории, позиционирование, каналы, KPI", owner: "Директор по маркетингу; утверждает CEO", purpose: "Задаёт выбор аудиторий, каналов, целей и критериев эффективности.", rules: ["Пересмотр ежеквартально", "Определяет бюджет и календарь"] }
  ]},
  { level: "3. Планирование", items: [
    { id: "budget", title: "Маркетинговый бюджет", subtitle: "Лимиты и план оплат по месяцам", owner: "Маркетинг + финансы; утверждает CEO", purpose: "Хранит утверждённые лимиты и план оплат.", rules: ["План-факт по месяцу оплаты", "Сверка с календарём"], docs: [{label:"Открыть бюджет",url:budget}] },
    { id: "calendar", title: "Маркетинговый календарь", subtitle: "Проекты, KPI, сроки и единый ID", owner: "Директор по маркетингу", purpose: "Единый реестр утверждённых проектов и активностей.", rules: ["Каждому проекту присваивается ID", "Месячный файл задач не создаётся"], docs: [{label:"Открыть план",url:plan},{label:"Открыть инструкцию",url:instruction}] }
  ]},
  { level: "4. Исполнение", items: [
    { id: "tasks", title: "Единый реестр задач", subtitle: "Исполнитель, дедлайн, статус", owner: "Маркетинговая команда", purpose: "Декомпозирует проекты на конкретные действия.", rules: ["Одна задача — одна строка", "Месяц отображается фильтром"], docs: [{label:"Открыть план",url:plan},{label:"Открыть инструкцию",url:instruction}] },
    { id: "projects", title: "Планы крупных проектов", subtitle: "Съёмки, показы и мероприятия", owner: "Владелец проекта", purpose: "Детализирует сложные проекты без дублирования календаря.", rules: ["Связь по ID проекта", "В календаре одна агрегированная строка"] }
  ]},
  { level: "5. Фактические данные", items: [
    { id: "activity", title: "Проекты и активности", subtitle: "Охват, трафик, лиды, покупки", owner: "Маркетинг / SMM / PR / CRM", purpose: "Хранит фактические результаты каждого мероприятия.", rules: ["Отдельно от финансового реестра", "Связь с расходами по ID"], docs: [{label:"Открыть отчёт",url:august}] },
    { id: "expense", title: "Маркетинговые расходы", subtitle: "Дата расхода, дата оплаты, сумма, ID", owner: "Финансы / маркетинг", purpose: "Хранит первичный финансовый факт по каждой операции.", rules: ["Учёт расходов — по дате расхода", "ДРР/ROMI месяца — по дате оплаты", "Проект — полная сумма независимо от периода"], docs: [{label:"Открыть отчёт",url:august},{label:"Открыть бюджет",url:budget}] },
    { id: "systems", title: "1С, RetailCRM и digital", subtitle: "Подтверждённые источники факта", owner: "Владельцы систем", purpose: "Поставляет выручку, клиентов, обращения, визиты и digital-метрики.", rules: ["1С — выручка и оплаты", "RetailCRM — клиенты и коммуникации"] }
  ]},
  { level: "6. Аналитика и отчёт", items: [
    { id: "projectAnalysis", title: "Анализ проекта", subtitle: "Полная стоимость независимо от периода", owner: "Директор по маркетингу", purpose: "Сопоставляет результаты со всеми расходами проекта.", rules: ["Группировка по ID", "Решение: повторить, изменить или остановить"], docs: [{label:"Открыть отчёт",url:august}] },
    { id: "monthly", title: "Месячный отчёт", subtitle: "ДРР/ROMI по датам оплаты", owner: "Директор по маркетингу", purpose: "Показывает финансовую эффективность закрытого месяца.", rules: ["Расходы по дате оплаты", "План-факт бюджета"], docs: [{label:"Открыть отчёт",url:august}] },
    { id: "dashboard", title: "Финальный лист «Показатели»", subtitle: "Главный экран CEO", owner: "Директор по маркетингу", purpose: "Сводит план, факт, динамику, ДРР/ROMI и выводы.", rules: ["Не хранит первичный факт", "Каждый KPI прослеживается до источника"], docs: [{label:"Открыть отчёт",url:august}] }
  ]},
  { level: "7. Решения", items: [
    { id: "decision", title: "Протокол управленческих решений", subtitle: "Продолжить, изменить, остановить", owner: "CEO + директор по маркетингу", purpose: "Фиксирует решение, ответственного, срок и ожидаемый эффект.", rules: ["Обновляет календарь и задачи", "Корректирует прогноз бюджета"] },
    { id: "revision", title: "Квартальный пересмотр стратегии", subtitle: "Проверка ключевых гипотез", owner: "CEO + директор по маркетингу", purpose: "Обновляет стратегию при подтверждённом изменении условий.", rules: ["Стратегия версионируется", "Новая версия влияет на бюджет"] }
  ]}
];

const process: Item[] = [
  {id:"context",title:"Анализ контекста",subtitle:"Годовой старт",owner:"Директор по маркетингу",purpose:"Свод целей, продаж, клиентов и результатов прошлого периода.",rules:["Результат — основания для стратегии"]},
  {id:"strategyProcess",title:"Разработка стратегии",subtitle:"Стратегическая задача",owner:"Директор по маркетингу",purpose:"Формирование аудиторий, позиционирования, каналов и KPI.",rules:["Передаётся CEO на утверждение"]},
  {id:"approveStrategy",title:"Стратегия утверждена?",subtitle:"BPMN-шлюз",owner:"CEO",purpose:"Контрольная точка до распределения ресурсов.",rules:["Нет — вернуть на доработку","Да — перейти к бюджету"]},
  {id:"budgetPlan",title:"Бюджет и календарь",subtitle:"Годовое планирование",owner:"Директор по маркетингу",purpose:"Перевод стратегии в ресурсы, проекты, KPI и сроки.",rules:["Единый ID проекта обязателен"],docs:[{label:"Бюджет",url:budget},{label:"План",url:plan}]},
  {id:"approvePlan",title:"План утверждён?",subtitle:"BPMN-шлюз",owner:"CEO",purpose:"Фиксация базовой версии бюджета и разрешённых активностей.",rules:["Нет — корректировка","Да — запуск месячного цикла"]},
  {id:"monthPlan",title:"Планирование месяца",subtitle:"Повторяющийся цикл",owner:"Директор по маркетингу",purpose:"Уточнение проектов, сумм, KPI и сроков.",rules:["Отдельный месячный файл не нужен"],docs:[{label:"Открыть план",url:plan}]},
  {id:"execute",title:"Задачи и реализация",subtitle:"Исполнение",owner:"Маркетинговая команда",purpose:"Проекты раскладываются на задачи и выполняются.",rules:["Статусы ведутся в едином реестре"],docs:[{label:"Открыть план",url:plan}]},
  {id:"facts",title:"Два потока факта",subtitle:"Параллельный шлюз",owner:"Финансы + аналитика",purpose:"Одновременно фиксируются расходы/оплаты и маркетинговые результаты.",rules:["Обе ветки связывает ID проекта"],docs:[{label:"Открыть отчёт",url:august}]},
  {id:"calculate",title:"Два аналитических среза",subtitle:"Расчёт",owner:"Директор по маркетингу",purpose:"Месячный ДРР/ROMI по оплате и полная эффективность проекта.",rules:["Период и дата актуальности обязательны"],docs:[{label:"Открыть отчёт",url:august}]},
  {id:"review",title:"Управленческий разбор",subtitle:"Ежемесячное событие",owner:"CEO + директор по маркетингу",purpose:"Решения по бюджету, каналам и проектам.",rules:["Тактика возвращается в месячный цикл","Стратегические вопросы — в квартальный пересмотр"]}
];

const roles = ["Все","CEO","Директор по маркетингу","Маркетинговая команда","Финансы + аналитика"];

export default function MarketingProcessesPage() {
  const [tab,setTab]=useState<"docs"|"process">("docs");
  const [selected,setSelected]=useState<Item>(hierarchy[0].items[0]);
  const [role,setRole]=useState("Все");
  const visibleProcess=useMemo(()=>process.filter(item=>role==="Все"||item.owner.includes(role.replace("Маркетинговая ",""))),[role]);

  return <main className={styles.page}>
    <header className={styles.header}>
      <p className={styles.eyebrow}>RASCHINI · УПРАВЛЕНИЕ МАРКЕТИНГОМ</p>
      <h1>Карта процессов и документов</h1>
      <p>Единая навигация от стратегии и бюджета до расходов, результатов и управленческих решений.</p>
      <nav className={styles.quick}>
        <a href={driveFolder} target="_blank" rel="noreferrer">Папка Google Drive ↗</a>
        <a href={processRules} target="_blank" rel="noreferrer">Регламент процессов ↗</a>
        <a href={instruction} target="_blank" rel="noreferrer">Инструкция ↗</a>
        <a href={budget} target="_blank" rel="noreferrer">Бюджет ↗</a>
        <a href={plan} target="_blank" rel="noreferrer">План ↗</a>
        <a href={august} target="_blank" rel="noreferrer">Отчёт ↗</a>
      </nav>
    </header>

    <div className={styles.tabs}>
      <button className={tab==="docs"?styles.active:""} onClick={()=>setTab("docs")}>Иерархия документов</button>
      <button className={tab==="process"?styles.active:""} onClick={()=>setTab("process")}>BPMN-процесс</button>
    </div>

    <section className={styles.workspace}>
      <div className={styles.canvas}>
        {tab==="docs" ? <div className={styles.hierarchy}>
          {hierarchy.map((group,index)=><div className={styles.levelWrap} key={group.level}>
            <div className={styles.level}>
              <span>{group.level}</span>
              <div className={styles.cards}>{group.items.map(item=><button key={item.id} onClick={()=>setSelected(item)} className={selected.id===item.id?styles.selected:""}>
                <strong>{item.title}{item.docs?" ↗":""}</strong><small>{item.subtitle}</small>
              </button>)}</div>
            </div>
            {index<hierarchy.length-1&&<div className={styles.arrow}>↓</div>}
          </div>)}
        </div> : <div className={styles.process}>
          <div className={styles.processToolbar}><span>BPMN: последовательность, шлюзы и повторяющийся цикл</span><select value={role} onChange={e=>setRole(e.target.value)}>{roles.map(r=><option key={r}>{r}</option>)}</select></div>
          <div className={styles.swimlanes}>
            {visibleProcess.map((item,index)=><div className={styles.stepWrap} key={item.id}>
              <button onClick={()=>setSelected(item)} className={(selected.id===item.id?styles.selected+" ":"")+(item.subtitle.includes("шлюз")?styles.gateway:"")}>
                <span className={styles.stepNo}>{index+1}</span><strong>{item.title}</strong><small>{item.owner}</small><em>{item.subtitle}</em>
              </button>
              {index<visibleProcess.length-1&&<div className={styles.flow}>↓</div>}
            </div>)}
          </div>
          <div className={styles.cycle}>↺ Управленческие решения обновляют календарь и запускают следующий месячный цикл</div>
        </div>}
      </div>

      <aside className={styles.detail}>
        <p className={styles.eyebrow}>ВЫБРАННЫЙ ЭЛЕМЕНТ</p>
        <h2>{selected.title}</h2>
        <h3>Владелец</h3><p>{selected.owner}</p>
        <h3>Назначение</h3><p>{selected.purpose}</p>
        <h3>Правила и связи</h3><ul>{selected.rules.map(rule=><li key={rule}>{rule}</li>)}</ul>
        {selected.docs?.map(doc=><a className={styles.open} href={doc.url} target="_blank" rel="noreferrer" key={doc.url}>{doc.label} ↗</a>)}
      </aside>
    </section>

    <footer className={styles.footer}>
      <strong>Методология:</strong> расходы учитываются по дате расхода; месячный ДРР/ROMI — по дате оплаты; проект оценивается по полной сумме связанных расходов независимо от периода.
    </footer>
  </main>;
}
