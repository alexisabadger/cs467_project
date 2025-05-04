import { db } from "../../../lib/databaseConnection";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    await db.query(
        "CALL UserFitnessPlan_Get(?)",
        [userId]
    )

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
