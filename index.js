const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose')
const adminRoute = require('./routes/adminRoute')
const dotenv = require('dotenv');
dotenv.config();

// mongoose.connect('mongodb+srv://sanjid:mongosanjid@cluster0.ylbg7lk.mongodb.net/OmniEx')
//     .then(() => console.log('DB Connected'))
//     .catch((err) => console.log('Something went wrong', err))

    mongoose.connect('mongodb://localhost:27017/OminiEx')
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log('Something went wrong', err))

app.use(cors({
    origin: ['http://localhost:4200', 'https://omniex.vercel.app']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hi from Backend')
})

app.use('/admin', adminRoute)

app.listen(3000, () => console.log('Server Connected..!'))

