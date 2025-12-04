// server/api/page-view.post.ts
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

  let body: { page?: string; user_id?: string }
  try {
    body = await readBody<{ page: string; user_id?: string }>(event)
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body. Expected JSON with page field.',
    })
  }

  if (!body.page || typeof body.page !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'page is required and must be a string',
    })
  }

  // IP 해싱 (SHA-256)
  const clientIP = getRequestIP(event) || 'unknown'
  const ipHash = createHash('sha256').update(clientIP).digest('hex')

  try {
    const db = getAdminFirestore()
    if (db) {
      await db.collection('pageViews').add({
        page: body.page,
        user_id: body.user_id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: FieldValue.serverTimestamp(),
        clientType: 'web',
        ipHash,
      })
      console.log('Page view saved:', { page: body.page, user_id: body.user_id })
    } else {
      console.warn('Firestore not initialized, page view not saved')
    }
  } catch (error: any) {
    console.error('Failed to save page view:', error.message, error.stack)
    // Silent fail - don't interrupt user experience
  }

  return { success: true }
})

