import express from 'express';
import {connect} from "./lib/database";
const app = express();
const port = 4000;

connect()

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/auth', (req, res) => {
    
})

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port} in ${process.env.NODE_ENV} mode`);
});