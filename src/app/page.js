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
const PROXY = '/api/proxy';

const store = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

function PitchView({ slots, formation, onSlotClick, selectedSlot, interactive, actualPlayers }) {
  const layout = FORMATION_LAYOUTS[formation] || FORMATION_LAYOUTS["4-3-3"];
  // actualPlayers: 실제 선발 선수 이름 배열 (비교용)
  function isHit(player) {
    if (!actualPlayers || !player) return null;
    return actualPlayers.some(a => {
      // 1순위: 등번호 일치
      if (player.number && a.number && String(player.number) === String(a.number)) return true;
      // 2순위: 영문 이름 전체 일치
      const pName = (player.name || '').toLowerCase();
      const aName = (a.name || '').toLowerCase();
      if (pName && aName && pName === aName) return true;
      // 3순위: 한글 이름 전체 일치 (slice 금지 - 오탐 방지)
      const pKo = (player.nameKo || '');
      const aKo = (a.nameKo || '');
      if (pKo && aKo && pKo === aKo) return true;
      return false;
    });
  }
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
            {(() => {
              const hit = player ? isHit(player) : null;
              const bg = player
                ? (isSelected ? "linear-gradient(135deg,#fbbf24,#f59e0b)"
                  : hit === true ? "linear-gradient(135deg,#16a34a,#22c55e)"
                  : hit === false ? "linear-gradient(135deg,#dc2626,#ef4444)"
                  : "linear-gradient(135deg,#1d4ed8,#2563eb)")
                : (isSelected ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.08)");
              const border = isSelected ? "2.5px solid #fbbf24"
                : hit === true ? "2px solid #4ade80"
                : hit === false ? "2px solid #f87171"
                : player ? "2px solid rgba(255,255,255,0.6)"
                : "2px dashed rgba(255,255,255,0.25)";
              return (
            <div style={{ width:44, height:44, borderRadius:"50%", background:bg, border, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:player?"0 2px 12px rgba(0,0,0,0.4)":"none", flexShrink:0 }}>
              {player ? (
                <span style={{ fontSize:8, textAlign:"center", lineHeight:1.1, padding:"0 2px", color:"white", fontWeight:700 }}>
                  {player.number}<br/>{(player.nameKo||player.name).trim().slice(0,3)}
                </span>
              ) : (
                <span style={{ opacity:0.4, fontSize:14, color:"white" }}>+</span>
              )}
            </div>
              );
            })()}
            <div style={{ marginTop:2, fontSize:7, color:"rgba(255,255,255,0.55)", background:"rgba(0,0,0,0.35)", padding:"1px 3px", borderRadius:3 }}>{slot.pos}</div>
          </div>
        );
      })}
    </div>
  );
}

function OtherPredictions({ preds, myNickname, scores, officialPlayers, scorePreds, isHome, actualScore }) {
  const [expanded, setExpanded] = useState(null);
  // 채점 완료 시 점수 높은 순 정렬
  const sortedPreds = scores
    ? [...preds].sort((a, b) => (scores[b.nickname] || 0) - (scores[a.nickname] || 0))
    : preds;
  return (
    <div style={{ marginTop:16 }}>
      <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.1em" }}>친구들 예측 ({preds.length}명)</div>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {sortedPreds.map((p, i) => {
          const isMe = p.nickname === myNickname;
          const isOpen = expanded === p.nickname;
          const fm = FORMATION_LAYOUTS[p.formation] || FORMATION_LAYOUTS["4-3-3"];
          const readonlySlots = fm.map((pos, idx) => ({
            pos: pos.pos,
            player: (p.slots||[])[idx]?.player || null,
          }));
          return (
            <div key={i} style={{ background:isMe?"rgba(59,130,246,0.1)":"rgba(255,255,255,0.04)", border:isMe?"1px solid rgba(59,130,246,0.3)":"1px solid rgba(255,255,255,0.08)", borderRadius:10, overflow:"hidden" }}>
              <div onClick={() => setExpanded(isOpen ? null : p.nickname)}
                style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", cursor:"pointer" }}>
                <span style={{ fontSize:13, fontWeight:700, color:isMe?"#60a5fa":"white" }}>
                  {p.nickname}{isMe&&<span style={{fontSize:10,marginLeft:4,color:"#60a5fa"}}>나</span>}
                  {(() => {
                  const sp = (scorePreds||[]).find(s=>s.nickname===p.nickname);
                  if (!sp) return null;
                  const suwonWin = isHome ? sp.homeScore > sp.awayScore : sp.awayScore > sp.homeScore;
                  const scoreColor = suwonWin ? "#4ade80" : sp.homeScore===sp.awayScore ? "#fbbf24" : "#f87171";
                  // 채점 완료 시 +10/+5/❌ 표시
                  let resultBadge = null;
                  if (actualScore) {
                    const [suwonScore, oppScore] = actualScore.split(':').map(Number);
                    // score는 수원:상대 기준, 예측은 실제 홈:원정 기준
                    const rh = isHome ? suwonScore : oppScore;
                    const ra = isHome ? oppScore : suwonScore;
                    const exact = sp.homeScore===rh && sp.awayScore===ra;
                    const result = !exact && (sp.homeScore>sp.awayScore)===(rh>ra) && (sp.homeScore===sp.awayScore)===(rh===ra);
                    resultBadge = exact
                      ? <span style={{fontSize:10,marginLeft:3,color:"#4ade80"}}>🎯+15</span>
                      : result
                        ? <span style={{fontSize:10,marginLeft:3,color:"#fbbf24"}}>✅+5</span>
                        : <span style={{fontSize:10,marginLeft:3,color:"rgba(255,255,255,0.3)"}}>❌</span>;
                  }
                  return <span style={{fontSize:11,marginLeft:6,fontWeight:700,color:scoreColor,display:"inline-flex",alignItems:"center"}}>{sp.homeScore}:{sp.awayScore}{resultBadge}</span>;
                })()}
                </span>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {scores?.[p.nickname] !== undefined && (
                    <span style={{ fontSize:13, fontWeight:900, color:"#fbbf24", fontFamily:"monospace" }}>{scores[p.nickname]}pt</span>
                  )}
                  <span style={{ fontSize:11, color:"#aaa" }}>{p.formation}</span>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{isOpen?"▲":"▼"}</span>
                </div>
              </div>
              {isOpen && (
                <div style={{ padding:"0 12px 12px" }}>
                  {/* 승부 예측 스코어 */}
                  {(() => { const sp = (scorePreds||[]).find(s=>s.nickname===p.nickname); return sp ? (
                    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:16, padding:"8px 0 10px", marginBottom:8, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>승부 예측</span>
                      <span style={{ fontSize:20, fontWeight:900, color:(isHome?sp.homeScore>sp.awayScore:sp.awayScore>sp.homeScore)?"#4ade80":sp.homeScore===sp.awayScore?"#fbbf24":"#f87171" }}>
                        {sp.homeScore} : {sp.awayScore}
                      </span>
                      <span style={{ fontSize:11, color:(isHome?sp.homeScore>sp.awayScore:sp.awayScore>sp.homeScore)?"#4ade80":sp.homeScore===sp.awayScore?"#fbbf24":"#f87171" }}>
                        {(isHome?sp.homeScore>sp.awayScore:sp.awayScore>sp.homeScore)?"수원 승":sp.homeScore===sp.awayScore?"무승부":"수원 패"}
                      </span>
                    </div>
                  ) : null; })()}
                  <PitchView formation={p.formation} slots={readonlySlots} interactive={false} actualPlayers={officialPlayers} />
                  <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:4 }}>
                    {readonlySlots.filter(s=>s.player).map((s,j) => (
                      <div key={j} style={{ fontSize:10, background:"rgba(29,78,216,0.3)", border:"1px solid rgba(59,130,246,0.3)", borderRadius:6, padding:"2px 6px" }}>
                        {s.pos} {(s.player.nameKo||s.player.name).trim()}
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showChangeNick, setShowChangeNick] = useState(false);
  const [changeInput, setChangeInput] = useState("");
  const [changeError, setChangeError] = useState("");
  const [showDeleteNick, setShowDeleteNick] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
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
  const [lineupAvailable, setLineupAvailable] = useState(false);
  const [scoringStatus, setScoringStatus] = useState("");
  const [currentLineup, setCurrentLineup] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [officialLineup, setOfficialLineup] = useState(null);
  const [lineupLoading, setLineupLoading] = useState(false);
  const [viewingMatch, setViewingMatch] = useState(null);
  const [matchIncidents, setMatchIncidents] = useState([]);
  const [matchComments, setMatchComments] = useState([]);
  const [scorePreds, setScorePreds] = useState([]);
  const [myScorePred, setMyScorePred] = useState(null);
  const [scoreHome, setScoreHome] = useState(0);
  const [scoreAway, setScoreAway] = useState(0);([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentStatus, setCommentStatus] = useState("");
  const [matchPredictions, setMatchPredictions] = useState([]);
  const [historyScoringStatus, setHistoryScoringStatus] = useState("");
  const [otherPredictions, setOtherPredictions] = useState([]);
  const [rankingData, setRankingData] = useState([]);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [rankingView, setRankingView] = useState(null);
  const [rankingPredDetail, setRankingPredDetail] = useState(null);
  const [rankingScorePred, setRankingScorePred] = useState(null);
  const [rankingLineupToggle, setRankingLineupToggle] = useState("pred");
  const [rankingLineup, setRankingLineup] = useState(null);
  const [leagueStandings, setLeagueStandings] = useState([]);
  const [leagueLoading, setLeagueLoading] = useState(false);
  const [allPredData, setAllPredData] = useState({});
  const [scoreData, setScoreData] = useState({ totals: {}, detail: {} });

  useEffect(() => {
    const nn = store.get('sw:nickname');
    if (nn) { setNickname(nn); setIsLoggedIn(true); }
    fetch(`${PROXY}?path=/api/schedule`)
      .then(r => r.json())
      .then(d => {
        setPastMatches((d.past || []).filter(m => m.date.startsWith('2026')));
        setUpcomingMatches(d.upcoming || []);
        if (d.upcoming?.length > 0) {
          const firstMatch = d.upcoming[0];
          setSelectedMatch(firstMatch);
          // 초기 로딩 시 score-pred도 로드
          fetch(`${PROXY}?path=${encodeURIComponent(`/api/score-pred?matchId=${firstMatch.id}`)}`)
            .then(r => r.json())
            .then(sd => { setScorePreds(sd.predictions || []); })
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setScheduleLoading(false));
    fetch(`${PROXY}?path=/api/squad`)
      .then(r => r.json())
      .then(d => { if (d.players) setSquad(d.players); })
      .catch(() => {});
    // 초기 접속 시 점수 데이터 자동 로드
    fetch(`${PROXY}?path=/api/score`)
      .then(r => r.json())
      .then(d => setScoreData(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedMatch || !nickname) return;
    // 경기 변경시 완전 초기화
    setFormation("4-3-3");
    resetSlots("4-3-3");
    setMySubmission(null);
    setOtherPredictions([]);
    setScoringStatus("");
    // 로컬 캐시 먼저 표시 (서버 응답 전까지만)
    const cachedRaw = localStorage.getItem(`sw:pred_${selectedMatch.id}_${nickname}`);
    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw);
        if (cached && cached.formation) { setFormation(cached.formation); setSlots(cached.slots); setMySubmission(cached); }
      } catch {}
    }
    // 이전 폴링 중지
    setPollingInterval(prev => { if (prev) clearInterval(prev); return null; });
    setLineupAvailable(false);
    setCurrentLineup(null);

    const matchId = selectedMatch.id;
    const matchDate = new Date(selectedMatch.date);

    async function checkAndScore() {
      try {
        const r = await fetch(`${PROXY}?path=/api/lineup?eventId=${matchId}`);
        const d = await r.json();
        if (d.lineup?.players?.length > 0) {
          setLineupAvailable(true);
          setCurrentLineup(d.lineup);
          // 점수 새로고침 (항상)
          const scoreRes = await fetch(`${PROXY}?path=/api/score`);
          const scoreData = await scoreRes.json();
          setScoreData(scoreData);
          // 아직 채점 안 됐으면 자동 채점
          // 경기 종료 여부 확인 후 재채점
          const isFinished = d.lineup?.players?.length > 0;
          const sr = await fetch(`${PROXY}?path=/api/score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matchId, eventId: matchId }),
          });
          const sd = await sr.json();
          const scoreRes2 = await fetch(`${PROXY}?path=/api/score`);
          const scoreData2 = await scoreRes2.json();
          setScoreData(scoreData2);
          setScoringStatus("✅ 자동 채점 완료!");
          setTimeout(() => setScoringStatus(""), 5000);
          // 폴링 중지
          setPollingInterval(prev => { if (prev) clearInterval(prev); return null; });
        }
      } catch {}
    }

    // 폴링 구간 설정
    const now = new Date();
    const diffMin = (matchDate - now) / 60000; // 양수면 경기 전, 음수면 경기 후
    const inPreWindow = diffMin <= 90 && diffMin >= 0;   // 킥오프 90분 전 ~ 킥오프
    const inPostWindow = diffMin < -120;                  // 킥오프 2시간 후부터 재채점

    if (inPreWindow) {
      // 경기 전 → 선발 발표 확인 (5분마다)
      checkAndScore();
      const interval = setInterval(checkAndScore, 300000);
      setPollingInterval(interval);
    } else if (inPostWindow) {
      // 경기 종료 후 → 재채점 (5분마다, 성공하면 중단)
      checkAndScore();
      const interval = setInterval(checkAndScore, 300000);
      setPollingInterval(interval);
    } else {
      // 그 외 → 한 번만 확인
      checkAndScore();
    }

    // 서버에서 최신 데이터 확인
    fetch(`${PROXY}?path=/api/predictions?matchId=${selectedMatch.id}`)
      .then(r => r.json())
      .then(d => {
        const preds = d.predictions || [];
        const mine = preds.find(p => p.nickname === nickname);
        if (mine) {
          // 서버에 있으면 표시
          setFormation(mine.formation);
          setSlots(mine.slots);
          setMySubmission(mine);
          store.set(`sw:pred_${selectedMatch.id}_${nickname}`, mine);
        } else {
          // 서버에 없으면 삭제된 것 - 로컬도 제거
          localStorage.removeItem(`sw:pred_${selectedMatch.id}_${nickname}`);
          setMySubmission(null);
          setFormation("4-3-3");
          resetSlots("4-3-3");
        }
        setOtherPredictions(preds);
      })
      .catch(() => {});
  }, [selectedMatch?.id, nickname]);

  useEffect(() => { if (tab === "ranking") loadRanking(); }, [tab]);

  useEffect(() => {
    if (tab === "predict" && selectedMatch) {
      fetch(`${PROXY}?path=${encodeURIComponent(`/api/score-pred?matchId=${selectedMatch.id}`)}`)
        .then(r => r.json())
        .then(sd => {
          const preds = sd.predictions || [];
          setScorePreds(preds);
          const mine = preds.find(p => p.nickname === nickname);
          if (mine) { setMyScorePred(mine); setScoreHome(mine.homeScore); setScoreAway(mine.awayScore); }
          else { setMyScorePred(null); }
        })
        .catch(() => {});
    }
  }, [tab, selectedMatch]);



  useEffect(() => {
    if (tab === "predict" && selectedMatch) {
      fetch(`${PROXY}?path=${encodeURIComponent(`/api/score-pred?matchId=${selectedMatch.id}`)}`)
        .then(r => r.json())
        .then(sd => {
          const preds = sd.predictions || [];
          setScorePreds(preds);
          const mine = preds.find(p => p.nickname === nickname);
          if (mine) { setMyScorePred(mine); setScoreHome(mine.homeScore); setScoreAway(mine.awayScore); }
          else { setMyScorePred(null); }
        })
        .catch(() => {});
    }
  }, [tab]);

  useEffect(() => { if (tab === "league") loadLeague(); }, [tab]);

  async function loadLeague() {
    setLeagueLoading(true);
    try {
      const r = await fetch(`${PROXY}?path=/api/standings`);
      const d = await r.json();
      setLeagueStandings(d.standings || []);
    } catch {}
    setLeagueLoading(false);
  }

// 폴링 정리 (컴포넌트 언마운트 시)
  useEffect(() => {
    return () => {
      setPollingInterval(prev => { if (prev) clearInterval(prev); return null; });
    };
  }, []);

  function resetSlots(f) {
    const layout = FORMATION_LAYOUTS[f] || FORMATION_LAYOUTS["4-3-3"];
    setSlots(layout.map(l => ({ pos: l.pos, player: null })));
    setSelectedSlot(null);
  }

  function handleFormationChange(f) { setFormation(f); resetSlots(f); }
  function handleSlotClick(i) {
    if (selectedSlot === null) {
      // 아무것도 선택 안 된 상태 → 클릭한 슬롯 선택
      setSelectedSlot(i);
    } else if (selectedSlot === i) {
      // 같은 슬롯 클릭 → 선택 해제
      setSelectedSlot(null);
    } else if (slots[selectedSlot]?.player && slots[i]?.player) {
      // 둘 다 선수 있음 → 위치 교체
      const newSlots = slots.map((s, idx) => {
        if (idx === selectedSlot) return { ...s, player: slots[i].player };
        if (idx === i) return { ...s, player: slots[selectedSlot].player };
        return s;
      });
      setSlots(newSlots);
      setSelectedSlot(null);
    } else if (slots[selectedSlot]?.player && !slots[i]?.player) {
      // 선수 있는 곳 → 빈 곳: 이동
      const newSlots = slots.map((s, idx) => {
        if (idx === selectedSlot) return { ...s, player: null };
        if (idx === i) return { ...s, player: slots[selectedSlot].player };
        return s;
      });
      setSlots(newSlots);
      setSelectedSlot(null);
    } else {
      // 빈 곳 → 다른 곳: 새 선수 선택 모드로 전환
      setSelectedSlot(i);
    }
  }

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
    if (!selectedMatch) { setSaveStatus("경기를 먼저 선택해주세요!"); return; }
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
      // 오프라인이어도 내 예측을 otherPredictions에 반영
      setOtherPredictions(prev => {
        const idx = prev.findIndex(p => p.nickname === nickname);
        if (idx >= 0) { const next = [...prev]; next[idx] = data; return next; }
        return [...prev, data];
      });
    }
  }

  async function handleLogin() {
    const nn = loginInput.trim().slice(0, 10);
    if (!nn) { setLoginError("닉네임을 입력해주세요."); return; }
    setLoginLoading(true);
    setLoginError("");
    try {
      const r = await fetch(`${PROXY}?path=/api/auth`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ action:'login', nickname:nn }),
      });
      const d = await r.json();
      if (d.ok) {
        if (d.existing) {
          // 기존 닉네임 - 확인 메시지
          if (!window.confirm(`"${d.nickname}" 닉네임이 이미 사용 중입니다.
이 닉네임으로 계속 접속하시겠습니까?`)) {
            setLoginLoading(false);
            return;
          }
        }
        setNickname(d.nickname);
        setIsLoggedIn(true);
        store.set('sw:nickname', d.nickname);
      } else {
        setLoginError(d.error || "로그인 실패");
      }
    } catch {
      setLoginError("서버 연결 실패. 잠시 후 다시 시도해주세요.");
    }
    setLoginLoading(false);
  }

  async function handleDeleteNickname() {
    if (deletePassword !== "3579") { setDeleteError("비밀번호가 틀렸습니다."); return; }
    try {
      await fetch(`${PROXY}?path=/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', nickname }),
      });
    } catch {}
    // 로컬 데이터 정리
    Object.keys(localStorage).filter(k => k.includes(`_${nickname}`) || k === 'sw:nickname').forEach(k => localStorage.removeItem(k));
    setNickname("");
    setIsLoggedIn(false);
    setShowDeleteNick(false);
    setDeletePassword("");
    setDeleteError("");
  }

  async function handleChangeNickname() {
    const newNick = changeInput.trim().slice(0, 10);
    if (!newNick) { setChangeError("새 닉네임을 입력해주세요."); return; }
    if (newNick === nickname) { setChangeError("현재 닉네임과 동일합니다."); return; }
    try {
      const r = await fetch(`${PROXY}?path=/api/auth`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ action:'change', nickname, newNickname:newNick }),
      });
      const d = await r.json();
      if (d.existingNick) {
        setChangeError(`"${d.nickname}" 닉네임은 이미 사용 중입니다. 다른 닉네임을 입력해주세요.`);
        return;
      }
      if (d.ok) {
        // 구 닉네임 로컬캐시 정리
        const oldNick = nickname;
        Object.keys(localStorage).filter(k => k.includes(`_${oldNick}`)).forEach(k => localStorage.removeItem(k));
        setNickname(d.nickname);
        store.set('sw:nickname', d.nickname);
        setShowChangeNick(false);
        setChangeInput("");
        setChangeError("");
      } else {
        setChangeError(d.error || "변경 실패");
      }
    } catch {
      setChangeError("서버 연결 실패.");
    }
  }

  function handleLogout() {
    store.set('sw:nickname', null);
    setNickname("");
    setIsLoggedIn(false);
    setLoginInput("");
  }

  async function handleDeletePred() {
    if (!nickname || !selectedMatch) return;
    try {
      await fetch(`${PROXY}?path=${encodeURIComponent(`/api/predictions?matchId=${selectedMatch.id}&nickname=${encodeURIComponent(nickname)}`)}`, {
        method: 'DELETE',
      });
    } catch {}
    // 로컬 캐시 완전 삭제
    localStorage.removeItem(`sw:pred_${selectedMatch.id}_${nickname}`);
    setMySubmission(null);
    setFormation("4-3-3");
    resetSlots("4-3-3");
    setOtherPredictions(prev => prev.filter(p => p.nickname !== nickname));
  }

  async function loadRanking() {
    setLoadingRanking(true);
    try {
      const [predRes, scoreRes] = await Promise.all([
        fetch(`${PROXY}?path=/api/predictions`),
        fetch(`${PROXY}?path=/api/score`),
      ]);
      const d = await predRes.json();
      const sd = await scoreRes.json();
      const preds = d.predictions || {};
      setAllPredData(preds);
      setScoreData(sd);
      // 닉네임별 예측 수 집계
      const nickMap = {};
      const scoredMap = {}; // 채점된 경기만 카운트
      const detail = sd.detail || {};
      Object.entries(preds).forEach(([matchId, matchPreds]) => {
        const isScored = !!detail[matchId];
        matchPreds.forEach(p => {
          if (!nickMap[p.nickname]) nickMap[p.nickname] = 0;
          nickMap[p.nickname]++;
          if (isScored) {
            if (!scoredMap[p.nickname]) scoredMap[p.nickname] = 0;
            scoredMap[p.nickname]++;
          }
        });
      });
      const totals = sd.totals || {};
      const entries = Object.entries(nickMap).map(([nick, count]) => ({
        nickname: nick,
        count,
        scoredCount: scoredMap[nick] || 0,
        score: totals[nick] || 0,
        avg: (scoredMap[nick] || 0) > 0 ? Math.round((totals[nick] || 0) / (scoredMap[nick] || 1) * 10) / 10 : 0,
      }));
      entries.sort((a, b) => {
        const aQual = a.scoredCount >= 5;
        const bQual = b.scoredCount >= 5;
        if (aQual && !bQual) return -1;
        if (!aQual && bQual) return 1;
        return b.avg - a.avg || b.score - a.score;
      });
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
    setMatchIncidents([]); setMatchComments([]); setCommentInput(''); setCommentStatus(''); setScorePreds([]); setMyScorePred(null); setScoreHome(0); setScoreAway(0);
    setLineupLoading(true);
    try {
      const [lineupRes, predRes, incidentRes] = await Promise.all([
        fetch(`${PROXY}?path=${encodeURIComponent(`/api/lineup?eventId=${match.id}`)}`),
        fetch(`${PROXY}?path=${encodeURIComponent(`/api/predictions?matchId=${match.id}`)}`),
        fetch(`${PROXY}?path=${encodeURIComponent(`/api/incidents?eventId=${match.id}`)}`),
      ]);
      const lineupData = await lineupRes.json();
      const incidentData = await incidentRes.json();
      setMatchIncidents(incidentData.incidents || []);
      // 코멘트 로드
      const commentRes = await fetch(`${PROXY}?path=${encodeURIComponent(`/api/comments?matchId=${match.id}`)}`);
      const commentData = await commentRes.json();
      setMatchComments(commentData.comments || []);
      // 승부 예측 로드
      const scorePredRes = await fetch(`${PROXY}?path=${encodeURIComponent(`/api/score-pred?matchId=${match.id}`)}`);
      const scorePredData = await scorePredRes.json();
      const preds = scorePredData.predictions || [];
      setScorePreds(preds);
      const mine = preds.find(p => p.nickname === nickname);
      if (mine) { setMyScorePred(mine); setScoreHome(mine.homeScore); setScoreAway(mine.awayScore); }
      else { setMyScorePred(null); setScoreHome(0); setScoreAway(0); }
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
            {isLoggedIn && (
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div onClick={()=>setShowChangeNick(!showChangeNick)} style={{ fontSize:12, background:"rgba(255,255,255,0.15)", padding:"4px 10px", borderRadius:20, fontWeight:700, cursor:"pointer" }}>👤 {nickname} ✏️</div>
                <button onClick={handleLogout} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:8, padding:"4px 8px", color:"rgba(255,255,255,0.5)", fontSize:10, cursor:"pointer" }}>로그아웃</button>
              </div>
            )}
          </div>
        </div>
        <div style={{ display:"flex" }}>
          {[{id:"predict",label:"📋 선발 예측"},{id:"history",label:"📅 이전 라인업"},{id:"ranking",label:"🏆 순위표"},{id:"league",label:"📊 리그순위"}].map(t => (
            <button key={t.id} onClick={()=>{ setTab(t.id); if(t.id==="ranking"){ setRankingView(null); setRankingPredDetail(null); } if(t.id==="history"){ setViewingMatch(null); setMatchIncidents([]); setMatchComments([]); setCommentInput(''); setCommentStatus(''); setScorePreds([]); setMyScorePred(null); setScoreHome(0); setScoreAway(0); } }} style={{ flex:1, padding:"10px 0", background:"none", border:"none", borderBottom:tab===t.id?"3px solid #fbbf24":"3px solid transparent", color:tab===t.id?"#fbbf24":"rgba(255,255,255,0.55)", fontSize:12, fontWeight:tab===t.id?700:500, cursor:"pointer", fontFamily:"'Noto Sans KR',sans-serif" }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* 닉네임 삭제 모달 */}
      {showDeleteNick && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#1a1f2e", border:"1px solid rgba(239,68,68,0.3)", borderRadius:16, padding:24, width:"100%", maxWidth:360 }}>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:4, color:"white" }}>🗑️ 닉네임 삭제</div>
            <div style={{ fontSize:12, color:"#f87171", marginBottom:16 }}>삭제 후 복구가 불가능합니다.</div>
            <input type="password" value={deletePassword} onChange={e=>setDeletePassword(e.target.value)}
              placeholder="관리자 비밀번호 입력"
              onKeyDown={e=>e.key==="Enter"&&handleDeleteNickname()}
              style={{ width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, padding:"10px 12px", color:"white", fontSize:13, outline:"none", marginBottom:8, boxSizing:"border-box" }} />
            {deleteError && <div style={{ fontSize:11, color:"#f87171", marginBottom:8 }}>{deleteError}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>{setShowDeleteNick(false);setDeletePassword("");setDeleteError("");}} style={{ flex:1, padding:10, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#aaa", fontSize:13, cursor:"pointer" }}>취소</button>
              <button onClick={handleDeleteNickname} style={{ flex:1, padding:10, background:"#dc2626", border:"none", borderRadius:8, color:"white", fontSize:13, fontWeight:700, cursor:"pointer" }}>삭제</button>
            </div>
          </div>
        </div>
      )}

      {/* 닉네임 변경 모달 */}
      {showChangeNick && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#1a1f2e", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:24, width:"100%", maxWidth:360 }}>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>닉네임 변경</div>
            <input value={changeInput} onChange={e=>setChangeInput(e.target.value)}
              placeholder="새 닉네임 (최대 10자)" maxLength={10}
              onKeyDown={e=>e.key==="Enter"&&handleChangeNickname()}
              style={{ width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, padding:"10px 12px", color:"white", fontSize:13, outline:"none", marginBottom:8, boxSizing:"border-box" }} />
            {changeError && <div style={{ fontSize:11, color:"#f87171", marginBottom:8 }}>{changeError}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>{setShowChangeNick(false);setChangeError("");}} style={{ flex:1, padding:10, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#aaa", fontSize:13, cursor:"pointer" }}>취소</button>
              <button onClick={handleChangeNickname} style={{ flex:1, padding:10, background:"#1d4ed8", border:"none", borderRadius:8, color:"white", fontSize:13, fontWeight:700, cursor:"pointer" }}>변경</button>
            </div>
            <button onClick={()=>{setShowChangeNick(false);setShowDeleteNick(true);}} style={{ width:"100%", marginTop:8, padding:8, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, color:"#f87171", fontSize:12, cursor:"pointer" }}>🗑️ 닉네임 삭제</button>
          </div>
        </div>
      )}

      <div style={{ padding:16, maxWidth:480, margin:"0 auto" }}>

      {/* 로그인 화면 */}
      {!isLoggedIn ? (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:16 }}>
          <div style={{ fontSize:16, fontWeight:700, color:"rgba(255,255,255,0.7)", marginBottom:8 }}>닉네임을 입력해주세요</div>
          <div style={{ width:"100%", maxWidth:320, display:"flex", flexDirection:"column", gap:10 }}>
            <input value={loginInput} onChange={e=>setLoginInput(e.target.value)}
              placeholder="닉네임 입력 (최대 10자)" maxLength={10}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              style={{ width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"12px 14px", color:"white", fontSize:14, outline:"none", boxSizing:"border-box" }} />
            {loginError && <div style={{ fontSize:12, color:"#f87171", textAlign:"center" }}>{loginError}</div>}
            <button onClick={handleLogin} disabled={loginLoading} style={{ width:"100%", padding:14, background:"linear-gradient(135deg,#1d4ed8,#2563eb)", border:"none", borderRadius:10, color:"white", fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(37,99,235,0.4)" }}>
              {loginLoading ? "확인 중..." : "시작하기"}
            </button>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", textAlign:"center", lineHeight:1.6 }}>
              닉네임만 입력하면 바로 시작할 수 있어요!
            </div>
          </div>
        </div>
      ) : (

        <>
        {tab === "predict" && (
          <div>
            {scheduleLoading && <div style={{ textAlign:"center", padding:40, color:"rgba(255,255,255,0.4)" }}>⚽ 경기 일정 불러오는 중...</div>}
            {!scheduleLoading && upcomingMatches.length === 0 && (
              <div style={{ textAlign:"center", padding:40, color:"rgba(255,255,255,0.3)", fontSize:13 }}>예정된 경기가 없습니다.</div>
            )}
            {!scheduleLoading && upcomingMatches.length > 0 && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.1em" }}>예측할 경기 선택</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {upcomingMatches.slice(0,5).map(m => <MatchCard key={m.id} match={m} active={selectedMatch?.id===m.id} onClick={async ()=>{
                    setSelectedMatch(m);
                    setScorePreds([]); setMyScorePred(null); setScoreHome(0); setScoreAway(0);
                    try {
                      const r = await fetch(`${PROXY}?path=${encodeURIComponent(`/api/score-pred?matchId=${m.id}`)}`);
                      const d = await r.json();
                      const preds = d.predictions || [];
                      setScorePreds(preds);
                      const mine = preds.find(p => p.nickname === nickname);
                      if (mine) { setMyScorePred(mine); setScoreHome(mine.homeScore); setScoreAway(mine.awayScore); }
                    } catch {}
                  }} />)}
                </div>
              </div>
            )}
            {selectedMatch && <>
              {!mySubmission && <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.1em" }}>포메이션</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {Object.keys(FORMATION_LAYOUTS).map(f => (
                    <button key={f} onClick={()=>handleFormationChange(f)} style={{ flex:1, padding:"8px 0", minWidth:70, background:formation===f?"#1d4ed8":"rgba(255,255,255,0.05)", border:formation===f?"1.5px solid #3b82f6":"1.5px solid rgba(255,255,255,0.1)", borderRadius:8, color:"white", fontSize:12, fontWeight:700, cursor:"pointer" }}>{f}</button>
                  ))}
                </div>
              </div>}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.1em" }}>작전판 ({countFilled()}/11) · 포지션 클릭 후 선수 선택 · 선수끼리 클릭하면 위치 교체</div>
                <PitchView slots={slots} formation={formation} onSlotClick={handleSlotClick} selectedSlot={selectedSlot} interactive={true} actualPlayers={currentLineup?.players} />
              </div>
              {selectedSlot !== null && (
                <div style={{ marginBottom:12, background:"rgba(255,255,255,0.04)", border:"1.5px solid rgba(59,130,246,0.3)", borderRadius:12, padding:12 }}>
                  <div style={{ fontSize:11, color:"#60a5fa", marginBottom:10, fontWeight:700 }}>[{slots[selectedSlot]?.pos}] 포지션 선수 선택</div>
                  {squad.length === 0 && <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", padding:8 }}>⚠️ 선수 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</div>}
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
                                {p.number} {(p.nameKo||p.name).trim()}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {!scoreData.detail?.[selectedMatch?.id] && <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <button onClick={handleSave} disabled={saveStatus==="저장 중..."} style={{ width:"100%", padding:14, background:countFilled()===11?"linear-gradient(135deg,#1d4ed8,#2563eb)":"rgba(255,255,255,0.05)", border:"none", borderRadius:10, color:"white", fontSize:14, fontWeight:700, cursor:saveStatus==="저장 중..."?"not-allowed":"pointer", boxShadow:countFilled()===11?"0 4px 16px rgba(37,99,235,0.4)":"none", opacity:saveStatus==="저장 중..."?0.6:1 }}>
                  {saveStatus==="저장 중..."?"저장 중...":(mySubmission?"🔄 예측 수정하기":"✅ 예측 제출하기")} ({countFilled()}/11)
                </button>
                {mySubmission && (new Date(selectedMatch?.date) - new Date() <= 90*60*1000) && new Date(selectedMatch?.date) > new Date() && (
                  <div style={{ textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:4 }}>🔒 킥오프 90분 전부터 예측 수정이 불가합니다</div>
                )}
                {saveStatus && <div style={{ textAlign:"center", fontSize:12, padding:8, color:saveStatus.includes("✅")?"#22c55e":"#fbbf24" }}>{saveStatus}</div>}
              </div>}
              {mySubmission && (
                <div style={{ marginTop:10, padding:"10px 14px", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:8, fontSize:11, color:"#4ade80" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span>✅ 예측 완료!</span>
{selectedMatch && new Date(selectedMatch.date) > new Date() && !scoreData.detail?.[selectedMatch.id] && (
                      (new Date(selectedMatch.date) - new Date() > 90*60*1000)
                        ? <button onClick={handleDeletePred} style={{ background:"rgba(239,68,68,0.2)", border:"1px solid rgba(239,68,68,0.4)", borderRadius:6, padding:"2px 8px", color:"#fc8181", fontSize:10, cursor:"pointer" }}>삭제</button>
                        : <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>🔒 잠김</span>
                    )}
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.4)", marginTop:3 }}>{mySubmission.formation} · {new Date(mySubmission.savedAt).toLocaleString("ko-KR",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                </div>
              )}

              {/* 승부 예측 섹션 */}
              {selectedMatch && (new Date(selectedMatch.date) - new Date() > 90*60*1000) && (
                <div style={{ marginBottom:12, padding:"12px 14px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10 }}>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:10, fontWeight:700 }}>🎯 승부 예측</div>
                  {myScorePred ? (
                    // 저장된 스코어 표시 (홈:원정 순서)
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, justifyContent:"center" }}>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontSize:11, color:selectedMatch.home?"#60a5fa":"#f87171", marginBottom:4 }}>{selectedMatch.home?"수원":selectedMatch.opponent}</div>
                          <div style={{ fontSize:28, fontWeight:900, color:(selectedMatch.home?scoreHome>scoreAway:scoreAway>scoreHome)?"#4ade80":scoreHome===scoreAway?"#fbbf24":"#f87171" }}>{scoreHome}</div>
                        </div>
                        <div style={{ fontSize:20, color:"rgba(255,255,255,0.3)", fontWeight:700 }}>:</div>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontSize:11, color:selectedMatch.home?"#f87171":"#60a5fa", marginBottom:4 }}>{selectedMatch.home?selectedMatch.opponent:"수원"}</div>
                          <div style={{ fontSize:28, fontWeight:900, color:(selectedMatch.home?scoreHome>scoreAway:scoreAway>scoreHome)?"#4ade80":scoreHome===scoreAway?"#fbbf24":"#f87171" }}>{scoreAway}</div>
                        </div>
                      </div>
                      {!scoreData.detail?.[selectedMatch?.id] && ((new Date(selectedMatch?.date) - new Date() > 90*60*1000) ? <button onClick={() => setMyScorePred(null)} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:6, padding:"4px 10px", color:"#aaa", fontSize:11, cursor:"pointer" }}>수정</button> : <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>🔒 잠김</span>)}
                    </div>
                  ) : (
                    // 입력 모드
                    <div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:10 }}>
                        <div style={{ textAlign:"center", flex:1 }}>
                          <div style={{ fontSize:11, color:selectedMatch.home?"#60a5fa":"#f87171", marginBottom:6, fontWeight:700 }}>{selectedMatch.home?"수원":selectedMatch.opponent}</div>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                            <button onClick={()=>setScoreHome(Math.max(0,scoreHome-1))} style={{ width:26,height:26,borderRadius:6,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"white",fontSize:14,cursor:"pointer" }}>−</button>
                            <span style={{ fontSize:26,fontWeight:900,minWidth:28,textAlign:"center" }}>{scoreHome}</span>
                            <button onClick={()=>setScoreHome(scoreHome+1)} style={{ width:26,height:26,borderRadius:6,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"white",fontSize:14,cursor:"pointer" }}>+</button>
                          </div>
                        </div>
                        <div style={{ fontSize:18,color:"rgba(255,255,255,0.3)",fontWeight:700 }}>:</div>
                        <div style={{ textAlign:"center", flex:1 }}>
                          <div style={{ fontSize:11, color:selectedMatch.home?"#f87171":"#60a5fa", marginBottom:6, fontWeight:700 }}>{selectedMatch.home?selectedMatch.opponent:"수원"}</div>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                            <button onClick={()=>setScoreAway(Math.max(0,scoreAway-1))} style={{ width:26,height:26,borderRadius:6,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"white",fontSize:14,cursor:"pointer" }}>−</button>
                            <span style={{ fontSize:26,fontWeight:900,minWidth:28,textAlign:"center" }}>{scoreAway}</span>
                            <button onClick={()=>setScoreAway(scoreAway+1)} style={{ width:26,height:26,borderRadius:6,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"white",fontSize:14,cursor:"pointer" }}>+</button>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign:"center", fontSize:11, marginBottom:8, color: (selectedMatch.home ? scoreHome > scoreAway : scoreAway > scoreHome) ? "#4ade80" : scoreHome === scoreAway ? "#fbbf24" : "#f87171" }}>
                        {(selectedMatch.home ? scoreHome > scoreAway : scoreAway > scoreHome) ? "🔵 수원 승리" : scoreHome === scoreAway ? "⚪ 무승부" : "🔴 상대팀 승리"}
                      </div>
                    </div>
                  )}
                  {!myScorePred && <button onClick={async () => {
                    if (!nickname) return;
                    const r = await fetch(`${PROXY}?path=${encodeURIComponent(`/api/score-pred?matchId=${selectedMatch.id}`)}`, {
                      method:'POST', headers:{'Content-Type':'application/json'},
                      body: JSON.stringify({ nickname, homeScore: scoreHome, awayScore: scoreAway }),
                    });
                    const d = await r.json();
                    if (d.ok) {
                      setMyScorePred({ nickname, homeScore: scoreHome, awayScore: scoreAway });
                      setScorePreds(prev => {
                        const idx = prev.findIndex(p => p.nickname === nickname);
                        const entry = { nickname, homeScore: scoreHome, awayScore: scoreAway };
                        if (idx !== -1) { const n=[...prev]; n[idx]=entry; return n; }
                        return [...prev, entry];
                      });
                    }
                  }} style={{ width:"100%", padding:8, background:"linear-gradient(135deg,#1d4ed8,#2563eb)", border:"none", borderRadius:8, color:"white", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                    {"✅ 승부 예측 저장"}
                  </button>}
                  {/* 친구들 승부 예측 */}
                  {scorePreds.length > 0 && (
                    <div style={{ marginTop:10, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:8 }}>
                      {(scorePreds||[]).map((p, i) => (
                        <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4, fontSize:12 }}>
                          <span style={{ color: p.nickname===nickname?"#60a5fa":"white", fontWeight: p.nickname===nickname?700:400 }}>{p.nickname}</span>
                          <span style={{ fontWeight:700, color: (selectedMatch?.home ? p.homeScore > p.awayScore : p.awayScore > p.homeScore) ? "#4ade80" : p.homeScore === p.awayScore ? "#fbbf24" : "#f87171" }}>
                            {p.homeScore} : {p.awayScore}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {lineupAvailable && (
                <div style={{ marginTop:8, padding:"8px 12px", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:8, fontSize:11, color:"#4ade80", textAlign:"center" }}>
                  ✅ 선발 발표됨! {scoringStatus || "자동 채점 완료"}
                </div>
              )}
              {!lineupAvailable && selectedMatch && (
                <div style={{ marginTop:8, padding:"8px 12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, fontSize:11, color:"rgba(255,255,255,0.3)", textAlign:"center" }}>
                  ⏳ 선발 발표 대기 중... (30초마다 자동 확인)
                </div>
              )}
              {scoringStatus && (
                <div style={{ textAlign:"center", fontSize:12, padding:8, color:scoringStatus.includes("✅")?"#22c55e":"#fbbf24" }}>{scoringStatus}</div>
              )}

              {otherPredictions.length > 0 && (
                <OtherPredictions preds={otherPredictions} myNickname={nickname} scores={selectedMatch ? scoreData.detail?.[selectedMatch.id] : undefined} officialPlayers={currentLineup?.players} scorePreds={scorePreds} isHome={selectedMatch?.home} actualScore={selectedMatch?.score} />
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
                        {/* 코멘트 섹션 */}
                        <div style={{ marginBottom:12, padding:"10px 12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10 }}>
                          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8, fontWeight:700 }}>💬 한줄 코멘트</div>
                          {matchComments.length > 0 && (
                            <div style={{ marginBottom:8 }}>
                              {matchComments.map((c, i) => (
                                <div key={i} style={{ display:"flex", gap:6, marginBottom:4, fontSize:12, alignItems:"center" }}>
                                  <span style={{ color:"#60a5fa", fontWeight:700, minWidth:60, flexShrink:0 }}>{c.nickname}</span>
                                  <span style={{ color:"rgba(255,255,255,0.7)", flex:1 }}>{c.comment}</span>
                                  {c.nickname === nickname && (
                                    <button onClick={async () => {
                                      await fetch(`${PROXY}?path=${encodeURIComponent(`/api/comments?matchId=${viewingMatch.id}&nickname=${encodeURIComponent(nickname)}`)}`, { method:'DELETE' });
                                      setMatchComments(prev => prev.filter(x => x.nickname !== nickname));
                                      setCommentInput('');
                                    }} style={{ background:"none", border:"none", color:"rgba(239,68,68,0.6)", cursor:"pointer", fontSize:10, flexShrink:0 }}>삭제</button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {nickname && !matchComments.find(c => c.nickname === nickname) && (
                            <div style={{ display:"flex", gap:6 }}>
                              <input value={commentInput} onChange={e=>setCommentInput(e.target.value.slice(0,50))}
                                onKeyDown={async e => {
                                  if (e.key !== 'Enter' || !commentInput.trim()) return;
                                  const r = await fetch(`${PROXY}?path=${encodeURIComponent(`/api/comments?matchId=${viewingMatch.id}`)}`, {
                                    method:'POST', headers:{'Content-Type':'application/json'},
                                    body: JSON.stringify({ nickname, comment: commentInput }),
                                  });
                                  const d = await r.json();
                                  if (d.ok) { setMatchComments(prev => [...prev, { nickname, comment: commentInput.trim() }]); setCommentInput(''); }
                                }}
                                placeholder={`한줄 코멘트 (${commentInput.length}/50)`}
                                style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"6px 10px", color:"white", fontSize:12, outline:"none" }} />
                              <button onClick={async () => {
                                if (!commentInput.trim()) return;
                                const r = await fetch(`${PROXY}?path=${encodeURIComponent(`/api/comments?matchId=${viewingMatch.id}`)}`, {
                                  method:'POST', headers:{'Content-Type':'application/json'},
                                  body: JSON.stringify({ nickname, comment: commentInput }),
                                });
                                const d = await r.json();
                                if (d.ok) { setMatchComments(prev => [...prev, { nickname, comment: commentInput.trim() }]); setCommentInput(''); }
                              }} style={{ background:"#1d4ed8", border:"none", borderRadius:6, padding:"6px 12px", color:"white", fontSize:12, cursor:"pointer", flexShrink:0 }}>등록</button>
                            </div>
                          )}
                          {nickname && matchComments.find(c => c.nickname === nickname) && (
                            <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>삭제 후 다시 작성할 수 있습니다.</div>
                          )}
                          {!nickname && <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>로그인 후 작성 가능합니다.</div>}
                        </div>

                        {/* 득점 기록 */}
                        {matchIncidents.length > 0 && (
                          <div style={{ marginBottom:12, padding:"10px 12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10 }}>
                            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8, fontWeight:700 }}>⚽ 득점 기록</div>
                            {matchIncidents.map((inc, idx) => (
                              <div key={idx} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4, fontSize:12 }}>
                                <span style={{ color:"#fbbf24", fontWeight:700, minWidth:36 }}>
                                  {inc.time}{inc.addedTime > 0 ? `+${inc.addedTime}` : ""}'
                                </span>
                                <span>{inc.incidentClass === 'ownGoal' ? '🔴' : inc.incidentClass === 'penalty' ? '⚽P' : '⚽'}</span>
                                <span style={{ color: (viewingMatch.home ? inc.isHome : !inc.isHome) ? "#60a5fa" : "#f87171", fontWeight:600 }}>{inc.player}</span>
                                {inc.assist && <span style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>🅰️ {inc.assist}</span>}
                                <span style={{ marginLeft:"auto", color:"rgba(255,255,255,0.5)", fontSize:11 }}>{inc.homeScore}:{inc.awayScore}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginBottom:8 }}>{officialLineup.formation} 포메이션</div>
                        <PitchView formation={fmKey} slots={readonlySlots} interactive={false} />
                        <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:5 }}>
                          {officialLineup.players.map((p,i) => (
                            <div key={i} style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"4px 8px" }}>
                              <span style={{ fontSize:9, color:"#888" }}>#{p.number}</span>
                              <span style={{ fontSize:11, fontWeight:600 }}>{(p.nameKo||p.name).trim()}</span>
                            </div>
                          ))}
                        </div>
                      </>;
                    })()}
                  </div>
                </div>
                {matchPredictions.length > 0 && (
                  <OtherPredictions preds={matchPredictions} myNickname={nickname} scores={viewingMatch ? scoreData.detail?.[viewingMatch.id] : undefined} officialPlayers={officialLineup?.players} scorePreds={scorePreds} isHome={viewingMatch?.home} actualScore={viewingMatch?.score} />
                )}
                {officialLineup && matchPredictions.length > 0 && (
                  <button onClick={async () => {
                    if (historyScoringStatus === "채점 중...") return;
                    setHistoryScoringStatus("채점 중...");
                    try {
                      const r = await fetch(`${PROXY}?path=/api/score`, {
                        method:'POST',
                        headers:{'Content-Type':'application/json'},
                        body: JSON.stringify({ matchId: viewingMatch.id, eventId: viewingMatch.id }),
                      });
                      const d = await r.json();
                      setHistoryScoringStatus("✅ 채점 완료!");
                      setTimeout(() => setHistoryScoringStatus(""), 3000);
                      alert('채점 완료!\n' + Object.entries(d.scores||{}).map(([n,s])=>`${n}: ${s}pt`).join('\n'));
                    } catch {
                      setHistoryScoringStatus("채점 실패");
                      setTimeout(() => setHistoryScoringStatus(""), 3000);
                    }
                  }} disabled={historyScoringStatus === "채점 중..."} style={{ width:"100%", padding:10, background: historyScoringStatus==="채점 중..."?"rgba(251,191,36,0.05)":"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:8, color:"#fbbf24", fontSize:12, cursor:historyScoringStatus==="채점 중..."?"not-allowed":"pointer", marginBottom:8, fontWeight:700 }}>
                    {historyScoringStatus || "🏆 채점하기"}
                  </button>
                )}
                <button onClick={()=>{ setViewingMatch(null); setMatchIncidents([]); setMatchComments([]); setCommentInput(''); setCommentStatus(''); setScorePreds([]); setMyScorePred(null); setScoreHome(0); setScoreAway(0); setMatchComments([]); setCommentInput(''); setCommentStatus(''); }} style={{ width:"100%", padding:10, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"rgba(255,255,255,0.5)", fontSize:12, cursor:"pointer" }}>← 목록으로</button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {pastMatches.length===0 && <div style={{ textAlign:"center", padding:24, color:"rgba(255,255,255,0.3)" }}>이전 경기 데이터가 없습니다.</div>}
                {pastMatches.map(m => (
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

        {tab === "league" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"white" }}>📊 K리그2 순위</div>
              <button onClick={loadLeague} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"4px 10px", color:"#aaa", fontSize:11, cursor:"pointer" }}>🔄 새로고침</button>
            </div>
            {leagueLoading && <div style={{ textAlign:"center", padding:40, color:"rgba(255,255,255,0.3)" }}>로딩 중...</div>}
            {!leagueLoading && leagueStandings.length === 0 && (
              <div style={{ textAlign:"center", padding:40, color:"rgba(255,255,255,0.3)", fontSize:13 }}>순위 데이터를 불러오지 못했습니다.</div>
            )}
            {!leagueLoading && leagueStandings.length > 0 && (
              <div style={{ borderRadius:10, overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)" }}>
                {/* 헤더 */}
                <div style={{ display:"grid", gridTemplateColumns:"30px 1fr 36px 36px 50px 50px", gap:4, padding:"8px 12px", background:"rgba(255,255,255,0.05)", fontSize:10, color:"rgba(255,255,255,0.4)", fontWeight:700 }}>
                  <div>순위</div>
                  <div>팀</div>
                  <div style={{ textAlign:"center" }}>경기</div>
                  <div style={{ textAlign:"center" }}>승점</div>
                  <div style={{ textAlign:"center" }}>득점</div>
                  <div style={{ textAlign:"center" }}>득실차</div>
                </div>
                {leagueStandings.map((row, i) => {
                  const isSuwon = row.isSuwon === true;
                  return (
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"30px 1fr 36px 36px 50px 50px", gap:4, padding:"9px 12px", background: isSuwon ? "rgba(37,99,235,0.2)" : i%2===0 ? "rgba(255,255,255,0.02)" : "transparent", borderTop:"1px solid rgba(255,255,255,0.04)", fontSize:12 }}>
                      <div style={{ color: row.position <= 2 ? "#4ade80" : row.position >= 9 ? "#f87171" : "rgba(255,255,255,0.6)", fontWeight:700 }}>{row.position}</div>
                      <div style={{ color: isSuwon ? "#60a5fa" : "white", fontWeight: isSuwon ? 700 : 400, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{row.team?.name}</div>
                      <div style={{ textAlign:"center", color:"rgba(255,255,255,0.6)" }}>{row.matches}</div>
                      <div style={{ textAlign:"center", color:"white", fontWeight:700 }}>{row.points}</div>
                      <div style={{ textAlign:"center", color:"rgba(255,255,255,0.6)" }}>{row.scoresFor}</div>
                      <div style={{ textAlign:"center", color: (row.scoresFor - row.scoresAgainst) > 0 ? "#4ade80" : (row.scoresFor - row.scoresAgainst) < 0 ? "#f87171" : "rgba(255,255,255,0.6)" }}>
                        {(row.scoresFor - row.scoresAgainst) > 0 ? "+" : ""}{row.scoresFor - row.scoresAgainst}
                      </div>
                    </div>
                  );
                })}
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
                    <button onClick={() => { setRankingPredDetail(null); setRankingLineup(null); setRankingScorePred(null); }} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"5px 10px", color:"#aaa", fontSize:12, cursor:"pointer", marginBottom:12 }}>← 경기 목록</button>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8 }}>{rankingPredDetail.formation}</div>
                    {rankingScorePred && (
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, padding:"8px 12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8 }}>
                        <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>🎯 승부 예측</span>
                        <span style={{ fontSize:18, fontWeight:900, color:(rankingPredDetail?.isHome ? rankingScorePred.homeScore>rankingScorePred.awayScore : rankingScorePred.awayScore>rankingScorePred.homeScore)?"#4ade80":rankingScorePred.homeScore===rankingScorePred.awayScore?"#fbbf24":"#f87171" }}>
                          {rankingScorePred.homeScore} : {rankingScorePred.awayScore}
                        </span>
                        {rankingPredDetail?.score && (() => {
                          const [sw, ow] = rankingPredDetail.score.split(':').map(Number);
                          const rh = rankingPredDetail.isHome ? sw : ow;
                          const ra = rankingPredDetail.isHome ? ow : sw;
                          const exact = rankingScorePred.homeScore===rh && rankingScorePred.awayScore===ra;
                          const result = !exact && (rankingScorePred.homeScore>rankingScorePred.awayScore)===(rh>ra) && (rankingScorePred.homeScore===rankingScorePred.awayScore)===(rh===ra);
                          return exact
                            ? <span style={{fontSize:11,color:"#4ade80",fontWeight:700}}>🎯 +15pt</span>
                            : result
                              ? <span style={{fontSize:11,color:"#fbbf24",fontWeight:700}}>✅ +5pt</span>
                              : <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>❌</span>;
                        })()}
                      </div>
                    )}
                    {/* 토글 버튼 */}
                   {/* 토글 버튼 */}
                   <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                     <button onClick={()=>setRankingLineupToggle("pred")} style={{ flex:1, padding:"6px 0", borderRadius:8, border:"none", fontSize:11, fontWeight:700, cursor:"pointer", background:rankingLineupToggle==="pred"?"#1d4ed8":"rgba(255,255,255,0.08)", color:"white" }}>내 예측</button>
                     <button onClick={()=>setRankingLineupToggle("actual")} disabled={!rankingLineup} style={{ flex:1, padding:"6px 0", borderRadius:8, border:"none", fontSize:11, fontWeight:700, cursor:"pointer", background:rankingLineupToggle==="actual"?"#1d4ed8":"rgba(255,255,255,0.08)", color:rankingLineup?"white":"rgba(255,255,255,0.3)" }}>실제 선발</button>
                   </div>
                   {rankingLineupToggle === "pred"
                     ? <PitchView formation={rankingPredDetail.formation} slots={rankingPredDetail.slots} interactive={false} actualPlayers={rankingLineup?.players} />
                     : rankingLineup
                       ? <PitchView formation={rankingLineup.formation} slots={rankingLineup.players.map((p,i)=>({ pos:["GK","CB","CB","LB","RB","CM","CM","LM","RM","ST","ST"][i]||"CM", player:{...p, nameKo:p.nameKo||p.name} }))} interactive={false} />
                       : <div style={{textAlign:"center",padding:20,fontSize:12,color:"rgba(255,255,255,0.3)"}}>선발 데이터 없음</div>
                   }
                    <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:4 }}>
                      {(rankingPredDetail.slots||[]).filter(s=>s.player).map((s,j) => (
                        <div key={j} style={{ fontSize:10, background:"rgba(29,78,216,0.3)", border:"1px solid rgba(59,130,246,0.3)", borderRadius:6, padding:"2px 6px" }}>
                          {s.pos} {(s.player.nameKo||s.player.name).trim()}
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
                        <div key={i} onClick={() => {
                          setRankingPredDetail(p);
                          setRankingLineup(null);
                          setRankingScorePred(null);
                          setRankingLineupToggle("pred");
                          fetch(`${PROXY}?path=/api/lineup?eventId=${p.matchId}`)
                            .then(r => r.json())
                            .then(d => { if (d.lineup?.players?.length > 0) setRankingLineup(d.lineup); })
                            .catch(() => {});
                          fetch(`${PROXY}?path=${encodeURIComponent(`/api/score-pred?matchId=${p.matchId}`)}`)
                            .then(r => r.json())
                            .then(d => {
                              const sp = (d.predictions||[]).find(s => s.nickname === rankingView.nickname);
                              setRankingScorePred(sp || null);
                            })
                            .catch(() => {});
                        }}
                          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 14px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div>
                            <div style={{ fontSize:12, fontWeight:700 }}>{p.round ? `${p.round}R` : ''} vs {p.opponent}</div>
                            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{p.formation} · {d.toLocaleDateString('ko-KR',{month:'short',day:'numeric'})}</div>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            {scoreData.detail?.[p.matchId]?.[rankingView.nickname] !== undefined && (
                              <div style={{ fontSize:14, fontWeight:900, color:"#fbbf24", fontFamily:"monospace" }}>{scoreData.detail[p.matchId][rankingView.nickname]}pt</div>
                            )}
                            <div style={{ fontSize:12, color:"#60a5fa" }}>보기 →</div>
                          </div>
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
                        preds.filter(p => p.nickname === entry.nickname).map(p => {
                          const matchInfo = [...(pastMatches||[]), ...(upcomingMatches||[])].find(m => m.id === matchId);
                          return { ...p, isHome: matchInfo?.home, score: matchInfo?.score };
                        })
                      );
                      return (
                        <div key={idx} onClick={() => { setRankingView({ nickname: entry.nickname, preds: myPreds }); setRankingPredDetail(null); }}
                          style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:entry.nickname===nickname?"rgba(59,130,246,0.1)":"rgba(255,255,255,0.03)", border:entry.nickname===nickname?"1.5px solid rgba(59,130,246,0.4)":"1.5px solid rgba(255,255,255,0.06)", borderRadius:10, cursor:"pointer" }}>
                          <div style={{ width:28, height:28, borderRadius:"50%", background:idx===0?"#fbbf24":idx===1?"#94a3b8":idx===2?"#cd7c3f":"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:idx<3?"#0a0e1a":"rgba(255,255,255,0.4)", flexShrink:0 }}>{entry.scoredCount >= 5 ? idx+1 : "-"}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:700 }}>{entry.nickname}{entry.nickname===nickname&&<span style={{ fontSize:10, color:"#60a5fa", marginLeft:6 }}>나</span>}</div>
                            <div style={{ fontSize:10, color: entry.scoredCount >= 5 ? "rgba(255,255,255,0.3)" : "#f87171" }}>예측 {entry.scoredCount}경기{entry.scoredCount < 5 ? ` (${5-entry.scoredCount}경기 더 필요)` : ""}</div>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            <div style={{ fontSize:18, fontWeight:900, color:"#fbbf24", fontFamily:"monospace" }}>{entry.avg}pt</div>
                            <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>총 {entry.score}pt · ›</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div style={{ marginTop:16, padding:"12px 14px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, fontSize:11, color:"rgba(255,255,255,0.35)", lineHeight:1.8 }}>
                  <div style={{ fontWeight:700, color:"rgba(255,255,255,0.5)", marginBottom:4 }}>📌 채점 기준</div>
                  선발 선수 1명 적중 = +5pt<br/>11명 전원 적중 = 보너스 +30pt<br/>승부예측 정확한 스코어 = +15pt<br/>승부예측 승무패만 맞춤 = +5pt<br/>경기당 최대 100pt
                </div>
              </div>
            )}
          </div>
        )}
      </>
      )}
      </div>
    </div>
  );
