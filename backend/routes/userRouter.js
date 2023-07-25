const express = require("express");
const {
  getAllBus,
  getBusDetails,
  getBusDetailsofCompany,
} = require("../controllers/busController");
const {
  register,
  login,
  addBusDetails,
  deleteBus,
  addFeedback,
} = require("../controllers/users/userController");
const Bus = require("../models/busModel");
const Feedback = require("../models/feedBack");

const { generateBusDetails } = require("../utils/helper");
const nodemailer = require("nodemailer");
const pdfkit = require("pdfkit");
const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");
const { getNotification } = require("../controllers/notificationController");

const userRouter = express.Router();

function generatePDF(data) {
  const doc = new PDFDocument();

  doc.fontSize(20).text("Ticket Details", { align: "center" });
  doc.fontSize(14).text(`Full Name: ${data.fullName}`);
  doc.fontSize(14).text(`Email: ${data.email}`);
  doc.fontSize(14).text(`Starting Point: ${data.startingPoint}`);
  doc.fontSize(14).text(`Destination Point: ${data.destinationPoint}`);
  doc.fontSize(14).text(`Amount: ${data.amount}`);
  doc.fontSize(14).text(`Date: ${data.date}`);
  doc.fontSize(14).text(`Selected Seats: ${data.selectedSeats}`);

  return doc;
}

async function sendEmailWithPDF(pdfBuffer, email) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Ticket Details",
    text: "Attached is your ticket details PDF.",
    attachments: [
      {
        filename: "ticket_details.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}

userRouter.get("/", (req, res) => {
  res.send("user router api callled");
});

userRouter.get("/bus", async (req, res) => {
  await getAllBus().then((result) => {
    res.send(result);
  });
});

userRouter.get("/bus/:id", async (req, res) => {
  await getBusDetails(req.params.id).then((result) => {
    res.send(result);
  });
});

userRouter.post("/register", async (req, res) => {
  let userData = req.body;
  register(userData).then((result) => {
    res.send(result);
  });
});

userRouter.post("/signin", async (req, res) => {
  let userData = req.body;
  login(userData).then((result) => {
    res.send(result);
  });
});

userRouter.post("/add-bus-details", async (req, res) => {
  let busData = req.body;
  addBusDetails(busData).then((result) => {
    res.send(result);
  });
});


userRouter.post("/update-bus-details/:busId", async (req, res) => {
  const busId = req.params.busId;
  const updatedData = req.body;

  try {
    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    bus.bus_name = updatedData.bus_name || bus.bus_name;
    bus.bus_no = updatedData.bus_no || bus.bus_no;
    bus.bus_type = updatedData.bus_type || bus.bus_type;
    bus.time = updatedData.time || bus.time;
    bus.start_time = updatedData.start_time || bus.start_time;
    bus.end_time = updatedData.end_time || bus.end_time;
    bus.from = updatedData.from || bus.from;
    bus.to = updatedData.to || bus.to;
    bus.imageUrl = updatedData.imageUrl || bus.imageUrl;
    bus.available_seats = updatedData.available_seats || bus.available_seats;
    bus.rate = updatedData.rate || bus.rate;
    bus.routes = updatedData.routes || bus.routes;
    bus.company_id = updatedData.company_id || bus.company_id;
    bus.bookedSeats = updatedData.bookedSeats || bus.bookedSeats;

    const updatedBus = await bus.save().then((result) => {
      res.send(result);
    });
    res.json(updatedBus);
  } catch (error) {
    res.status(500).json({ message: "Error updating bus details" });
  }
});


userRouter.delete("/delete-bus/:busId", async (req, res) => {
  const busId = req.params.busId;

  try {
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    await bus.remove();
    res.json({ message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bus" });
  }
});


userRouter.post("/sendmail", async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "aswin1542000@gmail.com",
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: "aswinst154@gmail.com",
    to: "aswin1542000@gmail.com",
    subject: "Hello from Nodemailer",
    text: "Hello, this is a test email sent using Nodemailer!",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred:", error.message);
    } else {
      console.log("Email sent successfully!");
      console.log("Message ID:", info.messageId);
    }
  });
  res.send("hello");
});

userRouter.get("/send-invoice", async (req, res) => {
  const invoice = generateInvoice();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "Invoice",
    text: "Please find attached invoice.",
    attachments: [
      {
        filename: "invoice.pdf",
        content: invoice,
        contentType: "application/pdf",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("Error occurred while sending email.");
    } else {
      console.log("Email sent: " + info.response);
      res.send("Email sent successfully!");
    }
  });
});

userRouter.get("/get-my-bus/:companyId", async (req, res) => {
  let companyId = req.params.companyId;
  getBusDetailsofCompany(companyId).then((result) => {
    res.send(result);
  });
});

userRouter.post("/book-ticket", async (req, res) => {
  const data = req.body;
  const pdfDoc = generatePDF(data);
  const buffers = [];
  pdfDoc.on("data", (buffer) => buffers.push(buffer));
  pdfDoc.on("end", () => {
    const pdfBuffer = Buffer.concat(buffers);
    sendEmailWithPDF(pdfBuffer, data.email)
      .then(async () => {
        const seatsArray = data.selectedSeats.split(",").map(Number);
        await Bus.updateOne(
          { _id: data["busId"] },
          { $push: { bookedSeats: { $each: seatsArray } } }
        ).then((err, result) => {
          if (err) {
            console.log("Error in inserting seats", err);
          } else {
            console.log("Seat inserted successfully");
          }
        });
        res.send("PDF sent via email successfully");
      })
      .catch((error) =>
        res.status(500).send(`Failed to send PDF via email: ${error}`)
      );
  });

  pdfDoc.end();
});

userRouter.post("/delete-bus/:busId", async (req, res) => {
  let busId = req.params.busId;
  deleteBus(busId).then((result) => {
    res.send(result);
  });
});

userRouter.post("/feedback", async (req, res) => {
  console.log("req", req);

  let payload = {
    comment: req.body.comment,
    rating: req.body.rating,
    name: req.body.name,
    bus_ID: req.body.bus_ID,
  }

  addFeedback(payload).then((result) => {
    res.send(result);
  });
});

userRouter.get('/get-notification',async(req,res)=>{
  getNotification().then((result)=>{
    res.send(result)
  })
})

module.exports = userRouter;
