const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoute = require('./routes/product');
const articleRoute = require('./routes/article');
const bestSellingRoute = require('./routes/bestSelling');
const equippedGymRoute = require('./routes/equippedGym');
const commentRoute = require('./routes/comment');
const messageRoute = require('./routes/sendMessage');
const questionRoute = require('./routes/question');
const authRoute = require('./routes/auth');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const app = express();

let port = process.env.PORT || 4000;
let host = process.env.HOST;
let databaseName = process.env.DATABASE_NAME;
let databaseHost = process.env.DATABASE_HOST;

const MONGODB_URI = `mongodb://${databaseHost}/${databaseName}`

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + '.jpg');
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('file type not supported!'));
    }
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(upload.array('image', 4));
app.use('/api', 
productRoute, 
articleRoute, 
bestSellingRoute, 
equippedGymRoute, 
questionRoute, 
messageRoute,
commentRoute);
app.use('/auth', authRoute);
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected To DB')
    }).catch((error) => {
        console.log(error)
    });

app.listen(port);