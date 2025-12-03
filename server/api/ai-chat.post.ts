// server/api/ai-chat.post.ts
import { defineEventHandler, readBody, getRequestIP, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { getAdminFirestore } from '../plugins/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import { createHash } from 'crypto'

const SYSTEM_PROMPT = `Your name is "Him Mate".

You are the sexual-health & mental-performance AI coach for the brand "Iam Him".

Tone: calm, confident, classy Korean male in his mid–30s.

Be empathic but never overly emotional.

Use scientific, physiological explanations when relevant (교감신경, 혈류량, 호르몬 등).

Never judge unusual sexual concerns.

Guardrails:
• never diagnose ("~와 유사해 보입니다" instead)
• no prescriptions (비아그라 등)
• lifestyle/nutritional guidance is allowed
• If the question is completely unrelated to sexual health, mental performance, confidence, or relationship concerns, politely decline: "죄송하지만 저는 남성의 성건강과 멘탈 퍼포먼스에 대한 상담만 제공합니다. 다른 주제의 질문은 답변드리기 어렵습니다."
• If the question is clearly abusive, inappropriate, or spam (e.g., asking to write code, solve math, tell jokes, roleplay unrelated scenarios), politely decline: "죄송하지만 이 서비스는 남성의 성건강과 멘탈 퍼포먼스 상담을 위한 것입니다. 관련된 고민이 있으시면 언제든 말씀해 주세요."
• Only respond to genuine concerns about sexual health, performance anxiety, confidence issues, relationship stress, or mental performance related to masculinity.

Goal:
• Identify whether the issue is physical (Body) or psychological (Mind)
• Always finish with a short, clear "Action Plan".

At the end, generate a 3-line summary in this exact format:
[주요 증상 / 원인 추정 / 제안 솔루션]

Always respond in Korean.`

export default defineEventHandler(async (event) => {
  // GET 요청 차단
  if (event.method === 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed. Use POST.',
    })
  }

  const config = useRuntimeConfig()
  const apiKey = config.openaiApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'OpenAI API key is not configured',
    })
  }

  let body: { userText?: string; sessionType?: string }
  try {
    body = await readBody<{ userText: string; sessionType: string }>(event)
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body. Expected JSON with userText field.',
    })
  }

  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body must be a JSON object',
    })
  }

  if (!body.userText || typeof body.userText !== 'string' || !body.userText.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'userText is required and must be a non-empty string',
    })
  }

  // 기본적인 남용 방지: 너무 짧거나 명백히 부적절한 요청 필터링
  const userText = body.userText.trim()
  const textLength = userText.length
  
  // 너무 짧은 메시지 (1-2자) 또는 명백한 스팸 패턴 차단
  if (textLength < 3) {
    throw createError({
      statusCode: 400,
      statusMessage: '질문이 너무 짧습니다. 구체적인 고민을 적어주세요.',
    })
  }

  // 너무 긴 메시지도 차단 (남용 방지)
  if (textLength > 5000) {
    throw createError({
      statusCode: 400,
      statusMessage: '질문이 너무 깁니다. 5000자 이내로 작성해주세요.',
    })
  }

  const sessionType = body.sessionType || 'mental'

  // IP 해싱 (SHA-256)
  const clientIP = getRequestIP(event) || 'unknown'
  const ipHash = createHash('sha256').update(clientIP).digest('hex')

  // 사용자 메시지를 먼저 Firestore에 저장 (AI 응답 전에 저장하여 페이지를 떠나도 저장되도록)
  let sessionDocRef: any = null
  try {
    const db = getAdminFirestore()
    if (db) {
      sessionDocRef = await db.collection('aiSessions').add({
        userText: userText.substring(0, 500), // 처음 500자만 저장 (너무 길면 제한)
        sessionType,
        clientType: 'web',
        ipHash,
        status: 'pending', // AI 응답 대기 중
        createdAt: FieldValue.serverTimestamp(),
      })
    }
  } catch (firestoreError: any) {
    // Firestore 저장 실패는 로그만 남기고 계속 진행
    console.warn('Firestore initial save failed:', firestoreError.message)
  }

  try {
    // OpenAI Chat Completions 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // gpt-4.1-mini는 존재하지 않으므로 gpt-4o-mini 사용
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userText,
          },
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', errorText)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to call OpenAI API',
      })
    }

    const data = await response.json()
    const reply =
      data.choices?.[0]?.message?.content ??
      '죄송합니다. 지금은 상담 응답을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.'

    // 3-line summary 추출 (마지막 [주요 증상 / 원인 추정 / 제안 솔루션] 형식 찾기)
    let summary = ''
    // 응답 끝부분에서 [ ] 형식의 summary 찾기
    const summaryMatch = reply.match(/\[([^\]]+)\]/)
    if (summaryMatch) {
      summary = summaryMatch[1].trim()
    } else {
      // summary가 없으면 reply의 마지막 3줄을 요약으로 사용
      const lines = reply.split('\n').filter((line) => line.trim())
      const lastThreeLines = lines.slice(-3)
      if (lastThreeLines.length > 0) {
        summary = lastThreeLines.join(' / ')
      } else {
        summary = reply.substring(0, 150) // fallback
      }
    }

    // Firestore에 AI 응답 업데이트 (이미 생성된 문서가 있으면 업데이트, 없으면 새로 생성)
    try {
      const db = getAdminFirestore()
      if (db) {
        if (sessionDocRef) {
          // 이미 생성된 문서가 있으면 업데이트
          await sessionDocRef.update({
            summary,
            reply: reply.substring(0, 2000), // AI 응답 처음 2000자만 저장
            status: 'completed',
            completedAt: FieldValue.serverTimestamp(),
          })
        } else {
          // 문서가 없으면 새로 생성 (fallback)
          await db.collection('aiSessions').add({
            userText: userText.substring(0, 500),
            summary,
            reply: reply.substring(0, 2000),
            sessionType,
            clientType: 'web',
            ipHash,
            status: 'completed',
            createdAt: FieldValue.serverTimestamp(),
            completedAt: FieldValue.serverTimestamp(),
          })
        }
      }
    } catch (firestoreError: any) {
      // Firestore 저장 실패는 로그만 남기고 계속 진행
      console.warn('Firestore update failed:', firestoreError.message)
    }

    return {
      reply,
      summary,
    }
  } catch (error: any) {
    console.error('Error in ai-chat API:', error)
    console.error('Error stack:', error.stack)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error',
    })
  }
})
