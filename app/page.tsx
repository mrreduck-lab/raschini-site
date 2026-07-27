'use client';

import { useEffect } from 'react';

const OFFICIAL_LOGO = 'https://lh3.googleusercontent.com/d/1z_j_76krs1HNLa_KhOxX8mdE3JJWOSYO';

const articles = [
  { kicker: 'Y Magazine · Отпуск', title: 'Мужчина в отпуске', note: 'Летний гардероб Raschini', cls: 'road', href: 'https://ymag.media/articles/muzhchina-v-otpuske' },
  { kicker: 'Y Magazine · Ремесло', title: 'В неаполитанских традициях', note: 'Крой, ткани, Su Misura', cls: 'tailor', href: 'https://ymag.media/articles/v-neapolitanskikh-tradiciyakh' },
  { kicker: 'РБК · История', title: 'Люди и традиции Raschini', note: 'Редакционный материал', cls: 'culture', href: 'https://www.rbc.ru/society/25/02/2026/699eaf899a79477bfd8743b8' },
  { kicker: 'РБК Стиль · Выбор', title: 'Вневременной мужской гардероб', note: 'Вещи, которые остаются', cls: 'nature', href: 'https://style.rbc.ru/items/6a4f71579a794752f32bf69f' },
];

const boutiques = [
  ['Смоленский Пассаж', 'Москва'],
  ['Dream House', 'Барвиха'],
  ['Архангельское Outlet', 'Москва'],
];

function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <span className={footer ? 'footerBrand brandAsset' : 'brand brandAsset'}>
      <img src={OFFICIAL_LOGO} alt="Raschini" width={700} height={379} />
      <span className="brandFallback" aria-hidden="true">RASCHINI</span>
    </span>
  );
}

export default function Home() {
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
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <header className="header">
        <a className="burger" href="#journal" aria-label="Перейти к содержанию"><span/><span/></a>
        <nav className="leftNav" aria-label="Основная навигация">
          <a href="#journal">Мир Raschini</a><a href="https://raschini.com/new/">Коллекции</a><a href="#su-misura">Индивидуальный заказ</a><a href="#boutiques">Бутики</a>
        </nav>
        <a className="brandLink" href="#top" aria-label="Raschini — на главную"><BrandLogo /></a>
        <nav className="rightNav" aria-label="Сервисы"><a href="https://raschini.com/?s=">Поиск</a><a href="https://raschini.com/my-account/">Кабинет</a><a href="https://raschini.com/cart/">Корзина</a></nav>
      </header>

      <section id="top" className="hero heroImg">
        <div className="heroMedia" />
        <div className="heroOverlay" />
        <div className="heroContent">
          <p className="heroKicker">Весна — лето 2026</p>
          <h1><span>Сила</span><span>спокойствия</span></h1>
          <h2>Неаполитанское портновское искусство<br/>в современном ритме</h2>
          <a className="cta" href="https://raschini.com/new/">Открыть коллекцию <b>↗</b></a>
          <div className="counter"><span>01</span><i/><span>05</span></div>
        </div>
        <a className="scrollHint" href="#journal">Листайте <span>↓</span></a>
      </section>

      <section id="journal" className="statement" data-reveal>
        <p>Raschini — одежда не для демонстрации статуса.</p>
        <h2>Она создаёт состояние,<br/>в котором ничего не нужно доказывать.</h2>
      </section>

      <section className="journalGrid" data-reveal>
        <article className="journalIntro lightPanel">
          <p>Raschini Journal</p><h2>Идеи.<br/>Люди.<br/>Стиль.</h2><i />
          <span>Путешествия, культура и неаполитанское ремесло — в материалах Raschini и ведущих редакций.</span>
          <a href="https://ymag.media/articles/muzhchina-v-otpuske" target="_blank" rel="noreferrer">Читать материалы <b>↗</b></a>
        </article>
        {articles.map(({ kicker, title, note, cls, href }, index) => (
          <a className={`story story-${cls}`} key={title} href={href} target="_blank" rel="noreferrer" style={{ '--delay': `${index * 90}ms` } as React.CSSProperties}>
            <div className="storyMedia"/><div className="shade"/><p>{kicker}<small>{note}</small></p><h3>{title}</h3><b className="storyArrow">↗</b>
          </a>
        ))}
      </section>

      <section id="su-misura" className="madeMeasure" data-reveal>
        <div className="clothPhoto" role="img" aria-label="Raschini Su Misura" />
        <article><p>Su Misura</p><h2>Создано<br/>для одного<br/>человека.</h2><i /><span>Выкройка на основе 21 мерки, итальянское производство и финальная доводка в ателье Raschini.</span><a href="https://raschini.com/individualnyj-poshiv/">Записаться на примерку <b>↗</b></a></article>
      </section>

      <section className="collectionSplit" data-reveal>
        <article className="collectionPhoto collectionMens"><div><p>Uomo</p><h2>Мужчина<br/>в отпуске</h2><a href="https://ymag.media/articles/muzhchina-v-otpuske">Читать историю ↗</a></div></article>
        <article className="collectionPhoto collectionDetails"><div><p>Napoli</p><h2>Вещи,<br/>которые движутся<br/>вместе с вами</h2><a href="https://ymag.media/articles/v-neapolitanskikh-tradiciyakh">Неаполитанский крой ↗</a></div></article>
      </section>

      <section id="boutiques" className="boutiqueBlock" data-reveal>
        <article className="lightPanel boutiqueText"><p>Бутики Raschini</p><h2>Личный опыт<br/>в пространстве<br/>бренда</h2><i /><span>Здесь образ собирают не по трендам, а вокруг характера, задач и привычек человека.</span><a href="https://raschini.com/boutiques/">Все контакты <b>↗</b></a></article>
        <div className="boutiquePhoto" role="img" aria-label="Бутик Raschini" />
        <aside className="boutiqueList">{boutiques.map(([item, city]) => <a href="https://raschini.com/boutiques/" key={item}><span>{item}<small>{city}</small></span><b>→</b></a>)}<a className="all" href="https://raschini.com/boutiques/">Выбрать бутик <b>→</b></a></aside>
      </section>

      <footer className="footer">
        <nav><a href="https://raschini.com/new/">Коллекции</a><a href="#journal">Мир Raschini</a><a href="#su-misura">Индивидуальный заказ</a><a href="#boutiques">Бутики</a></nav>
        <BrandLogo footer />
        <nav><a href="https://www.instagram.com/raschini_official/" target="_blank" rel="noreferrer">Instagram</a><a href="https://raschini.com/my-account/">Личный кабинет</a><a href="mailto:info@raschini.com">info@raschini.com</a></nav>
      </footer>

      <style jsx global>{`
        .brandLink{justify-self:center;display:block;line-height:0}
        .brandAsset{position:relative;display:block;width:118px;line-height:0}
        .brandAsset img{display:block;width:100%;height:auto;object-fit:contain}
        .brandFallback{display:none!important}
        .footerBrand.brandAsset{width:210px}
        @media(max-width:900px){
          html,body{min-height:100%;background:#000}
          .hero{height:100vh;height:100dvh;min-height:100dvh}
          .header{padding-top:max(20px,env(safe-area-inset-top));align-items:start}
          .brandLink{position:absolute;top:max(17px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:2}
          .brandAsset{width:94px;max-height:62px;overflow:hidden}
          .brandAsset img{max-height:62px;width:auto;max-width:94px;margin:0 auto}
          .heroMedia{background-position:center top}
        }
        @media(max-width:520px){
          .hero{height:100vh!important;height:100dvh!important;min-height:100dvh!important}
          .heroMedia{inset:0;background-size:cover;background-position:center top}
          .heroContent{bottom:max(28px,calc(env(safe-area-inset-bottom) + 20px))}
          .brandLink{top:max(14px,env(safe-area-inset-top))}
          .brandAsset{width:86px;max-height:56px}
          .brandAsset img{max-height:56px;max-width:86px}
        }
      `}</style>
    </main>
  );
}