import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
        name: { type: String, required: false },
        slug: { type: String, required: true, unique: true },
        category: { type: String, required: false },
        image: { type: String, required: false },
        price: { type: Number, required: false, default: 0 },
        brand: { type: String, required: false },
        rating: { type: Number, required: false, default: 0 },
        numReviews: { type: Number, required: false, default: 0 },
        countInStock: { type: Number, required: false, default: 0 },
        description: { type: String, required: false },
        color: {type: String, require: false},
        volume: {type: Number, require: false, default: 0},
        percentage: {type: String, require: false},
        sort: {type: String, require: false},
        country: {type: String, require: false},
        shugar: {type: String, require: false},
        type_product: {type: String, require: false},
        show_main: { type: Boolean, required: false, default: false },
        popular: { type: Boolean, required: false, default: false },
        new_products: { type: Boolean, required: false, default: false },
    }, {
        timestamps: true,
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
