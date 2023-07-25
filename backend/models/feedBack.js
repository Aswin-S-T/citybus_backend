const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema({
    name: { type: String },
    comment: { type: String },
    rating: { type: String },
    bus_ID: { type: String },
});

const User = mongoose.model("FeedBack", feedbackSchema);
module.exports = User;
