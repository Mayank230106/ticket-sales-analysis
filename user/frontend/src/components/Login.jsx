import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log('Username:', username, 'Password:', password);

    try {
      const response = await axios.post('/api/user/login', {
        email: username, // assuming you're using email as username
        password,
      });
  
      if (response && response.status === 200) {
        console.log('Login successful:', response.data);
        // Store token if using it
        // localStorage.setItem('token', response.data.token);
        navigate('/'); // redirect to homepage or dashboard
      }
    } catch (error) {
      console.error('Login error:', error);
      
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-900">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-80">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Username</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input 
            type="password" 
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-sm">Not registered yet? <Link to="/register" className="text-blue-500 hover:underline">Click here</Link></p>
    </div>
  );
}

export default Login;
