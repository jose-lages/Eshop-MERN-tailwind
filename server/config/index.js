const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI).then((data) => {
    console.log(`DB connected on: ${data.connection.host}`);
  });
};

module.exports = connectDB;
