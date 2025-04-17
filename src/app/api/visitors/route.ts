import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  getVisitorCount, 
  incrementVisitorCount, 
  generateVisitorId 
} from '@/utils/visitorCounterUtils';

// GET handler to retrieve current visitor count
export async function GET() {
  const count = getVisitorCount();
  return NextResponse.json({ count });
}

// POST handler to increment visitor count if this is a new visitor
export async function POST() {
  const cookieStore = cookies();
  const visitorId = cookieStore.get('visitor-id');
  
  let count = getVisitorCount();
  let hasIncremented = false;
  
  // Only increment if no visitor cookie exists
  if (!visitorId) {
    count = incrementVisitorCount();
    hasIncremented = true;
  }
  
  // Create a response
  const response = NextResponse.json({ 
    count,
    // Let the client know if this was a new visitor
    isNewVisitor: hasIncremented
  });
  
  // Set visitor cookie if it doesn't exist yet
  if (!visitorId) {
    // Set cookie to expire in 30 days
    response.cookies.set({
      name: 'visitor-id',
      value: generateVisitorId(),
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'strict'
    });
  }
  
  return response;
}