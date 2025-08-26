// Importing required modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

const TeamData = require("./models/TeamData.Schema");
const AdminData = require("./models/Admin.Schema");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- MongoDB Connection ----------
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// ---------- Nodemailer Setup ----------
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "955abb001@smtp-brevo.com", // usually your email or login
    pass: "6mYKXdfatpxU2I01", // API key from Brevo
  },
});

async function sendConfirmationMail(name, email, teamKey) {
  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      teamKey
    )}`;
    await transporter.sendMail({
      from: '"Team Dotz" <symposium@dotzv12.in>',
      to: email,
      subject: "Registration Successful 🎉",
      html: `
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: Arial, sans-serif; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #6a11cb, #2575fc); padding: 20px; text-align: center; color: #fff;">
            <h1 style="margin: 0; font-size: 28px;">Dotz V12</h1>
          </div>
          <div style="padding: 25px; text-align: center; color: #333;">
            <h2 style="margin-bottom: 10px;">Hi ${name},</h2>
            <p style="font-size: 16px; line-height: 1.6;">Thanks for registering with <b>Dotz V12</b>!<br/>
            We’re thrilled to have you onboard 🚀</p>
            <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">Your Team QR Code:</p>
            <div style="display: inline-block; padding: 15px; border: 2px dashed #6a11cb; border-radius: 12px; background: #f9f9ff;">
              <img src="${qrUrl}" alt="Team QR Code" style="width: 150px; height: 150px;" />
            </div>
            <p style="margin-top: 20px; font-size: 15px; color: #666;">Scan this QR code to access your team details anytime.</p>
          </div>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 14px; color: #777;">
            <p style="margin: 0;">Best Regards,<br/><b>Team Dotz</b></p>
          </div>
        </div>
      `,
    });
    console.log("Confirmation mail sent to:", email);
  } catch (err) {
    console.error("Error sending mail:", err);
  }
}

// ---------- Register Team ----------
app.post("/api/register", async (req, res) => {
  try {
    const teamData = req.body;
    const teamKey = uuidv4();

    if (teamData.leaderEvents.includes("Paper Presentation")) {
      const countPaperPresentation = await TeamData.countDocuments({
        leaderEvents: "Paper Presentation",
      });
      teamData.paperPresentationTeamCount = countPaperPresentation + 1;
    } else {
      teamData.paperPresentationTeamCount = 0;
    }

    const count = await TeamData.countDocuments({});
    teamData.teamNumber = count + 1;
    teamData.teamKey = teamKey;

    console.log("📩 Received team data:", teamData);

    const newTeam = new TeamData(teamData);
    await newTeam.save();

    res
      .status(201)
      .json({ message: "Team registered successfully", team: newTeam, teamKey });

    await sendConfirmationMail(
      teamData.leaderName,
      teamData.leaderEmail,
      teamKey
    );
  } catch (error) {
    console.error("❌ Error saving team data:", error);
    res.status(500).json({
      error: "Failed to register team",
      details: error.message,
    });
  }
});

// ---------- Cashfree: Create Order Token ----------
app.post("/api/create-cashfree-order", async (req, res) => {
  console.log("CASHFREE_APP_ID:", process.env.CASHFREE_APP_ID);
  console.log("CASHFREE_SECRET_KEY:", process.env.CASHFREE_SECRET_KEY);

  try {
    const { amount, currency = "INR" } = req.body;
    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    console.log(orderId);
    const orderData = {
      order_id: orderId,
      order_amount: (Number(amount) / 100).toFixed(2), // in rupees
      order_currency: currency,
      customer_details: {
        customer_id: orderId,
        customer_email: "naresh2004.m@gmail.com",
        customer_phone: "+91936056511",
      },
    };

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      orderData,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.payment_session_id) {
      res.json({ orderToken: response.data.payment_session_id });
    } else {
      res.status(500).json({
        error: "Unable to create Cashfree order",
        details: response.data,
      });
    }
  } catch (err) {
    console.error(
      "❌ Error creating Cashfree order:",
      err.response?.data || err.message
    );
    res.status(500).json({ error: "Unable to create Cashfree order" });
  }
});

// ---------- Entry Permit ----------
app.post("/api/entry-permit", async (req, res) => {
  const { teamKey } = req.body;

  if (!teamKey) {
    return res
      .status(400)
      .json({ valid: false, message: "Team key is required." });
  }

  const team = await TeamData.findOne({ teamKey });
  if (!team) {
    return res.status(404).json({ valid: false, message: "Team not found." });
  }
  if (team.hasVisited) {
    return res
      .status(400)
      .json({ valid: false, message: "Entry permit has already been used." });
  }

  await TeamData.updateOne({ teamKey }, { hasVisited: true });
  return res.json({
    valid: true,
    message: "Entry permit is valid. User visit Registered✅.",
  });
});

// ---------- Admin Login ----------
app.post("/api/admin-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await AdminData.findOne({ email, password });
    if (!admin) {
      return res
        .status(401)
        .json({ valid: false, message: "Invalid email or password." });
    }
    return res.json({ valid: true, message: "Admin login successful." });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ valid: false, message: "Server error." });
  }
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
