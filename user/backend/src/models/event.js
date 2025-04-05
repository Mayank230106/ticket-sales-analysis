// src/models/Event.js
import mongoose from 'mongoose';

const ticketTypeSchema = new mongoose.Schema({
  type: String, // VIP, General, Early Bird
  available: Number,
});

const eventSchema = new mongoose.Schema({
  name: String,
  organizer: String,
  tickets: [ticketTypeSchema],
});

export default mongoose.model('Event', eventSchema);
