const Bus = require("../models/busModel");
const { successResponse, errorResponse } = require("../response");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  getAllBus: () => {
    return new Promise(async (resolve, reject) => {
      let bus = await Bus.find().then((response) => {
        if (response) {
          successResponse.data = response;
          resolve(successResponse);
        } else {
          resolve(errorResponse);
        }
      });
    });
  },
  getBusDetails: (busId) => {
    return new Promise(async (resolve, reject) => {
      await Bus.findOne({ _id: busId }).then((response) => {
        if (response) {
          if (!response.bookedSeats) {
            response.bookedSeats = []
          }
          successResponse.data = response;
          resolve(successResponse);
        } else {
          resolve(errorResponse);
        }
      });
    });
  },
  getBusDetailsofCompany: (companyId) => {
    return new Promise(async (resolve, reject) => {
      await Bus.find({ company_id: companyId }).then((response) => {
        if (response) {
          successResponse.data = response;
          resolve(successResponse);
        } else {
          resolve(errorResponse);
        }
      });
    });
  },
};
