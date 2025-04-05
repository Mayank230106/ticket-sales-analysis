import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.css';
import App from './App.jsx';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // ✅ Import AuthProvider

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* ✅ Wrap everything with AuthProvider */}
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
