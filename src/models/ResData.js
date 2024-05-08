const mongoose = require('mongoose');

var restaurantSchema = new Schema({
  title:{type: String, required: true},
  categories:{type: Number, required: true},
  rating:{type: Number, required: true},
  delivery_time:{type: Number, required: true},
  price:{type: Number, required: true},
  image_url:{type: String, required: true},
  offer_status:{type: Boolean, required: true},
  offer:{type: Number, required: true},
  coupon_code:{type: String, required: true},
  address:{type: String, required: true},
});

module.exports = mongoose.model('ResData',restaurantSchema);