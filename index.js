const connectToMongo = require('./db');
var cors = require('cors')
const express = require('express')
connectToMongo();
const app = express()
const port = 5000
app.use(cors({
  origin:["https://digitalised-hospital-system-frontend.vercel.app/"],
  methods:["GET","POST","PUT"],
  allowedHeaders: ["Origin",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-Request-With",
    "multipart/form-data"
    ],
  credentials:true,
}))
app.use(express.json())

app.use('/api/auth',require('./routes/auth'))
app.use('/api/list',require('./routes/list'))
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Hospital Management Backend listening on port ${port}`)
})