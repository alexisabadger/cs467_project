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

    let query = `
      SELECT 
        ue.UserExerciseId, ue.ExerciseId, e.Name AS ExerciseName,
        ue.ExerciseDate, ue.ExerciseStartTime, ue.ExerciseStopTime,
        ue.Distance, ue.Reps, ue.Weight
      FROM UserExercises ue
      INNER JOIN Exercises e ON ue.ExerciseId = e.ExerciseId
      WHERE ue.UserId = ?
    `;
    
    const params = [userIdParam];
    
    if (exerciseDateParam) {
      query += ' AND DATE(ue.ExerciseDate) = ?';
      params.push(exerciseDateParam);
    }
    
    query += ' ORDER BY ue.ExerciseDate DESC';
    
    const [rows] = await db.execute(query, params) as any;

    return NextResponse.json({ success: true, rows }, { status: 200 });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}