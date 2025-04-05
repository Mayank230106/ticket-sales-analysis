import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // ✅ reactive user state

  const handleEventClick = () => {
    if (user) {
      navigate('/tickets'); // ✅ corrected route from /events to /tickets
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Ticket App!</h1>
      <p className="mb-8 text-lg">Explore and book tickets to your favorite events</p>
      <button
        onClick={handleEventClick}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        View Events
      </button>
    </div>
  );
}

export default Home;
