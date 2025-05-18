import { db } from "../../../lib/databaseConnection";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      // optionally add fields below later if needed from form
    } = await req.json();

    // Constants for registration
    const userId = null; // null or 0 for insert
    const userName = email; // you could change this if needed
    const fitnessLevelId = 1; // default for now
    const userTypeId = 1; // default user type
    const currentUserId = null; // no current user creating this (public registration)

    const [resultSets]: any = await db.query(
      "CALL User_Save(?, ?, ?, ?, ?, ?, ?, SHA2(?, 256), ?)",
      [
        userId,
        userName,
        email,
        firstName,
        lastName,
        fitnessLevelId,
        userTypeId,
        password, // will be hashed inside query
        currentUserId,
      ]
    );

    const rows = resultSets[0];

    if (rows.length > 0 && rows[0].UserId) {
      return NextResponse.json({ success: true, data: rows });
    } else {
      return NextResponse.json({ success: false, message: "Failed to create user." });
    }
  } catch (error: any) {
    console.error("User creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
