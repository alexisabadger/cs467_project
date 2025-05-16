import { db } from '@/lib/databaseConnection';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userIdParam = url.searchParams.get("userId");

    if (!userIdParam || userIdParam === 'null') {
      // Return a 400 Bad Request if userId is missing or invalid
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const userId = Number(userIdParam);
     // Call the stored SQL procedure `User_Get()` 
     const [resultSets]: any = await db.query("CALL User_Get(?, ?, ?)", [userId, null, null]);
     const rows = resultSets[0];

    if (!rows || rows.length === 0) {
        return NextResponse.json(
          { success: false, error: "User not found." },
          { status: 404 }
        );
      }
      const fitnessLevelId: number = rows[0].FitnessLevelId;
  
      return NextResponse.json({ success: true, fitnessLevelId });
    } catch (error: unknown) {
      const err = error as Error;
      return NextResponse.json(
        { success: false, error: err.message || "server error." },
        { status: 500 }
      );
    }
  }