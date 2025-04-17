import { NextResponse } from 'next/server';
import { getVisitorCount, updateVisitorCount } from '@/utils/visitorCounterUtils';

// POST handler for admin sync - can only increase the count, not decrease it
export async function POST(request: Request) {
  // Check for admin key in request (simple security)
  const adminKey = process.env.VISITOR_ADMIN_KEY || 'synthwave-portfolio-admin';
  
  try {
    const body = await request.json();
    
    // Validate auth key and count data
    if (!body.adminKey || body.adminKey !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (typeof body.clientCount !== 'number' || body.clientCount < 0) {
      return NextResponse.json({ error: 'Invalid count' }, { status: 400 });
    }
    
    // Get current server count
    const serverCount = getVisitorCount();
    
    // Only update if client count is higher (never decrease)
    if (body.clientCount > serverCount) {
      updateVisitorCount(body.clientCount);
      return NextResponse.json({ 
        success: true, 
        message: 'Count updated',
        newCount: body.clientCount
      });
    }
    
    // Return current server count if no update needed
    return NextResponse.json({
      success: true,
      message: 'No update needed, server count is higher',
      serverCount
    });
  } catch (error) {
    console.error('Error in sync API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}