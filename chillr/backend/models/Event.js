const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 0
  }
});

const EventSchema = new mongoose.Schema({
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: String,
  target: {
    type: Number,
    default: 0
  },
  vipTickets: ticketSchema,
  generalTickets: ticketSchema,
  earlyBirdTickets: ticketSchema,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);