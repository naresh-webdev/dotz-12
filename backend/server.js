// Importing required modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { Cashfree, CFEnvironment } = require('cashfree-pg');
const nodemailer = require("nodemailer");
const SibApiV3Sdk = require('@sendinblue/client');
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
// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   auth: {
//     user: "955abb001@smtp-brevo.com", // usually your email or login
//     pass: "6mYKXdfatpxU2I01", // API key from Brevo
//   },
// });

const brevo = new SibApiV3Sdk.TransactionalEmailsApi();
brevo.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.EMAIL_SENDER_API);

async function sendConfirmationMail(name, email, teamKey) {
  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(teamKey)}`;

    const sendSmtpEmail = {
      sender: { name: "Team Dotz", email: "symposium@dotzv12.in" },
      to: [{ email, name }],
      subject: "Registration Successful 🎉",
      htmlContent: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>DOTZ Symposium Registration</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: #f5f7fa;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 6px 18px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #4f46e5, #6366f1);
              padding: 20px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 30px;
              color: #333;
            }
            .content h2 {
              color: #4f46e5;
            }
            .qr-section {
              text-align: center;
              margin: 30px 0;
            }
            .qr-section img {
              width: 200px;
              height: 200px;
            }
            .footer {
              background: #f3f4f6;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }
            .highlight {
              font-weight: bold;
              color: #111827;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>DOTZ Symposium 2025</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>We are excited to confirm your registration for the <span class="highlight">DOTZ Symposium</span>!</p>
              
              <p><strong>Event Date:</strong> 15th September, 2025</p>
              <p>Please <strong>save the QR code below</strong>. It will be required for entry verification at the venue.</p>

              <div class="qr-section">
                <img src="${qrUrl}" alt="QR Code for Entry">
              </div>

              <p>We look forward to seeing you at the symposium!</p>
            </div>
            <div class="footer">
              This is an automated email. Please do not reply.<br>
              © 2025 DOTZ Symposium Committee
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await brevo.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Confirmation mail sent to:", email);
  } catch (err) {
    console.error("❌ Error sending mail via Brevo API:", err.message);
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
    // Calculate total amount and add 2% service charge
    const baseAmount = teamData.participantCount * process.env.AMOUNT_PER_HEAD;
    const serviceCharge = baseAmount * 0.04;
    const totalAmount = Math.round((baseAmount + serviceCharge) * 100) / 100; // round to 2 decimals
    
    const orderData = {
      order_amount: totalAmount,
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
    console.log("inside api/payment/verify", req.body);
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
          teamData.paymentId = cashfreeResponse.data.cf_order_id || 'PAYMENT_COMPLETED';
          teamData.paymentMethod = paymentDetails.payment_method;
          teamData.paymentTime = paymentDetails.payment_time;
          teamData.bankReference = paymentDetails.bank_reference;
          console.log(`Payment verified as successful for order ${orderId}`);
          
          await sendConfirmationMail(
            teamData.leaderName,
            teamData.leaderEmail,
            teamData.teamKey
          );
          console.log(`Confirmation email sent to ${teamData.leaderEmail}`);
          
          
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

      
      const baseAmount = teamData.participantCount * process.env.AMOUNT_PER_HEAD;
      const serviceCharge = baseAmount * 0.04;
      const totalAmount = Math.round((baseAmount + serviceCharge) * 100) / 100; // round to 2 decimals
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
          amount: totalAmount,
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
          teamData.paymentId = req.body.data.payment.cf_payment_id || 'PAYMENT_COMPLETED';
          teamData.paymentMethod = req.body.data.payment.payment_group || 'UNKNOWN';
          teamData.paymentTime = req.body.data.payment.payment_time || new Date().toISOString();
          teamData.bankReference = req.body.data.payment.bank_reference || 'N/A';
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

    const baseAmount = teamData.participantCount * process.env.AMOUNT_PER_HEAD;
    const serviceCharge = baseAmount * 0.04;
    const totalAmount = Math.round((baseAmount + serviceCharge) * 100) / 100; // round to 2 decimals

    res.json({
      success: true,
      team: {
        id: teamData._id,
        leaderName: teamData.leaderName,
        email: teamData.email,
        mobileNumber: teamData.leaderPhoneNumber,
        status: teamData.paymentStatus,
        orderId: teamData.orderId,
        amount: totalAmount,
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
