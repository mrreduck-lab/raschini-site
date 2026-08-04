const url = 'https://raschini.com/product/usxxii2016109bp/';
const image = `/api/version2/product-image?url=${encodeURIComponent(url)}`;

export default function Version2Product() {
  return (
    <main className="v2 v2Pdp">
      <header className="v2Header dark">
        <nav className="v2Nav">
          <a href="/version2/shop">← Коллекция</a>
          <a href="/version2">Главная</a>
        </nav>
        <a className="v2Brand" href="/version2">RASCHINI</a>
        <nav className="v2Tools">
          <a href="https://raschini.com/?s=">Поиск</a>
          <a href="https://raschini.com/my-account/">Кабинет</a>
          <a href="https://raschini.com/cart/">Корзина 0</a>
        </nav>
      </header>

      <div className="v2PdpBreadcrumbs">
        <a href="/version2/shop">Мужчины</a><span>/</span><a href="/version2/shop">Куртки</a><span>/</span><span>Замша</span>
      </div>

      <section className="v2ProductPage">
        <div className="v2Gallery">
          <figure className="v2GalleryMain">
            <img src={image} alt="Тёмно-синяя двусторонняя куртка из натуральной замши" />
            <span className="v2GalleryCount">01 / 04</span>
          </figure>
          <figure><img src={image} alt="Куртка Raschini — общий вид" style={{ transform: 'scale(1.12)', objectPosition: '50% 28%' }} /></figure>
          <figure><img src={image} alt="Фактура натуральной замши" style={{ transform: 'scale(1.34)', objectPosition: '35% 42%' }} /></figure>
          <figure><img src={image} alt="Посадка куртки Raschini" style={{ filter: 'saturate(.78) contrast(1.04)' }} /></figure>
        </div>

        <aside className="v2Buy">
          <div className="v2BuyTopline">
            <p className="v2Kicker">Outerwear · Made in Italy</p>
            <button className="v2Wish v2Wish--pdp" aria-label="Добавить в избранное">♡</button>
          </div>
          <h1>Двусторонняя куртка из натуральной замши</h1>
          <div className="v2PriceRow">
            <p className="v2Price">148 800 ₽</p>
            <span>В наличии</span>
          </div>
          <p className="v2Desc">
            Лёгкая двусторонняя куртка с мягкой конструкцией и точной посадкой.
            Работает и с костюмными брюками, и с расслабленным повседневным гардеробом.
          </p>

          <div className="v2OptionHead">
            <p className="v2Kicker">Размер</p>
            <button>Таблица размеров</button>
          </div>
          <div className="v2Sizes">
            {['46', '48', '50', '52', '54', '56', '58', '60'].map((size, index) => (
              <button key={size} className={index === 2 ? 'is-selected' : ''}>{size}</button>
            ))}
          </div>
          <p className="v2FitHint">Модель соответствует размеру. Для свободной посадки выберите на размер больше.</p>

          <button className="v2Add">Добавить в корзину · 148 800 ₽</button>
          <button className="v2Manager">Уточнить размер у персонального менеджера</button>

          <div className="v2DeliveryCard">
            <div><span>Доставка</span><strong>Бесплатно по России</strong></div>
            <div><span>Примерка</span><strong>Москва — в день заказа</strong></div>
            <div><span>Возврат</span><strong>14 дней</strong></div>
          </div>

          <div className="v2Accordion">
            <details>
              <summary><span>Детали и состав</span><span>+</span></summary>
              <p>Натуральная замша. Двусторонняя конструкция. Мягкая линия плеча. Сделано в Италии.</p>
            </details>
            <details>
              <summary><span>Посадка и рекомендации</span><span>+</span></summary>
              <p>Прямая комфортная посадка. Подходит для многослойных сочетаний с рубашкой или тонким трикотажем.</p>
            </details>
            <details>
              <summary><span>Доставка и возврат</span><span>+</span></summary>
              <p>Бесплатная доставка по России. Возможность примерки и возврата в течение 14 дней.</p>
            </details>
          </div>
        </aside>
      </section>

      <section className="v2PdpStory">
        <p className="v2Kicker">Raschini wardrobe</p>
        <h2>Одна вещь. Несколько сценариев.</h2>
        <p>Замша добавляет глубину классическому гардеробу, не делая образ формальным.</p>
      </section>

      <div className="v2MobileBuy">
        <div><span>Размер 50</span><strong>148 800 ₽</strong></div>
        <button>В корзину</button>
      </div>
    </main>
  );
}
