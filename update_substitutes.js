#!/usr/bin/env node
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

function kleagueGet(path) {
  return new Promise((resolve) => {
    https.get({ hostname: 'www.kleague.com', path, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

// playerIdCache 로드
let playerIdCache = {};
try {
  const mapping = JSON.parse(fs.readFileSync(process.env.HOME + '/suwon-server/player_mapping.json', 'utf8'));
  Object.entries(mapping).forEach(([id, p]) => {
    if (p.nameKo) playerIdCache[p.nameKo] = id;
    if (p.number) playerIdCache[String(p.number)] = id;
  });
} catch(e) {}

async function fetchSubstitutes(gameId) {
  // 1. matchInfo API에서 교체 이벤트
  const matchInfo = await kleaguePost('/api/ddf/match/matchInfo.do', { year: YEAR, meetSeq: MEET_SEQ, gameId });
  const d = matchInfo.data;
  const allEvents = d ? [...(d.firstHalf || []), ...(d.secondHalf || [])] : [];
  const subEvents = allEvents.filter(e => e.eventName === '교체' && e.teamId === SUWON_TEAM_ID);

  const subInMap = {};
  subEvents.forEach(s => {
    const halfMin = s.halfType === 2 ? s.timeMin + 45 : s.timeMin;
    // playerId = 나간 선수, playerId2 = 투입 선수
    if (s.playerId2) {
      subInMap[String(s.playerId2)] = { subTime: halfMin, subOut: s.playerName || null };
    }
  });

  // 2. HTML에서 벤치 전체 명단
  const html = await kleagueGet(`/match.do?year=${YEAR}&leagueId=2&gameId=${gameId}&meetSeq=${MEET_SEQ}`);
  const gameInfo = html.match(/class="game-info">([\s\S]*?)<\/div>\s*<div class="desc"/);
  const isSuwonHome = gameInfo && gameInfo[1].includes(SUWON_TEAM_ID);
  const standbyBlocks = [...html.matchAll(/<div class="standby">([\s\S]*?)<\/div>\s*<\/div>/g)];
  const suwonBlock = isSuwonHome ? standbyBlocks[0]?.[1] : standbyBlocks[1]?.[1];
  if (!suwonBlock) return [];

  const benchPlayers = [...suwonBlock.matchAll(/<p>(\d+)\.([^<]+)<\/p>/g)].map(p => ({
    number: parseInt(p[1]),
    nameKo: p[2].trim(),
  }));

  return benchPlayers.map(p => {
    const playerId = playerIdCache[String(p.number)];
    const subInfo = playerId ? subInMap[String(playerId)] : null;
    return {
      number: p.number,
      nameKo: p.nameKo,
      playerId: playerId || null,
      subIn: !!subInfo,
      subTime: subInfo?.subTime || null,
      subOut: subInfo?.subOut || null,
    };
  });
}

async function main() {
  const lineups = JSON.parse(fs.readFileSync(LINEUP_FILE, 'utf8'));
  const matchIds = Object.keys(lineups).filter(id => id.length <= 5);
  
  console.log(`총 ${matchIds.length}개 경기 업데이트 시작...`);
  
  for (const matchId of matchIds) {
    try {
      const subs = await fetchSubstitutes(matchId);
      lineups[matchId].substitutes = subs;
      const subIn = subs.filter(s => s.subIn).length;
      console.log(`[완료] matchId ${matchId} - 벤치 ${subs.length}명 (투입 ${subIn}명)`);
    } catch(e) {
      console.log(`[오류] matchId ${matchId}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  
  fs.writeFileSync(LINEUP_FILE, JSON.stringify(lineups));
  console.log('\n완료!');
}

main();
