# 🎯 로또 스마트 분석 추첨기 (자동 업데이트)

동행복권 로또 6/45 역대 당첨 데이터를 기반으로 한 통계 분석 추첨기입니다.
매주 월요일 아침 자동으로 최신 당첨 번호를 수집하여 데이터가 업데이트됩니다.

---

## 🚀 배포 방법 (GitHub Pages)

### 1단계: GitHub 레포지토리 생성
1. [github.com](https://github.com) 에 로그인
2. 오른쪽 상단 `+` → **New repository** 클릭
3. Repository name: `lotto-analyzer` (원하는 이름)
4. **Public** 선택 → **Create repository**

### 2단계: 파일 업로드
1. 생성된 레포지토리에서 **"uploading an existing file"** 클릭
2. 이 ZIP의 압축을 푼 모든 파일을 드래그앤드롭
3. **Commit changes** 클릭

### 3단계: GitHub Pages 활성화
1. 레포지토리 상단 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Pages** 클릭
3. Source 섹션에서 **Deploy from a branch** 선택
4. Branch를 `main` / 폴더를 `/(root)` 로 설정
5. **Save** 클릭

### 4단계: 자동화 확인
1. 상단 **Actions** 탭 클릭
2. `🎱 로또 데이터 자동 업데이트` 워크플로우 확인
3. 오른쪽 **Run workflow** → **Run workflow** 클릭 (수동 테스트)
4. 1~2분 후 완료되면 Pages URL 확인

### 5단계: 접속 주소 확인
- Settings → Pages 에서 `https://[내아이디].github.io/lotto-analyzer/` 확인
- 이 주소를 카카오톡/메모에 저장해두세요!

---

## 🔄 자동 업데이트 동작 방식

| 시간 | 동작 |
|------|------|
| 매주 토요일 밤 | 로또 추첨 방송 |
| 일요일 새벽 | 동행복권 사이트에 결과 게시 |
| 월요일 오전 9시 | GitHub Actions 자동 실행 |
| 월요일 오전 9시 5분 | 최신 데이터 반영된 웹사이트 배포 완료 |

### 수동 업데이트도 가능
Actions 탭 → `🎱 로또 데이터 자동 업데이트` → **Run workflow** 클릭

---

## 📁 파일 구조

```
lotto-analyzer/
├── .github/
│   └── workflows/
│       └── update-lotto.yml    # 자동화 설정 (매주 월요일 실행)
├── scripts/
│   └── update-data.js          # 데이터 수집 스크립트
├── data/
│   ├── frequency.json          # 번호별 출현 빈도 데이터
│   └── last-updated.txt        # 마지막 업데이트 회차
└── index.html                  # 메인 웹사이트
```

---

## 🧠 추첨 전략 설명

| 전략 | 설명 |
|------|------|
| **🔥 핫 넘버** | 역대 가장 많이 나온 번호에 가중치를 줘서 추첨 |
| **❄️ 콜드 넘버** | 적게 나온 번호에 가중치를 줘서 "보정" 추첨 |
| **⚖️ 밸런스** | 홀짝 3:3, 고저 3:3, 연번 적정 수준을 만족하는 조합만 필터링 |
| **🎲 완전 랜덤** | 통계와 무관한 순수 무작위 |

---

## ⚠️ 면책

본 추첨기는 역대 당첨 번호의 통계적 패턴을 분석하여 **참고용**으로 제공합니다.
로또는 확률 게임이며, 과거 데이터가 미래 결과를 보장하지 않습니다.
건전한 복권 문화를 실천해 주세요.

데이터 출처: [동행복권](https://www.dhlottery.co.kr)
