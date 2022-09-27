const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/school', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log("connected")
    
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};


connectDB();