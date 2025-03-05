/**
 * TODO:
 * - Define a function to calculate fines for overdue books.
 * - Implement a fine of $0.10 per hour after the due date.
 * - Return 0 if the book is returned on or before the due date.
 * - Ensure fine calculation is rounded up to the next full hour.
 * - Export the function for use in the Borrow model or controllers.
 */

const calculateFine = (dueDate) => {
    const finePerHour = 0.1; // 10 cents per hour
    const today = new Date();

    // Check if the book is overdue
    if (today > dueDate) {
        const lateHours = Math.ceil((today - dueDate) / (60 * 60 * 1000)); // Convert ms to hours
        const fine = lateHours * finePerHour;
        return fine;
    }
    
    return 0; // No fine if returned on time
};

module.exports = calculateFine;
