import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    let token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied. No valid token provided." });
    }

    try {
        token = token.split(" ")[1]; // Extract token after "Bearer"
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Ensure the user ID is stored properly
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please log in again." });
        }
        return res.status(400).json({ message: "Invalid Token" });
    }
};

export default authMiddleware;