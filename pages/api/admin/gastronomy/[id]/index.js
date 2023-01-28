import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import Gastronomy from '../../../../../models/Gastronomy';
import db from '../../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
    await db.connect();
    const product = await Gastronomy.findById(req.query.id);
    await db.disconnect();
    res.send(product);
});

handler.put(async (req, res) => {
    await db.connect();
    const product = await Gastronomy.findById(req.query.id);
    if (product) {
        product.name = req.body.name;
        product.slug = req.body.slug;
        product.category = req.body.category;
        product.image = req.body.image;
        product.price = req.body.price;
        product.new_price = req.body.new_price;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        product.composition = req.body.composition;
        product.shelf_life = req.body.shelf_life;
        product.storage_rules = req.body.storage_rules;
        product.weight = req.body.weight;
        product.weight_unit = req.body.weight_unit;
        product.country = req.body.country;
        product.appearance = req.body.appearance;
        product.color = req.body.color;
        product.product_date = req.body.product_date;
        await product.save();
        await db.disconnect();
        res.send({ message: 'Товар успешно обновлен' });
    } else {
        await db.disconnect();
        res.status(404).send({ message: 'Товар не найден' });
    }
});

handler.delete(async (req, res) => {
    await db.connect();
     const product = await Gastronomy.findById(req.query.id);
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