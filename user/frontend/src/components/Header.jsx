import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // adjust path if needed

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); // use context directly

  const handleLogout = () => {
    logout(); // call context logout
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold cursor-pointer" onClick={() => navigate('/')}>
        Ticket App
      </h1>
      <nav className="space-x-4">
        {user ? (
          <>
            {/* <button
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
              onClick={() => navigate('/my-profile')}
            >
              My Profile
            </button> */}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
