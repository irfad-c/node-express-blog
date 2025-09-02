const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    //Allow any fields in queries(That is fields which are not defined in your schema).
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    //conn.connection.host gives the host address.
    console.log(`Database connected : ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
