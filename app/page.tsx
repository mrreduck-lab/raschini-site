'use client';

import { useEffect } from 'react';

const OFFICIAL_LOGO = 'https://raschini.com/wp-content/themes/raschini_new/img/logo.svg';

const articles = [
  { kicker: 'Путешествие', title: 'Дорога на юг', note: 'Napoli / Amalfi', cls: 'road', href: 'https://www.instagram.com/raschini_official/' },
  { kicker: 'Портновское искусство', title: 'Совершенство в деталях', note: 'Su misura', cls: 'tailor', href: 'https://raschini.com/individualnyj-poshiv/' },
  { kicker: 'Культура', title: 'Искусство жить красиво', note: 'Beyond the season', cls: 'culture', href: 'https://www.instagram.com/raschini_official/' },
  { kicker: 'Вдохновение', title: 'Лёгкость и естественность', note: 'Summer 2026', cls: 'nature', href: 'https://raschini.com/new/' },
];

const boutiques = [
  ['Смоленский Пассаж', 'Москва'],
  ['Dream House', 'Барвиха'],
  ['Архангельское Outlet', 'Москва'],
];

function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <span className={footer ? 'footerBrand brandAsset' : 'brand brandAsset'}>
      <img src={OFFICIAL_LOGO} alt="Raschini" width="220" height="54" />
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
          <span>Путешествия, культура, ремесло и вещи, которые становятся частью личной истории.</span>
          <a href="https://www.instagram.com/raschini_official/" target="_blank" rel="noreferrer">Смотреть журнал <b>↗</b></a>
        </article>
        {articles.map(({ kicker, title, note, cls, href }, index) => (
          <a className={`story story-${cls}`} key={title} href={href} style={{ '--delay': `${index * 90}ms` } as React.CSSProperties}>
            <div className="storyMedia"/><div className="shade"/><p>{kicker}<small>{note}</small></p><h3>{title}</h3><b className="storyArrow">↗</b>
          </a>
        ))}
      </section>

      <section id="su-misura" className="madeMeasure" data-reveal>
        <div className="clothPhoto" role="img" aria-label="Raschini Su Misura" />
        <article><p>Su Misura</p><h2>Создано<br/>для одного<br/>человека.</h2><i /><span>Более 600 тканей, ручная работа неаполитанских мастеров и посадка, которая учитывает ваш образ жизни.</span><a href="https://raschini.com/individualnyj-poshiv/">Записаться на примерку <b>↗</b></a></article>
      </section>

      <section className="collectionSplit" data-reveal>
        <article className="collectionPhoto collectionMens"><div><p>Uomo</p><h2>Летняя<br/>коллекция</h2><a href="https://raschini.com/product-category/clothes/men-clothes/">Мужская одежда ↗</a></div></article>
        <article className="collectionPhoto collectionDetails"><div><p>Essential</p><h2>Вещи,<br/>которые остаются</h2><a href="https://raschini.com/product-category/accessories/">Аксессуары ↗</a></div></article>
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
    </main>
  );
}
