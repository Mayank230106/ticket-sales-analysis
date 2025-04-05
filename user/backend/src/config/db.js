//mongodb+srv://maonkaee:<db_password>@ticket-sales-and-more.5s5g4bv.mongodb.net/?retryWrites=true&w=majority&appName=ticket-sales-and-more

import mongoose from 'mongoose';

//MONGO_URI = mongodb+srv:user_app:<w9h5XtMulqZJXd7g>@ticket-sales-and-more.5s5g4bv.mongodb.net/?retryWrites=true&w=majority&appName=ticket-sales-and-more
MONGO_URI = "mongodb+srv://user_app:<w9h5XtMulqZJXd7g>@ticket-sales-and-more.5s5g4bv.mongodb.net/?retryWrites=true&w=majority&appName=ticket-sales-and-more"
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  };
  
  export default connectDB;
