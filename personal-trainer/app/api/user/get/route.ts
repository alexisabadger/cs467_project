import { db } from "@/lib/databaseConnection";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Extract the userId from  header
    const userIdHeader = req.headers.get("x-user-id");

    if (!userIdHeader) {
      return NextResponse.json(
        { success: false, error: "User ID not in request headers." },
        { status: 400 }
      );
    }
    const userId = parseInt(userIdHeader, 10);

    // Call the stored SQL procedure `User_Get()` 
    const [resultSets]: any = await db.query("CALL User_Get(?, ?, ?)", [userId, null, null]);
    const rows = resultSets[0];

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }
    const userName: string = rows[0].UserName;

    return NextResponse.json({ success: true, user: userName });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "server error." },
      { status: 500 }
    );
  }
}