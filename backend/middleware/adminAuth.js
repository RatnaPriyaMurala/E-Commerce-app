import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
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

        if (
            !process.env.JWT_SECRET ||
            !process.env.ADMIN_EMAIL
        ) {
            console.error(
                "Admin authentication environment variables are missing"
            );

            return res.status(500).json({
                success: false,
                message:
                    "Admin authentication is not configured",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const adminEmail =
            String(process.env.ADMIN_EMAIL)
                .trim()
                .toLowerCase();

        const tokenEmail =
            String(decoded?.email || "")
                .trim()
                .toLowerCase();

        if (!tokenEmail || tokenEmail !== adminEmail) {
            return res.status(403).json({
                success: false,
                message: "Admin access required",
            });
        }

        req.admin = decoded;

        next();
    } catch (error) {
        console.error(
            "Admin authentication error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired admin token",
        });
    }
};

export default adminAuth;