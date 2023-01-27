import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import Product from '../../../../../models/Product';
import db from '../../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
    await db.connect();
    const product = await Product.findById(req.query.id);
    await db.disconnect();
    res.send(product);
});

handler.put(async (req, res) => {
    await db.connect();
    const product = await Product.findById(req.query.id);
    if (product) {
        product.name = req.body.name;
        product.slug = req.body.slug;
        product.price = req.body.price;
        product.new_price = req.body.new_price;
        product.category = req.body.category;
        product.color = req.body.color;
        product.volume = req.body.volume;
        product.sort = req.body.sort;
        product.country = req.body.country;
        product.shugar = req.body.shugar;
        product.type_product = req.body.type_product;
        product.image = req.body.image;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        product.popular = req.body.popular;
        product.new_products = req.body.new_products;
        await product.save();
        await db.disconnect();
        res.send({ message: 'Продукт успешно обновлен' });
    } else {
        await db.disconnect();
        res.status(404).send({ message: 'Товар не найден' });
    }
});

handler.delete(async (req, res) => {
    await db.connect();
     const product = await Product.findById(req.query.id);
    if (product) {
        await product.remove();
        await db.disconnect();
        res.send({ message: 'Товар удален' });
    } else {
        await db.disconnect();
        res.status(404).send({ message: 'Товар не найден' });
    }
});

export default handler;