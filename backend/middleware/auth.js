import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
    try {
        const authHeader =
            req.headers.authorization;

        const token =
            req.headers.token ||
            (
                authHeader &&
                authHeader.startsWith("Bearer ")
                    ? authHeader.split(" ")[1]
                    : null
            );

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please login again.",
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error(
                "JWT_SECRET is missing from environment variables"
            );

            return res.status(500).json({
                success: false,
                message: "Server authentication is not configured",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded?.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token",
            });
        }

        req.userId = decoded.id;

        next();
    } catch (error) {
        console.error(
            "Authentication error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export default authUser;