import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../utils/auth';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
    await db.connect();
    const products = await Product.find({});
    await db.disconnect();
    res.send(products);
});

handler.post(async (req, res) => {
    await db.connect();
    const newProduct = new Product({
        name: 'Название товара',
        slug: 'nazvanie_tovara' + Math.random(),
        category: 'Название категории',
        image: '/images/noimage.svg',
        price: 0,
        new_price: 0,
        brand: 'Название брэнда',
        rating: 0,
        numReviews: 0,
        countInStock: 1000,
        color: 'Цвет товара',
        volume: 0.5,
        percentage: 'Процент алкоголя',
        sort: 'Сорт винограда',
        popular: false,
        new_products: false,
        country: 'Страна производитель',
        shugar: 'Сухое, полусухое ...',
        type_product: 'Игристое или тихое',
        description: 'Описание товара',
   });

    const product = await newProduct.save();
    await db.disconnect();
    res.send({ message: 'Товар создан', product });
});

export default handler;