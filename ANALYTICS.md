# 통계 확인 방법

이 프로젝트는 Firestore를 사용하여 다음 통계를 수집합니다:

## 수집되는 데이터

### 1. 웹사이트 방문자 수
- **컬렉션**: `pageViews`
- **위치**: 각 페이지(`index`, `vitality-test`, `chat`) 로드 시 자동 저장
- **필드**:
  - `page`: 페이지 이름 ('index', 'vitality-test', 'chat')
  - `timestamp`: 방문 시간
  - `clientType`: 'web'

### 2. 테스트 완료 수
- **컬렉션**: `iiefTests`
- **위치**: 테스트 완료 시 자동 저장
- **필드**:
  - `user_id`: 익명 세션 ID
  - `test_date`: 테스트 완료 시간
  - `q1_score` ~ `q5_score`: 각 문항 점수
  - `total_score`: 총점
  - `severity_category`: 카테고리
  - `clientType`: 'web'

### 3. 심리 상담 챗 사용 수
- **컬렉션**: `aiSessions`
- **위치**: AI 상담 시작 시 자동 저장
- **필드**:
  - `userText`: 사용자 질문
  - `summary`: AI 요약
  - `reply`: AI 응답
  - `sessionType`: 'mental' 또는 'sexual'
  - `clientType`: 'web'
  - `ipHash`: IP 해시 (익명)
  - `createdAt`: 생성 시간

## 통계 확인 방법

### 방법 1: Firebase Console에서 확인
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택
3. Firestore Database 메뉴 클릭
4. 각 컬렉션의 문서 수 확인:
   - `pageViews` 컬렉션의 문서 수 = 총 페이지 방문 수
   - `iiefTests` 컬렉션의 문서 수 = 테스트 완료 수
   - `aiSessions` 컬렉션의 문서 수 = AI 상담 사용 수

### 방법 2: Firestore 쿼리로 확인
```javascript
// 총 방문자 수 (중복 제거하려면 user_id나 ipHash로 그룹화)
const pageViews = await db.collection('pageViews').get()
console.log('총 방문 수:', pageViews.size)

// 테스트 완료 수
const tests = await db.collection('iiefTests').get()
console.log('테스트 완료 수:', tests.size)

// AI 상담 사용 수
const sessions = await db.collection('aiSessions').get()
console.log('AI 상담 사용 수:', sessions.size)
```

### 방법 3: Google Looker Studio 연동
Firestore 데이터를 Google Looker Studio에 연결하여 시각화할 수 있습니다.

## 주의사항
- 모든 데이터는 익명으로 수집됩니다
- IP는 해시 처리되어 저장됩니다
- 개인정보는 수집하지 않습니다

