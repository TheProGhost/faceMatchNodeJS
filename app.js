const express = require('express');
const faceCheck = require('./faceCheck');

const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';

const app = express();

app.get('/', (req,res) => {
    res.send("Server working");
});

app.get('/faces', async (req,res) => {
    let a = await faceCheck();
    res.send(a);
})


app.listen(port, host, () =>{
    console.log(`Server up and running on the http://${host}:${port}`);
})