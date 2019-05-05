import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const ENV_PORT = process.env.PORT;
const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(ENV_PORT, () =>
    console.log(`Example app listening on port ${ENV_PORT}!`),
);