import mongoose from 'mongoose';

const gastronomyProductSchema = new mongoose.Schema({
        name: { type: String, required: false },// Названеи
        slug: { type: String, required: true, unique: true },// символьный код
        category: { type: String, required: false },// категория
        image: { type: String, required: false },// картинка
        price: { type: Number, required: false, default: 0 },// цена
        new_price: { type: Number, required: false, default: 0 },// если цена по акции
        brand: { type: String, required: false },// бренд
        countInStock: { type: Number, required: false, default: 10 },// кол-во на складе
        description: { type: String, required: false },// описание
        composition: { type: String, required: false },// состав
        shelf_life: { type: String, required: false },// срок хранения
        storage_rules: { type: String, required: false },// правила хранения
        weight: { type: String, required: false },// грамовка
        weight_unit: { type: String, required: false },// еденица измерения веса
        country: {type: String, require: false},// страна производитель
        appearance: {type: String, require: false},// внешний вид
        color: {type: String, require: false},// цвет
        product_date: {type: String, require: false}//дата производмтва
    }, {
        timestamps: true,
});

const Gastronomy = mongoose.models.Gastronomy || mongoose.model('Gastronomy', gastronomyProductSchema);
export default Gastronomy;
