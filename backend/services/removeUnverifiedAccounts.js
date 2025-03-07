/**
 * TODO:
 * - Schedule a cron job to run every 5 minutes.
 * - Identify user accounts that remain unverified for more than 30 minutes.
 * - Delete these unverified accounts from the database.
 * - Log relevant information for debugging and tracking deletions.
 */

const cron = require("node-cron");
const User = require("../models/userModel"); // Correct import statement for User model

const removeUnverifiedAccounts = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Cron job started for removing unverified accounts..."); // Log to indicate the cron job has started
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const result = await User.deleteMany({
        accountVerified: false,
        createdAt: { $lt: thirtyMinutesAgo },
      });
      console.log(`Deleted ${result.deletedCount} unverified accounts.`); // Log the number of deleted accounts
    } catch (error) {
      console.error("Error removing unverified accounts:", error); // Log any errors that occur
    }
  });
};

module.exports = removeUnverifiedAccounts;
