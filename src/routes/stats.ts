import express from 'express';
import { getBarChart, getDashboardStats, getLineChart, getPieChart } from '../controllers/stats.js';
import { adminOnly } from '../middlewares/auth.js';

const app = express();

//route - /api/v1/dashboard/stats
app.get('/stats',adminOnly,getDashboardStats);

//route - /api/v1/dashboard/pie
app.post('/pie',adminOnly,getPieChart);

//route - /api/v1/dashboard/bar
app.post('/bar',adminOnly,getBarChart);

//route - /api/v1/dashboard/line
app.post('/line',adminOnly,getLineChart);


export default app;
