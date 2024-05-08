const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    user:{type: Schema.Types.ObjectId, ref: 'userData'},
    cart:{type: Object, required: true},
    address:{type: String, required: true},
    // paymentID:{type: String, required: true}
});

module.exports = mongoose.model('Order',orderSchema);