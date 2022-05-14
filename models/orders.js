const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    products: [{
        product: {
            type: Object,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    }],
});

module.exports = model('Order', orderSchema);
