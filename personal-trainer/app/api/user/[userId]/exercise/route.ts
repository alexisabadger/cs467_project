import { db } from '../../../../../lib/databaseConnection';

export async function GET(request: Request, context: any) {
  try {
    const { params } = context;
    const userId = params?.userId;
    const userIdNum = parseInt(userId);
    
    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get('exerciseId');
    
    if (!userIdNum || !exerciseId) {
      return Response.json({ error: 'User ID and Exercise ID required' }, { status: 400 });
    }
    
    const [rows] = await db.execute(`
      SELECT 
        ufp.UserId, ufp.ExerciseId, e.ExerciseEquipmentId, e.FitnessLevelId,
        e.Name AS ExerciseName, e.Description AS ExerciseDescription,
        ufp.ExerciseTime, ufp.Distance, ufp.Sets, ufp.Reps, ufp.Weight
      FROM UserFitnessPlans ufp
      INNER JOIN Exercises e ON e.ExerciseId = ufp.ExerciseId
      WHERE ufp.UserId = ? AND ufp.ExerciseId = ?
    `, [userIdNum, exerciseId]) as any;
    
    return Response.json({ rows });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}