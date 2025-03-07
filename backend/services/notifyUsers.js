/**
 * TODO:
 * - Schedule a cron job to run every 30 minutes.
 * - Fetch borrowers with overdue books who haven't been notified.
 * - Send email reminders to users about overdue books.
 * - Mark users as notified after sending the email.
 * - Log relevant information for debugging.
 */

const cron = require("node-cron");
const Borrow = require("../models/borrowModel"); // Correct import statement for Borrow model
const sendEmail = require("../utils/sendEmail");

const notifyUsers = () => {
  cron.schedule(" */30 * * * *", async () => {
    console.log("Cron job started..."); // Log to indicate the cron job has started
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const borrowers = await Borrow.find({
        dueDate: { $lt: oneDayAgo },
        returnDate: null,
        notified: false,
      }).populate("user"); // Populate the user field

      console.log(`Found ${borrowers.length} borrowers to notify.`); // Log the number of borrowers found

      for (const element of borrowers) {
        if (element.user && element.user.email) {
          await sendEmail({
            email: element.user.email, // Use the email of the user fetched from the database
            subject: "Book return reminder",
            message: `Hi there! ${
              element.user.name
            }, this is a reminder to return the book you borrowed from our library. The due date was ${element.dueDate.toDateString()}. Please return the book as soon as possible to avoid any fines. Thank you!`,
          });
          element.notified = true;
          await element.save();
          console.log(`Email sent to ${element.user.email}`); // Log email sent
        } else {
          console.log("Element user or email not defined."); // Log if user or email is not defined
        }
      }
    } catch (error) {
      console.error("Error notifying users:", error);
    }
  });
};

module.exports = notifyUsers;
