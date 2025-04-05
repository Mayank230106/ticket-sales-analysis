// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  email: { type: String, unique: true },
  phone: String,
  tickets: [
    {
      event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
      type: String,
      quantity: Number,
    }
  ]
});

export default mongoose.model('User', userSchema);
