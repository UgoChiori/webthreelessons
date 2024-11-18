const express = require('express');
const app = express();

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Start your server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
