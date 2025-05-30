import { authenticateUser } from '../../../../lib/databaseConnection';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 });
    }
    
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const user = await authenticateUser(email, hashedPassword);
    
    if (user) {
      return Response.json({ success: true, user });
    } else {
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}