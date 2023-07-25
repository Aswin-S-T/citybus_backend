const mongoose = require("mongoose");
const busSchema = new mongoose.Schema(
  {
    bus_name: { type: String, required: true },
    bus_no: { type: String, required: true },
    bus_type: { type: String, required: true },
    time: { type: String },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    imageUrl: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    available_seats: { type: Number },
    rate: { type: Number, required: true },
    routes: [],
    company_id: { type: String, required: true },
    bookedSeats:[]
  },
  {
    timestamps: true,
  }
);

const Bus = mongoose.model("Bus", busSchema);
module.exports = Bus;
