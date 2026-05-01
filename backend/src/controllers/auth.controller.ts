import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";

/**
 * Signup
 */
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: "All fields are required" });
      return;
    }

    const result = await authService.signup(name, email, password);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password required" });
      return;
    }

    const result = await authService.login(email, password);

    res.json({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current logged-in user
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const user = await authService.getMe(userId);

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Google OAuth callback
 */
export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as any;

    if (!user) {
      res.status(401).json({ success: false, message: "Google auth failed" });
      return;
    }

    const result = await authService.generateTokenForUser(user);

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:3000";

    res.redirect(
      `${frontendUrl}/auth/callback?token=${result.token}&user=${encodeURIComponent(
        JSON.stringify(result.user)
      )}`
    );
  } catch (err) {
    next(err);
  }
};