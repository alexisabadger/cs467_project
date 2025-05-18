import { db } from '@/lib/databaseConnection';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (userId === 'null' || userId === null)  {
      // Return a 400 Bad Request if userId is missing or invalid
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

     const [resultSets]: any = await db.query("CALL User_Get(?, ?, ?)", [userId, null, null]);
     const rows = resultSets[0];

    if (!rows || rows.length === 0) {
        return NextResponse.json(
          { success: false, error: "User not found." },
          { status: 404 }
        );
      }
      const userName: string = rows[0].UserName;
  
      return NextResponse.json({ success: true, user: userName });
    } catch (error: unknown) {
      const err = error as Error;
      return NextResponse.json(
        { success: false, error: err.message || "server error." },
        { status: 500 }
      );
    }
  }