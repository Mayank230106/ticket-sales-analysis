import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // 🔁 Import context

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ use login from context

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/user/login', {
        email: username,
        password,
      });

      if (response && response.status === 200) {
        const userData = {
          userId: response.data.userId,
          token: response.data.token
        };

        localStorage.setItem('user', JSON.stringify(userData)); // ✅ optional, your context can handle this too
        login(userData); // ✅ this triggers re-render in Header!
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gray-100 to-blue-100 text-gray-900 px-4">
      <h2 className="text-3xl font-bold mb-6">Login</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-4"
      >
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-sm">
        Not registered yet?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Click here
        </Link>
      </p>
    </div>
  );
}

export default Login;
