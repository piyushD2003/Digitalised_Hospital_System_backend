const connectToMongo = require('./db');
const express = require('express');
const app = express();

const cors = require("cors")
connectToMongo();

app.use(cors({
  origin: "https://digitalised-hospital-system-frontend.vercel.app",
}))

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/list', require('./routes/list'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(() => {
  console.log(`Hospital Management Backend listening on port`);
});
