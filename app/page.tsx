const cards = [
  ['Su misura', 'Посадка, которая не спорит с телом', 'atelier'],
  ['Linen summer', 'Лён, кожа, спокойная архитектура', 'linen'],
  ['Private boutiques', 'Смоленский Пассаж · Dream House', 'boutique'],
];

const looks = [
  ['01', 'Белый лен', 'Для города у воды'],
  ['02', 'Замша и хлопок', 'Для вечернего движения'],
  ['03', 'Костюм без усилия', 'Для встреч без пафоса'],
];

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <button>Меню</button>
        <a className="logo" href="#top">RASCHINI</a>
        <nav>
          <a href="#looks">Образы</a>
          <a href="#visit">Бутики</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="heroPhoto photoHero" />
        <div className="heroShade" />
        <div className="heroText">
          <p>Весна—лето 26</p>
          <h1>Портновская классика в современной жизни</h1>
          <a href="#looks">Смотреть первую прикидку</a>
        </div>
      </section>

      <section className="opening">
        <p>Главная Raschini должна ощущаться не как магазин, а как вход в тихий частный мир: вещи, путешествия, портновская культура и личный сервис.</p>
      </section>

      <section className="mosaic">
        <article className="bigTile photoLake">
          <span>Raschini journal</span>
          <h2>Лето у воды</h2>
        </article>
        {cards.map(([title, text, cls]) => (
          <article className={`smallTile photo ${cls}`} key={title}>
            <span>{title}</span>
            <h3>{text}</h3>
          </article>
        ))}
      </section>

      <section id="looks" className="looks">
        <div className="sectionHead">
          <p>Selected looks</p>
          <h2>Не категории. Состояния.</h2>
        </div>
        <div className="lookGrid">
          {looks.map(([num, title, text]) => (
            <article className="look" key={num}>
              <div className={`lookPhoto look${num}`} />
              <div>
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="tailoring">
        <div className="tailorPhoto" />
        <div className="tailorText">
          <p>Индивидуальный заказ</p>
          <h2>Ваши правила. Наша точность.</h2>
          <span>Костюм, пиджак или рубашка по меркам — без театральности, с вниманием к посадке и ткани.</span>
          <a href="#visit">Записаться</a>
        </div>
      </section>

      <section id="visit" className="visit">
        <p>Private appointment</p>
        <h2>Смоленский Пассаж · Dream House · Архангельское Outlet</h2>
        <a href="mailto:client@raschini.com">Связаться с нами</a>
      </section>
    </main>
  );
}
