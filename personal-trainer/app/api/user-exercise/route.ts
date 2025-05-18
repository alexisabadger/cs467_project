import { db } from "../../../lib/databaseConnection";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userIdParam = url.searchParams.get("userId");
    const exerciseIdParam = url.searchParams.get("exerciseId");

    const [resultSets]: any = await db.query("CALL User_Exercise_Get(?, ?)", [userIdParam, exerciseIdParam]);
    const rows = resultSets[0];

    return NextResponse.json({ success: true, rows });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
