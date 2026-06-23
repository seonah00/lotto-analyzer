const fs = require('fs');
const https = require('https');

// 동행복권 API에서 회차별 데이터 수집
function fetchLottoData(drwNo) {
  return new Promise((resolve, reject) => {
    const url = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`;
    https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.returnValue === 'success') {
            resolve({
              drwNo: json.drwNo,
              numbers: [json.drwtNo1, json.drwtNo2, json.drwtNo3, 
                       json.drwtNo4, json.drwtNo5, json.drwtNo6],
              bonus: json.bnusNo,
              date: json.drwNoDate
            });
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      console.warn(`${drwNo}회차 요청 실패:`, err.message);
      resolve(null);
    }).on('timeout', () => {
      console.warn(`${drwNo}회차 요청 타임아웃`);
      resolve(null);
    });
  });
}

async function main() {
  const freqPath = './data/frequency.json';
  const lastUpdatedPath = './data/last-updated.txt';

  // 기존 데이터 로드
  let frequency = {};
  if (fs.existsSync(freqPath)) {
    frequency = JSON.parse(fs.readFileSync(freqPath, 'utf8'));
  }

  // 마지막 업데이트 회차 확인
  let lastUpdated = 1225;
  if (fs.existsSync(lastUpdatedPath)) {
    lastUpdated = parseInt(fs.readFileSync(lastUpdatedPath, 'utf8').trim()) || '1225');
  }

  const startDrwNo = lastUpdated + 1;
  console.log(`📌 마지막 업데이트: ${lastUpdated}회차`);
  console.log(`🔍 새로운 회차 확인: ${startDrwNo}회차부터`);

  let updated = false;
  let drwNo = startDrwNo;
  let maxDrwNo = lastUpdated;

  // 최대 10회차까지 한 번에 확인 (API 부하 방지)
  while (drwNo <= startDrwNo + 10) {
    console.log(`⏳ ${drwNo}회차 데이터 수집 중...`);
    const data = await fetchLottoData(drwNo);

    if (!data) {
      console.log('✅ 더 이상 새로운 회차가 없습니다.');
      break;
    }

    // 번호 빈도 업데이트
    data.numbers.forEach(num => {
      frequency[num.toString()] = (frequency[num.toString()] || 0) + 1;
    });

    console.log(`   ✅ ${drwNo}회차: ${data.numbers.join(', ')} (보너스: ${data.bonus}) | ${data.date}`);
    updated = true;
    maxDrwNo = drwNo;
    drwNo++;

    // API 부하 방지를 위해 500ms 대기
    await new Promise(r => setTimeout(r, 500));
  }

  if (updated) {
    // 데이터 저장
    fs.writeFileSync(freqPath, JSON.stringify(frequency, null, 2));
    fs.writeFileSync(lastUpdatedPath, maxDrwNo.toString());

    // index.html의 frequencyData 업데이트
    updateHtmlFile(frequency);

    console.log(`\n🎉 ${startDrwNo}~${maxDrwNo}회차 데이터 업데이트 완료!`);
    console.log(`📁 저장된 파일: frequency.json, last-updated.txt, index.html`);
  } else {
    console.log('\n⏭️ 이미 최신 데이터입니다. 업데이트할 내용이 없습니다.');
  }
}

function updateHtmlFile(frequency) {
  const htmlPath = './index.html';
  if (!fs.existsSync(htmlPath)) {
    console.warn('⚠️ index.html이 없습니다. HTML 업데이트를 건너뜁니다.');
    return;
  }

  let html = fs.readFileSync(htmlPath, 'utf8');

  // frequencyData 부분 치환
  const entries = Object.entries(frequency)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([k, v]) => `            ${k}:${v}`)
    .join(',\n');

  const regex = /const frequencyData = \{[\s\S]*?\};/;
  const newData = `const frequencyData = {\n${entries}\n        };`;

  if (regex.test(html)) {
    html = html.replace(regex, newData);
    fs.writeFileSync(htmlPath, html);
    console.log('📝 index.html의 frequencyData가 업데이트되었습니다.');
  } else {
    console.warn('⚠️ index.html에서 frequencyData를 찾을 수 없습니다.');
  }
}

main().catch(err => {
  console.error('❌ 오류 발생:', err);
  process.exit(1);
});
