# 점수 이미지 저장 문제 정리

## 문제 현상
- 화면에서는 점수(예: "9점 / 25점")가 정상적으로 표시됨
- 결과저장 버튼을 눌러 이미지로 저장하면 점수 숫자가 사라지고 "점 / 25점"만 표시됨

## 원인 분석
html2canvas가 Vue의 반응형 데이터(`v-text="totalScore"`)를 제대로 캡처하지 못하는 것으로 추정됩니다.
- Vue의 템플릿 바인딩이 html2canvas 스냅샷 시점에서 렌더링되지 않음
- DOM 요소는 존재하지만 텍스트 내용이 비어있거나 흰색으로 블렌드됨

## 시도한 해결 방법들

### 1. onclone 콜백에서 DOM 조작
- **방법**: html2canvas의 `onclone` 콜백에서 클론된 문서의 점수 요소를 찾아 텍스트 강제 설정
- **시도 내용**:
  - `textContent`, `innerText`, `innerHTML` 모두 설정
  - 모든 자식 요소 제거 후 직접 텍스트 노드 추가
  - 스타일 강제 적용 (`fontSize`, `fontWeight`, `color`, `display`, `visibility`, `opacity`)
  - `data-score` 속성으로 요소 찾기
  - 클래스로 요소 찾기
  - 부모 요소의 텍스트로 요소 찾기
- **결과**: 실패 - 점수가 여전히 표시되지 않음

### 2. 캡처 전 DOM 직접 조작
- **방법**: html2canvas 호출 전에 실제 DOM 요소의 텍스트를 강제로 설정
- **시도 내용**:
  - `scoreDisplayElement.value.textContent = scoreValue`
  - `scoreDisplayElement.value.innerText = scoreValue`
  - `scoreDisplayElement.value.innerHTML = scoreValue`
  - 모든 자식 제거 후 텍스트 노드 추가
  - Vue 속성 제거 (`removeAttribute('v-text')`, `removeAttribute('v-html')`)
- **결과**: 실패 - 점수가 여전히 표시되지 않음

### 3. Canvas에 직접 그리기 (getBoundingClientRect 사용)
- **방법**: html2canvas로 캡처한 후, 캔버스에 직접 `fillText()`로 점수 그리기
- **시도 내용**:
  - `getBoundingClientRect()`로 점수 요소의 실제 위치 계산
  - `resultContainer` 기준 상대 좌표로 변환
  - `scale` 적용하여 캔버스 좌표로 변환
  - `strokeText()` + `fillText()`로 테두리와 채우기 함께 사용
- **결과**: 실패 - 점수가 여전히 표시되지 않음

### 4. 고정 위치에 그리기
- **방법**: 계산 없이 캔버스의 고정 위치(중앙, 상단 15%)에 점수 그리기
- **시도 내용**:
  - `centerX = canvas.width / 2`
  - `centerY = canvas.height * 0.15`
  - 폰트 크기 48px * scale
- **결과**: 실패 - 점수가 여전히 표시되지 않음

### 5. 하이브리드 방식 (getBoundingClientRect + fallback)
- **방법**: ref를 찾으면 정확한 위치, 못 찾으면 fallback 위치 사용
- **시도 내용**:
  - `getBoundingClientRect()`로 위치 계산 시도
  - 실패 시 고정 위치 사용
  - 폰트 크기 56px * scale
  - `strokeText()` + `fillText()` 사용
- **결과**: 실패 - 점수가 여전히 표시되지 않음

### 6. 디버깅 로그 추가
- **방법**: 콘솔 로그로 문제 진단
- **시도 내용**:
  - 점수 텍스트 값 로그
  - `scoreDisplayElement` 존재 여부 확인
  - `getBoundingClientRect()` 결과 로그
  - 계산된 좌표 로그
  - html2canvas `logging: true` 활성화
- **결과**: 로그는 정상적으로 출력되지만 점수는 여전히 표시되지 않음

## 현재 코드 상태

### 템플릿
```vue
<div ref="scoreDisplayElement" class="text-5xl sm:text-6xl font-bold mb-2" :data-score="totalScore" v-text="totalScore"></div>
```

### saveResultAsImage 함수
- html2canvas로 `resultContainer` 캡처
- `getBoundingClientRect()`로 점수 요소 위치 계산
- 캔버스에 직접 `strokeText()` + `fillText()`로 점수 그리기
- 폰트: `bold 64px * scale`
- 테두리: `6px * scale`, `rgba(0,0,0,0.5)`
- 채우기: `#ffffff`

## 가능한 원인들

1. **html2canvas 버전 문제**: 특정 버전에서 Vue 반응형 데이터를 제대로 처리하지 못할 수 있음
2. **타이밍 문제**: DOM 렌더링과 html2canvas 캡처 시점의 불일치
3. **CSS 문제**: 특정 CSS 속성(예: `backdrop-filter`, `transform`)이 html2canvas와 충돌
4. **폰트 로딩 문제**: Pretendard 폰트가 html2canvas 캡처 시점에 로드되지 않음
5. **Canvas 렌더링 문제**: `fillText()`가 실제로 실행되지만 다른 레이어에 가려짐

## 제안하는 추가 시도 방법

1. **html2canvas 옵션 추가**:
   - `ignoreElements: (el) => false` - 모든 요소 캡처
   - `removeContainer: false` - 컨테이너 제거하지 않기
   - `foreignObjectRendering: true` - 외부 객체 렌더링 활성화

2. **다른 라이브러리 시도**:
   - `dom-to-image`
   - `html-to-image`
   - `rasterizeHTML`

3. **점수 요소를 별도로 캡처**:
   - 점수 박스만 따로 캡처한 후 메인 이미지에 합성

4. **서버 사이드 렌더링**:
   - Puppeteer나 Playwright로 서버에서 스크린샷

5. **SVG로 변환 후 Canvas에 그리기**:
   - 점수를 SVG로 렌더링한 후 Canvas에 그리기

6. **점수를 이미지로 변환**:
   - 점수 텍스트를 먼저 이미지로 변환한 후 합성

## 현재 파일 위치
- `pages/vitality-test.vue`의 `saveResultAsImage` 함수 (약 721번째 줄)

