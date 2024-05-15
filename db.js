const mongoose = require('mongoose');

const mongoDB ='mongodb+srv://kannansiva0910:3tIqawFHvZIGJQ4E@day-39.nsqripm.mongodb.net/';

mongoose.connect(mongoDB).then(() => {
    console.log('MongoDB connected');
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
  });

module.exports=mongoose;

// kannansiva0910
// 3tIqawFHvZIGJQ4E