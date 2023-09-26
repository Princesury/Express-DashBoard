const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: [false, "Price must be given"]
    },
    category: { // Corrected the field name to "category"
        type: String,
        required: false
    },
    sold: {
        type: Boolean,
        required: false,
    },

    image: {
        type: String,                    // Add a contentType field for the image
    },
    dateOfSale: {
        type:Date,
    },
    month: {type: Number,},
});

const myModel = mongoose.model('Products', ProductSchema); 

module.exports = myModel
