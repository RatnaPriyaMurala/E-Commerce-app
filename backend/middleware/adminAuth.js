import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({ success: false, message: "Not authorized. Login again." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: "Not authorized. Login again." });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Not authorized. Login again." });
  }
};

export default adminAuth;
