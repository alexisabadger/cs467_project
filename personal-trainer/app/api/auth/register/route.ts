import { createUser } from '../../../../lib/databaseConnection';

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, password } = await request.json();
    
    if (!email || !firstName || !lastName || !password) {
      return Response.json({ error: 'All fields required' }, { status: 400 });
    }
    
    const userId = await createUser(email, firstName, lastName, password);
    return Response.json({ success: true, userId }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return Response.json({ success: false, error: 'Email already exists' }, { status: 409 });
    }
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}