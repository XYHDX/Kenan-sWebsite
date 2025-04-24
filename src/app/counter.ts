'use server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { headers } from 'next/headers'

interface AccessLog {
  ip: string;
  path: string;
  accessed_at: string;
}

interface CounterResult {
  count: number;
  recentAccess: AccessLog[];
}

// Increment the counter and log the access
export async function incrementAndLog(): Promise<CounterResult> {
  try {
    const cf = await getCloudflareContext()
    const headersList = await headers()

    // Insert into counters table with increment or create new entry
    const { results: countResults, error: countError } = await cf.env.DB.prepare(
      'INSERT INTO counters (name, value) VALUES (?, 1) ON CONFLICT (name) DO UPDATE SET value = value + 1 RETURNING value'
    )
      .bind('page_views')
      .all()

    if (countError) {
      console.error('Error incrementing counter:', countError)
      return { count: 0, recentAccess: [] }
    }

    // Log access with IP and path information
    try {
      const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
      const path = headersList.get('x-forwarded-host') || '/'
      
      await cf.env.DB.prepare('INSERT INTO access_logs (ip, path, accessed_at) VALUES (?, ?, datetime())')
        .bind(ip, path)
        .run()
    } catch (logError) {
      console.error('Error logging access:', logError)
      // Continue execution even if logging fails
    }

    // Get recent access logs
    const { results: logs, error: logsError } = await cf.env.DB.prepare(
      'SELECT * FROM access_logs ORDER BY accessed_at DESC LIMIT 5'
    ).all()

    if (logsError) {
      console.error('Error fetching access logs:', logsError)
      return { 
        count: typeof countResults[0]?.value === 'number' ? countResults[0].value : 0, 
        recentAccess: [] 
      }
    }

    return {
      count: typeof countResults[0]?.value === 'number' ? countResults[0].value : 0,
      recentAccess: logs as unknown as AccessLog[]
    }
  } catch (error) {
    console.error('Unexpected error in incrementAndLog:', error)
    return { count: 0, recentAccess: [] }
  }
}

// Get the current count and recent access logs
export async function getStats(): Promise<CounterResult> {
  try {
    const cf = await getCloudflareContext()
    
    // Get current count value
    const { results: count, error: countError } = await cf.env.DB.prepare(
      'SELECT value FROM counters WHERE name = ?'
    )
      .bind('page_views')
      .all()

    if (countError) {
      console.error('Error fetching counter:', countError)
      return { count: 0, recentAccess: [] }
    }

    // Get recent access logs
    const { results: logs, error: logsError } = await cf.env.DB.prepare(
      'SELECT accessed_at FROM access_logs ORDER BY accessed_at DESC LIMIT 5'
    ).all()

    if (logsError) {
      console.error('Error fetching access logs:', logsError)
      return { 
        count: typeof count[0]?.value === 'number' ? count[0].value : 0, 
        recentAccess: [] 
      }
    }

    return {
      count: typeof count[0]?.value === 'number' ? count[0].value : 0,
      recentAccess: logs as unknown as AccessLog[]
    }
  } catch (error) {
    console.error('Unexpected error in getStats:', error)
    return { count: 0, recentAccess: [] }
  }
}
