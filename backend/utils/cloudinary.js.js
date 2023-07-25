require("dotenv").config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "personalprojectaswins" || process.env.CLOUDINARY_NAME,
  api_key: "343244986796635" || process.env.CLOUDINARY_API_KEY,
  api_secret:
    "sEVNeeKFS57c0udTcVgbNdY8nuk" || process.env.CLOUDINARY_API_SECRET,
});

module.exports = { cloudinary };
