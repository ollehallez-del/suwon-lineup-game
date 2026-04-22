'use client';
import { useState, useEffect } from "react";

const FORMATION_LAYOUTS = {
  "4-3-3": [
    { pos:"GK", top:87, left:50 },
    { pos:"RB", top:68, left:80 },
    { pos:"CB", top:68, left:60 },
    { pos:"CB", top:68, left:40 },
    { pos:"LB", top:68, left:20 },
    { pos:"CM", top:48, left:70 },
    { pos:"CM", top:48, left:50 },
    { pos:"CM", top:48, left:30 },
    { pos:"RW", top:25, left:78 },
    { pos:"ST", top:18, left:50 },
    { pos:"LW", top:25, left:22 },
  ],
  "4-4-2": [
    { pos:"GK", top:87, left:50 },
    { pos:"RB", top:68, left:80 },
    { pos:"CB", top:68, left:60 },
    { pos:"CB", top:68, left:40 },
    { pos:"LB", top:68, left:20 },
    { pos:"RM", top:48, left:80 },
    { pos:"CM", top:48, left:60 },
    { pos:"CM", top:48, left:40 },
    { pos:"LM", top:48, left:20 },
    { pos:"ST", top:20, left:62 },
    { pos:"ST", top:20, left:38 },
  ],
  "4-2-3-1": [
    { pos:"GK",  top:87, left:50 },
    { pos:"RB",  top:70, left:82 },
    { pos:"CB",  top:70, left:62 },
    { pos:"CB",  top:70, left:38 },
    { pos:"LB",  top:70, left:18 },
    { pos:"DM",  top:55, left:62 },
    { pos:"DM",  top:55, left:38 },
    { pos:"RAM", top:35, left:78 },
    { pos:"CAM", top:35, left:50 },
    { pos:"LAM", top:35, left:22 },
    { pos:"ST",  top:16, left:50 },
  ],
  "4-1-4-1": [
    { pos:"GK",  top:87, left:50 },
    { pos:"RB",  top:72, left:82 },
    { pos:"CB",  top:72, left:62 },
    { pos:"CB",  top:72, left:38 },
    { pos:"LB",  top:72, left:18 },
    { pos:"DM",  top:58, left:50 },
    { pos:"RM",  top:42, left:82 },
    { pos:"CM",  top:42, left:62 },
    { pos:"CM",  top:42, left:38 },
    { pos:"LM",  top:42, left:18 },
    { pos:"ST",  top:16, left:50 },
  ],
  "4-5-1": [
    { pos:"GK",  top:87, left:50 },
    { pos:"RB",  top:70, left:82 },
    { pos:"CB",  top:70, left:62 },
    { pos:"CB",  top:70, left:38 },
    { pos:"LB",  top:70, left:18 },
    { pos:"RM",  top:48, left:82 },
    { pos:"CM",  top:48, left:67 },
    { pos:"CM",  top:48, left:50 },
    { pos:"CM",  top:48, left:33 },
    { pos:"LM",  top:48, left:18 },
    { pos:"ST",  top:16, left:50 },
  ],
  "4-3-2-1": [
    { pos:"GK",  top:87, left:50 },
    { pos:"RB",  top:72, left:82 },
    { pos:"CB",  top:72, left:62 },
    { pos:"CB",  top:72, left:38 },
    { pos:"LB",  top:72, left:18 },
    { pos:"CM",  top:55, left:67 },
    { pos:"CM",  top:55, left:50 },
    { pos:"CM",  top:55, left:33 },
    { pos:"SS",  top:35, left:62 },
    { pos:"SS",  top:35, left:38 },
    { pos:"ST",  top:16, left:50 },
  ],
  "3-4-3": [
    { pos:"GK",  top:87, left:50 },
    { pos:"CB",  top:68, left:67 },
    { pos:"CB",  top:68, left:50 },
    { pos:"CB",  top:68, left:33 },
    { pos:"RM",  top:50, left:82 },
    { pos:"CM",  top:50, left:62 },
    { pos:"CM",  top:50, left:38 },
    { pos:"LM",  top:50, left:18 },
    { pos:"RW",  top:22, left:75 },
    { pos:"ST",  top:16, left:50 },
    { pos:"LW",  top:22, left:25 },
  ],
  "3-4-2-1": [
    { pos:"GK",  top:87, left:50 },
    { pos:"CB",  top:70, left:67 },
    { pos:"CB",  top:70, left:50 },
    { pos:"CB",  top:70, left:33 },
    { pos:"RM",  top:52, left:82 },
    { pos:"CM",  top:52, left:62 },
    { pos:"CM",  top:52, left:38 },
    { pos:"LM",  top:52, left:18 },
    { pos:"SS",  top:32, left:62 },
    { pos:"SS",  top:32, left:38 },
    { pos:"ST",  top:16, left:50 },
  ],
  "3-5-2": [
    { pos:"GK",  top:87, left:50 },
    { pos:"CB",  top:70, left:67 },
    { pos:"CB",  top:70, left:50 },
    { pos:"CB",  top:70, left:33 },
    { pos:"RWB", top:52, left:88 },
    { pos:"CM",  top:52, left:67 },
    { pos:"CM",  top:52, left:50 },
    { pos:"CM",  top:52, left:33 },
    { pos:"LWB", top:52, left:12 },
    { pos:"ST",  top:20, left:62 },
    { pos:"ST",  top:20, left:38 },
  ],
  "5-3-2": [
    { pos:"GK",  top:87, left:50 },
    { pos:"RWB", top:68, left:88 },
    { pos:"CB",  top:70, left:72 },
    { pos:"CB",  top:70, left:50 },
    { pos:"CB",  top:70, left:28 },
    { pos:"LWB", top:68, left:12 },
    { pos:"CM",  top:48, left:67 },
    { pos:"CM",  top:48, left:50 },
    { pos:"CM",  top:48, left:33 },
    { pos:"ST",  top:20, left:62 },
    { pos:"ST",  top:20, left:38 },
  ],
  "5-4-1": [
    { pos:"GK",  top:87, left:50 },
    { pos:"RWB", top:68, left:88 },
    { pos:"CB",  top:70, left:72 },
    { pos:"CB",  top:70, left:50 },
    { pos:"CB",  top:70, left:28 },
    { pos:"LWB", top:68, left:12 },
    { pos:"RM",  top:46, left:80 },
    { pos:"CM",  top:46, left:60 },
    { pos:"CM",  top:46, left:40 },
    { pos:"LM",  top:46, left:20 },
    { pos:"ST",  top:16, left:50 },
  ],
  "5-2-3": [
    { pos:"GK",  top:87, left:50 },
    { pos:"RWB", top:68, left:88 },
    { pos:"CB",  top:70, left:72 },
    { pos:"CB",  top:70, left:50 },
    { pos:"CB",  top:70, left:28 },
    { pos:"LWB", top:68, left:12 },
    { pos:"CM",  top:50, left:62 },
    { pos:"CM",  top:50, left:38 },
    { pos:"RW",  top:22, left:78 },
    { pos:"ST",  top:18, left:50 },
    { pos:"LW",  top:22, left:22 },
  ],
};

const posGroupLabel = { G: "골키퍼", D: "수비수", M: "미드필더", F: "공격수" };
const posOrder = ["G", "D", "M", "F"];
const PROXY = '/.netlify/functions/proxy';

const store = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

function PitchView({ slots, formation, onSlotClick, selectedSlot, interactive }) {
  const layout = FORMATION_LAYOUTS[formation] || FORMATION_LAYOUTS["4-3-3"];
  return (
    <div style={{ position:"relative", width:"100%", paddingBottom:"140%", background:"linear-gradient(180deg,#1a4d2e 0%,#1e5c35 20%,#16a34a 40%,#1e5c35 60%,#1a4d2e 100%)", borderRadius:12, overflow:"hidden", border:"2px solid #22c55e", boxShadow:"0 0 40px rgba(34,197,94,0.15)" }}>
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 100 140">
        <rect x="5" y="5" width="90" height="130" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <line x1="5" y1="70" x2="95" y2="70" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <circle cx="50" cy="70" r="10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="20" y="5" width="60" height="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="32" y="5" width="36" height="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="20" y="115" width="60" height="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="32" y="127" width="36" height="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
      </svg>
      {layout.map((slot, i) => {
        const slotData = slots[i] || {};
        const player = slotData.player || null;
        const isSelected = selectedSlot === i;
        return (
          <div key={i} onClick={() => interactive && onSlotClick && onSlotClick(i)}
            style={{ position:"absolute", left:`${slot.left}%`, top:`${slot.top}%`, transform:"translate(-50%,-50%)", display:"flex", flexDirection:"column", alignItems:"center", cursor:interactive?"pointer":"default", zIndex:10 }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:player?(isSelected?"linear-gradient(135deg,#fbbf24,#f59e0b)":"linear-gradient(135deg,#1d4ed8,#2563eb)"):(isSelected?"rgba(251,191,36,0.4)":"rgba(255,255,255,0.08)"), border:isSelected?"2.5px solid #fbbf24":(player?"2px solid rgba(255,255,255,0.6)":"2px dashed rgba(255,255,255,0.25)"), display:"flex", alignItems:"center", justifyContent:"center", boxShadow:player?"0 2px 12px rgba(0,0,0,0.4)":"none", flexShrink:0 }}>
              {player ? (
                <span style={{ fontSize:8, textAlign:"center", lineHeight:1.1, padding:"0 2px", color:"white", fontWeight:700 }}>
                  {player.number}<br/>{(player.nameKo||player.name).slice(0,3)}
                </span>
              ) : (
                <span style={{ opacity:0.4, fontSize:14, color:"white" }}>+</span>
              )}
            </div>
            <div style={{ marginTop:2, fontSize:7, color:"rgba(255,255,255,0.55)", background:"rgba(0,0,0,0.35)", padding:"1px 3px", borderRadius:3 }}>{slot.pos}</div>
          </div>
        );
      })}
    </div>
  );
}

function OtherPredictions({ preds, myNickname }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div style={{ marginTop:16 }}>
      <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.1em" }}>친구들 예측 ({preds.length}명)</div>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {preds.map((p, i) => {
          const isMe = p.nickname === myNickname;
          const isOpen = expanded === i;
          const fm = FORMATION_LAYOUTS[p.formation] || FORMATION_LAYOUTS["4-3-3"];
          const readonlySlots = fm.map((pos, idx) => ({
            pos: pos.pos,
            player: (p.slots||[])[idx]?.player || null,
          }));
          return (
            <div key={i} style={{ background:isMe?"rgba(59,130,246,0.1)":"rgba(255,255,255,0.04)", border:isMe?"1px solid rgba(59,130,246,0.3)":"1px solid rgba(255,255,255,0.08)", borderRadius:10, overflow:"hidden" }}>
              <div onClick={() => setExpanded(isOpen ? null : i)}
                style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", cursor:"pointer" }}>
                <span style={{ fontSize:13, fontWeight:700, color:isMe?"#60a5fa":"white" }}>
                  {p.nickname}{isMe&&<span style={{fontSize:10,marginLeft:4,color:"#60a5fa"}}>나</span>}
                </span>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:11, color:"#aaa" }}>{p.formation}</span>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{isOpen?"▲":"▼"}</span>
                </div>
              </div>
              {isOpen && (
                <div style={{ padding:"0 12px 12px" }}>
                  <PitchView formation={p.formation} slots={readonlySlots} interactive={false} />
                  <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:4 }}>
                    {readonlySlots.filter(s=>s.player).map((s,j) => (
                      <div key={j} style={{ fontSize:10, background:"rgba(29,78,216,0.3)", border:"1px solid rgba(59,130,246,0.3)", borderRadius:6, padding:"2px 6px" }}>
                        {s.pos} {s.player.nameKo||s.player.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MatchCard({ match, active, onClick }) {
  const isPast = match.status === 'finished';
  const resultLabel = match.result === 'W' ? '승' : match.result === 'D' ? '무' : match.result === 'L' ? '패' : null;
  const resultColor = match.result === 'W' ? '#22c55e' : match.result === 'D' ? '#eab308' : '#ef4444';
  const d = new Date(match.date);
  const dateStr = `${d.getMonth()+1}/${d.getDate()}`;
  const timeStr = d.toLocaleTimeString('ko-KR', { hour:'2-digit', minute:'2-digit' });
  return (
    <div onClick={onClick} style={{ padding:"10px 14px", borderRadius:10, border:active?"2px solid #3b82f6":"1.5px solid rgba(255,255,255,0.08)", background:active?"rgba(59,130,246,0.1)":"rgba(255,255,255,0.03)", cursor:"pointer" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:2 }}>{match.round ? `${match.round}R` : ''} · {dateStr} {!isPast&&timeStr} · {match.home?"홈":"원정"}</div>
          <div style={{ fontSize:13, fontWeight:700, color:"white" }}>vs {match.opponent}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          {isPast && match.score && <>
            <div style={{ fontSize:16, fontWeight:900, color:resultColor, fontFamily:"monospace" }}>{match.score}</div>
            <div style={{ fontSize:10, color:resultColor, fontWeight:700 }}>{resultLabel}</div>
          </>}
          {!isPast && <div style={{ fontSize:10, color:"#60a5fa", fontWeight:700 }}>예측 가능</div>}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("predict");
  const [nickname, setNickname] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [pastMatches, setPastMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [squad, setSquad] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [formation, setFormation] = useState("4-3-3");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [officialLineup, setOfficialLineup] = useState(null);
  const [lineupLoading, setLineupLoading] = useState(false);
  const [viewingMatch, setViewingMatch] = useState(null);
  const [matchPredictions, setMatchPredictions] = useState([]);
  const [otherPredictions, setOtherPredictions] = useState([]);
  const [rankingData, setRankingData] = useState([]);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [rankingView, setRankingView] = useState(null); // null | { nickname, preds }
  const [rankingPredDetail, setRankingPredDetail] = useState(null); // { matchId, slots, formation }
  const [allPredData, setAllPredData] = useState({});

  useEffect(() => {
    const nn = store.get('sw:nickname');
    if (nn) setNickname(nn);
    fetch(`${PROXY}?path=/api/schedule`)
      .then(r => r.json())
      .then(d => {
        setPastMatches(d.past || []);
        setUpcomingMatches(d.upcoming || []);
        if (d.upcoming?.length > 0) setSelectedMatch(d.upcoming[0]);
      })
      .catch(() => {})
      .finally(() => setScheduleLoading(false));
    fetch(`${PROXY}?path=/api/squad`)
      .then(r => r.json())
      .then(d => { if (d.players) setSquad(d.players); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedMatch || !nickname) return;
    // 경기 변경시 완전 초기화
    setFormation("4-3-3");
    resetSlots("4-3-3");
    setMySubmission(null);
    setOtherPredictions([]);
    // 로컬 캐시 먼저 표시
    const cached = store.get(`sw:pred_${selectedMatch.id}_${nickname}`);
    if (cached) { setFormation(cached.formation); setSlots(cached.slots); setMySubmission(cached); }
    // 서버에서 최신 데이터 확인
    fetch(`${PROXY}?path=/api/predictions?matchId=${selectedMatch.id}`)
      .then(r => r.json())
      .then(d => {
        const preds = d.predictions || [];
        const mine = preds.find(p => p.nickname === nickname);
        if (mine) { setFormation(mine.formation); setSlots(mine.slots); setMySubmission(mine); store.set(`sw:pred_${selectedMatch.id}_${nickname}`, mine); }
        setOtherPredictions(preds);
      })
      .catch(() => {});
  }, [selectedMatch?.id, nickname]);

  useEffect(() => { if (tab === "ranking") loadRanking(); }, [tab]);

  function resetSlots(f) {
    const layout = FORMATION_LAYOUTS[f] || FORMATION_LAYOUTS["4-3-3"];
    setSlots(layout.map(l => ({ pos: l.pos, player: null })));
    setSelectedSlot(null);
  }

  function handleFormationChange(f) { setFormation(f); resetSlots(f); }
  function handleSlotClick(i) { setSelectedSlot(selectedSlot === i ? null : i); }

  function handlePlayerSelect(player) {
    if (selectedSlot === null) return;
    const newSlots = slots.map((s, i) => {
      if (i === selectedSlot) return { ...s, player };
      if (s.player?.number === player.number) return { ...s, player: null };
      return s;
    });
    setSlots(newSlots);
    setSelectedSlot(null);
  }

  function countFilled() { return slots.filter(s => s.player).length; }

  async function handleSave() {
    if (!nickname) { setSaveStatus("닉네임을 먼저 설정해주세요!"); return; }
    if (countFilled() < 11) { setSaveStatus("선수 11명을 모두 배치해주세요!"); return; }
    const data = { nickname, matchId: selectedMatch.id, round: selectedMatch.round, opponent: selectedMatch.opponent, formation, slots, savedAt: Date.now() };
    setSaveStatus("저장 중...");
    try {
      await fetch(`${PROXY}?path=/api/predictions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      store.set(`sw:pred_${selectedMatch.id}_${nickname}`, data);
      setMySubmission(data);
      setSaveStatus("✅ 예측 저장 완료!");
      setTimeout(() => setSaveStatus(""), 3000);
      // 다른 사람 예측도 새로고침
      fetch(`${PROXY}?path=/api/predictions?matchId=${selectedMatch.id}`)
        .then(r => r.json())
        .then(d => setOtherPredictions(d.predictions || []))
        .catch(() => {});
    } catch(e) {
      store.set(`sw:pred_${selectedMatch.id}_${nickname}`, data);
      setMySubmission(data);
      setSaveStatus("✅ 저장됨 (오프라인)");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  }

  function handleSetNickname() {
    if (!nicknameInput.trim()) return;
    const nn = nicknameInput.trim().slice(0, 10);
    setNickname(nn);
    store.set('sw:nickname', nn);
    setNicknameInput("");
  }

  async function handleDeletePred() {
    if (!nickname || !selectedMatch) return;
    try {
      await fetch(`${PROXY}?path=/api/predictions?matchId=${selectedMatch.id}&nickname=${encodeURIComponent(nickname)}`, {
        method: 'DELETE',
      });
    } catch {}
    store.set(`sw:pred_${selectedMatch.id}_${nickname}`, null);
    setMySubmission(null);
    setFormation("4-3-3");
    resetSlots("4-3-3");
    setOtherPredictions(prev => prev.filter(p => p.nickname !== nickname));
  }

  async function loadRanking() {
    setLoadingRanking(true);
    try {
      const r = await fetch(`${PROXY}?path=/api/predictions`);
      const d = await r.json();
      const preds = d.predictions || {};
      setAllPredData(preds);
      // 닉네임별 예측 수 집계
      const nickMap = {};
      Object.values(preds).forEach(matchPreds => {
        matchPreds.forEach(p => {
          if (!nickMap[p.nickname]) nickMap[p.nickname] = 0;
          nickMap[p.nickname]++;
        });
      });
      const entries = Object.entries(nickMap).map(([nick, count]) => ({ nickname: nick, count }));
      entries.sort((a, b) => b.count - a.count);
      setRankingData(entries);
    } catch(e) {
      setRankingData([]);
    }
    setLoadingRanking(false);
  }

  async function handleViewLineup(match) {
    setViewingMatch(match);
    setOfficialLineup(null);
    setMatchPredictions([]);
    setLineupLoading(true);
    try {
      const [lineupRes, predRes] = await Promise.all([
        fetch(`${PROXY}?path=/api/lineup?eventId=${match.id}`),
        fetch(`${PROXY}?path=/api/predictions?matchId=${match.id}`),
      ]);
      const lineupData = await lineupRes.json();
      const predData = await predRes.json();
      if (lineupData.lineup) setOfficialLineup(lineupData.lineup);
      setMatchPredictions(predData.predictions || []);
    } catch {}
    setLineupLoading(false);
  }

  const squadByPos = {};
  posOrder.forEach(p => { squadByPos[p] = []; });
  squad.forEach(p => { const g = p.position?.[0]||'M'; if (squadByPos[g]) squadByPos[g].push(p); });
  const usedNumbers = new Set(slots.filter(s => s.player).map(s => s.player.number));

  return (
    <div style={{ minHeight:"100vh", background:"#0a0e1a", color:"white", fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap" rel="stylesheet" />

      <div style={{ background:"linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 50%,#2563eb 100%)", padding:"16px 20px 0", boxShadow:"0 4px 24px rgba(0,0,0,0.4)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
          <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#1e40af,#3b82f6)", border:"2px solid #60a5fa", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>⚽</div>
          <div>
            <div style={{ fontSize:18, fontWeight:900, letterSpacing:"-0.02em" }}>수원삼성 선발 예측</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>2026 K리그2 · 이정효 감독</div>
          </div>
          <div style={{ marginLeft:"auto" }}>
            {nickname ? (
              <div style={{ fontSize:12, background:"rgba(255,255,255,0.15)", padding:"4px 10px", borderRadius:20, fontWeight:700 }}>👤 {nickname}</div>
            ) : (
              <div style={{ display:"flex", gap:6 }}>
                <input value={nicknameInput} onChange={e=>setNicknameInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSetNickname()} placeholder="닉네임 입력"
                  style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:8, padding:"5px 10px", color:"white", fontSize:12, width:90, outline:"none" }} />
                <button onClick={handleSetNickname} style={{ background:"#3b82f6", border:"none", borderRadius:8, padding:"5px 10px", color:"white", fontSize:11, cursor:"pointer", fontWeight:700 }}>확인</button>
              </div>
            )}
          </div>
        </div>
        <div style={{ display:"flex" }}>
          {[{id:"predict",label:"📋 선발 예측"},{id:"history",label:"📅 이전 라인업"},{id:"ranking",label:"🏆 순위표"}].map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:"10px 0", background:"none", border:"none", borderBottom:tab===t.id?"3px solid #fbbf24":"3px solid transparent", color:tab===t.id?"#fbbf24":"rgba(255,255,255,0.55)", fontSize:12, fontWeight:tab===t.id?700:500, cursor:"pointer", fontFamily:"'Noto Sans KR',sans-serif" }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:16, maxWidth:480, margin:"0 auto" }}>

        {tab === "predict" && (
          <div>
            {scheduleLoading && <div style={{ textAlign:"center", padding:40, color:"rgba(255,255,255,0.4)" }}>⚽ 경기 일정 불러오는 중...</div>}
            {!scheduleLoading && upcomingMatches.length > 0 && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.1em" }}>예측할 경기 선택</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {upcomingMatches.slice(0,5).map(m => <MatchCard key={m.id} match={m} active={selectedMatch?.id===m.id} onClick={()=>setSelectedMatch(m)} />)}
                </div>
              </div>
            )}
            {selectedMatch && <>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.1em" }}>포메이션</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {Object.keys(FORMATION_LAYOUTS).map(f => (
                    <button key={f} onClick={()=>handleFormationChange(f)} style={{ flex:1, padding:"8px 0", minWidth:70, background:formation===f?"#1d4ed8":"rgba(255,255,255,0.05)", border:formation===f?"1.5px solid #3b82f6":"1.5px solid rgba(255,255,255,0.1)", borderRadius:8, color:"white", fontSize:12, fontWeight:700, cursor:"pointer" }}>{f}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.1em" }}>작전판 ({countFilled()}/11) · 포지션 클릭 후 선수 선택</div>
                <PitchView slots={slots} formation={formation} onSlotClick={handleSlotClick} selectedSlot={selectedSlot} interactive={true} />
              </div>
              {selectedSlot !== null && (
                <div style={{ marginBottom:12, background:"rgba(255,255,255,0.04)", border:"1.5px solid rgba(59,130,246,0.3)", borderRadius:12, padding:12 }}>
                  <div style={{ fontSize:11, color:"#60a5fa", marginBottom:10, fontWeight:700 }}>[{slots[selectedSlot]?.pos}] 포지션 선수 선택</div>
                  {posOrder.map(posKey => {
                    const players = squadByPos[posKey] || [];
                    if (!players.length) return null;
                    return (
                      <div key={posKey} style={{ marginBottom:10 }}>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginBottom:5 }}>{posGroupLabel[posKey]}</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                          {players.map(p => {
                            const inUse = usedNumbers.has(p.number) && slots[selectedSlot]?.player?.number !== p.number;
                            return (
                              <button key={p.number} onClick={()=>!inUse&&handlePlayerSelect(p)} style={{ padding:"5px 8px", background:inUse?"rgba(255,255,255,0.03)":"rgba(29,78,216,0.3)", border:inUse?"1px solid rgba(255,255,255,0.06)":"1px solid rgba(59,130,246,0.4)", borderRadius:6, color:inUse?"rgba(255,255,255,0.25)":"white", fontSize:11, cursor:inUse?"default":"pointer", fontWeight:600, textDecoration:inUse?"line-through":"none", fontFamily:"'Noto Sans KR',sans-serif" }}>
                                {p.number} {p.nameKo||p.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <button onClick={handleSave} style={{ width:"100%", padding:14, background:countFilled()===11?"linear-gradient(135deg,#1d4ed8,#2563eb)":"rgba(255,255,255,0.05)", border:"none", borderRadius:10, color:"white", fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:countFilled()===11?"0 4px 16px rgba(37,99,235,0.4)":"none" }}>
                  {mySubmission?"🔄 예측 수정하기":"✅ 예측 제출하기"} ({countFilled()}/11)
                </button>
                {saveStatus && <div style={{ textAlign:"center", fontSize:12, padding:8, color:saveStatus.includes("✅")?"#22c55e":"#fbbf24" }}>{saveStatus}</div>}
              </div>
              {mySubmission && (
                <div style={{ marginTop:10, padding:"10px 14px", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:8, fontSize:11, color:"#4ade80" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span>✅ 예측 완료!</span>
{selectedMatch && new Date(selectedMatch.date) > new Date() && (
                      <button onClick={handleDeletePred} disabled={selectedMatch && new Date(selectedMatch.date) <= new Date()} style={{ background:"rgba(239,68,68,0.2)", border:"1px solid rgba(239,68,68,0.4)", borderRadius:6, padding:"2px 8px", color: selectedMatch && new Date(selectedMatch.date) <= new Date() ? "rgba(252,129,129,0.3)" : "#fc8181", fontSize:10, cursor: selectedMatch && new Date(selectedMatch.date) <= new Date() ? "not-allowed" : "pointer" }}>삭제</button>
                    )}
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.4)", marginTop:3 }}>{mySubmission.formation} · {new Date(mySubmission.savedAt).toLocaleString("ko-KR",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                </div>
              )}

              {otherPredictions.length > 0 && (
                <OtherPredictions preds={otherPredictions} myNickname={nickname} />
              )}
            </>}
          </div>
        )}

        {tab === "history" && (
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.1em" }}>이전 경기 실제 선발</div>
            {viewingMatch ? (
              <div>
                <div style={{ background:"rgba(255,255,255,0.04)", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:12, overflow:"hidden", marginBottom:8 }}>
                  <div style={{ padding:"12px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:2 }}>{viewingMatch.round}R · {new Date(viewingMatch.date).toLocaleDateString('ko-KR',{month:'short',day:'numeric'})} · {viewingMatch.home?"홈":"원정"}</div>
                      <div style={{ fontSize:14, fontWeight:700 }}>vs {viewingMatch.opponent}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      {viewingMatch.score && <div style={{ fontSize:18, fontWeight:900, color:viewingMatch.result==='W'?'#22c55e':viewingMatch.result==='D'?'#eab308':'#ef4444', fontFamily:"monospace" }}>{viewingMatch.score}</div>}
                      {viewingMatch.result && <div style={{ fontSize:11, fontWeight:700, color:viewingMatch.result==='W'?'#22c55e':viewingMatch.result==='D'?'#eab308':'#ef4444' }}>{viewingMatch.result==='W'?'승':viewingMatch.result==='D'?'무':'패'}</div>}
                    </div>
                  </div>
                  <div style={{ padding:12 }}>
                    {lineupLoading && <div style={{ textAlign:"center", padding:20, color:"rgba(255,255,255,0.4)" }}>선발 명단 불러오는 중...</div>}
                    {!lineupLoading && !officialLineup && <div style={{ textAlign:"center", padding:20, color:"rgba(255,255,255,0.3)" }}>선발 명단 데이터가 없습니다.</div>}
                    {!lineupLoading && officialLineup && (() => {
                      const fmKey = officialLineup.formation?.replace(/\s/g,'-')||'4-3-3';
                      const layout = FORMATION_LAYOUTS[fmKey]||FORMATION_LAYOUTS['4-3-3'];
                      const readonlySlots = layout.map((pos,i) => ({ pos:pos.pos, player:officialLineup.players[i]||null }));
                      return <>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginBottom:8 }}>{officialLineup.formation} 포메이션</div>
                        <PitchView formation={fmKey} slots={readonlySlots} interactive={false} />
                        <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:5 }}>
                          {officialLineup.players.map((p,i) => (
                            <div key={i} style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"4px 8px" }}>
                              <span style={{ fontSize:9, color:"#888" }}>#{p.number}</span>
                              <span style={{ fontSize:11, fontWeight:600 }}>{p.nameKo||p.name}</span>
                            </div>
                          ))}
                        </div>
                      </>;
                    })()}
                  </div>
                </div>
                {matchPredictions.length > 0 && (
                  <OtherPredictions preds={matchPredictions} myNickname={nickname} />
                )}
                <button onClick={()=>setViewingMatch(null)} style={{ width:"100%", padding:10, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"rgba(255,255,255,0.5)", fontSize:12, cursor:"pointer" }}>← 목록으로</button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {pastMatches.length===0 && <div style={{ textAlign:"center", padding:24, color:"rgba(255,255,255,0.3)" }}>이전 경기 데이터가 없습니다.</div>}
                {pastMatches.slice(0,10).map(m => (
                  <div key={m.id} onClick={()=>handleViewLineup(m)} style={{ background:"rgba(255,255,255,0.03)", border:"1.5px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"12px 14px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:2 }}>{m.round}R · {new Date(m.date).toLocaleDateString('ko-KR',{month:'short',day:'numeric'})} · {m.home?"홈":"원정"}</div>
                      <div style={{ fontSize:14, fontWeight:700 }}>vs {m.opponent}</div>
                    </div>
                    <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2 }}>
                      {m.score && <div style={{ fontSize:16, fontWeight:900, color:m.result==='W'?'#22c55e':m.result==='D'?'#eab308':'#ef4444', fontFamily:"monospace" }}>{m.score}</div>}
                      {m.result && <div style={{ fontSize:10, fontWeight:700, color:m.result==='W'?'#22c55e':m.result==='D'?'#eab308':'#ef4444' }}>{m.result==='W'?'승':m.result==='D'?'무':'패'}</div>}
                      <div style={{ fontSize:9, color:"#60a5fa" }}>라인업 보기 →</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "ranking" && (
          <div>
            {/* 닉네임 상세 보기 */}
            {rankingView ? (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <button onClick={() => { setRankingView(null); setRankingPredDetail(null); }} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"5px 10px", color:"#aaa", fontSize:12, cursor:"pointer" }}>← 순위표</button>
                  <div style={{ fontSize:15, fontWeight:700 }}>{rankingView.nickname}의 예측</div>
                </div>

                {rankingPredDetail ? (
                  <div>
                    <button onClick={() => setRankingPredDetail(null)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"5px 10px", color:"#aaa", fontSize:12, cursor:"pointer", marginBottom:12 }}>← 경기 목록</button>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8 }}>{rankingPredDetail.formation}</div>
                    <PitchView formation={rankingPredDetail.formation} slots={rankingPredDetail.slots} interactive={false} />
                    <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:4 }}>
                      {(rankingPredDetail.slots||[]).filter(s=>s.player).map((s,j) => (
                        <div key={j} style={{ fontSize:10, background:"rgba(29,78,216,0.3)", border:"1px solid rgba(59,130,246,0.3)", borderRadius:6, padding:"2px 6px" }}>
                          {s.pos} {s.player.nameKo||s.player.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {rankingView.preds.length === 0 && <div style={{ textAlign:"center", padding:24, color:"rgba(255,255,255,0.3)" }}>예측 데이터가 없습니다.</div>}
                    {rankingView.preds.map((p, i) => {
                      const d = new Date(p.savedAt);
                      return (
                        <div key={i} onClick={() => setRankingPredDetail(p)}
                          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 14px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div>
                            <div style={{ fontSize:12, fontWeight:700 }}>{p.round ? `${p.round}R` : ''} vs {p.opponent}</div>
                            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{p.formation} · {d.toLocaleDateString('ko-KR',{month:'short',day:'numeric'})}</div>
                          </div>
                          <div style={{ fontSize:12, color:"#60a5fa" }}>보기 →</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* 순위표 메인 */
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.1em" }}>예측 순위표</div>
                  <button onClick={loadRanking} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"5px 10px", color:"rgba(255,255,255,0.6)", fontSize:11, cursor:"pointer" }}>🔄 새로고침</button>
                </div>
                {loadingRanking ? (
                  <div style={{ textAlign:"center", padding:40, color:"rgba(255,255,255,0.3)" }}>로딩 중...</div>
                ) : rankingData.length===0 ? (
                  <div style={{ textAlign:"center", padding:40, color:"rgba(255,255,255,0.25)", fontSize:13, lineHeight:1.8 }}>아직 예측 데이터가 없어요.<br/>친구들과 링크를 공유하고<br/>선발을 예측해보세요! ⚽</div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {rankingData.map((entry,idx) => {
                      // 이 닉네임의 전체 예측 수집
                      const myPreds = Object.entries(allPredData).flatMap(([matchId, preds]) =>
                        preds.filter(p => p.nickname === entry.nickname)
                      );
                      return (
                        <div key={idx} onClick={() => { setRankingView({ nickname: entry.nickname, preds: myPreds }); setRankingPredDetail(null); }}
                          style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:entry.nickname===nickname?"rgba(59,130,246,0.1)":"rgba(255,255,255,0.03)", border:entry.nickname===nickname?"1.5px solid rgba(59,130,246,0.4)":"1.5px solid rgba(255,255,255,0.06)", borderRadius:10, cursor:"pointer" }}>
                          <div style={{ width:28, height:28, borderRadius:"50%", background:idx===0?"#fbbf24":idx===1?"#94a3b8":idx===2?"#cd7c3f":"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:idx<3?"#0a0e1a":"rgba(255,255,255,0.4)", flexShrink:0 }}>{idx+1}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:700 }}>{entry.nickname}{entry.nickname===nickname&&<span style={{ fontSize:10, color:"#60a5fa", marginLeft:6 }}>나</span>}</div>
                            <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>예측 {entry.count}경기</div>
                          </div>
                          <div style={{ fontSize:12, color:"#60a5fa" }}>›</div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div style={{ marginTop:16, padding:"12px 14px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, fontSize:11, color:"rgba(255,255,255,0.35)", lineHeight:1.8 }}>
                  <div style={{ fontWeight:700, color:"rgba(255,255,255,0.5)", marginBottom:4 }}>📌 채점 기준 (예정)</div>
                  선발 선수 1명 적중 = +5pt<br/>포메이션 적중 = +10pt<br/>11명 전원 적중 = 보너스 +30pt
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
