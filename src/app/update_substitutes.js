#!/usr/bin/env node
// 기존 경기들 substitutes 일괄 업데이트
const fs = require('fs');
const https = require('https');

const LINEUP_FILE = process.env.HOME + '/suwon-server/lineups.json';
const SUWON_TEAM_ID = 'K02';
const YEAR = '2026';
const MEET_SEQ = '2';

function kleaguePost(path, params) {
  return new Promise((resolve) => {
    const body = new URLSearchParams(params).toString();
    const req = https.request({
      hostname: 'www.kleague.com', path, method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve({}); } });
    }).on('error', () => resolve({}));
    req.write(body); req.end();
  });
}

async function fetchSubstitutes(gameId) {
  const matchInfo = await kleaguePost('/api/ddf/match/matchInfo.do', { year: YEAR, meetSeq: MEET_SEQ, gameId });
  const d = matchInfo.data;
  if (!d) return [];
  const allEvents = [...(d.firstHalf || []), ...(d.secondHalf || [])];
  const subs = allEvents.filter(e => e.eventName === '교체' && e.teamId === SUWON_TEAM_ID);
  return subs.map(s => ({
    number: s.backNo,
    nameKo: s.playerName,
    playerId: s.playerId || null,
    subIn: true,
    subTime: s.halfType === 2 ? s.timeMin + 45 : s.timeMin,
    subOut: s.playerName2 || null,
  }));
}

async function main() {
  const lineups = JSON.parse(fs.readFileSync(LINEUP_FILE, 'utf8'));
  const matchIds = Object.keys(lineups).filter(id => id.length <= 5); // K리그만 (코리아컵 제외)
  
  console.log(`총 ${matchIds.length}개 경기 업데이트 시작...`);
  
  for (const matchId of matchIds) {
    if (lineups[matchId].substitutes && lineups[matchId].substitutes.length > 0) {
      console.log(`[스킵] matchId ${matchId} - 이미 있음`);
      continue;
    }
    try {
      const subs = await fetchSubstitutes(matchId);
      lineups[matchId].substitutes = subs;
      console.log(`[완료] matchId ${matchId} - 교체 ${subs.length}명`);
    } catch(e) {
      console.log(`[오류] matchId ${matchId}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 500)); // 0.5초 대기
  }
  
  fs.writeFileSync(LINEUP_FILE, JSON.stringify(lineups));
  console.log('\n✅ 전체 업데이트 완료!');
}

main();
