import { getAllExercises } from '../../../lib/databaseConnection';

export async function GET() {
  try {
    const exercises = await getAllExercises();
    return Response.json(exercises);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}