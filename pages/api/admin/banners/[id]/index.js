import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import Banner from '../../../../../models/Banner';
import db from '../../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
    await db.connect();
    const banner = await Banner.findById(req.query.id);
    await db.disconnect();
    res.send(banner);
});

handler.put(async (req, res) => {
    await db.connect();
    const banner = await Banner.findById(req.query.id);
    if (banner) {
        banner.title = req.body.title;
        banner.image = req.body.image;
        banner.description = req.body.description;
        banner.link = req.body.link;
        banner.button_text = req.body.button_text;
        banner.link_all_banner = req.body.link_all_banner;
        await banner.save();
        await db.disconnect();
        res.send({ message: 'Баннер успешно обновлен' });
    } else {
        await db.disconnect();
        res.status(404).send({ message: 'Баннер не найден' });
    }
});

handler.delete(async (req, res) => {
    await db.connect();
     const banner = await Banner.findById(req.query.id);
    if (banner) {
        await banner.remove();
        await db.disconnect();
        res.send({ message: 'Баннер удален' });
    } else {
        await db.disconnect();
        res.status(404).send({ message: 'Баннер не найден' });
    }
});

export default handler;