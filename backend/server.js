// Importing required modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { Cashfree, CFEnvironment } = require('cashfree-pg');
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


// ---------- Cashfree Initialization -----------
const cashfree = new Cashfree(
  CFEnvironment.PRODUCTION,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

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
  console.log("inside api/register")
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

    // Validate Cashfree configuration
    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      return res.status(500).json({ 
        message: 'Cashfree configuration is missing. Please check process.env.CASHFREE_APP_ID and process.env.CASHFREE_SECRET_KEY environment variables.' 
      });
    }

    // Generate order ID
    const orderId = generateOrderId();
    teamData.orderId = orderId;

    const newTeam = new TeamData(teamData);
    await newTeam.save();

    
    // Create Cashfree order using SDK
    const orderData = {
      order_amount: teamData.participantCount * process.env.AMOUNT_PER_HEAD,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: `CUST_${Date.now()}`,
        customer_phone: teamData.leaderPhoneNumber,
        customer_name: teamData.leaderName,
        customer_email: teamData.leaderEmail
      },
      order_meta: {
        return_url: `https://dotzv12.in/payment-success?order_id=${orderId}`,
        notify_url: `https://dotz-12-production.up.railway.app/api/payment/webhook`,
        payment_methods: "cc,dc,upi"
      },
    };

    console.log('Creating Cashfree order with data:', orderData);

    const cashfreeResponse = await cashfree.PGCreateOrder(orderData);
    console.log('Cashfree response:', cashfreeResponse.data);

    if (cashfreeResponse.data.payment_session_id) {

      // try {
      //   await sendConfirmationMail(
      //   teamData.leaderName,
      //   teamData.leaderEmail,
      //   teamKey
      // );
      // } catch {
      //   // re("Email sending failed");
      //   return res.status(500).json({ message: "Email sending failed" });
      // }
      console.log("session Id is created")
      return res.status(200).json({
        success: true,
        message: 'Booking created successfully',
        orderId: orderId,
        paymentUrl: cashfreeResponse.data.payment_link,
        paymentSessionId: cashfreeResponse.data.payment_session_id
      });
    } else {
      throw new Error('Failed to create payment session');
    }

  } catch (error) {
    console.error('Register error:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Cashfree API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create booking',
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }} 
);



// POST /api/payment/verify - Verify payment status and return booking data
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    console.log(`Verifying payment for order: ${orderId}`);

    // Get order details from Cashfree using SDK
    const cashfreeResponse = await cashfree.PGFetchOrder(orderId);
    console.log('Cashfree order details:', cashfreeResponse.data);
    
    const orderStatus = cashfreeResponse.data.order_status;
    const paymentDetails = cashfreeResponse.data.payment_details || {};

    // Update booking status in database
    const teamData = await TeamData.findOne({ orderId });
    if (teamData) {
      console.log(`Updating Team ${orderId} from status: ${teamData.paymentStatus} to: ${orderStatus}`);
      
      // Handle different payment statuses
      switch (orderStatus) {
        case 'PAID':
          teamData.paymentStatus = 'paid';
          teamData.paymentId = paymentDetails.payment_id || paymentDetails.auth_id || 'PAYMENT_COMPLETED';
          teamData.paymentMethod = paymentDetails.payment_method;
          teamData.paymentTime = paymentDetails.payment_time;
          teamData.bankReference = paymentDetails.bank_reference;
          console.log(`Payment verified as successful for order ${orderId}`);
          break;
          
        case 'EXPIRED':
          teamData.paymentStatus = 'cancelled';
          console.log(`Payment expired for order ${orderId}`);
          break;
          
        case 'FAILED':
          teamData.paymentStatus = 'failed';
          // booking.paymentMessage = paymentDetails.payment_message;
          console.log(`Payment failed for order ${orderId}`);
          break;
          
        case 'PENDING':
          teamData.paymentStatus = 'pending';
          console.log(`Payment still pending for order ${orderId}`);
          break;
          
        default:
          console.log(`Unknown payment status for order ${orderId}: ${orderStatus}`);
          teamData.paymentStatus = orderStatus.toLowerCase();
      }

      await teamData.save();
      console.log(`Team ${orderId} updated successfully`);

      // Return both verification result and booking data
      res.json({
        success: true,
        orderStatus: orderStatus,
        paymentStatus: teamData.paymentStatus,
        paymentDetails: paymentDetails,
        booking: {
          id: teamData._id,
          leaderName: teamData.leaderName,
          leaderEmail: teamData.leaderEmail,
          mobileNumber: teamData.leaderPhoneNumber,
          orderId: teamData.orderId,
          amount: teamData.participantCount * process.env.AMOUNT_PER_HEAD,
          paymentId: teamData.paymentId,
          paymentMethod: teamData.paymentMethod,
          paymentTime: teamData.paymentTime,
          bankReference: teamData.bankReference,
        }
      });
    } else {
      console.error(`Team not found for orderId: ${orderId}`);
      res.status(404).json({
        success: false,
        message: 'Team not found',
        orderStatus: orderStatus
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Cashfree API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});

// POST /api/payment/webhook - Handle Cashfree webhooks
app.post('/api/payment/webhook', async (req, res) => {
  try {
    console.log('Webhook received:', JSON.stringify(req.body, null, 2));

    const { 
      orderId, 
      orderAmount, 
      orderCurrency, 
      orderStatus, 
      paymentId,
      paymentAmount,
      paymentCurrency,
      paymentStatus,
      paymentMessage,
      paymentTime,
      bankReference,
      authId,
      paymentMethod
    } = req.body;

    if (!req.body.data.order.order_id) {
      console.error('Webhook missing orderId');
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // Update booking status in database
    const teamData = await TeamData.findOne({ orderId });
    if (teamData) {
      console.log(`Updating team ${orderId} from status: ${teamData.paymentStatus} to: ${orderStatus}`);

      // Handle different payment statuses
      switch (orderStatus) {
        case 'PAID':
          teamData.paymentStatus = 'paid';
          teamData.paymentId = paymentId || authId || 'PAYMENT_COMPLETED';
          teamData.paymentMethod = paymentMethod;
          teamData.paymentTime = paymentTime;
          teamData.bankReference = bankReference;
          console.log(`Payment successful for order ${orderId}`);
          break;
          
        case 'EXPIRED':
          teamData.paymentStatus = 'cancelled';
          console.log(`Payment expired for order ${orderId}`);
          break;
          
        case 'FAILED':
          teamData.paymentStatus = 'failed';
          // teamData.paymentMessage = paymentMessage;
          console.log(`Payment failed for order ${orderId}: ${paymentMessage}`);
          break;
          
        case 'PENDING':
          teamData.paymentStatus = 'pending';
          console.log(`Payment pending for order ${orderId}`);
          break;
          
        default:
          console.log(`Unknown payment status for order ${orderId}: ${orderStatus}`);
          teamData.paymentStatus = orderStatus.toLowerCase();
      }

      await teamData.save();
      console.log(`Team ${orderId} updated successfully`);
    } else {
      console.error(`Team not found for orderId: ${orderId}`);
    }

    res.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      orderId: orderId,
      status: orderStatus
    });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      message: 'Failed to process webhook',
      error: error.message 
    });
  }
});

// GET /api/status/:orderId - Get booking status
app.get('/api/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const teamData = await TeamData.findOne({ orderId });

    if (!teamData) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({
      success: true,
      team: {
        id: teamData._id,
        leaderName: teamData.leaderName,
        email: teamData.email,
        mobileNumber: teamData.leaderPhoneNumber,
        status: teamData.paymentStatus,
        orderId: teamData.orderId,
        amount: teamData.participantCount * process.env.AMOUNT_PER_HEAD,
        paymentId: teamData.paymentId,
        paymentMethod: teamData.paymentMethod,
        paymentTime: teamData.paymentTime,
        bankReference: teamData.bankReference,
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ 
      message: 'Failed to get booking status',
      error: error.message 
    });
  }
});



// generate order id
const generateOrderId = () => {
  return 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};
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
