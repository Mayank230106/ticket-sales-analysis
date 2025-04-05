import React, { useEffect, useState } from 'react';

function MyProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  if (!user) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="bg-white shadow p-4 rounded space-y-2">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>City:</strong> {user.city}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
}

export default MyProfile;
