# 배포 가이드

이 프로젝트는 정적 사이트(SPA)로 빌드되어 다양한 호스팅 서비스에 배포할 수 있습니다.

## 🚀 Firebase Hosting (추천)

이미 Firebase를 사용하고 있으므로 가장 간단합니다.

### 1. Firebase CLI 설치
```bash
npm install -g firebase-tools
```

### 2. Firebase 로그인
```bash
firebase login
```

### 3. Firebase 프로젝트 초기화 (처음 한 번만)
```bash
firebase init hosting
```
- 기존 프로젝트 선택
- Public directory: `.output/public`
- Single-page app: `Yes`
- GitHub Actions: `No` (선택사항)

### 4. .firebaserc 파일 수정
`.firebaserc` 파일에서 `your-firebase-project-id`를 실제 Firebase 프로젝트 ID로 변경하세요.

### 5. 빌드 및 배포
```bash
npm run build
firebase deploy --only hosting
```

또는 한 번에:
```bash
npm run deploy
```

### 6. 환경 변수 설정
Firebase Hosting에서는 환경 변수를 직접 설정할 수 없으므로, 빌드 시점에 환경 변수가 필요합니다.

`.env` 파일을 만들고:
```
NUXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NUXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NUXT_PUBLIC_FCM_VAPID_KEY=your-vapid-key
```

빌드 전에 환경 변수가 로드되도록 해야 합니다.

---

## 🌐 Netlify

### 1. Netlify CLI 설치
```bash
npm install -g netlify-cli
```

### 2. Netlify 로그인
```bash
netlify login
```

### 3. 배포
```bash
npm run build
netlify deploy --prod --dir=.output/public
```

또는 Netlify 웹사이트에서:
- Repository 연결
- Build command: `npm run build`
- Publish directory: `.output/public`

---

## ▲ Vercel

### 1. Vercel CLI 설치
```bash
npm install -g vercel
```

### 2. 배포
```bash
npm run build
vercel --prod
```

또는 Vercel 웹사이트에서:
- Repository 연결
- Framework preset: Nuxt.js
- Build command: `npm run build`
- Output directory: `.output/public`

---

## 📦 GitHub Pages

### 1. GitHub Actions 워크플로우 생성
`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NUXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          NUXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          NUXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
          NUXT_PUBLIC_FCM_VAPID_KEY: ${{ secrets.FCM_VAPID_KEY }}
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./.output/public
```

### 2. GitHub Settings에서 Pages 활성화
- Settings > Pages
- Source: GitHub Actions 선택

---

## ⚙️ 환경 변수 설정

모든 호스팅 서비스에서 환경 변수를 설정해야 합니다:

- **Firebase Hosting**: 빌드 시점에 `.env` 파일 필요
- **Netlify**: Site settings > Environment variables
- **Vercel**: Project settings > Environment Variables
- **GitHub Pages**: Repository settings > Secrets and variables > Actions

---

## 📝 참고사항

- 빌드된 파일은 `.output/public` 디렉토리에 생성됩니다
- SPA 모드이므로 모든 경로를 `index.html`로 리다이렉트해야 합니다
- 환경 변수는 `NUXT_PUBLIC_` 접두사가 붙은 것만 클라이언트에서 사용 가능합니다

