import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import purchaseRoutes from './routes/purchaseRoutes.js';


connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/purchase', purchaseRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
