// server/api/save-test-result.post.ts
import { defineEventHandler, readBody, getRequestIP, createError } from 'h3'
import { getAdminFirestore } from '../plugins/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import { createHash } from 'crypto'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed. Use POST.',
    })
  }

  let body: {
    user_id?: string
    q1_score?: number
    q2_score?: number
    q3_score?: number
    q4_score?: number
    q5_score?: number
    total_score?: number
    severity_category?: string
  }
  try {
    body = await readBody(event)
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body.',
    })
  }

  // IP 해싱 (SHA-256)
  const clientIP = getRequestIP(event) || 'unknown'
  const ipHash = createHash('sha256').update(clientIP).digest('hex')

  try {
    const db = getAdminFirestore()
    if (db) {
      await db.collection('iiefTests').add({
        user_id: body.user_id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        test_date: FieldValue.serverTimestamp(),
        q1_score: body.q1_score || 0,
        q2_score: body.q2_score || 0,
        q3_score: body.q3_score || 0,
        q4_score: body.q4_score || 0,
        q5_score: body.q5_score || 0,
        total_score: body.total_score || 0,
        severity_category: body.severity_category || '',
        clientType: 'web',
        ipHash,
      })
    }
  } catch (error: any) {
    console.warn('Failed to save test result:', error.message)
    // Silent fail
  }

  return { success: true }
})

