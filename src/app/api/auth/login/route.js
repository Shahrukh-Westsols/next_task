import { NextResponse } from "next/server";
import pool from "../../../lib/db";
import bcrypt from "bcrypt";

const jwt = require("jsonwebtoken");

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const userQuery = await pool.query(
      "SELECT user_id, username, email, password, role FROM users WHERE email = $1",
      [email]
    );

    if (userQuery.rows.length === 0) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = userQuery.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json(
      {
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token, // optional for client-side storage
        message: "Login successful",
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      //secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      secure: false, // Changed this to false for development
      maxAge: 60 * 60 * 24, // 1 day
      // maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error during login" },
      { status: 500 }
    );
  }
}
