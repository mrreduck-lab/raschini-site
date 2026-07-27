'use client';

import { useEffect, useRef, useState } from 'react';

const LOGO_URL = '/IMG_4803.png';
const HERO_VIDEO_URL = '/copy_5C18ACC9-0A1A-4565-92BA-0757C4EDB946.mp4';

const articles = [
  { kicker: 'Y Magazine · Отпуск', title: 'Мужчина в отпуске', note: 'Летний гардероб Raschini', cls: 'road', href: 'https://ymag.media/articles/muzhchina-v-otpuske' },
  { kicker: 'Y Magazine · Ремесло', title: 'В неаполитанских традициях', note: 'Крой, ткани, Su Misura', cls: 'tailor', href: 'https://ymag.media/articles/v-neapolitanskikh-tradiciyakh' },
  { kicker: 'РБК · История', title: 'Люди и традиции Raschini', note: 'Редакционный материал', cls: 'culture', href: 'https://www.rbc.ru/society/25/02/2026/699eaf899a79477bfd8743b8' },
  { kicker: 'РБК Стиль · Выбор', title: 'Вневременной мужской гардероб', note: 'Вещи, которые остаются', cls: 'nature', href: 'https://style.rbc.ru/items/6a4f71579a794752f32bf69f' },
];

const boutiques = [['Смоленский Пассаж', 'Москва'], ['Dream House', 'Барвиха'], ['Архангельское Outlet', 'Москва']];

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5"/></svg>;
}

function BagIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5h11l1 12h-13l1-12Z"/><path d="M9 8.5V6.8a3 3 0 0 1 6 0v1.7"/></svg>;
}

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
  const [menuOpen, setMenuOpen] = useState(false);
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
      const goingDown = y > lastScroll.current + 5;
      const goingUp = y < lastScroll.current - 5;
      setCompactHeader(y > 96);
      if (!menuOpen) {
        if (y < 130) setHeaderHidden(false);
        else if (goingDown) setHeaderHidden(true);
        else if (goingUp) setHeaderHidden(false);
      }
      lastScroll.current = y;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className={`header ${compactHeader ? 'headerCompact' : 'headerHero'} ${headerHidden ? 'headerHidden' : ''} ${menuOpen ? 'menuIsOpen' : ''}`}>
        <button className={`burger ${menuOpen ? 'isOpen' : ''}`} onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen}><span/><span/></button>
        <nav className="leftNav" aria-label="Основная навигация"><a href="#journal">Мир Raschini</a><a href="https://raschini.com/new/">Коллекции</a><a href="#su-misura">Индивидуальный заказ</a><a href="#boutiques">Бутики</a></nav>
        <a className="brandLink" href="#top" aria-label="Raschini — на главную"><BrandLogo compact={compactHeader || menuOpen} /></a>
        <nav className="rightNav" aria-label="Сервисы"><a href="https://raschini.com/?s=">Поиск</a><a href="https://raschini.com/my-account/">Кабинет</a><a className="cartLink" href="https://raschini.com/cart/" aria-label="Корзина"><BagIcon/><span>Корзина</span></a></nav>
      </header>

      <aside className={`mobileMenu ${menuOpen ? 'isOpen' : ''}`} aria-hidden={!menuOpen}>
        <div className="menuInner">
          <p className="menuLabel">Навигация</p>
          <nav className="menuPrimary">
            <a onClick={closeMenu} href="https://raschini.com/new/"><span>01</span>Коллекции</a>
            <a onClick={closeMenu} href="#journal"><span>02</span>Мир Raschini</a>
            <a onClick={closeMenu} href="#su-misura"><span>03</span>Su Misura</a>
            <a onClick={closeMenu} href="#boutiques"><span>04</span>Бутики</a>
          </nav>
          <div className="menuMeta">
            <a href="https://raschini.com/my-account/">Личный кабинет</a>
            <a href="https://raschini.com/cart/">Корзина</a>
            <a href="mailto:info@raschini.com">info@raschini.com</a>
          </div>
        </div>
      </aside>

      <section id="top" className="hero heroVideo">
        <video className="heroVideoEl" autoPlay muted loop playsInline preload="metadata"><source src={HERO_VIDEO_URL} type="video/mp4" /></video>
        <div className="heroOverlay" />
        <div className="heroContent">
          <p className="heroKicker">Весна — лето 2026</p>
          <h1><span>Сила</span><span>спокойствия</span></h1>
          <p className="heroLead">Неаполитанская лёгкость.<br/>Современный ритм.</p>
          <a className="cta" href="https://raschini.com/new/"><span>Открыть коллекцию</span><ArrowIcon/></a>
        </div>
        <a className="scrollHint" href="#journal"><span>Листайте</span><ArrowIcon/></a>
      </section>

      <section id="journal" className="statement" data-reveal><p>Raschini — одежда не для демонстрации статуса.</p><h2>Она создаёт состояние,<br/>в котором ничего не нужно доказывать.</h2></section>
      <section className="journalGrid" data-reveal>
        <article className="journalIntro lightPanel"><p>Raschini Journal</p><h2>Идеи.<br/>Люди.<br/>Стиль.</h2><i /><span>Путешествия, культура и неаполитанское ремесло — в материалах Raschini и ведущих редакций.</span><a href="https://ymag.media/articles/muzhchina-v-otpuske" target="_blank" rel="noreferrer">Читать материалы <ArrowIcon/></a></article>
        {articles.map(({ kicker, title, note, cls, href }, index) => <a className={`story story-${cls}`} key={title} href={href} target="_blank" rel="noreferrer" style={{ '--delay': `${index * 90}ms` } as React.CSSProperties}><div className="storyMedia"/><div className="shade"/><p>{kicker}<small>{note}</small></p><h3>{title}</h3><span className="storyArrow"><ArrowIcon/></span></a>)}
      </section>
      <section id="su-misura" className="madeMeasure" data-reveal><div className="clothPhoto" role="img" aria-label="Raschini Su Misura"/><article><p>Su Misura</p><h2>Создано<br/>для одного<br/>человека.</h2><i/><span>Выкройка на основе 21 мерки, итальянское производство и финальная доводка в ателье Raschini.</span><a href="https://raschini.com/individualnyj-poshiv/">Записаться на примерку <ArrowIcon/></a></article></section>
      <section className="collectionSplit" data-reveal><article className="collectionPhoto collectionMens"><div><p>Uomo</p><h2>Мужчина<br/>в отпуске</h2><a href="https://ymag.media/articles/muzhchina-v-otpuske">Читать историю <ArrowIcon/></a></div></article><article className="collectionPhoto collectionDetails"><div><p>Napoli</p><h2>Вещи,<br/>которые движутся<br/>вместе с вами</h2><a href="https://ymag.media/articles/v-neapolitanskikh-tradiciyakh">Неаполитанский крой <ArrowIcon/></a></div></article></section>
      <section id="boutiques" className="boutiqueBlock" data-reveal><article className="lightPanel boutiqueText"><p>Бутики Raschini</p><h2>Личный опыт<br/>в пространстве<br/>бренда</h2><i/><span>Здесь образ собирают не по трендам, а вокруг характера, задач и привычек человека.</span><a href="https://raschini.com/boutiques/">Все контакты <ArrowIcon/></a></article><div className="boutiquePhoto" role="img" aria-label="Бутик Raschini"/><aside className="boutiqueList">{boutiques.map(([item, city]) => <a href="https://raschini.com/boutiques/" key={item}><span>{item}<small>{city}</small></span><ArrowIcon/></a>)}<a className="all" href="https://raschini.com/boutiques/">Выбрать бутик <ArrowIcon/></a></aside></section>
      <footer className="footer"><nav><a href="https://raschini.com/new/">Коллекции</a><a href="#journal">Мир Raschini</a><a href="#su-misura">Индивидуальный заказ</a><a href="#boutiques">Бутики</a></nav><BrandLogo footer/><nav><a href="https://www.instagram.com/raschini_official/" target="_blank" rel="noreferrer">Instagram</a><a href="https://raschini.com/my-account/">Личный кабинет</a><a href="mailto:info@raschini.com">info@raschini.com</a></nav></footer>

      <style jsx global>{`
        :root{--brand-gold:#9b7844;--header-h:92px}html,body{overscroll-behavior-y:none}body{padding:0}.header{position:fixed;z-index:80;inset:0 0 auto;min-height:var(--header-h);transition:transform .5s cubic-bezier(.16,1,.3,1),background-color .35s ease,backdrop-filter .35s ease,padding .35s ease;color:#fff;will-change:transform}.headerHidden{transform:translateY(-120%)}.headerHero{background:transparent}.headerCompact{background:rgba(246,242,235,.92);color:#17130f;backdrop-filter:blur(18px) saturate(130%);-webkit-backdrop-filter:blur(18px) saturate(130%);box-shadow:0 1px 0 rgba(20,16,12,.08);mix-blend-mode:normal}.menuIsOpen{transform:none!important;background:transparent;color:var(--brand-gold);box-shadow:none;backdrop-filter:none}.burger{appearance:none;border:0;background:transparent;color:inherit;padding:10px 0;width:34px;height:36px;display:grid;align-content:center;gap:8px;cursor:pointer;z-index:91}.burger span{display:block;width:30px;height:1px;background:currentColor;transition:transform .35s ease,width .35s ease}.burger.isOpen span:first-child{transform:translateY(4.5px) rotate(45deg)}.burger.isOpen span:last-child{transform:translateY(-4.5px) rotate(-45deg)}.brandLink{justify-self:center;display:block;line-height:0;align-self:start}.brandAsset{display:flex;flex-direction:column;align-items:center;color:var(--brand-gold);line-height:1}.brandAsset img{display:block;width:clamp(190px,20vw,300px);height:auto;object-fit:contain}.brandAsset.isCompact .wordmark{display:block;font-family:var(--font-display),Georgia,serif;font-size:24px;font-weight:500;letter-spacing:.28em;padding-left:.28em;color:var(--brand-gold);white-space:nowrap}.brandAsset.isFooter img{width:220px}.cartLink{display:inline-flex!important;align-items:center;gap:9px}.cartLink svg,.cta svg,.storyArrow svg,.journalIntro a svg,.madeMeasure a svg,.boutiqueText a svg,.collectionPhoto a svg,.boutiqueList a svg,.scrollHint svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}.mobileMenu{position:fixed;z-index:70;inset:0;background:#f2ede5;color:#17130f;opacity:0;visibility:hidden;transform:translateY(-18px);transition:opacity .35s ease,visibility .35s ease,transform .55s cubic-bezier(.16,1,.3,1)}.mobileMenu.isOpen{opacity:1;visibility:visible;transform:none}.menuInner{min-height:100%;padding:calc(env(safe-area-inset-top) + 132px) 24px calc(env(safe-area-inset-bottom) + 34px);display:flex;flex-direction:column}.menuLabel{margin:0 0 28px;text-transform:uppercase;font-size:10px;letter-spacing:.24em;color:#987b55}.menuPrimary{display:flex;flex-direction:column}.menuPrimary a{display:grid;grid-template-columns:34px 1fr;gap:14px;align-items:baseline;padding:16px 0;border-bottom:1px solid rgba(20,16,12,.14);font-family:var(--font-display),serif;font-size:clamp(40px,12vw,58px);line-height:.95}.menuPrimary a span{font-family:var(--font-sans),sans-serif;font-size:9px;letter-spacing:.18em;color:#987b55}.menuMeta{margin-top:auto;display:grid;gap:14px;padding-top:34px;text-transform:uppercase;font-size:10px;letter-spacing:.18em}.hero{height:100vh;height:100svh;height:100dvh;min-height:100svh;padding-top:env(safe-area-inset-top);position:relative}.heroVideoEl{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;background:#111}.heroOverlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.03) 48%,rgba(0,0,0,.68) 100%)}.heroContent{position:absolute;left:clamp(24px,6vw,96px);bottom:clamp(34px,7vh,76px);max-width:780px}.heroKicker{margin:0 0 14px;font-size:10px;letter-spacing:.28em;color:#d9c09a}.hero h1{margin:0;font-size:clamp(72px,9.2vw,138px);line-height:.76;letter-spacing:-.045em}.heroLead{margin:28px 0 0;font-size:11px;line-height:1.65;letter-spacing:.16em;text-transform:uppercase}.cta,.journalIntro a,.madeMeasure a,.boutiqueText a,.collectionPhoto a{display:inline-flex;align-items:center;gap:14px;margin-top:30px;padding-bottom:8px;border-bottom:1px solid currentColor;text-transform:uppercase;font-size:10px;letter-spacing:.18em}.cta svg{transition:transform .3s ease}.cta:hover svg{transform:translateX(4px)}.scrollHint{position:absolute;right:38px;bottom:34px;display:flex;align-items:center;gap:12px;font-size:9px;letter-spacing:.2em;text-transform:uppercase}.scrollHint svg{transform:rotate(90deg)}
        @media(max-width:900px){:root{--header-h:84px}.header{grid-template-columns:40px 1fr 40px;padding:calc(env(safe-area-inset-top) + 14px) 20px 12px;align-items:start}.headerCompact{padding-top:calc(env(safe-area-inset-top) + 12px);padding-bottom:12px}.leftNav,.rightNav a:not(.cartLink){display:none}.rightNav{display:block;justify-self:end}.cartLink span{display:none}.cartLink svg{width:24px;height:24px}.brandLink{position:absolute;top:calc(env(safe-area-inset-top) + 12px);left:50%;transform:translateX(-50%)}.headerCompact .brandLink{top:calc(env(safe-area-inset-top) + 17px)}.brandAsset img{width:34vw;min-width:150px;max-width:225px}.brandAsset.isCompact .wordmark{font-size:18px;letter-spacing:.27em;padding-left:.27em}.heroContent{left:24px;right:24px;bottom:max(30px,calc(env(safe-area-inset-bottom) + 22px))}.hero h1{font-size:clamp(68px,19vw,104px);line-height:.72}.heroLead{font-size:10px;margin-top:24px}.scrollHint{display:none}}
        @media(max-width:520px){.brandAsset img{width:38vw;min-width:150px;max-width:205px}.hero h1{font-size:18.5vw}.cta{margin-top:25px}.heroContent{bottom:max(22px,calc(env(safe-area-inset-bottom) + 16px))}}
      `}</style>
    </main>
  );
}
