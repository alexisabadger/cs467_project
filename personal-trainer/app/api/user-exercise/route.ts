import { saveUserExercise, db } from '../../../lib/databaseConnection';
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userIdParam = url.searchParams.get("userId");
    const exerciseIdParam = url.searchParams.get("exerciseId");

    if (!userIdParam || !exerciseIdParam) {
      return NextResponse.json(
        { success: false, error: "Missing userId or exerciseId" },
        { status: 400 }
      );
    }

    const [rows] = await db.execute(`
      SELECT 
        ufp.UserId, ufp.ExerciseId, e.ExerciseEquipmentId, e.FitnessLevelId,
        e.Name AS ExerciseName, e.Description AS ExerciseDescription,
        ufp.ExerciseTime, ufp.Distance, ufp.Sets, ufp.Reps, ufp.Weight
      FROM UserFitnessPlans ufp
      INNER JOIN Exercises e ON e.ExerciseId = ufp.ExerciseId
      WHERE ufp.UserId = ? AND ufp.ExerciseId = ?
    `, [userIdParam, exerciseIdParam]) as any;

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

    const userExerciseId = await saveUserExercise(
      0, // 0 means insert new
      parseInt(userId),
      parseInt(exerciseId),
      exerciseDate,
      null, // exerciseStartTime
      null, // exerciseStopTime
      distance ? parseFloat(distance) : null,
      reps ? parseInt(reps) : null,
      weight ? parseFloat(weight) : null
    );

    return NextResponse.json({ success: true, userExerciseId }, { status: 200 });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ message: 'Internal Error', error: error.message }, { status: 500 });
  }
}