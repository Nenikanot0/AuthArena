import jwt from "jsonwebtoken";
import { jwtUsers, refreshTokens } from "../../../data/jwtUsers.js";

export const refreshAccessToken = (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    if (!refreshTokens.includes(token)) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
        
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const user = jwtUsers.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User no longer exists" });
    }

    const payload = { id: user.id,email: user.email };
    const newAccessToken = jwt.sign(payload,process.env.ACCESS_SECRET,{ expiresIn: "15m" });

    return res.json({ 
      accessToken: newAccessToken 
    });

  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};