import { NextResponse } from "next/server";
import pool from "../../../lib/db";
import bcrypt from "bcrypt";
import { AuditEvents } from "../../../lib/audit";

const jwt = require("jsonwebtoken");

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const userExists = await pool.query(
      "SELECT user_id FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return NextResponse.json(
        { message: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, 'user') RETURNING user_id, username, email, role",
      [username, email, hashedPassword]
    );

    const user = newUser.rows[0];

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
        token: token,
        message: "Registration successful",
      },
      { status: 201 }
    );
    await AuditEvents.loginSuccess(user.user_id, user.email);
    // response.cookies.set("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   secure: false, // Changed this to false for development
    //   maxAge: 60 * 60 * 24,
    //   path: "/",
    // });

    return response;
  } catch (err) {
    console.error("Registration Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error during registration" },
      { status: 500 }
    );
  }
}
