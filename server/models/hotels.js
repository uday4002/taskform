const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true,
  },
  hotelDescription: {
    type: String,
    required: true,
  },
  image: {
    type: Buffer, 
    required: true,
  },
  hotelType: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isDisabled: {
    type: String,
    default: 'Yes',
  },
  isClosed: {
    type: String,
    default: 'No',
  },
  hotelOpenTime: {
    type: String,
    required: true
  },
  hotelCloseTime: {
    type: String,
    required: true
  },
  hotelLocation: {
    type: String,
    required: true
  },
  hotelAddress: {
    type: String,
    required: true
  },
  hotelLocationPinCode: {
    type: Number,
    required: true
  },
  hotelLocationCity: {
    type: String,
    required: true
  },
  hotelLocationState: {
    type: String,
    required: true
  },
  hotelInstaHandles: {
    type: String,
    default: ''
  },
  hotelOrderService: {
    type: String,
    default: ''
  },
  createdAt: {
    type: String,
    required: true,
  }
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;