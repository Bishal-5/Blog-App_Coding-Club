import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import db from './config/db.js';
import UserRoutes from './routes/userAuth.js';

const app = express();
app.use(express.json()); // data parsing
const PORT = process.env.PORT || 5000;
dotenv.config(); // env variables
db(); // database connection

const corsOptoins = {
    origin: true, 
    credentials: true
} // cors

app.get('/', (req, res) => {
    res.send('Hello!! Welcome To My Server...');
})

app.use(cors(corsOptoins)); // cors
app.use('/user', UserRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})