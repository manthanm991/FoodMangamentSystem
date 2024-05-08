const mongoose = require('mongoose');

var menuSchema = new mongoose.Schema({
    name:{type: String, required: true},
    price:{type: Number, required: true},
    isVeg:{type: Boolean, required: true},
    image:{type: String, required: true},
    category:{type: String, required: true},
});

module.exports = mongoose.model('MenuData',menuSchema);