import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

const AdminAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No Access Token Found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "No User Found with this Id" });
    }

    // Check if user has admin role
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin privileges required." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }
};

export default AdminAuth;






