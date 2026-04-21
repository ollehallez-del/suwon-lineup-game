'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

// ── 상수 ──────────────────────────────────────────────────────────────────────
const BLUE = '#004B9A';
const BLUE_L = '#1565C0';

const FORMATIONS = {
  '4-3-3': {
    positions: [
      { id: 'gk',  label: 'GK',  x: 50, y: 88 },
      { id: 'lb',  label: 'LB',  x: 15, y: 70 },
      { id: 'cb1', label: 'CB',  x: 35, y: 72 },
      { id: 'cb2', label: 'CB',  x: 65, y: 72 },
      { id: 'rb',  label: 'RB',  x: 85, y: 70 },
      { id: 'lcm', label: 'CM',  x: 25, y: 52 },
      { id: 'cm',  label: 'CM',  x: 50, y: 50 },
      { id: 'rcm', label: 'CM',  x: 75, y: 52 },
      { id: 'lw',  label: 'LW',  x: 18, y: 28 },
      { id: 'st',  label: 'ST',  x: 50, y: 22 },
      { id: 'rw',  label: 'RW',  x: 82, y: 28 },
    ],
  },
  '4-4-2': {
    positions: [
      { id: 'gk',  label: 'GK', x: 50, y: 88 },
      { id: 'lb',  label: 'LB', x: 15, y: 70 },
      { id: 'cb1', label: 'CB', x: 33, y: 72 },
      { id: 'cb2', label: 'CB', x: 67, y: 72 },
      { id: 'rb',  label: 'RB', x: 85, y: 70 },
      { id: 'lm',  label: 'LM', x: 15, y: 50 },
      { id: 'cm1', label: 'CM', x: 37, y: 50 },
      { id: 'cm2', label: 'CM', x: 63, y: 50 },
      { id: 'rm',  label: 'RM', x: 85, y: 50 },
      { id: 'st1', label: 'ST', x: 35, y: 25 },
      { id: 'st2', label: 'ST', x: 65, y: 25 },
    ],
  },
  '4-2-3-1': {
    positions: [
      { id: 'gk',  label: 'GK',  x: 50, y: 88 },
      { id: 'lb',  label: 'LB',  x: 15, y: 72 },
      { id: 'cb1', label: 'CB',  x: 35, y: 72 },
      { id: 'cb2', label: 'CB',  x: 65, y: 72 },
      { id: 'rb',  label: 'RB',  x: 85, y: 72 },
      { id: 'dm1', label: 'DM',  x: 35, y: 58 },
      { id: 'dm2', label: 'DM',  x: 65, y: 58 },
      { id: 'lam', label: 'LAM', x: 18, y: 38 },
      { id: 'cam', label: 'CAM', x: 50, y: 38 },
      { id: 'ram', label: 'RAM', x: 82, y: 38 },
      { id: 'st',  label: 'ST',  x: 50, y: 20 },
    ],
  },
  '3-5-2': {
    positions: [
      { id: 'gk',  label: 'GK',  x: 50, y: 88 },
      { id: 'cb1', label: 'CB',  x: 25, y: 72 },
      { id: 'cb2', label: 'CB',  x: 50, y: 72 },
      { id: 'cb3', label: 'CB',  x: 75, y: 72 },
      { id: 'lwb', label: 'LWB', x: 10, y: 52 },
      { id: 'cm1', label: 'CM',  x: 30, y: 52 },
      { id: 'cm2', label: 'CM',  x: 50, y: 52 },
      { id: 'cm3', label: 'CM',  x: 70, y: 52 },
      { id: 'rwb', label: 'RWB', x: 90, y: 52 },
      { id: 'st1', label: 'ST',  x: 35, y: 25 },
      { id: 'st2', label: 'ST',  x: 65, y: 25 },
    ],
  },
};

const POS_COLORS = { G: '#f6ad55', D: '#68d391', M: '#63b3ed', F: '#fc8181' };

// ── localStorage 헬퍼 ─────────────────────────────────────────────────────────
const store = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ── 피치 컴포넌트 ─────────────────────────────────────────────────────────────
function Pitch({ formation, slots, onSlotClick, onSlotMove, selectedPlayer, onRemove, readOnly = false }) {
  const ref = useRef(null);
  const drag = useRef(null);
  const fmData = FORMATIONS[formation] || FORMATIONS['4-3-3'];

  const getXY = (cx, cy) => {
    const r = ref.current.getBoundingClientRect();
    return { x: Math.max(5, Math.min(95, ((cx - r.left) / r.width) * 100)), y: Math.max(5, Math.min(95, ((cy - r.top) / r.height) * 100)) };
  };
  const onMove = useCallback((e) => {
    if (!drag.current || readOnly) return;
    const { x, y } = getXY(e.touches ? e.touches[0].clientX : e.clientX, e.touches ? e.touches[0].clientY : e.clientY);
    onSlotMove?.(drag.current, x, y);
  }, [readOnly]);
  const onUp = useCallback(() => { drag.current = null; }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [onMove, onUp]);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', paddingBottom: '145%', background: 'linear-gradient(180deg,#1a4d0a 0%,#2d5a1b 25%,#1e4a10 50%,#2d5a1b 75%,#1a4d0a 100%)', borderRadius: 12, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.15)', userSelect: 'none', touchAction: 'none' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.35 }} viewBox="0 0 100 145" preserveAspectRatio="none">
        <rect x="3" y="3" width="94" height="139" fill="none" stroke="white" strokeWidth="0.8" />
        <line x1="3" y1="72.5" x2="97" y2="72.5" stroke="white" strokeWidth="0.8" />
        <circle cx="50" cy="72.5" r="12" fill="none" stroke="white" strokeWidth="0.8" />
        <rect x="21" y="3" width="58" height="22" fill="none" stroke="white" strokeWidth="0.8" />
        <rect x="31" y="3" width="38" height="11" fill="none" stroke="white" strokeWidth="0.8" />
        <rect x="21" y="120" width="58" height="22" fill="none" stroke="white" strokeWidth="0.8" />
        <rect x="31" y="131" width="38" height="11" fill="none" stroke="white" strokeWidth="0.8" />
        <rect x="40" y="1" width="20" height="3" fill="none" stroke="white" strokeWidth="0.8" />
        <rect x="40" y="141" width="20" height="3" fill="none" stroke="white" strokeWidth="0.8" />
      </svg>
      {fmData.positions.map((fp) => {
        const slot = slots[fp.id];
        const px = slot?.customPos?.x ?? fp.x;
        const py = slot?.customPos?.y ?? fp.y;
        const player = slot?.player;
        const isHl = selectedPlayer && !player;
        const col = player ? (POS_COLORS[player.position?.[0]] || '#90cdf4') : isHl ? 'rgba(255,220,0,0.8)' : 'rgba(255,255,255,0.4)';
        return (
          <div key={fp.id}
            onMouseDown={(e) => { if (readOnly) return; e.preventDefault(); drag.current = fp.id; }}
            onTouchStart={() => { if (readOnly) return; drag.current = fp.id; }}
            onClick={() => { if (!drag.current) onSlotClick?.(fp.id); }}
            style={{ position: 'absolute', left: `${px}%`, top: `${py}%`, transform: 'translate(-50%,-50%)', cursor: readOnly ? 'default' : player ? 'grab' : 'pointer', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: player ? `radial-gradient(circle at 35% 35%,${BLUE_L},${BLUE})` : isHl ? 'rgba(255,220,0,0.3)' : 'rgba(255,255,255,0.12)', border: `2.5px solid ${col}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: player ? `0 4px 12px rgba(0,0,0,0.5),0 0 8px ${col}40` : 'none', fontSize: 9, color: 'white', fontWeight: 700, position: 'relative' }}>
              {player ? (<>
                <span style={{ fontSize: 13, lineHeight: 1 }}>{player.number}</span>
                <span style={{ fontSize: 7, opacity: 0.8 }}>{fp.label}</span>
                {!readOnly && <div onClick={(e) => { e.stopPropagation(); onRemove?.(fp.id); }} style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, borderRadius: '50%', background: '#e53e3e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, zIndex: 20 }}>×</div>}
              </>) : (<span style={{ opacity: 0.5, fontSize: 9 }}>{fp.label}</span>)}
            </div>
            {player && <div style={{ background: 'rgba(0,0,0,0.8)', color: 'white', fontSize: 9, fontWeight: 600, padding: '1px 5px', borderRadius: 4, whiteSpace: 'nowrap', maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.nameKo || player.name}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ── 메인 앱 ───────────────────────────────────────────────────────────────────
export default function App() {
  const [username, setUsername] = useState('');
  const [usernameSet, setUsernameSet] = useState(false);
  const [view, setView] = useState('home'); // home | predict | lineup | leaderboard | predDetail
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [viewingPred, setViewingPred] = useState(null);

  const [pastMatches, setPastMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  const [officialLineup, setOfficialLineup] = useState(null); // { formation, players }
  const [lineupLoading, setLineupLoading] = useState(false);

  const [formation, setFormation] = useState('4-3-3');
  const [slots, setSlots] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [savedPred, setSavedPred] = useState(false);

  const [allPreds, setAllPreds] = useState({});
  const [squad, setSquad] = useState([]);
  const [posFilter, setPosFilter] = useState('ALL');

  // 초기 로드
  useEffect(() => {
    const u = store.get('sw:user');
    if (u) { setUsername(u); setUsernameSet(true); }
    const p = store.get('sw:preds');
    if (p) setAllPreds(p);

    // Sofascore에서 일정 가져오기
    fetch('https://tropical-unthread-skilled.ngrok-free.dev/api/schedule')
      .then(r => r.json())
      .then(d => {
        setPastMatches(d.past || []);
        setUpcomingMatches(d.next || []);

        // 선수단은 가장 최근 경기 선발에서 추출
        if (d.past?.length > 0) {
          const latest = d.past[0];
          fetchLineupForSquad(latest.id);
        }
      })
      .catch(() => {})
      .finally(() => setScheduleLoading(false));
  }, []);

  // 선수단 추출용 (최근 경기 선발 → squad 구성)
  const fetchLineupForSquad = (eventId) => {
    fetch(`https://tropical-unthread-skilled.ngrok-free.dev/api/lineup?eventId=${eventId}`, { headers: { 'ngrok-skip-browser-warnin
      .then(r => r.json())
      .then(d => {
        if (d.lineup?.players?.length > 0) {
          const players = d.lineup.players.map(p => ({
            ...p,
            status: 'available',
          }));
          setSquad(players);
          store.set('sw:squad', players);
        }
      })
      .catch(() => {
        const cached = store.get('sw:squad');
        if (cached) setSquad(cached);
      });
  };

  // 경기 클릭
  const handleMatchClick = (m) => {
    setSelectedMatch(m);
    setOfficialLineup(null);
    const isPast = new Date(m.date) < new Date();
    if (isPast) {
      setView('lineup');
      // 선발 라인업 자동 로드
      setLineupLoading(true);
      fetch(`https://tropical-unthread-skilled.ngrok-free.dev/api/lineup?eventId=${m.id}`)
        .then(r => r.json())
        .then(d => { if (d.lineup) setOfficialLineup(d.lineup); })
        .catch(() => {})
        .finally(() => setLineupLoading(false));
    } else {
      setView('predict');
      const mine = allPreds[m.id]?.find(p => p.username === username);
      if (mine) { setFormation(mine.formation); setSlots(mine.slots); setSavedPred(true); }
      else { setSlots({}); setSavedPred(false); }
    }
  };

  // 예측 저장
  const savePred = () => {
    const updated = { ...allPreds };
    const arr = [...(updated[selectedMatch.id] || [])];
    const pred = { username, formation, slots, savedAt: new Date().toISOString() };
    const idx = arr.findIndex(p => p.username === username);
    if (idx >= 0) arr[idx] = pred; else arr.push(pred);
    updated[selectedMatch.id] = arr;
    setAllPreds(updated);
    store.set('sw:preds', updated);
    setSavedPred(true);
  };

  // 일치율 계산
  const calcScore = (pred, official) => {
    if (!official?.players) return null;
    const officialNames = official.players.map(p => p.name.toLowerCase());
    const predNames = Object.values(pred.slots).filter(s => s.player).map(s => (s.player.name || '').toLowerCase());
    let hit = 0;
    predNames.forEach(n => { if (officialNames.some(o => o.includes(n.split(' ').pop()) || n.includes(o.split(' ').pop()))) hit++; });
    return Math.round((hit / 11) * 100);
  };

  const matchPreds = selectedMatch ? (allPreds[selectedMatch.id] || []) : [];
  const rankedPreds = [...matchPreds].map(p => ({ ...p, score: calcScore(p, officialLineup) })).sort((a, b) => {
    if (a.score === null && b.score === null) return 0;
    if (a.score === null) return 1;
    if (b.score === null) return -1;
    return b.score - a.score;
  });

  const assignedNums = new Set(Object.values(slots).filter(s => s.player).map(s => s.player.number));
  const filteredSquad = squad.filter(p => posFilter === 'ALL' || p.position?.[0] === posFilter.replace('GK', 'G').replace('DF', 'D').replace('MF', 'M').replace('FW', 'F'));

  // ── 닉네임 화면 ─────────────────────────────────────────────────────────────
  if (!usernameSet) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0e1a,#0d1b2a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '48px 40px', width: 'min(90%,360px)', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: `radial-gradient(circle,${BLUE_L},${BLUE})`, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: '0 8px 32px rgba(0,75,154,0.5)' }}>⚽</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>수원삼성 블루윙즈</h1>
        <p style={{ color: '#aaa', fontSize: 13, marginBottom: 24 }}>선발명단 예측 게임</p>
        <input type="text" placeholder="닉네임을 입력하세요" value={username} onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && username.trim() && (store.set('sw:user', username.trim()), setUsernameSet(true))}
          style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: 15, outline: 'none', marginBottom: 12 }} />
        <button onClick={() => { if (!username.trim()) return; store.set('sw:user', username.trim()); setUsernameSet(true); }}
          style={{ width: '100%', padding: 13, borderRadius: 10, background: `linear-gradient(135deg,${BLUE_L},${BLUE})`, border: 'none', color: 'white', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 20px rgba(0,75,154,0.4)' }}>
          시작하기
        </button>
      </div>
    </div>
  );

  // ── 메인 화면 ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0e1a,#0d1b2a)' }}>
      {/* 헤더 */}
      <div style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => { setView('home'); setSelectedMatch(null); }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: `radial-gradient(circle,${BLUE_L},${BLUE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚽</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>수원삼성 블루윙즈</div>
            <div style={{ fontSize: 9, color: '#aaa' }}>선발명단 예측 게임</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {view !== 'home' && <button onClick={() => { setView('home'); setSelectedMatch(null); }} style={{ padding: '5px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa', fontSize: 11 }}>← 홈</button>}
          <span style={{ fontSize: 11, color: '#aaa' }}>👤 {username}</span>
        </div>
      </div>

      <div style={{ padding: 16, maxWidth: 800, margin: '0 auto' }}>

        {/* ── 홈: 경기 목록 ── */}
        {view === 'home' && (
          <>
            {scheduleLoading && <div style={{ textAlign: 'center', padding: 40, color: '#90cdf4' }}>⚽ 경기 일정 불러오는 중...</div>}

            {!scheduleLoading && upcomingMatches.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: '#90cdf4', fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>📅 예정 경기</div>
                {upcomingMatches.map(m => {
                  const d = new Date(m.date);
                  return (
                    <div key={m.id} onClick={() => handleMatchClick(m)} style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(0,75,154,0.15)', border: '1.5px solid rgba(0,75,154,0.35)', cursor: 'pointer', marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 10, color: '#aaa', marginBottom: 3 }}>{m.round ? `${m.round}R · ` : ''}{d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} {d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{m.home ? '수원삼성' : m.opponent} vs {m.home ? m.opponent : '수원삼성'}</div>
                          <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>{m.home ? '홈' : '원정'}</div>
                        </div>
                        <div style={{ fontSize: 11, color: '#90cdf4', background: 'rgba(144,205,244,0.1)', padding: '3px 10px', borderRadius: 20 }}>예측하기 →</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!scheduleLoading && pastMatches.length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>📋 이전 경기</div>
                {pastMatches.map(m => {
                  const d = new Date(m.date);
                  return (
                    <div key={m.id} onClick={() => handleMatchClick(m)} style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', marginBottom: 7 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>{m.round ? `${m.round}R · ` : ''}{d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{m.home ? '수원삼성' : m.opponent} vs {m.home ? m.opponent : '수원삼성'}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            {m.score && <span style={{ fontSize: 14, fontWeight: 800 }}>{m.score}</span>}
                            {m.result && <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 20, color: m.result === 'W' ? '#68d391' : m.result === 'D' ? '#f6ad55' : '#fc8181', background: m.result === 'W' ? 'rgba(104,211,145,0.15)' : m.result === 'D' ? 'rgba(246,173,85,0.15)' : 'rgba(252,129,129,0.15)' }}>{m.result === 'W' ? '승' : m.result === 'D' ? '무' : '패'}</span>}
                          </div>
                          <div style={{ fontSize: 10, color: '#555' }}>라인업 · 순위 →</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── 이전 경기: 라인업 / 순위 탭 ── */}
        {(view === 'lineup' || view === 'leaderboard') && selectedMatch && (
          <>
            <div style={{ display: 'flex', gap: 0, marginBottom: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 3 }}>
              {[['lineup', '📋 선발 라인업'], ['leaderboard', '🏆 예측 순위']].map(([v, label]) => (
                <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: 9, borderRadius: 8, border: 'none', background: view === v ? 'rgba(0,75,154,0.6)' : 'transparent', color: view === v ? 'white' : '#666', fontWeight: view === v ? 700 : 400, fontSize: 13 }}>{label}</button>
              ))}
            </div>

            {/* 선발 라인업 */}
            {view === 'lineup' && (
              <div>
                <div style={{ background: 'rgba(0,75,154,0.2)', border: '1px solid rgba(0,75,154,0.4)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 3 }}>{selectedMatch.round ? `${selectedMatch.round}R · ` : ''}{new Date(selectedMatch.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}</div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{selectedMatch.home ? '수원삼성' : selectedMatch.opponent} vs {selectedMatch.home ? selectedMatch.opponent : '수원삼성'}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
                    {selectedMatch.score && <span style={{ fontSize: 16, fontWeight: 800 }}>{selectedMatch.score}</span>}
                    {selectedMatch.result && <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, color: selectedMatch.result === 'W' ? '#68d391' : selectedMatch.result === 'D' ? '#f6ad55' : '#fc8181', background: selectedMatch.result === 'W' ? 'rgba(104,211,145,0.15)' : 'rgba(252,129,129,0.15)' }}>{selectedMatch.result === 'W' ? '승' : selectedMatch.result === 'D' ? '무' : '패'}</span>}
                  </div>
                </div>

                {lineupLoading && <div style={{ textAlign: 'center', padding: 40, color: '#90cdf4' }}>선발 명단 불러오는 중...</div>}
                {!lineupLoading && !officialLineup && <div style={{ textAlign: 'center', padding: 32, color: '#666' }}>선발 명단 데이터가 없습니다.</div>}
                {!lineupLoading && officialLineup && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                      <div style={{ fontSize: 12, color: '#aaa', fontWeight: 600 }}>실제 선발 라인업</div>
                      <span style={{ fontSize: 11, color: '#90cdf4', background: 'rgba(144,205,244,0.1)', padding: '2px 8px', borderRadius: 20 }}>{officialLineup.formation}</span>
                    </div>
                    {/* 피치 표시 */}
                    {(() => {
                      const fmKey = officialLineup.formation?.replace(/\s/g, '-') || '4-3-3';
                      const fm = FORMATIONS[fmKey] || FORMATIONS['4-3-3'];
                      const readonlySlots = {};
                      fm.positions.forEach((pos, i) => {
                        const p = officialLineup.players[i];
                        if (p) readonlySlots[pos.id] = { player: { ...p, position: p.position } };
                      });
                      return <Pitch formation={fmKey} slots={readonlySlots} readOnly />;
                    })()}
                    <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {officialLineup.players.map((p, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 8px' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: POS_COLORS[p.position?.[0]] || '#aaa' }}>{p.position}</span>
                          <span style={{ fontSize: 10, color: '#888' }}>#{p.number}</span>
                          <span style={{ fontSize: 11, fontWeight: 600 }}>{p.nameKo || p.name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 예측 순위 */}
            {view === 'leaderboard' && (
              <div>
                {!officialLineup && (
                  <div style={{ padding: 14, background: 'rgba(246,173,85,0.08)', border: '1px solid rgba(246,173,85,0.2)', borderRadius: 10, marginBottom: 12, fontSize: 12, color: '#f6ad55' }}>
                    ⏳ 선발 라인업 탭에서 먼저 명단을 확인하면 일치율이 계산됩니다.
                  </div>
                )}
                {rankedPreds.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#666', padding: 24, fontSize: 13 }}>아직 예측한 참여자가 없습니다.</div>
                ) : rankedPreds.map((p, i) => (
                  <div key={p.username} onClick={() => { setViewingPred(p); setView('predDetail'); }}
                    style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', borderRadius: 10, background: i === 0 ? 'rgba(255,215,0,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${i === 0 ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.07)'}`, marginBottom: 6, gap: 10, cursor: 'pointer' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, background: i === 0 ? 'linear-gradient(135deg,#f6d365,#fda085)' : i === 1 ? 'linear-gradient(135deg,#c0c0c0,#888)' : i === 2 ? 'linear-gradient(135deg,#cd7f32,#8b4513)' : 'rgba(255,255,255,0.1)' }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{p.username}</div>
                      <div style={{ fontSize: 10, color: '#aaa' }}>{p.formation}</div>
                    </div>
                    <div>{p.score !== null ? <div style={{ fontSize: 20, fontWeight: 800, color: p.score >= 70 ? '#68d391' : p.score >= 40 ? '#f6ad55' : '#fc8181' }}>{p.score}%</div> : <div style={{ fontSize: 11, color: '#555' }}>집계 전</div>}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>›</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── 예측 작전판 ── */}
        {view === 'predict' && selectedMatch && (
          <div>
            <div style={{ background: 'rgba(0,75,154,0.2)', border: '1px solid rgba(0,75,154,0.4)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 3 }}>{selectedMatch.round ? `${selectedMatch.round}R · ` : ''}{new Date(selectedMatch.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} {new Date(selectedMatch.date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{selectedMatch.home ? '수원삼성' : selectedMatch.opponent} vs {selectedMatch.home ? selectedMatch.opponent : '수원삼성'}</div>
            </div>

            {/* 포메이션 선택 */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {Object.keys(FORMATIONS).map(f => (
                <button key={f} onClick={() => { setFormation(f); setSlots({}); }} style={{ padding: '5px 12px', borderRadius: 20, border: `1.5px solid ${formation === f ? BLUE : 'rgba(255,255,255,0.12)'}`, background: formation === f ? 'rgba(0,75,154,0.4)' : 'rgba(255,255,255,0.05)', color: formation === f ? 'white' : '#aaa', fontSize: 11, fontWeight: formation === f ? 700 : 400 }}>{f}</button>
              ))}
            </div>

            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6, fontWeight: 600 }}>작전판 <span style={{ color: '#555', fontWeight: 400 }}>선수 선택 후 슬롯 탭 · 드래그로 이동</span></div>
            <Pitch formation={formation} slots={slots}
              onSlotClick={id => { if (selectedPlayer) { setSlots(s => ({ ...s, [id]: { ...s[id], player: selectedPlayer } })); setSelectedPlayer(null); } }}
              onSlotMove={(id, x, y) => setSlots(s => ({ ...s, [id]: { ...s[id], customPos: { x, y } } }))}
              selectedPlayer={selectedPlayer}
              onRemove={id => setSlots(s => { const n = { ...s }; if (n[id]) n[id] = { ...n[id], player: null }; return n; })} />

            {/* 선수 목록 */}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', gap: 5, marginBottom: 8, flexWrap: 'wrap' }}>
                {['ALL', 'GK', 'DF', 'MF', 'FW'].map(p => (
                  <button key={p} onClick={() => setPosFilter(p)} style={{ padding: '3px 10px', borderRadius: 20, border: `1px solid ${posFilter === p ? BLUE : 'rgba(255,255,255,0.1)'}`, background: posFilter === p ? 'rgba(0,75,154,0.3)' : 'transparent', color: posFilter === p ? 'white' : '#888', fontSize: 11 }}>{p}</button>
                ))}
              </div>
              {squad.length === 0 && <div style={{ color: '#555', fontSize: 12, padding: 8 }}>선수 데이터를 불러오는 중입니다. 이전 경기를 먼저 클릭해주세요.</div>}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(95px,1fr))', gap: 5, maxHeight: 260, overflowY: 'auto' }}>
                {filteredSquad.map(p => {
                  const isSel = selectedPlayer?.number === p.number;
                  const isAss = assignedNums.has(p.number);
                  const col = POS_COLORS[p.position?.[0]] || '#aaa';
                  return (
                    <div key={p.number} onClick={() => !isAss && setSelectedPlayer(isSel ? null : p)} style={{ padding: '6px 8px', borderRadius: 8, cursor: isAss ? 'not-allowed' : 'pointer', opacity: isAss ? 0.4 : 1, background: isSel ? 'rgba(255,220,0,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isSel ? 'rgba(255,220,0,0.5)' : 'rgba(255,255,255,0.08)'}` }}>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: col, background: `${col}20`, padding: '1px 3px', borderRadius: 3 }}>{p.position}</span>
                        <span style={{ fontSize: 9, color: '#666' }}>#{p.number}</span>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.2 }}>{p.nameKo || p.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={savePred} style={{ width: '100%', padding: 13, borderRadius: 10, marginTop: 14, background: savedPred ? 'rgba(72,187,120,0.2)' : `linear-gradient(135deg,${BLUE_L},${BLUE})`, border: savedPred ? '1.5px solid rgba(72,187,120,0.4)' : 'none', color: 'white', fontWeight: 700, fontSize: 14 }}>
              {savedPred ? '✅ 예측 저장완료' : '💾 예측 저장하기'}
            </button>
          </div>
        )}

        {/* ── 예측 상세 ── */}
        {view === 'predDetail' && viewingPred && (
          <div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>{viewingPred.username}의 예측</div>
              <div style={{ fontSize: 11, color: '#666' }}>{viewingPred.formation} · {new Date(viewingPred.savedAt).toLocaleString('ko-KR')}</div>
            </div>
            <Pitch formation={viewingPred.formation} slots={viewingPred.slots} readOnly />
            <button onClick={() => setView('leaderboard')} style={{ width: '100%', marginTop: 14, padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa', fontSize: 13 }}>← 순위로 돌아가기</button>
          </div>
        )}
      </div>
    </div>
  );
}
