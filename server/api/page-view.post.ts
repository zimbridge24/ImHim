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

  let body: { page?: string }
  try {
    body = await readBody<{ page: string }>(event)
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
        timestamp: FieldValue.serverTimestamp(),
        clientType: 'web',
        ipHash,
      })
    }
  } catch (error: any) {
    console.warn('Failed to save page view:', error.message)
    // Silent fail - don't interrupt user experience
  }

  return { success: true }
})

