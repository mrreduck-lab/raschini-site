const chapters = [
  {
    kicker: '01 / Morning',
    title: 'Lake light, linen, silence.',
    copy: 'Главная не продает с первого касания. Она вводит в состояние: утро, воздух, ткань, уверенность без жеста.',
  },
  {
    kicker: '02 / Tailoring',
    title: 'Made to move like a shirt.',
    copy: 'Неаполитанское плечо, мягкая посадка и лёгкая конструкция становятся частью движения, а не витриной статуса.',
  },
  {
    kicker: '03 / Club',
    title: 'Private, not loud.',
    copy: 'Бутики, su misura, личные приглашения и сезонные главы Raschini Beyond собраны в одну спокойную цифровую среду.',
  },
];

const collections = ['Linen', 'Su Misura', 'Fragrance'];

export default function Home() {
  return (
    <main>
      <header className="siteHeader" aria-label="Main navigation">
        <button className="menuButton" aria-label="Open menu">Menu</button>
        <a className="brand" href="#top">RASCHINI</a>
        <a className="headerLink" href="#contact">Private</a>
      </header>

      <section id="top" className="hero sectionGrid">
        <div className="heroMedia" aria-hidden="true">
          <div className="grain" />
          <div className="figure one" />
          <div className="figure two" />
        </div>
        <div className="heroCopy">
          <p className="eyebrow">Raschini Beyond / Summer</p>
          <h1>Quiet luxury for men who do not need to explain.</h1>
          <div className="heroMeta">
            <span>Digital journal</span>
            <span>Tailoring</span>
            <span>Moscow</span>
          </div>
        </div>
        <div className="scrollHint">Scroll</div>
      </section>

      <section className="manifesto">
        <p>Raschini.com как закрытый журнал, а не обычный интернет-магазин. Сначала атмосфера. Потом вещь.</p>
      </section>

      <section className="editorial sectionGrid">
        <div className="verticalTitle">Journal</div>
        <article className="leadCard">
          <p className="eyebrow">Chapter one</p>
          <h2>Summer in Como</h2>
          <p>Один экран, одна сцена, одно настроение. Пользователь движется по сайту как по дорогому печатному альбому.</p>
        </article>
        <div className="photoStack" aria-hidden="true">
          <div className="photo tall" />
          <div className="photo small" />
        </div>
      </section>

      <section className="chapters">
        {chapters.map((chapter) => (
          <article className="chapter" key={chapter.kicker}>
            <p>{chapter.kicker}</p>
            <h3>{chapter.title}</h3>
            <span>{chapter.copy}</span>
          </article>
        ))}
      </section>

      <section className="collectionPanel">
        <div>
          <p className="eyebrow">Selected worlds</p>
          <h2>Not categories. States.</h2>
        </div>
        <div className="collectionList">
          {collections.map((item, index) => (
            <a href="#contact" key={item}>
              <span>0{index + 1}</span>
              {item}
              <em>Explore</em>
            </a>
          ))}
        </div>
      </section>

      <section id="contact" className="finalScreen">
        <p className="eyebrow">Private appointment</p>
        <h2>Smolenskiy Passage / Dream House / Arkhangelskoe Outlet</h2>
        <a href="mailto:client@raschini.com">Request a visit</a>
      </section>
    </main>
  );
}
