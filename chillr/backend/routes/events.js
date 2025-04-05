const express = require('express');
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const router = express.Router();

// Create Event (Organizer Only)
router.post('/', auth, async (req, res) => {
  try {
    // Map frontend fields to backend structure
    const eventData = {
      organizerId: req.user._id,
      name: req.body.name,
      venue: req.body.venue,
      date: new Date(req.body.date),
      description: req.body.description,
      target: req.body.target || 0,
      vipTickets: {
        price: req.body.vipTicketPrice || 0,
        quantity: req.body.vipTickets || 0
      },
      generalTickets: {
        price: req.body.generalTicketPrice || 0,
        quantity: req.body.generalTickets || 0
      },
      earlyBirdTickets: {
        price: req.body.earlyBirdTicketPrice || 0,
        quantity: req.body.earlyBirdTickets || 0
      }
    };

    // Validate required fields
    if (!eventData.name || !eventData.venue || !eventData.date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const event = new Event(eventData);
    await event.save();
    
    res.status(201).json({
      message: 'Event created successfully',
      event: {
        id: event._id,
        name: event.name,
        date: event.date,
        venue: event.venue
      }
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message
    });
  }
});

// Get Organizer's Events
router.get('/my-events', auth, async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user._id })
      .select('name date venue vipTickets generalTickets earlyBirdTickets');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Public Events (Website)
router.get('/public', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizerId', 'name email')
      .select('name date venue description vipTickets generalTickets earlyBirdTickets');
      
    res.json(events.map(event => ({
      ...event._doc,
      organizer: event.organizerId
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;