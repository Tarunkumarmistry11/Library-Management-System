// TODO: Set up an Express server with environment variable configuration

const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./database/db");
const { errorMiddleware } = require("./middlewares/errorMiddlewares");


// Load environment variables from the specified config file
dotenv.config({ path: "./config/config.env" });

// Initialize the Express application
const app = express();

// Set up CORS middleware
app.use(
    cors({
      origin: [process.env.FRONTEND_URL], // Allow requests from the specified frontend URL
      methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
      credentials: true, // Allow cookies and credentials to be sent with requests
    })
  );


// Define the port, with a fallback to 3000 if not specified in environment variables
const PORT = process.env.PORT || 3000;

// Add middleware
app.use(cookieParser()); // Parse cookies from incoming requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Start mongoDB 
console.log("Attempting to connect mongoDB");
connectDB();

// Global error handling middleware
app.use(errorMiddleware);