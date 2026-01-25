import jwt from "jsonwebtoken";

export default function adminAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.admin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
