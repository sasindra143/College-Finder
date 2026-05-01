import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Extend Request locally (safe fix)
 */
interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "No token provided",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({
        success: false,
        message: "JWT secret not configured",
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as { userId: string };

    // ✅ FIX HERE (cast req safely)
    (req as AuthRequest).userId = decoded.userId;

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};