import { db } from '../../../lib/databaseConnection';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return Response.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const [rows] = await db.execute(`
      SELECT 
        u.UserId, u.FirstName, u.LastName, u.FitnessLevelId,
        r.FitnessLevel
      FROM Users u
      LEFT JOIN RefFitnessLevel r ON u.FitnessLevelId = r.FitnessLevelId
      WHERE u.UserId = ? AND u.IsDeleted = FALSE
    `, [userId]) as any;
    
    return Response.json({ rows });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}