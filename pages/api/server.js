const http = require('http');
const https = require('https');

const TEAM_ID = 7652;
const GIST_ID = '18d30d84225a0ce6f35a3914b9c2bdcd';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // 태블릿에서 환경변수로 설정

const SOFA_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "application/json",
  "Accept-Language": "ko-KR,ko;q=0.9",
  "Referer": "https://www.sofascore.com/",
  "Origin": "https://www.sofascore.com",
};

// 한글 선수명 매핑
const KO_NAMES = {
  'Stanislav Iljutcenko': '일류첸코',
  'Reis': '헤이스',
  'Fessin': '페신',
  'Ji-hyun Kim': '김지현',
  'Ho-Yeon Jung': '정호연',
  'Seung-beom Ko': '고승범',
  'Bruno Silva': '브루노 실바',
  'Hyeon-bin Park': '박현빈',
  'Hyun-muk Kang': '강현묵',
  'Min-woo Kim': '김민우',
  'Seong-ju Kim': '김성주',
  'Park Ji-Won': '박지원',
  'Jeong-ho Hong': '홍정호',
  'Lee Geon-hee': '이건희',
  'Jong-hyun Ko': '고종현',
  'Dong-yun Jeong': '정동윤',
  'Joo-Hoon Song': '송주훈',
  'Dae-Won Park': '박대원',
  'Lee Jun-Jae': '이준재',
  'Kyung-bin Mo': '모경빈',
  'Geun-yeong Yoon': '윤근영',
  'Jun-hong Kim': '김준홍',
  'Hyeong-mo Yang': '양형모',
  'Kim Min-Jun': '김민준',
  'Min-jun Kim': '김민준',
  'Minjun Kim': '김민준',
  'Kim Minjun': '김민준',
  'Gyeong-jun Lee': '이경준',
  'Suk-Hwan Jang': '장석환',
  'Paulinho': '파울리뇨',
  'Paulo Henrique': '파울리뇨',
  'Paulo Henrique do Pilar Silva': '파울리뇨',
  'Paulo Silva': '파울리뇨',
  'Dong-han Seo': '서동한',
  'Lee Sang-min': '이상민',
  'Ji-moog Choi': '최지묵',
  'Sung-min Jung': '정성민',
  'Min-jun Yeo': '여민준',
  'Ji-hoon Lim': '임지훈',
  'Do-yeon Kim': '김도연',
  'Ji-sung Kim': '김지성',
  'Seong-Jin Kang': '강성진',
  'Hi-jun Bak': '박희준',
};

function getKoName(name) {
  return KO_NAMES[name] || name;
}

const TEAM_KO = {
  'Seoul E-Land FC': '서울이랜드',
  'Paju Frontier FC': '파주프런티어',
  'Jeonnam Dragons': '전남드래곤즈',
  'Gimhae City FC': '김해FC',
  'Yongin City FC': '용인FC',
  'Cheongju FC': '충북청주',
  'Gimpo FC': '김포FC',
  'Gyeongnam FC': '경남FC',
  'Busan I Park': '부산아이파크',
  'Suwon FC': '수원FC',
  'Daegu FC': '대구FC',
  'Cheonan City FC': '천안시티',
  'Chungnam Asan FC': '충남아산',
  'Hwaseong FC': '화성FC',
  'Seongnam FC': '성남FC',
  'Ansan Greeners FC': '안산그리너스',
  'Paju Frontier': '파주프런티어',
  'Jeju SK': '제주SK',
  'Incheon United': '인천유나이티드',
  'Bucheon FC 1995': '부천FC',
};

function getTeamKo(name) {
  return TEAM_KO[name] || name;
}

function sofaFetch(path) {
  return new Promise((resolve, reject) => {
    const req = https.get(`https://api.sofascore.com/api/v1${path}`, { headers: SOFA_HEADERS }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch(e) { resolve({ status: res.statusCode, data: {} }); }
      });
    });
    req.on('error', reject);
    // 10초 timeout
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Sofascore API timeout'));
    });
  });
}

function safeReadJson(filePath, defaultVal) {
  const fs = require('fs');
  try {
    if (!fs.existsSync(filePath)) return defaultVal;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch(e) {
    console.error(`파일 읽기/파싱 오류 (${filePath}):`, e.message);
    return defaultVal;
  }
}

function parseEvent(e) {
  const isHome = e.homeTeam?.id === TEAM_ID;
  const myScore = isHome ? e.homeScore?.current : e.awayScore?.current;
  const oppScore = isHome ? e.awayScore?.current : e.homeScore?.current;
  const finished = e.status?.type === 'finished';
  let result = null;
  if (finished && myScore !== undefined && oppScore !== undefined) {
    result = myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D';
  }
  return {
    id: String(e.id),
    date: new Date(e.startTimestamp * 1000).toISOString(),
    opponent: getTeamKo(isHome ? e.awayTeam.name : e.homeTeam.name),
    home: isHome,
    status: finished ? 'finished' : 'upcoming',
    score: finished ? `${myScore}:${oppScore}` : null,
    result,
    round: e.roundInfo?.round || null,
  };
}

// Gist에 pinggy URL 저장
async function updateGist(url) {
  if (!GITHUB_TOKEN) { console.log('GITHUB_TOKEN 없음, Gist 업데이트 생략'); return; }
  return new Promise((resolve) => {
    const body = JSON.stringify({ files: { 'url.txt': { content: url } } });
    const options = {
      hostname: 'api.github.com',
      path: `/gists/${GIST_ID}`,
      method: 'PATCH',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'suwon-server',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      res.on('data', () => {});
      res.on('end', () => { console.log(`Gist 업데이트 완료: ${url}`); resolve(); });
    });
    req.on('error', (e) => { console.log('Gist 업데이트 실패:', e.message); resolve(); });
    req.write(body);
    req.end();
  });
}

// 서버 시작 시 pinggy URL 자동 감지 및 Gist 업데이트
function watchForPinggyUrl() {
  // pinggy는 표준 입력에 URL을 출력하지 않으므로
  // 환경변수로 URL을 받거나 파일로 받음
  const url = process.env.PINGGY_URL;
  if (url) {
    console.log(`pinggy URL 감지: ${url}`);
    updateGist(url);
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  const url = new URL(req.url, 'http://localhost');

  // Gist에 pinggy URL 등록용 엔드포인트
  if (url.pathname === '/register' && req.method === 'GET') {
    const pinggyUrl = url.searchParams.get('url');
    if (pinggyUrl) {
      await updateGist(pinggyUrl);
      res.end(JSON.stringify({ ok: true, url: pinggyUrl }));
    } else {
      res.end(JSON.stringify({ ok: false, error: 'url 파라미터 필요' }));
    }
    return;
  }

  if (url.pathname === '/api/schedule') {
    try {
      const [last, next] = await Promise.all([
        sofaFetch(`/team/${TEAM_ID}/events/last/0`),
        sofaFetch(`/team/${TEAM_ID}/events/next/0`),
      ]);
      const past = (last.data.events || []).map(parseEvent).reverse();
      const upcoming = (next.data.events || []).map(parseEvent);
      res.end(JSON.stringify({ past, upcoming }));
    } catch(e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
  } else if (url.pathname === '/api/lineup') {
    const eventId = url.searchParams.get('eventId');
    if (!eventId) { res.writeHead(400); res.end(JSON.stringify({ error: 'eventId 필요' })); return; }
    try {
      const [lineupRes, eventRes] = await Promise.all([
        sofaFetch(`/event/${eventId}/lineups`),
        sofaFetch(`/event/${eventId}`),
      ]);
      const event = eventRes.data.event;
      if (!event) { res.end(JSON.stringify({ lineup: null })); return; }
      const isHome = event.homeTeam?.id === TEAM_ID;
      if (!isHome && event.awayTeam?.id !== TEAM_ID) { res.end(JSON.stringify({ lineup: null })); return; }
      const side = isHome ? lineupRes.data.home : lineupRes.data.away;
      if (!side?.players) { res.end(JSON.stringify({ lineup: null })); return; }
      const starters = side.players
        .filter(p => !p.substitute)
        .map(p => ({
          name: p.player.name,
          nameKo: getKoName(p.player.name),
          number: p.jerseyNumber,
          position: p.position,
        }));
      res.end(JSON.stringify({ lineup: { formation: side.formation, players: starters } }));
    } catch(e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
  } else if (url.pathname === '/api/squad') {
    // 플래시스코어 확인 정확한 선수단 데이터
    const players = [
      { name:"Jun-hong Kim",   nameKo:"김준홍",   number:30, position:"G" },
      { name:"Kim Min-Jun",    nameKo:"김민준",   number:1,  position:"G" },
      { name:"Hyeong-mo Yang", nameKo:"양형모",   number:21, position:"G" },
      { name:"Gyeong-jun Lee", nameKo:"이경준",   number:31, position:"G" },
      { name:"Jong-hyun Ko",   nameKo:"고종현",   number:5,  position:"D" },

      { name:"Ji-sung Kim",    nameKo:"김지성",   number:80, position:"M" },
      { name:"Kyung-bin Mo",   nameKo:"모경빈",   number:3,  position:"D" },
      { name:"Dae-Won Park",   nameKo:"박대원",   number:33, position:"D" },
      { name:"Joo-Hoon Song",  nameKo:"송주훈",   number:4,  position:"D" },
      { name:"Lee Geon-hee",   nameKo:"이건희",   number:27, position:"D" },
      { name:"Lee Jun-Jae",    nameKo:"이준재",   number:11, position:"D" },
      { name:"Ji-hoon Lim",    nameKo:"임지훈",   number:6,  position:"D" },
      { name:"Geun-yeong Yoon", nameKo:"윤근영",   number:28, position:"D" },
      { name:"Suk-Hwan Jang",  nameKo:"장석환",   number:2,  position:"D" },
      { name:"Dong-yun Jeong", nameKo:"정동윤",   number:32, position:"D" },
      { name:"Jeong-ho Hong",  nameKo:"홍정호",   number:20, position:"D" },
      { name:"Hyun-muk Kang",  nameKo:"강현묵",   number:17, position:"M" },
      { name:"Seung-beom Ko",  nameKo:"고승범",   number:24, position:"M" },
      { name:"Do-yeon Kim",    nameKo:"김도연",   number:99, position:"M" },
      { name:"Min-woo Kim",    nameKo:"김민우",   number:23, position:"M" },
      { name:"Seong-ju Kim",   nameKo:"김성주",   number:19, position:"M" },
      { name:"Hyeon-bin Park", nameKo:"박현빈",   number:16, position:"M" },
      { name:"Ho-Yeon Jung",   nameKo:"정호연",   number:14, position:"M" },
      { name:"Reis",           nameKo:"헤이스",   number:10, position:"M" },
      { name:"Min-jun Yeo",      nameKo:"여민준",   number:13, position:"M" },
      { name:"Sung-min Jung",    nameKo:"정성민",   number:15, position:"D" },
      { name:"Ji-moog Choi",     nameKo:"최지묵",   number:18, position:"D" },
      { name:"Lee Sang-min",     nameKo:"이상민",   number:92, position:"D" },
      { name:"Jun-woo Lee",      nameKo:"이준우",   number:42, position:"M" },
      { name:"Seong-Jin Kang",   nameKo:"강성진",   number:22, position:"F" },
      { name:"Ji-hyun Kim",    nameKo:"김지현",   number:77, position:"F" },
      { name:"Park Ji-Won",    nameKo:"박지원",   number:91, position:"F" },
      { name:"Bruno Silva",    nameKo:"브루노 실바", number:58, position:"F" },
      { name:"Stanislav Iljutcenko", nameKo:"일류첸코", number:9, position:"F" },
      { name:"Fessin",         nameKo:"페신",     number:7,  position:"F" },
      { name:"Paulinho",        nameKo:"파울리뇨", number:96, position:"F" },
    ];
    res.end(JSON.stringify({ players }));
  } else if (url.pathname === '/api/auth') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { action, nickname, newNickname, force } = JSON.parse(body);
          const fs = require('fs');
          const PRED_FILE = process.env.HOME + '/suwon-server/predictions.json';

          if (action === 'login') {
            // 닉네임만으로 로그인
            if (!nickname || !nickname.trim()) {
              res.end(JSON.stringify({ ok: false, error: '닉네임을 입력해주세요.' }));
              return;
            }
            // 기존 예측 데이터에 이 닉네임이 있는지 확인
            const preds = safeReadJson(PRED_FILE, {});
            const existing = Object.values(preds).some(matchPreds =>
              matchPreds.some(p => p.nickname === nickname.trim())
            );
            res.end(JSON.stringify({ ok: true, nickname: nickname.trim(), existing }));
          } else if (action === 'delete') {
            // 닉네임 삭제 - predictions, scores에서 해당 닉네임 제거
            const delPreds = safeReadJson(PRED_FILE, {});
            Object.keys(delPreds).forEach(matchId => {
              delPreds[matchId] = delPreds[matchId].filter(p => p.nickname !== nickname);
            });
            fs.writeFileSync(PRED_FILE, JSON.stringify(delPreds));
            const SCORE_FILE2 = process.env.HOME + '/suwon-server/scores.json';
            const delScores = safeReadJson(SCORE_FILE2, {});
            Object.keys(delScores).forEach(matchId => {
              delete delScores[matchId][nickname];
            });
            fs.writeFileSync(SCORE_FILE2, JSON.stringify(delScores));
            res.end(JSON.stringify({ ok: true }));
          } else if (action === 'change') {
            // 닉네임 변경 - 예측 데이터도 이전
            if (!newNickname || !newNickname.trim()) {
              res.end(JSON.stringify({ ok: false, error: '새 닉네임을 입력해주세요.' }));
              return;
            }
            // 새 닉네임이 기존 예측 데이터에 있는지 확인
            const checkPreds = safeReadJson(PRED_FILE, {});
            const existingNick = Object.values(checkPreds).some(matchPreds =>
              matchPreds.some(p => p.nickname === newNickname.trim())
            );
            if (existingNick && !force) {
              res.end(JSON.stringify({ ok: false, existingNick: true, nickname: newNickname.trim() }));
              return;
            }
            const SCORE_FILE = process.env.HOME + '/suwon-server/scores.json';
            // predictions.json 닉네임 변경
            const changePreds = safeReadJson(PRED_FILE, {});
            Object.keys(changePreds).forEach(matchId => {
              changePreds[matchId] = changePreds[matchId].map(p =>
                p.nickname === nickname ? { ...p, nickname: newNickname.trim() } : p
              );
            });
            fs.writeFileSync(PRED_FILE, JSON.stringify(changePreds));
            // scores.json 닉네임 변경
            const changeScores = safeReadJson(SCORE_FILE, {});
            Object.keys(changeScores).forEach(matchId => {
              if (changeScores[matchId][nickname] !== undefined) {
                changeScores[matchId][newNickname.trim()] = changeScores[matchId][nickname];
                delete changeScores[matchId][nickname];
              }
            });
            fs.writeFileSync(SCORE_FILE, JSON.stringify(changeScores));
            res.end(JSON.stringify({ ok: true, nickname: newNickname.trim() }));
          }
        } catch(e) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    }
  } else if (url.pathname === '/api/predictions') {
    const fs = require('fs');
    const PRED_FILE = process.env.HOME + '/suwon-server/predictions.json';

    if (req.method === 'GET') {
      try {
        const matchId = url.searchParams.get('matchId');
        const data = safeReadJson(PRED_FILE, {});
        if (matchId) {
          res.end(JSON.stringify({ predictions: data[matchId] || [] }));
        } else {
          res.end(JSON.stringify({ predictions: data }));
        }
      } catch(e) {
        res.end(JSON.stringify({ predictions: [] }));
      }
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const pred = JSON.parse(body);
          const data = safeReadJson(PRED_FILE, {});
          if (!data[pred.matchId]) data[pred.matchId] = [];
          const idx = data[pred.matchId].findIndex(p => p.nickname === pred.nickname);
          if (idx >= 0) data[pred.matchId][idx] = pred;
          else data[pred.matchId].push(pred);
          fs.writeFileSync(PRED_FILE, JSON.stringify(data));
          res.end(JSON.stringify({ ok: true }));
        } catch(e) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    } else if (req.method === 'DELETE') {
      try {
        const matchId = url.searchParams.get('matchId');
        const nickname = url.searchParams.get('nickname');
        const data = safeReadJson(PRED_FILE, {});
        if (matchId && nickname && data[matchId]) {
          data[matchId] = data[matchId].filter(p => p.nickname !== nickname);
          fs.writeFileSync(PRED_FILE, JSON.stringify(data));
        }
        res.end(JSON.stringify({ ok: true }));
      } catch(e) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: e.message }));
      }
    }
  } else if (url.pathname === '/api/score') {
    // 채점 API - 경기 끝난 후 예측 vs 실제 선발 비교
    const fs = require('fs');
    const PRED_FILE = process.env.HOME + '/suwon-server/predictions.json';
    const SCORE_FILE = process.env.HOME + '/suwon-server/scores.json';

    if (req.method === 'POST') {
      // 특정 경기 채점 요청
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { matchId, eventId } = JSON.parse(body);
          
          // Sofascore에서 실제 선발 가져오기
          // /api/lineup 엔드포인트 재사용 (substitute 필터 이미 적용됨)
          const [lineupRes, eventRes] = await Promise.all([
            sofaFetch(`/event/${eventId}/lineups`),
            sofaFetch(`/event/${eventId}`),
          ]);
          const ev = eventRes.data.event;
          if (!ev) { res.writeHead(400); res.end(JSON.stringify({ error: 'event 데이터 없음' })); return; }
          const isHome = ev.homeTeam?.id === TEAM_ID;
          if (!isHome && ev.awayTeam?.id !== TEAM_ID) {
            res.writeHead(400); res.end(JSON.stringify({ error: '수원삼성 경기 아님' })); return;
          }
          const side = isHome ? lineupRes.data.home : lineupRes.data.away;
          if (!side?.players) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: '선발 데이터 없음' }));
            return;
          }

          const actualFormation = side.formation || '';
          // 선발만 (substitute: false 또는 undefined인 선수만)
          const actualPlayers = side.players
            .filter(p => p.substitute === false || p.substitute === undefined || p.substitute === null)
            .filter(p => {
              // position이 있고, 교체 선수가 아닌 경우만
              // Sofascore에서 선발은 보통 앞 11명
              return true;
            })
            .slice(0, 11) // 선발 11명만
            .map(p => ({
              number: p.jerseyNumber,
              name: p.player.name.toLowerCase(),
              nameLast: p.player.name.toLowerCase().split(' ').pop(),
            }));

          // 예측 데이터 불러오기
          const predData = safeReadJson(PRED_FILE, {});
          const matchPreds = predData[matchId] || [];

          // 채점
          const scores = {};
          matchPreds.forEach(pred => {
            let score = 0;
            // 포메이션 채점 제외
            // 선수 적중 - 등번호 우선, 없으면 이름 전체 비교
            const predPlayers = (pred.slots || []).filter(s => s.player).map(s => s.player);
            
            let hits = 0;
            predPlayers.forEach(pp => {
              const ppNum = pp.number;
              const ppName = (pp.name || '').toLowerCase();
              const ppNameKo = (pp.nameKo || '').toLowerCase();
              
              const matched = actualPlayers.some(ap => {
                // 1순위: 등번호 일치
                if (ppNum && ap.number && ppNum === ap.number) return true;
                // 2순위: 이름 전체 일치
                if (ppName && ppName === ap.name) return true;
                // 3순위: 한글 이름 마지막 2글자 비교 (동명이인 방지 위해 전체 비교)
                if (ppNameKo && ppNameKo.length >= 2) {
                  const koMatch = ap.name && getKoName(ap.name.split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' '));
                  if (koMatch && koMatch.toLowerCase() === ppNameKo) return true;
                }
                return false;
              });
              if (matched) { hits++; score += 5; }
            });
            // 11명 전원 적중 보너스
            if (hits === 11) score += 30;
            scores[pred.nickname] = score;
          });

          // 점수 저장
          const scoreData = safeReadJson(SCORE_FILE, {});
          scoreData[matchId] = scores;
          fs.writeFileSync(SCORE_FILE, JSON.stringify(scoreData));

          res.end(JSON.stringify({ ok: true, scores, actualFormation, actualPlayers }));
        } catch(e) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    } else if (req.method === 'GET') {
      // 전체 점수 조회
      try {
        const fs = require('fs');
        const SCORE_FILE = process.env.HOME + '/suwon-server/scores.json';
        const scoreData = safeReadJson(SCORE_FILE, {});
        // 닉네임별 합산
        const totals = {};
        Object.values(scoreData).forEach(matchScores => {
          Object.entries(matchScores).forEach(([nick, score]) => {
            totals[nick] = (totals[nick] || 0) + score;
          });
        });
        res.end(JSON.stringify({ totals, detail: scoreData }));
      } catch(e) {
        res.end(JSON.stringify({ totals: {}, detail: {} }));
      }
    }
  } else {
    res.end(JSON.stringify({ status: 'ok', message: '수원삼성 API 서버 실행 중' }));
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
  watchForPinggyUrl();
});
