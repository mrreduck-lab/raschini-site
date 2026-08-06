const img = (url: string) =>
  `/api/version2/product-image?url=${encodeURIComponent(url)}`;
const campaign = (driveId: string) =>
  `/api/version2/product-image?driveId=${encodeURIComponent(driveId)}`;

const mediaBase: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const shade: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(180deg, rgba(0,0,0,.12) 0%, rgba(0,0,0,.04) 45%, rgba(0,0,0,.62) 100%)',
};

const copy: React.CSSProperties = {
  position: 'absolute',
  zIndex: 2,
  left: 'clamp(22px, 5vw, 72px)',
  right: 'clamp(22px, 5vw, 72px)',
  bottom: 'clamp(38px, 7vw, 82px)',
  color: '#fff',
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-between',
  gap: 28,
};

const title: React.CSSProperties = {
  fontFamily: 'var(--font-display), serif',
  fontSize: 'clamp(34px, 5vw, 72px)',
  lineHeight: 0.96,
  fontWeight: 400,
  letterSpacing: '-.025em',
  margin: '10px 0 0',
  maxWidth: 760,
};

function CampaignSlide({
  id,
  zIndex,
  label,
  children,
}: {
  id?: string;
  zIndex: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="v2OverlaySlide" style={{ zIndex }} aria-label={label}>
      {children}
    </section>
  );
}

export default function Version2Home() {
  return (
    <main className="v2 v2Home">
      <header className="v2Header">
        <nav className="v2Nav">
          <a href="/version2/shop">Мужчины</a>
          <a href="#collection">Коллекция</a>
          <a href="https://raschini.com/individualnyj-poshiv/">Su Misura</a>
        </nav>
        <a className="v2Brand" href="/">RASCHINI</a>
        <nav className="v2Tools">
          <a href="https://raschini.com/?s=">Поиск</a>
          <a href="https://raschini.com/my-account/">Кабинет</a>
          <a href="https://raschini.com/cart/">Корзина 0</a>
        </nav>
      </header>

      <CampaignSlide zIndex={1} label="Raschini Spring Summer 2026">
        <video autoPlay muted loop playsInline preload="metadata" src="/copy_5C18ACC9-0A1A-4565-92BA-0757C4EDB946.mp4" style={mediaBase} />
        <div style={shade} />
        <div style={copy}>
          <div><p className="v2Kicker">Spring Summer 2026</p><h1 style={title}>Сила спокойствия</h1></div>
          <a className="v2Link" href="/version2/shop">Открыть коллекцию →</a>
        </div>
      </CampaignSlide>

      <CampaignSlide id="collection" zIndex={2} label="Новый кампейн Raschini">
        <img src={campaign('1pX4WhVK0_wXQmiEEiYcP7HZV7HIYFeq7')} alt="Новый кампейн Raschini — мужской костюм у моря" style={{ ...mediaBase, objectPosition: '50% 34%' }} />
        <div style={shade} />
        <div style={copy}>
          <div><p className="v2Kicker">New campaign · South of Italy</p><h2 style={title}>Классика, которой не нужно доказывать свой статус</h2></div>
          <a className="v2Link" href="/version2/shop">Смотреть образы →</a>
        </div>
      </CampaignSlide>

      <CampaignSlide zIndex={3} label="Raschini outerwear">
        <img src={img('https://raschini.com/product/usxxii2016109bp/')} alt="Замшевая куртка Raschini" style={mediaBase} />
        <div style={shade} />
        <div style={copy}>
          <div><p className="v2Kicker">Outerwear</p><h2 style={title}>Материал говорит тише логотипа</h2></div>
          <a className="v2Link" href="/version2/shop/testgood">Смотреть вещь →</a>
        </div>
      </CampaignSlide>

      <CampaignSlide zIndex={4} label="Raschini Su Misura">
        <div className="v2SuMisuraSlide">
          <div>
            <p className="v2Kicker">Su Misura · Napoli</p>
            <h2 style={{ ...title, maxWidth: 'none', fontSize: 'clamp(38px, 6vw, 86px)' }}>Вещь, созданная вокруг человека</h2>
            <a className="v2Link" href="https://raschini.com/individualnyj-poshiv/" style={{ marginTop: 30 }}>Индивидуальный пошив →</a>
          </div>
        </div>
      </CampaignSlide>

      <footer className="v2Footer" style={{ position: 'relative', zIndex: 5, background: '#f3efe7' }}>
        <span>Москва · Неаполь</span><strong>RASCHINI</strong><span style={{ textAlign: 'right' }}>© 2026</span>
      </footer>
    </main>
  );
}
