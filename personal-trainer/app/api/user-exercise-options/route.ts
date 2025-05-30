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
        e.ExerciseId, e.Name AS ExerciseName, e.Description AS ExerciseDescription,
        ee.Name AS ExerciseEquipmentName, l.FitnessLevel,
        e.ExerciseTime, e.Distance, e.Sets, e.Reps, e.Weight
      FROM Exercises e
      INNER JOIN RefExerciseEquipment ee ON e.ExerciseEquipmentId = ee.ExerciseEquipmentId
      INNER JOIN RefFitnessLevel l ON e.FitnessLevelId = l.FitnessLevelId
      LEFT JOIN UserFitnessPlans ufp ON ufp.ExerciseId = e.ExerciseId AND ufp.UserId = ?
      WHERE ufp.ExerciseId IS NULL
      ORDER BY e.Name
    `, [userId]) as any;
    
    return Response.json({ rows });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, exerciseId } = await request.json();
    
    if (!userId || !exerciseId) {
      return Response.json({ error: 'User ID and Exercise ID required' }, { status: 400 });
    }
    
    // Add exercise to user's plan
    const [exerciseData] = await db.execute(`
      SELECT ExerciseTime, Distance, Sets, Reps, Weight 
      FROM Exercises WHERE ExerciseId = ?
    `, [exerciseId]) as any;
    
    if (exerciseData.length === 0) {
      return Response.json({ error: 'Exercise not found' }, { status: 404 });
    }
    
    const exercise = exerciseData[0];
    
    await db.execute(`
      INSERT INTO UserFitnessPlans (UserId, ExerciseId, ExerciseTime, Distance, Sets, Reps, Weight)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [userId, exerciseId, exercise.ExerciseTime, exercise.Distance, exercise.Sets, exercise.Reps, exercise.Weight]);
    
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId, exerciseId } = await request.json();
    
    if (!userId || !exerciseId) {
      return Response.json({ error: 'User ID and Exercise ID required' }, { status: 400 });
    }
    
    await db.execute(`
      DELETE FROM UserFitnessPlans 
      WHERE UserId = ? AND ExerciseId = ?
    `, [userId, exerciseId]);
    
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}