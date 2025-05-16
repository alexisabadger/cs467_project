import { db } from '../../../lib/databaseConnection';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, firstName, lastName, password } = await req.json();

    await db.query('CALL User_Save(?, ?, ?, SHA2(?, 256))', [email, firstName, lastName, password]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}