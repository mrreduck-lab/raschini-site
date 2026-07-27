'use client';

import { useEffect, useRef, useState } from 'react';

const LOGO_URL = 'https://drive.google.com/thumbnail?id=1z_j_76krs1HNLa_KhOxX8mdE3JJWOSYO&sz=w1000';
const HERO_VIDEO_URL = 'https://drive.google.com/uc?export=download&id=1jQZ0LhTSbTMAip5WMD0pN3pJQk2p85m3';

const articles = [
  { kicker: 'Y Magazine · Отпуск', title: 'Мужчина в отпуске', note: 'Летний гардероб Raschini', cls: 'road', href: 'https://ymag.media/articles/muzhchina-v-otpuske' },
  { kicker: 'Y Magazine · Ремесло', title: 'В неаполитанских традициях', note: 'Крой, ткани, Su Misura', cls: 'tailor', href: 'https://ymag.media/articles/v-neapolitanskikh-tradiciyakh' },
  { kicker: 'РБК · История', title: 'Люди и традиции Raschini', note: 'Редакционный материал', cls: 'culture', href: 'https://www.rbc.ru/society/25/02/2026/699eaf899a79477bfd8743b8' },
  { kicker: 'РБК Стиль · Выбор', title: 'Вневременной мужской гардероб', note: 'Вещи, которые остаются', cls: 'nature', href: 'https://style.rbc.ru/items/6a4f71579a794752f32bf69f' },
];

const boutiques = [['Смоленский Пассаж', 'Москва'], ['Dream House', 'Барвиха'], ['Архангельское Outlet', 'Москва']];

function BrandLogo({ compact = false, footer = false }: { compact?: boolean; footer?: boolean }) {
  return (
    <span className={`brandAsset ${compact ? 'isCompact' : ''} ${footer ? 'isFooter' : ''}`}>
      {!compact && <img src={LOGO_URL} alt="Raschini" width={700} height={379} />}
      {compact && <span className="wordmark">RASCHINI</span>}
    </span>
  );
}

export default function Home() {
  const [compactHeader, setCompactHeader] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach((item) => observer.observe(item));

    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      const goingDown = y > lastScroll.current + 4;
      const goingUp = y < lastScroll.current - 4;
      setCompactHeader(y > 84);
      if (y < 120) setHeaderHidden(false);
      else if (goingDown) setHeaderHidden(true);
      else if (goingUp) setHeaderHidden(false);
      lastScroll.current = y;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <main>
      <header className={`header ${compactHeader ? 'headerCompact' : 'headerHero'} ${headerHidden ? 'headerHidden' : ''}`}>
        <a className="burger" href="#journal" aria-label="Перейти к содержанию"><span/><span/></a>
        <nav className="leftNav" aria-label="Основная навигация"><a href="#journal">Мир Raschini</a><a href="https://raschini.com/new/">Коллекции</a><a href="#su-misura">Индивидуальный заказ</a><a href="#boutiques">Бутики</a></nav>
        <a className="brandLink" href="#top" aria-label="Raschini — на главную"><BrandLogo compact={compactHeader} /></a>
        <nav className="rightNav" aria-label="Сервисы"><a href="https://raschini.com/?s=">Поиск</a><a href="https://raschini.com/my-account/">Кабинет</a><a href="https://raschini.com/cart/">Корзина</a></nav>
      </header>

      <section id="top" className="hero heroVideo">
        <video className="heroVideoEl" autoPlay muted loop playsInline preload="metadata">
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="heroOverlay" />
        <div className="heroContent">
          <p className="heroKicker">Весна — лето 2026</p>
          <h1><span>Сила</span><span>спокойствия</span></h1>
          <h2>Неаполитанское портновское искусство<br/>в современном ритме</h2>
          <a className="cta" href="https://raschini.com/new/">Открыть коллекцию <b>↗</b></a>
        </div>
        <a className="scrollHint" href="#journal">Листайте <span>↓</span></a>
      </section>

      <section id="journal" className="statement" data-reveal><p>Raschini — одежда не для демонстрации статуса.</p><h2>Она создаёт состояние,<br/>в котором ничего не нужно доказывать.</h2></section>
      <section className="journalGrid" data-reveal>
        <article className="journalIntro lightPanel"><p>Raschini Journal</p><h2>Идеи.<br/>Люди.<br/>Стиль.</h2><i /><span>Путешествия, культура и неаполитанское ремесло — в материалах Raschini и ведущих редакций.</span><a href="https://ymag.media/articles/muzhchina-v-otpuske" target="_blank" rel="noreferrer">Читать материалы <b>↗</b></a></article>
        {articles.map(({ kicker, title, note, cls, href }, index) => <a className={`story story-${cls}`} key={title} href={href} target="_blank" rel="noreferrer" style={{ '--delay': `${index * 90}ms` } as React.CSSProperties}><div className="storyMedia"/><div className="shade"/><p>{kicker}<small>{note}</small></p><h3>{title}</h3><b className="storyArrow">↗</b></a>)}
      </section>
      <section id="su-misura" className="madeMeasure" data-reveal><div className="clothPhoto" role="img" aria-label="Raschini Su Misura"/><article><p>Su Misura</p><h2>Создано<br/>для одного<br/>человека.</h2><i/><span>Выкройка на основе 21 мерки, итальянское производство и финальная доводка в ателье Raschini.</span><a href="https://raschini.com/individualnyj-poshiv/">Записаться на примерку <b>↗</b></a></article></section>
      <section className="collectionSplit" data-reveal><article className="collectionPhoto collectionMens"><div><p>Uomo</p><h2>Мужчина<br/>в отпуске</h2><a href="https://ymag.media/articles/muzhchina-v-otpuske">Читать историю ↗</a></div></article><article className="collectionPhoto collectionDetails"><div><p>Napoli</p><h2>Вещи,<br/>которые движутся<br/>вместе с вами</h2><a href="https://ymag.media/articles/v-neapolitanskikh-tradiciyakh">Неаполитанский крой ↗</a></div></article></section>
      <section id="boutiques" className="boutiqueBlock" data-reveal><article className="lightPanel boutiqueText"><p>Бутики Raschini</p><h2>Личный опыт<br/>в пространстве<br/>бренда</h2><i/><span>Здесь образ собирают не по трендам, а вокруг характера, задач и привычек человека.</span><a href="https://raschini.com/boutiques/">Все контакты <b>↗</b></a></article><div className="boutiquePhoto" role="img" aria-label="Бутик Raschini"/><aside className="boutiqueList">{boutiques.map(([item, city]) => <a href="https://raschini.com/boutiques/" key={item}><span>{item}<small>{city}</small></span><b>→</b></a>)}<a className="all" href="https://raschini.com/boutiques/">Выбрать бутик <b>→</b></a></aside></section>
      <footer className="footer"><nav><a href="https://raschini.com/new/">Коллекции</a><a href="#journal">Мир Raschini</a><a href="#su-misura">Индивидуальный заказ</a><a href="#boutiques">Бутики</a></nav><BrandLogo footer/><nav><a href="https://www.instagram.com/raschini_official/" target="_blank" rel="noreferrer">Instagram</a><a href="https://raschini.com/my-account/">Личный кабинет</a><a href="mailto:info@raschini.com">info@raschini.com</a></nav></footer>

      <style jsx global>{`
        .header{transition:transform .48s cubic-bezier(.16,1,.3,1),background-color .4s ease,backdrop-filter .4s ease,color .35s ease,padding .4s ease;will-change:transform}
        .headerHidden{transform:translateY(-120%)}
        .headerHero{background:transparent;backdrop-filter:none}
        .headerCompact{padding-top:17px;padding-bottom:17px;background:rgba(246,242,235,.9);color:#17130f;backdrop-filter:blur(18px) saturate(130%);-webkit-backdrop-filter:blur(18px) saturate(130%);box-shadow:0 1px 0 rgba(20,16,12,.08);mix-blend-mode:normal}
        .brandLink{justify-self:center;display:block;line-height:0;align-self:start}
        .brandAsset{display:flex;flex-direction:column;align-items:center;color:#a38354;line-height:1}
        .brandAsset img{display:block;width:clamp(180px,20vw,290px);height:auto;object-fit:contain}
        .brandAsset.isCompact .wordmark{display:block;font-family:var(--font-display),Georgia,serif;font-size:23px;letter-spacing:.31em;padding-left:.31em;color:#a38354;white-space:nowrap}
        .brandAsset.isFooter img{width:210px}
        .heroVideoEl{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;background:#111}
        .heroOverlay{background:linear-gradient(180deg,rgba(0,0,0,.12),rgba(0,0,0,.04) 34%,rgba(0,0,0,.62) 100%)}
        .headerCompact .burger span{background:#17130f}
        @media(max-width:900px){
          html,body{min-height:100%;background:#000}
          .hero{height:100vh;height:100svh;height:100dvh;min-height:100svh}
          .header{padding-top:max(18px,env(safe-area-inset-top));align-items:start}
          .headerCompact{padding-top:max(14px,env(safe-area-inset-top));padding-bottom:14px}
          .brandLink{position:absolute;top:max(17px,env(safe-area-inset-top));left:50%;transform:translateX(-50%)}
          .headerCompact .brandLink{top:max(17px,env(safe-area-inset-top))}
          .brandAsset img{width:34vw;min-width:150px;max-width:230px}
          .brandAsset.isCompact .wordmark{font-size:18px;letter-spacing:.29em;padding-left:.29em}
          .heroContent{left:24px;right:24px;bottom:max(34px,calc(env(safe-area-inset-bottom) + 24px))}
          .heroVideoEl{object-position:center center}
        }
        @media(max-width:520px){
          .hero{height:100vh!important;height:100svh!important;height:100dvh!important;min-height:100svh!important}
          .brandAsset img{width:36vw;min-width:145px;max-width:200px}
          .hero h1{font-size:18vw}
          .heroContent{bottom:max(24px,calc(env(safe-area-inset-bottom) + 18px))}
        }
      `}</style>
    </main>
  );
}
