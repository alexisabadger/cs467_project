import { db } from '../../../lib/databaseConnection';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, fitnessLevel, fitnessGoals } = await req.json();

    console.log('=== SURVEY SUBMISSION ===');
    console.log('UserId:', userId);
    console.log('Fitness Level:', fitnessLevel);
    console.log('Fitness Goals:', fitnessGoals);
    console.log('Goals Length:', fitnessGoals.length);

    // Validate user inputs
    if (!userId || fitnessLevel === null 
                || !Array.isArray(fitnessGoals)) {
      console.error('Invalid input data:', { userId, fitnessLevel, fitnessGoals });
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Step 1: Delete existing fitness plans for the user
    console.log('Deleting existing plans for user:', userId);
    const [deleteResult] = await db.query('DELETE FROM UserFitnessPlans WHERE UserId = ?', [userId]) as any;
    console.log('Delete result:', deleteResult);

    // Step 2: Insert exercises for each fitness goal
    let totalExercisesAdded = 0;

    for (let i = 0; i < fitnessGoals.length; i++) {
      const goal = fitnessGoals[i];
      console.log(`Processing goal ${i + 1}/${fitnessGoals.length}: ${goal}`);
      
      try {
        const [insertResult] = await db.query(`
          INSERT INTO UserFitnessPlans (ExerciseId, UserId, ExerciseTime, Distance, Sets, Reps, Weight)
          SELECT
            fpe.ExerciseId,
            ? as UserId,
            e.ExerciseTime,
            e.Distance,
            e.Sets,
            e.Reps,
            e.Weight
          FROM FitnessGoalExercises AS fpe
          INNER JOIN FitnessGoals AS f ON f.FitnessGoalId = fpe.FitnessGoalId
          INNER JOIN Exercises AS e ON e.ExerciseId = fpe.ExerciseId
          INNER JOIN RefFitnessLevel AS l ON l.FitnessLevelId = e.FitnessLevelId
          WHERE
            l.FitnessLevelId <= ? AND
            f.FitnessGoalId = ?
        `, [userId, fitnessLevel, goal]) as any;

        console.log(`Goal ${goal} - Exercises added:`, insertResult);

        // Exercises added for this goal
        if (insertResult && insertResult.affectedRows) {
          totalExercisesAdded += insertResult.affectedRows;
          console.log(`Added ${insertResult.affectedRows} exercises for goal ${goal}`);
        }
      } catch (goalError: any) {
        console.error(`Error processing goal ${goal}:`, goalError);
      }
    }

    console.log(`Total exercises added across all goals: ${totalExercisesAdded}`);

    // Step 3: Update user's fitness level
    console.log(`Updating user ${userId} fitness level to ${fitnessLevel}`);

    const [updateResult] = await db.query(
      'UPDATE Users SET FitnessLevelId = ? WHERE UserId = ?',
      [fitnessLevel, userId]
    ) as any;
    console.log('Update result:', updateResult);

    // Verify if any rows were updated
    const [verifyResult] = await db.query(
      'SELECT FitnessLevelId FROM Users WHERE UserId = ?',
      [userId]
    ) as any;
    console.log('User fitness level after update: ', verifyResult);

    console.log('Success! Fitness plan created.');
    return NextResponse.json({ 
      success: true,
      exercisesAdded: totalExercisesAdded,
      fitnessLevel: fitnessLevel,
    });

  } catch (error: any) {
    console.error('Detailed error in UserFitnessGoalExercises:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}