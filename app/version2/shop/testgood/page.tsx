const url = 'https://raschini.com/product/usxxii2016109bp/';
const image = `/api/version2/product-image?url=${encodeURIComponent(url)}`;
const img = (source: string) => `/api/version2/product-image?url=${encodeURIComponent(source)}`;

const look = [
  {
    label: 'Основа образа',
    name: 'Брюки с мягкими защипами',
    price: '58 800 ₽',
    image: img('https://raschini.com/product-category/clothes/men-clothes/men-clothes-trousers/'),
  },
  {
    label: 'Первый слой',
    name: 'Поло из тонкого хлопка',
    price: '32 800 ₽',
    image: img('https://raschini.com/product/usxxv3021204bp/'),
  },
  {
    label: 'Финальный акцент',
    name: 'Замшевые лоферы',
    price: '69 800 ₽',
    image: img('https://raschini.com/product-category/shoes/men-shoes/'),
  },
];

export default function Version2Product() {
  return (
    <main className="v2 v2Pdp">
      <header className="v2Header dark">
        <nav className="v2Nav"><a href="/version2/shop">← Коллекция</a><a href="/version2">Главная</a></nav>
        <a className="v2Brand" href="/version2">RASCHINI</a>
        <nav className="v2Tools"><a href="https://raschini.com/?s=">Поиск</a><a href="https://raschini.com/my-account/">Кабинет</a><a href="https://raschini.com/cart/">Корзина 0</a></nav>
      </header>

      <div className="v2PdpBreadcrumbs"><a href="/version2/shop">Мужчины</a><span>/</span><a href="/version2/shop">Куртки</a><span>/</span><span>Замша</span></div>

      <section className="v2ProductPage">
        <div className="v2Gallery">
          <figure className="v2GalleryMain"><img src={image} alt="Тёмно-синяя двусторонняя куртка из натуральной замши" /><span className="v2GalleryCount">01 / 04</span></figure>
          <figure><img src={image} alt="Куртка Raschini — общий вид" style={{ transform: 'scale(1.12)', objectPosition: '50% 28%' }} /></figure>
          <figure><img src={image} alt="Фактура натуральной замши" style={{ transform: 'scale(1.34)', objectPosition: '35% 42%' }} /></figure>
          <figure><img src={image} alt="Посадка куртки Raschini" style={{ filter: 'saturate(.78) contrast(1.04)' }} /></figure>
        </div>

        <aside className="v2Buy">
          <div className="v2BuyTopline"><p className="v2Kicker">Outerwear · Made in Italy</p><button className="v2Wish v2Wish--pdp" aria-label="Добавить в избранное">♡</button></div>
          <h1>Двусторонняя куртка из натуральной замши</h1>
          <div className="v2PriceRow"><p className="v2Price">148 800 ₽</p><span>В наличии</span></div>
          <p className="v2Desc">Лёгкая двусторонняя куртка с мягкой конструкцией и точной посадкой. Более свободная альтернатива пиджаку: сохраняет собранность образа, но не делает его формальным.</p>

          <div className="v2OptionHead"><p className="v2Kicker">Размер</p><button>Таблица размеров</button></div>
          <div className="v2Sizes">{['46','48','50','52','54','56','58','60'].map((size,index)=><button key={size} className={index===2?'is-selected':''}>{size}</button>)}</div>
          <p className="v2FitHint">Соответствует размеру. Для свободной посадки поверх трикотажа выбирайте на размер больше.</p>

          <button className="v2Add">Добавить в корзину · 148 800 ₽</button>
          <button className="v2Manager">Подобрать размер с персональным менеджером</button>

          <div className="v2DeliveryCard">
            <div><span>Доставка</span><strong>Бесплатно по России</strong></div>
            <div><span>Примерка</span><strong>Москва — в день заказа</strong></div>
            <div><span>Бутик</span><strong>Отложим нужный размер</strong></div>
            <div><span>Возврат</span><strong>14 дней</strong></div>
          </div>

          <div className="v2Accordion">
            <details open><summary><span>Детали и состав</span><span>+</span></summary><p>Верх: 100% натуральная замша. Вторая сторона: техническая ткань. Двусторонняя конструкция, мягкая линия плеча, двухзамковая молния, внутренние карманы. Сделано в Италии.</p></details>
            <details><summary><span>Посадка</span><span>+</span></summary><p>Прямая комфортная посадка без лишнего объёма. Длина рассчитана так, чтобы куртка работала и с классическими брюками, и с денимом.</p></details>
            <details><summary><span>Уход</span><span>+</span></summary><p>Профессиональная специализированная чистка изделий из замши. Хранить на широких плечиках в дышащем чехле.</p></details>
          </div>
        </aside>
      </section>

      <section className="v2PdpStory">
        <p className="v2Kicker">Raschini wardrobe</p>
        <h2>Не отдельная вещь. Готовое состояние.</h2>
        <p>Raschini строит гардероб вокруг человека: мягкая конструкция, спокойная палитра и вещи, которые легко переходят из делового дня в вечер.</p>
      </section>

      <section className="v2CompleteLook">
        <div className="v2SectionHead"><div><p className="v2Kicker">Complete the look</p><h2>Собрать образ</h2></div><p>Три вещи, которые поддерживают глубину замши и сохраняют классическую мужскую собранность.</p></div>
        <div className="v2LookGrid">
          {look.map((item)=><a className="v2LookCard" href="/version2/shop" key={item.name}><div><img src={item.image} alt={item.name}/><span>+</span></div><p>{item.label}</p><h3>{item.name}</h3><strong>{item.price}</strong></a>)}
        </div>
        <div className="v2LookAction"><div><span>Полный образ</span><strong>310 200 ₽</strong></div><button>Добавить образ в корзину</button></div>
      </section>

      <section className="v2BoutiqueExperience">
        <div className="v2BoutiqueMedia"><img src={img('https://raschini.com/su-misura/')} alt="Бутик и сервис Raschini"/></div>
        <div className="v2BoutiqueCopy">
          <p className="v2Kicker">Raschini private service</p>
          <h2>Продолжение бутика — онлайн</h2>
          <p>Менеджер проверит посадку, соберёт полный образ, отложит изделия в Смоленском Пассаже или организует примерку у вас дома. Без формы заявки и ожидания ответа от безымянной поддержки.</p>
          <div className="v2BoutiqueActions"><a href="https://raschini.com/contact-us/">Написать менеджеру</a><a href="tel:+74957408833">Позвонить · +7 495 740-88-33</a></div>
          <ul><li>VIP-зал и персональная примерка</li><li>Подбор вещей по вашим размерам и гардеробу</li><li>Доставка и примерка по Москве</li></ul>
        </div>
      </section>

      <section className="v2BrandChapter">
        <p className="v2Kicker">Сила спокойствия</p>
        <blockquote>Дорогая вещь не должна доказывать свою ценность. Она должна давать человеку свободу, контроль и естественную уверенность.</blockquote>
        <a href="/version2">Узнать больше о Raschini →</a>
      </section>

      <div className="v2MobileBuy"><div><span>Размер 50</span><strong>148 800 ₽</strong></div><button>В корзину</button></div>
    </main>
  );
}
