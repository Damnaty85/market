import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../utils/auth';
import Banner from '../../../../models/Banner';
import db from '../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
    await db.connect();
    const banners = await Banner.find({});
    await db.disconnect();
    res.send(banners);
});

handler.post(async (req, res) => {
    await db.connect();
    const newBanner = new Banner({
        image: '/images/noimage.svg',
        title: 'Заголовок в баннере',
        description: 'Описание в баннере',
        link: 'ссылка',
        button_text: 'текст кнопки',
        link_all_banner: false,
   });

    const banner = await newBanner.save();
    await db.disconnect();
    res.send({ message: 'Товар создан', banner });
});

export default handler;