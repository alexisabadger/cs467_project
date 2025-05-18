import { db } from "../../../lib/databaseConnection";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
    } = await req.json();

    const userId = null; 
    const userName = email; 
    const fitnessLevelId = 1; 
    const userTypeId = 1; 
    const currentUserId = null;

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
        password, 
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
