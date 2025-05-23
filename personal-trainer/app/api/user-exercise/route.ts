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
    
    let rows;
    if (exerciseIdParam) {
      const [result]: any = await db.query(
        "SELECT * FROM userexercises WHERE UserId = ? AND ExerciseID = ? ORDER BY ExerciseDate DESC",
        [userIdParam, exerciseIdParam]
      );
      rows = result;
    } else {
      const [result]: any = await db.query(
        "SELECT * FROM userexercises WHERE UserId = ? ORDER BY ExerciseDate DESC",
        [userIdParam]
      );
      rows = result;
    }

    return NextResponse.json({ success: true, rows });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

function formatMySQLDateTime(date: string | Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) throw new Error('Invalid date');
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      exerciseId,
      exerciseDate,
      startTime,
      stopTime,
      distance,
      reps,
      weight
    } = body;

    if (!userId || !exerciseId || !exerciseDate || !startTime || !stopTime) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const formattedStart = formatMySQLDateTime(startTime);
    const formattedStop = formatMySQLDateTime(stopTime);

    const query = `
      INSERT INTO userexercises (
        UserId, ExerciseID, ExerciseDate, ExerciseStartTime, ExerciseStopTime, Distance, Reps, Weight
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId,
      exerciseId,
      exerciseDate,
      formattedStart,
      formattedStop,
      distance || null,
      reps || null,
      weight || null
    ];

    await db.execute(query, values);

    return NextResponse.json({ message: 'Exercise added' }, { status: 200 });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ message: 'Internal Error', error: error.message }, { status: 500 });
  }
}