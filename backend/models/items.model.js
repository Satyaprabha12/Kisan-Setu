import mongoose from "mongoose";

const itemsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop', required: true
    },
    foodType: {
        type: String,
        enum: ['veg', 'non veg'],
        default: 'veg'
    },
    category: {
        type: String,
        required: true
    },
    price: { type: Number, min: 0, required: true },
    quantity: { type: Number, min: 0, required: true },
    unit: {
        type: String,
        enum: ['kg', 'g', 'l', 'ml', 'piece', 'dozen', 'quintal'],
        default: 'kg'
    },
}, { timestamps: true })

const Item = mongoose.model('Item', itemsSchema)
export default Item;