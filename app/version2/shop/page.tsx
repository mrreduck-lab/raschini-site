const products=[
['Тёмно-синяя двусторонняя куртка из натуральной замши','148 800 ₽','https://raschini.com/product/usxxii2016109bp/'],
['Серый классический костюм из шерсти и вискозы','189 800 ₽','https://raschini.com/product/uwxxii3037607bp/'],
['Футболка из хлопка двойной мерсеризации','19 800 ₽','https://raschini.com/product/usxxv3021204bp/'],
['Тёмно-зелёный льняной костюм','158 800 ₽','https://raschini.com/product-category/clothes/men-clothes/men-clothes-classic-suits-and-jackets/'],
['Тёмно-коричневый спортивный костюм','48 800 ₽','https://raschini.com/product-category/clothes/men-clothes/men-clothes-tracksuits/'],
['Костюм Safari','268 800 ₽','https://raschini.com/product-category/clothes/men-clothes/men-clothes-classic-suits-and-jackets/']
];
const img=(url:string)=>`/api/version2/product-image?url=${encodeURIComponent(url)}`;
export default function Version2Shop(){return <main className="v2"><header className="v2Header dark"><nav className="v2Nav"><a href="/version2">Меню</a><a href="/version2/shop">Мужчины</a></nav><a className="v2Brand" href="/version2">RASCHINI</a><nav className="v2Tools"><a href="https://raschini.com/?s=">Поиск</a><a href="https://raschini.com/cart/">Корзина 0</a></nav></header><section className="v2ShopHead"><div><p className="v2Kicker">Men / Spring Summer 2026</p><h1>Коллекция</h1></div><div className="v2Filters"><button>Фильтры</button><button>Сортировка</button><span>06 изделий</span></div></section><section className="v2Grid">{products.map(([name,price,url],i)=><a key={name} className="v2Product v2Reveal" href={i===0?'/version2/shop/testgood':url}><div className="v2ProductMedia"><img src={img(url)} alt={name}/></div><div className="v2Meta"><h2>{name}</h2><p>{price}</p></div></a>)}</section><footer className="v2Footer"><span>Бесплатная доставка по России от 20 000 ₽</span><strong>RASCHINI</strong><span style={{textAlign:'right'}}>Сервис бутика онлайн</span></footer></main>}
