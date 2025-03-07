// TODO: Set up an Express server with environment variable configuration

const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./database/db");
const { errorMiddleware } = require("./middlewares/errorMiddlewares");
const authRouter = require("./routes/authRouter");
const bookRouter = require("./routes/bookRouter");
const borrowRouter = require("./routes/borrowRouter");
const expressFileUpload = require("express-fileupload");
const userRouter = require("./routes/userRouter");
const notifyUsers = require("./services/notifyUsers");
const cloudinary = require("cloudinary").v2;

// Load environment variables from the specified config file
dotenv.config({ path: "./config/config.env" });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET
});



// Initialize the Express application
const app = express();

notifyUsers();
// Connect to MongoDB before setting up routes
connectDB();

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
app.use(expressFileUpload({ useTempFiles: true, tempFileDir: "/tmp/" })); // Parse file uploads

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

// Global error handling middleware
app.use(errorMiddleware);

// Start the server after everything is set up
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
