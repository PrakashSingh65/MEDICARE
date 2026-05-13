import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token
             

        if(!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized -Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error: ", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}