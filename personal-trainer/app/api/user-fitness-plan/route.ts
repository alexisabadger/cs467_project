import { db } from "../../../lib/databaseConnection";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (userId === "null" || userId === null) {
      // Return a 400 Bad Request if userId is missing or invalid
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const [resultSets]: any = await db.query("CALL UserFitnessPlan_Get(?)", [
      userId,
    ]);

    return new Response(JSON.stringify({ resultSets: resultSets[0] }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
