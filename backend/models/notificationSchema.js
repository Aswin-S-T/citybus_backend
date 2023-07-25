const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  notifications: [
    {
      from: { type: String, required: true },
      to: { type: String, required: true },
      message: { type: String },
      time: { type: String },
      read: {type:Boolean,default:false},
    },
  ],
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
