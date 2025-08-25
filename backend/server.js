// Importing required modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");


const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");

const TeamData = require("./models/TeamData.Schema");
const AdminData = require("./models/Admin.Schema")

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

// ---------- Razorpay Instance ----------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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
    pass: "6mYKXdfatpxU2I01"      // API key from Brevo
  }
});


async function sendConfirmationMail(name, email, teamKey) {
  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(teamKey)}`;
    await transporter.sendMail({
      from: '"Team Dotz" <symposium@dotzv12.in>',
      to: email,
      subject: "Registration Successful 🎉",
      html: `
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: Arial, sans-serif; overflow: hidden;">
  
        <!-- Header -->
        <div style="background: linear-gradient(90deg, #6a11cb, #2575fc); padding: 20px; text-align: center; color: #fff;">
          <h1 style="margin: 0; font-size: 28px;">Dotz V12</h1>
        </div>
        
        <!-- Body -->
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
        
        <!-- Footer -->
        <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 14px; color: #777;">
          <p style="margin: 0;">Best Regards,<br/><b>Team Dotz</b></p>
        </div>
      </div>
      `
    });
    console.log("Confirmation mail sent to:", email);
  } catch (err) {
    console.error("Error sending mail:", err);
  }
}


// Register team
app.post("/api/register", async (req, res) => {
  try {
    const teamData = req.body;
    // Generate a random UUID key for the team
    const teamKey = uuidv4();
    if (teamData.leaderEvents.includes("Paper Presentation")) {
      const countPaperPresentation = await TeamData.countDocuments({ leaderEvents: "Paper Presentation" })
      teamData.paperPresentationTeamCount = countPaperPresentation + 1;
    } else {
      teamData.paperPresentationTeamCount = 0;
    }
    
    const count = await TeamData.countDocuments({});
    teamData.teamNumber = count + 1; // Auto-increment team number
    teamData.teamKey = teamKey;
    
    console.log("📩 Received team data:", teamData);
    const newTeam = new TeamData(teamData);
    await newTeam.save();
    res.status(201).json({ message: "Team registered successfully", team: newTeam, teamKey });
    // Only send confirmation mail after successful save and response, include QR
    await sendConfirmationMail(teamData.leaderName, teamData.leaderEmail, teamKey);
  } catch (error) {
    console.error("❌ Error saving team data:", error);
    res.status(500).json({
      error: "Failed to register team",
      details: error.message,
    });
  }
});

// ---------- Razorpay: Create Order ----------
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    const options = {
      amount: Number(amount), // amount in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ order });
  } catch (err) {
    console.error("❌ Error creating Razorpay order:", err);
    res.status(500).json({ error: "Unable to create order" });
  }
});

// ---------- Razorpay: Verify Payment ----------
app.post("/api/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ verified: false, message: "Invalid signature" });
    }

    // ✅ At this point, mark the order as paid in DB if needed
    res.json({ verified: true, message: "Payment verified successfully" });
  } catch (err) {
    console.error("❌ Payment verification error:", err);
    res.status(500).json({ verified: false, message: "Verification failed" });
  }
});

// Entry Permit
app.post('/api/entry-permit', async (req, res) => {
  // Logic for handling entry permit requests
  const { teamKey } = req.body;

  if (!teamKey) {
    return res.status(400).json({ valid: false, message: "Team key is required." });
  }

  const team = await TeamData.findOne({ teamKey });
  if (!team) {
    return res.status(404).json({ valid: false, message: "Team not found." });
  }
  if (team.hasVisited) {
    return res.status(400).json({ valid: false, message: "Entry permit has already been used." });
  }
  await TeamData.updateOne({ teamKey }, { hasVisited: true });
  return res.json({ valid: true, message: "Entry permit is valid. User visit Registered✅." });
});

// Admin Login
app.post("/api/admin-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await AdminData.findOne({ email, password });
    if (!admin) {
      return res.status(401).json({ valid: false, message: "Invalid email or password." });
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
