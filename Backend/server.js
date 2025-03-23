import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';

const app = express();
dotenv.config();

// Middleware for data parsing and cors
const corsOptoins = {
    origin: true,
    credentials: true
}

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello!! Welcome To My Server...');
})

app.use(cors(corsOptoins)); // cors

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})