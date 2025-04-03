import express from 'express';
import cors from 'cors';
import db from './conn.js';
import paraRoute from './route.js';

const app = express();
const port = 3000;

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
};

app.use(cors(corsOptions));
app.use('/para', paraRoute);

db();

app.listen(port, () => {
    console.log('Server is running on port', port);
});
