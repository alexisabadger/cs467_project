import { db } from "../../../lib/databaseConnection";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const [resultSets]: any = await db.query(
      "CALL User_Authenticate(?, ?, SHA2(?, 256))",
      [null, email, password]
    );

    const rows = resultSets[0];

    if (
      rows.length > 0 &&
      (rows[0].UserId != null || rows[0].UserId != undefined)
    ) {
      return NextResponse.json({ success: true, data: rows });
    } else {
      return NextResponse.json({ success: false, data: rows });
    }
  } catch (error: any) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
