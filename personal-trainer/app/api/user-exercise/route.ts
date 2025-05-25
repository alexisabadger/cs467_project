import { db } from "../../../lib/databaseConnection";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userIdParam = url.searchParams.get("userId");
    const exerciseIdParam = url.searchParams.get("exerciseId");

    if (!userIdParam) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }
    
    const [resultSets]: any = await db.query("CALL User_Exercise_Get(?, ?)", [userIdParam, exerciseIdParam]);
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      exerciseId,
      exerciseDate,
      exerciseTime,
      distance,
      reps,
      weight
    } = body;

    if (!userId || !exerciseId) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const [resultSets]: any = await db.query("CALL UserExercise_Save(?, ?, ?, ?, ?, ?, ?, ?, ?)", [null, userId, exerciseId, exerciseDate, exerciseTime, distance, reps, weight, userId]);
    const rows = resultSets[0];

    return NextResponse.json({ success: true, rows }, { status: 200 });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ message: 'Internal Error', error: error.message }, { status: 500 });
  }
}