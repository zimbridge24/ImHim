// server/plugins/firebase-admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';

let firestoreInstance: ReturnType<typeof getFirestore> | null = null;

// Firestore 인스턴스를 가져오는 함수 (실패 시 null 반환)
export const getAdminFirestore = (): ReturnType<typeof getFirestore> | null => {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  try {
    if (getApps().length === 0) {
      const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'i-mhim';
      
      let credential;
      
      // Vercel 환경 변수에서 서비스 계정 키 확인 (우선순위 1)
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
          const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
          credential = cert(serviceAccount);
        } catch (parseError) {
          console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', parseError);
        }
      }
      
      // 파일 시스템에서 서비스 계정 키 확인 (우선순위 2)
      if (!credential) {
        try {
          const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
                                      join(process.cwd(), 'serviceAccountKey.json');
          const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
          credential = cert(serviceAccount);
        } catch (fileError) {
          // 파일이 없으면 프로젝트 ID만으로 시도 (프로덕션 환경에서 작동)
          console.warn('Service account key not found, using project ID only');
          credential = undefined;
        }
      }

      initializeApp({
        projectId,
        credential,
      });
    }

    firestoreInstance = getFirestore();
    return firestoreInstance;
  } catch (error: any) {
    // Firebase Admin 초기화 실패 시 null 반환
    console.warn('Firebase Admin initialization failed:', error.message);
    return null;
  }
};

// 👉 Nuxt/Nitro 플러그인 요구사항: default export
export default () => {
  // 플러그인 로드 시 초기화는 하지 않고, 필요할 때 lazy initialization
};
