import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    {
      message: "Logged out successfully",
      token: null,
      user: null,
    },
    { status: 200 }
  );

  // Clear token cookie
  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    httpOnly: true,
    maxAge: 0,
    secure: false,
    sameSite: "lax",
  });

  return response;
}
