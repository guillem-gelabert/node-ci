require('../models/User');
jest.setTimeout(30000);


const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.connect(keys.mongoURI);