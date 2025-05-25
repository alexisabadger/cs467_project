import { db } from "../../../lib/databaseConnection";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userIdParam = url.searchParams.get("userId");
    const exerciseDateParam = url.searchParams.get("exerciseDate");

    if (!userIdParam) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }
    
    const [resultSets]: any = await db.query("CALL UserExercise_GetHistory(?, ?, ?, ?, ?)", [userIdParam, null, exerciseDateParam, exerciseDateParam, userIdParam]);
    const rows = resultSets[0];
    
    return NextResponse.json({ success: true, rows }, { status: 200 });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}