const connectToMongo = require('./db');
const cors = require('cors');
const express = require('express');
const app = express();
const port = 5000;

connectToMongo();

app.use(cors({
  origin: "https://digitalised-hospital-system-frontend.vercel.app",
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: [
    "Origin",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-Request-With",
    "multipart/form-data"
  ],
  credentials: true
}));

app.use(express.json());

// Set CORS headers for all responses
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://digitalised-hospital-system-frontend.vercel.app/');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Request-With, multipart/form-data');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/list', require('./routes/list'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Hospital Management Backend listening on port ${port}`);
});
