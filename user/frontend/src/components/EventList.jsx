// src/components/EventList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function EventList({ userId }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/api/events').then(res => setEvents(res.data));
  }, []);

  const handleBuy = async (eventId, type) => {
    await axios.post('/api/purchase/buy', {
      userId,
      eventId,
      type,
      quantity: 1,
    });
    alert('Ticket purchased!');
  };

  return (
    <div className="p-6">
      {events.map(event => (
        <div key={event._id} className="mb-4 p-4 border rounded-lg bg-white shadow">
          <h3 className="text-xl font-semibold">{event.name}</h3>
          <div className="mt-2 space-y-2">
            {event.tickets.map(ticket => (
              <div key={ticket.type} className="flex justify-between">
                <span>{ticket.type}: {ticket.available} available</span>
                <button
                  onClick={() => handleBuy(event._id, ticket.type)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventList;
