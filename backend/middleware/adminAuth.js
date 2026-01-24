import jwt from "jsonwebtoken";

export default function adminAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.admin) return res.status(403).json({ message: "Forbidden" });
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
