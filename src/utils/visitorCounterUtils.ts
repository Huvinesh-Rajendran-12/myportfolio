import fs from 'fs';
import path from 'path';

// Path to the visitor count file
const visitorFilePath = path.join(process.cwd(), 'visitors.txt');

/**
 * Get the current visitor count from the file system
 * @returns The current visitor count, or 0 if the file doesn't exist
 */
export function getVisitorCount(): number {
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

/**
 * Update the visitor count in the file system
 * @param count The new visitor count
 */
export function updateVisitorCount(count: number): void {
  try {
    fs.writeFileSync(visitorFilePath, count.toString(), 'utf8');
  } catch (error) {
    console.error('Error updating visitor count:', error);
  }
}

/**
 * Increment the visitor count and return the new value
 * @returns The new visitor count
 */
export function incrementVisitorCount(): number {
  const currentCount = getVisitorCount();
  const newCount = currentCount + 1;
  updateVisitorCount(newCount);
  return newCount;
}

/**
 * Generate a unique visitor ID
 * @returns A random visitor ID string
 */
export function generateVisitorId(): string {
  return `visitor-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}
