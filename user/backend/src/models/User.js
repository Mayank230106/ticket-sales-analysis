// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  city:String,
  age: Number,
  gender: String,
  email: { type: String, unique: true },
  phone: String,
  password:{
    type:String,
    required:[true,'Password is required']
  },
  
  tickets: [
    {
      event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
      type: String,
      quantity: Number,
    }
  ]
});

export default mongoose.model('User', userSchema);
