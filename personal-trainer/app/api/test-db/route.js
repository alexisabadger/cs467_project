import { db } from '../../../lib/databaseConnection';

export async function GET() {
  try {
    const [rows] = await db.execute('SELECT 1 as test');
    return Response.json({ success: true, data: rows });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}