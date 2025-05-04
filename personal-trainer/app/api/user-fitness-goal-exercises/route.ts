import { db } from "../../../lib/databaseConnection";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, fitnessLevel, fitnessGoals } = await req.json();

    fitnessGoals.map( async (goal: number) => ( 
        await db.query(
            "CALL UserFitnessGoalExercises(?, ?, ?)",
            [userId, fitnessLevel, goal]
        )
    )); 

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
