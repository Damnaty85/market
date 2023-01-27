import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
        image: { type: String, required: true },
        title: { type: String, required: false },
        description: { type: String, required: false },
        link: { type: String, required: false },
        button_text: { type: String, required: false },
        link_all_banner: { type: Boolean, required: false, default: false },
    }, {
        timestamps: true,
});

const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
export default Banner;
