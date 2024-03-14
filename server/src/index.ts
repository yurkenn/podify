import express from 'express';
import 'dotenv/config';
import './db';
import authRouter from './routers/auth';

const app = express();

//register middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);

const PORT = process.env.PORT || 8989;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
