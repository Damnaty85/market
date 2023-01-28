import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../utils/auth';
import Gastronomy from '../../../../models/Gastronomy';
import db from '../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
    await db.connect();
    const products = await Gastronomy.find({});
    await db.disconnect();
    res.send(products);
});

handler.post(async (req, res) => {
    await db.connect();
    const newGastronomyProduct = new Gastronomy({
        name: 'Название товара',// Названеи
        slug: 'nazvanie_tovara' + Math.random(),// символьный код
        category: 'Категория товара',// категория
        image: '/images/noimage.svg',// картинка
        price: 0,// цена
        new_price: 0,// если цена по акции
        brand: 'Бренд производитель',// бренд
        countInStock: 10,// кол-во на складе
        description: 'Описание товара',// описание
        composition: 'Состав товара',// состав
        shelf_life: 'Сроки хранения товара',// срок хранения
        storage_rules: 'Правила хранения товара',// правила хранения
        weight: 'Вес товара',// грамовка
        weight_unit: 'Еденица измирения товара',// еденица измерения веса
        country: 'Страна проихводитель',// страна производитель
        appearance: 'Внешний вид товара',// внешний вид
        color: 'Цвет товара',// цвет
        product_date: 'Дата производства'//дата производмтва
   });

    const product = await newGastronomyProduct.save();
    await db.disconnect();
    res.send({ message: 'Товар создан', product });
});

export default handler;