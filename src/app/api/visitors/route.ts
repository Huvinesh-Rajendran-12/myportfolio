import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the visitor count file
const visitorFilePath = path.join(process.cwd(), 'visitors.txt');

// Function to get the current visitor count
function getVisitorCount(): number {
  try {
    if (fs.existsSync(visitorFilePath)) {
      const count = parseInt(fs.readFileSync(visitorFilePath, 'utf8').trim(), 10);
      return isNaN(count) ? 0 : count;
    }
    return 0;
  } catch (error) {
    console.error('Error reading visitor count:', error);
    return 0;
  }
}

// Function to update the visitor count
function updateVisitorCount(count: number): void {
  try {
    fs.writeFileSync(visitorFilePath, count.toString(), 'utf8');
  } catch (error) {
    console.error('Error updating visitor count:', error);
  }
}

// GET handler to retrieve current visitor count
export async function GET() {
  const count = getVisitorCount();
  return NextResponse.json({ count });
}

// POST handler to increment visitor count
export async function POST() {
  let count = getVisitorCount();
  count += 1;
  updateVisitorCount(count);
  return NextResponse.json({ count });
}
