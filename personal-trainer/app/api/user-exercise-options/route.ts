import { db } from "../../../lib/databaseConnection";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (userId === "null") {
      // Return a 400 Bad Request if userId is missing or invalid
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const [resultSets]: any = await db.query(
      "CALL UserExerciseOptions_Get(?)",
      [userId]
    );

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

export async function POST(req: Request) {
  try {
    const { userId, exerciseId } = await req.json();
    console.log("User ID: ", userId, " Exercise ID: ", exerciseId);

    await db.query("CALL UserExercise_Add(?, ?)", [userId, exerciseId]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId, exerciseId } = await req.json();

    await db.query("CALL UserExercise_Delete(?, ?)", [userId, exerciseId]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { userId, exerciseId, exerciseTime, distance, sets, reps, weight } =
      await req.json();

    await db.query("CALL UserExercise_Update(?, ?, ?, ?, ?, ?, ?)", [
      userId,
      exerciseId,
      exerciseTime,
      distance,
      sets,
      reps,
      weight,
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
