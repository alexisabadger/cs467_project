import { getUserFitnessPlan } from '../../../../../lib/databaseConnection';

export async function GET(request: Request, context: any) {
  try {
    const { params } = context;
    const userId = params?.userId;
    const userIdNum = parseInt(userId);
    
    if (!userIdNum) {
      return Response.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    const plan = await getUserFitnessPlan(userIdNum);
    return Response.json({ resultSets: plan });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}