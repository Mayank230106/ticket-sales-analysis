// src/controllers/purchaseController.js
import User from '../models/User.js';
import Event from '../models/event.js';

export const purchaseTickets = async (req, res) => {
  try {
    const { userId, eventId, type, quantity } = req.body;

    const event = await Event.findById(eventId);
    const ticket = event.tickets.find(t => t.type === type);

    if (!ticket || ticket.available < quantity) {
      return res.status(400).json({ message: 'Tickets not available' });
    }

    ticket.available -= quantity;
    await event.save();

    const user = await User.findById(userId);
    user.tickets.push({ event: event._id, type, quantity });
    await user.save();

    res.json({ message: 'Purchase successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
