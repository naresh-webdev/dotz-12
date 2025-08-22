// Importing required modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const TeamData = require('./models/TeamData.Schema');
const app = express();
const PORT = 5000;
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('MongoDB connection error:', err));

// Middleware to parse JSON bodies


// Enable CORS for all origins
app.use(cors());

// OR enable CORS for specific origins

// Setting up the root route
app.get('/', (req, res) => {
	res.send('Hello, World!');
});

app.post('/api/register', async (req, res) => {
	try {
		const teamData = req.body;
		console.log("Received team data:", teamData);
		const newTeam = new TeamData(teamData);
		await newTeam.save();
		res.status(201).json({ message: 'Team registered successfully', team: newTeam });
	} catch (error) {
		console.error('Error saving team data:', error);
		res.status(500).json({ error: 'Failed to register team', details: error.message });
	}
});

// Starting the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
