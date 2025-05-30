import { getUserExerciseHistory } from '../../../../../lib/databaseConnection';

export async function GET(request: Request, context: any) {
  try {
    const { params } = context;
    const userId = params?.userId;
    const userIdNum = parseInt(userId);
    
    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get('exerciseId') ? parseInt(searchParams.get('exerciseId')!) : null;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (!userIdNum) {
      return Response.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    const history = await getUserExerciseHistory(userIdNum, exerciseId, startDate, endDate);
    return Response.json(history);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}