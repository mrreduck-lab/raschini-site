const articles = [
  ['Путешествие', 'Дорога в Quattro Passi', 'italy road', 'road'],
  ['Портновское искусство', 'Совершенство в деталях', 'details and seams', 'tailor'],
  ['Культура', 'Искусство жить красиво', 'lake evening', 'culture'],
  ['Вдохновение', 'Легкость и естественность', 'nature', 'nature'],
];

const boutiques = ['Смоленский Пассаж', 'Dream House', 'Архангельское Outlet'];

export default function Home() {
  return (
    <main>
      <header className="header">
        <button className="burger" aria-label="menu"><span/><span/></button>
        <nav className="leftNav"><a>Мир Raschini</a><a>Коллекции</a><a>Индивидуальный заказ</a><a>Бутики</a></nav>
        <a className="brand" href="#top"><span>♜</span>RASCHINI<small>MADE IN ITALY</small></a>
        <nav className="rightNav"><a>⌕</a><a>♙</a><a>▢ (0)</a></nav>
      </header>

      <section id="top" className="hero heroImg">
        <div className="heroOverlay" />
        <div className="heroContent">
          <p>Лето ’26</p>
          <h1>Портновское<br/>искусство</h1>
          <h2>В современном повседневном стиле</h2>
          <a>Смотреть коллекцию</a>
          <div className="counter"><span>01</span><i/><span>05</span></div>
        </div>
      </section>

      <section className="journalGrid">
        <article className="journalIntro lightPanel">
          <p>Raschini философия</p>
          <h2>Идеи.<br/>Вдохновение.<br/>Стиль.</h2>
          <i />
          <span>Путешествия, культура, вещи и моменты, которые нас формируют.</span>
          <a>Читать журнал</a>
        </article>
        {articles.map(([kicker, title, note, cls]) => (
          <article className={`story story-${cls}`} key={title}>
            <div className="shade" />
            <p>{kicker}<small>{note}</small></p>
            <h3>{title}</h3>
          </article>
        ))}
      </section>

      <section className="madeMeasure">
        <div className="clothPhoto" />
        <article>
          <p>Индивидуальный заказ</p>
          <h2>Ваш стиль.<br/>Ваши правила.</h2>
          <i />
          <span>Более 6000 тканей, безупречная посадка и внимание к каждой детали.</span>
          <a>Узнать больше</a>
        </article>
      </section>

      <section className="boutiqueBlock">
        <article className="lightPanel boutiqueText">
          <p>Бутики Raschini</p>
          <h2>Личный опыт<br/>в наших<br/>бутиках</h2>
          <i />
          <span>Пространства, где каждая деталь говорит о качестве и внимании.</span>
          <a>Найти бутик</a>
        </article>
        <div className="boutiquePhoto" />
        <aside className="boutiqueList">
          {boutiques.map((item) => <a key={item}>{item}<small>Москва</small><b>→</b></a>)}
          <a className="all">Все бутики <b>→</b></a>
        </aside>
      </section>

      <footer className="footer">
        <nav><a>Коллекции</a><a>Мир Raschini</a><a>Индивидуальный заказ</a><a>Бутики</a></nav>
        <div className="footerBrand"><span>♜</span>RASCHINI<small>MADE IN ITALY</small></div>
        <nav><a>Поиск</a><a>Избранное</a><a>Корзина (0)</a></nav>
      </footer>
    </main>
  );
}
