const products = [
  {
    name: 'Двусторонняя куртка из натуральной замши',
    note: 'New season · Made in Italy',
    price: '148 800 ₽',
    url: 'https://raschini.com/product/usxxii2016109bp/',
    href: '/version2/shop/testgood',
    className: 'v2Product v2Product--hero',
  },
  {
    name: 'Классический костюм из шерсти и вискозы',
    note: 'Soft tailoring',
    price: '189 800 ₽',
    url: 'https://raschini.com/product/uwxxii3037607bp/',
    className: 'v2Product',
  },
  {
    name: 'Футболка двойной мерсеризации',
    note: 'Essential',
    price: '19 800 ₽',
    url: 'https://raschini.com/product/usxxv3021204bp/',
    className: 'v2Product',
  },
  {
    name: 'Льняной костюм',
    note: 'Summer tailoring',
    price: '158 800 ₽',
    url: 'https://raschini.com/product-category/clothes/men-clothes/men-clothes-classic-suits-and-jackets/',
    className: 'v2Product v2Product--wide',
  },
  {
    name: 'Трикотажный костюм',
    note: 'Travel wardrobe',
    price: '48 800 ₽',
    url: 'https://raschini.com/product-category/clothes/men-clothes/men-clothes-tracksuits/',
    className: 'v2Product',
  },
  {
    name: 'Костюм Safari',
    note: 'Raschini signature',
    price: '268 800 ₽',
    url: 'https://raschini.com/product-category/clothes/men-clothes/men-clothes-classic-suits-and-jackets/',
    className: 'v2Product',
  },
];

const img = (url: string) =>
  `/api/version2/product-image?url=${encodeURIComponent(url)}`;

export default function Version2Shop() {
  return (
    <main className="v2 v2ShopPage">
      <header className="v2Header dark">
        <nav className="v2Nav">
          <a href="/version2">Меню</a>
          <a href="/version2/shop">Мужчины</a>
        </nav>
        <a className="v2Brand" href="/version2">RASCHINI</a>
        <nav className="v2Tools">
          <a href="https://raschini.com/?s=">Поиск</a>
          <a href="https://raschini.com/my-account/">Кабинет</a>
          <a href="https://raschini.com/cart/">Корзина 0</a>
        </nav>
      </header>

      <section className="v2ShopIntro">
        <div>
          <p className="v2Kicker">Men · Spring Summer 2026</p>
          <h1>Современная классика</h1>
        </div>
        <p className="v2ShopLead">
          Мягкая конструкция, точные пропорции и материалы, которые становятся
          выразительнее со временем.
        </p>
      </section>

      <div className="v2CatalogBar">
        <div className="v2CategoryRail" aria-label="Категории">
          <button className="is-active">Все</button>
          <button>Костюмы</button>
          <button>Куртки</button>
          <button>Трикотаж</button>
          <button>Рубашки</button>
          <button>Обувь</button>
        </div>
        <div className="v2CatalogTools">
          <button>Фильтры <span>+</span></button>
          <button>Сортировка <span>↓</span></button>
          <span>06</span>
        </div>
      </div>

      <section className="v2EditorialGrid">
        {products.map((product, index) => (
          <a
            key={product.name}
            className={`${product.className} v2Reveal`}
            href={product.href || product.url}
          >
            <div className="v2ProductMedia">
              <img src={img(product.url)} alt={product.name} />
              <button className="v2Wish" aria-label={`Добавить ${product.name} в избранное`}>
                ♡
              </button>
              {index === 0 && <span className="v2Badge">New</span>}
            </div>
            <div className="v2Meta">
              <div>
                <p className="v2ProductNote">{product.note}</p>
                <h2>{product.name}</h2>
              </div>
              <p>{product.price}</p>
            </div>
          </a>
        ))}
      </section>

      <section className="v2ServiceStrip">
        <div><span>01</span><p>Бесплатная доставка по России от 20 000 ₽</p></div>
        <div><span>02</span><p>Примерка и возврат в течение 14 дней</p></div>
        <div><span>03</span><p>Подбор образа персональным менеджером</p></div>
      </section>

      <footer className="v2Footer">
        <span>Москва · Неаполь</span>
        <strong>RASCHINI</strong>
        <span style={{ textAlign: 'right' }}>Сервис бутика онлайн</span>
      </footer>
    </main>
  );
}
