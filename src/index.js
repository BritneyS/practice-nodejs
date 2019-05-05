import 'dotenv/config';
import express from 'express';

const env_port = process.env.PORT;
const app = express();

app.listen(env_port, () =>
    console.log(`Example app listening on port ${env_port}`),
);