/**
 * TODO:
 * - Generate a JWT token for the authenticated user.
 * - Set the token in an HTTP-only cookie with an expiration date.
 * - Configure security options for production (secure flag, sameSite policy).
 * - Send the token along with the user details and success response.
 */


const sendToken = (user, statusCode, message, res) => {
    const token = user.generateToken();
    
    res.status(statusCode)
        .cookie("token", token, {
            expires: new Date(
                Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production", // Secure cookie in production
            // sameSite: "strict", // Prevent CSRF
        })
        .json({
            success: true,
            token,
            user,
            message,
        });
};

module.exports = { sendToken };
