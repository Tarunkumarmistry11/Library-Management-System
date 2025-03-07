const cron = require("node-cron");
const User = require("../models/userModel"); // Correct import statement for User model

const removeUnverifiedAccounts = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Cron job started for removing unverified accounts..."); // Log to indicate the cron job has started
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const result = await User.deleteMany({
        accountVerified: false,
        createdAt: { $lt: thirtyMinutesAgo }
      });
      console.log(`Deleted ${result.deletedCount} unverified accounts.`); // Log the number of deleted accounts
    } catch (error) {
      console.error("Error removing unverified accounts:", error); // Log any errors that occur
    }
  });
};

module.exports = removeUnverifiedAccounts;