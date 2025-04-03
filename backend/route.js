import express from 'express';
import getpara from './controller.js';

const router = express.Router();

router.get('/getpara', getpara);

export default router;
