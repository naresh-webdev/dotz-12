// Importing required modules
const express = require('express');
const app = express();
const PORT = 3000;

// Setting up the root route
app.get('/', (req, res) => {
	res.send('Hello, World!');
});

// Starting the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
