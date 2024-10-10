const mongoose = require('mongoose');

const hotelUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  hotelusersid:{
    type: String,
    required: true,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

const HotelUser = mongoose.model('HotelUser', hotelUserSchema);

module.exports = HotelUser;