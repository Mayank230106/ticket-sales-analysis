import React from 'react'
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate=useNavigate();
    const handleLoginButton=()=>{
        navigate("/login");
      }

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow-lg">
      <h1 className="text-xl font-semibold">Chillr</h1>
      <button onClick={handleLoginButton} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">Login</button>
    </nav>
  )
}

export default Header