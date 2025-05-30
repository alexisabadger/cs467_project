import { getUser } from '../../../../../lib/databaseConnection';

export async function GET(request: Request, context: any) {
  try {
    const { params } = context;
    const userId = params?.userId;
    const userIdNum = parseInt(userId);
    
    if (!userIdNum) {
      return Response.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    const user = await getUser(userIdNum);
    return Response.json({ rows: user ? [user] : [] });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}