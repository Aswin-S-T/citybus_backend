const mongoose = require("mongoose");
const dbUrl =
  process.env.DATABASE_URL ||
  "mongodb://localhost:27017/seat-booking-application";

mongoose.set("strictQuery", true);

module.exports.connect = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(dbUrl);
    console.log("Mongodb Database connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
