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

function PitchView({ slots, formation, onSlotClick, selectedSlot, interactive, actualPlayers, squadMap }) {
  const layout = FORMATION_LAYOUTS[formation] || FORMATION_LAYOUTS["4-3-3"];

  function isHit(player) {
    if (!actualPlayers || !player) return null;
    return actualPlayers.some(ap =>
      (player.number && ap.number && String(player.number) === String(ap.number)) ||
      (player.nameKo && ap.nameKo && player.nameKo === ap.nameKo)
    );
  }

  function getPlayerId(player) {
    if (!player) return null;
    if (player.playerId) return player.playerId;
    if (!squadMap) return null;
    if (player.number && squadMap[String(player.number)]) return squadMap[String(player.number)];
    if (player.nameKo && squadMap[player.nameKo]) return squadMap[player.nameKo];
    return null;
  }

  return (
    <div style={{ position:"relative", width:"100%", paddingBottom:"155%", background:"linear-gradient(180deg,#1a4d2e 0%,#1e5c35 20%,#16a34a 40%,#1e5c35 60%,#1a4d2e 100%)", borderRadius:12, overflow:"hidden", border:"1.5px solid rgba(255,255,255,0.15)" }}>
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 100 155">
        <rect x="5" y="5" width="90" height="145" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5"/>
        <line x1="5" y1="77" x2="95" y2="77" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5"/>
        <circle cx="50" cy="77" r="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5"/>
        <rect x="20" y="5" width="60" height="20" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5"/>
        <rect x="32" y="5" width="36" height="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5"/>
        <rect x="20" y="128" width="60" height="20" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5"/>
        <rect x="32" y="141" width="36" height="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5"/>
      </svg>
      {layout.map((slot, i) => {
        const s = slots[i];
        const player = s?.player || (s?.nameKo ? s : null);
        const isSelected = selectedSlot === i;
        const hit = isHit(player);
        const pid = getPlayerId(player);

        const border = isSelected ? "3px solid #fbbf24"
          : hit === true  ? "4px solid #4ade80"
          : hit === false ? "4px solid #E14C58"
          : player ? "2px solid rgba(255,255,255,0.7)"
          : "2px dashed rgba(255,255,255,0.3)";

        const shadow = hit === true  ? "0 0 10px rgba(34,197,94,0.8)"
          : hit === false ? "0 0 10px rgba(239,68,68,0.8)"
          : player ? "0 2px 12px rgba(0,0,0,0.4)"
          : "none";

        const nameColor = hit === true ? "#4ade80" : hit === false ? "#E14C58" : "white";

        return (
          <div key={i} onClick={() => interactive && onSlotClick && onSlotClick(i)}
            style={{ position:"absolute", left:`${slot.left}%`, top:`${slot.top}%`, transform:"translate(-50%,-50%)", display:"flex", flexDirection:"column", alignItems:"center", cursor:interactive?"pointer":"default", zIndex:10, gap:2 }}>

            {/* 포지션 */}
            <div style={{ fontSize:7, fontWeight:700, color:"rgba(255,255,255,0.85)", background:"rgba(0,0,0,0.5)", padding:"1px 4px", borderRadius:3, letterSpacing:"0.05em" }}>
              {slot.pos}
            </div>

            {/* 사진 원 */}
            <div style={{ width:44, height:44, borderRadius:"50%", border, overflow:"hidden", background:"rgba(29,78,216,0.5)", boxShadow:shadow, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
              {pid ? (
                <>
                  <img
                    src={`${PROXY}?path=/api/player-image?id=${pid}`}
                    style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top", display:"block" }}
                    onError={e => { e.target.style.display="none"; e.target.nextSibling && (e.target.nextSibling.style.display="flex"); }}
                  />
                  <span style={{ display:"none", position:"absolute", inset:0, alignItems:"center", justifyContent:"center", fontSize:8, color:"white", fontWeight:700, textAlign:"center", flexDirection:"column" }}>
                    {player.number && <>{player.number}<br/></>}{(player.nameKo||player.name||"").trim().split(" ").map((w,i) => <span key={i}>{w}<br/></span>)}
                  </span>
                </>
              ) : player ? (
                <span style={{ fontSize:8, textAlign:"center", lineHeight:1.2, color:"white", fontWeight:700, padding:"0 2px" }}>
                  {player.number && <>{player.number}<br/></>}{(player.nameKo||player.name||"").trim().split(" ").map((w,i) => <span key={i}>{w}<br/></span>)}
                </span>
              ) : (
                <span style={{ opacity:0.4, fontSize:14, color:"white" }}>+</span>
              )}
            </div>

            {/* 이름 */}
            {player ? (
              <div style={{ fontSize:8, fontWeight:700, color:nameColor, textShadow:"0 1px 3px rgba(0,0,0,0.9)", background:"rgba(0,0,0,0.55)", padding:"1px 5px", borderRadius:4, textAlign:"center", maxWidth:52 }}>
                {(player.nameKo||player.name||"").trim().split(" ").map((w,i) => <span key={i}>{w}<br/></span>)}
              </div>
            ) : (
              <div style={{ fontSize:7, color:"rgba(255,255,255,0.5)", padding:"1px 3px" }}>{slot.pos}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}



function NicknameManager({ adminPassword, proxy }) {
  const [nicknames, setNicknames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [status, setStatus] = useState("");

  async function loadNicknames() {
    setLoading(true);
    try {
      const r = await fetch(`${proxy}?path=/api/admin/nicknames`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });
      const d = await r.json();
      setNicknames(d.nicknames || []);
    } catch(e) { setStatus("❌ 로드 실패"); }
    setLoading(false);
  }

  async function deleteNickname(nick) {
    if (!confirm(`"${nick}" 닉네임을 삭제하시겠습니까? 예측, 점수, 코멘트가 모두 삭제됩니다.`)) return;
    try {
      const r = await fetch(`${proxy}?path=/api/admin/nicknames`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword, nickname: nick }),
      });
      const d = await r.json();
      if (d.ok) { setStatus("✅ 삭제 완료"); loadNicknames(); }
      else setStatus("❌ " + (d.error || "삭제 실패"));
    } catch(e) { setStatus("❌ 오류"); }
  }

  async function renameNickname(oldNick, newNick) {
    if (!newNick.trim()) return;
    try {
      const r = await fetch(`${proxy}?path=/api/admin/nicknames`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword, oldNickname: oldNick, newNickname: newNick.trim() }),
      });
      const d = await r.json();
      if (d.ok) { setStatus("✅ 수정 완료"); setEditTarget(null); loadNicknames(); }
      else setStatus("❌ " + (d.error || "수정 실패"));
    } catch(e) { setStatus("❌ 오류"); }
  }

  return (
    <div>
      <button onClick={loadNicknames} style={{ background:"rgba(15,33,71,0.06)", border:"1px solid rgba(15,33,71,0.10)", borderRadius:6, padding:"6px 12px", color:"#0F2147", fontSize:12, cursor:"pointer", marginBottom:8 }}>
        {loading ? "로딩 중..." : "🔄 닉네임 목록 불러오기"}
      </button>
      {status && <div style={{ fontSize:12, padding:6, color:status.includes("✅")?"#4ade80":"#E14C58", marginBottom:8 }}>{status}</div>}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {nicknames.map(nick => (
          <div key={nick} style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(15,33,71,0.04)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:8, padding:"8px 12px" }}>
            {editTarget === nick ? (
              <>
                <input value={editValue} onChange={e=>setEditValue(e.target.value)}
                  style={{ flex:1, background:"rgba(15,33,71,0.08)", border:"1px solid rgba(15,33,71,0.18)", borderRadius:6, padding:"4px 8px", color:"#0F2147", fontSize:13 }} />
                <button onClick={()=>renameNickname(nick, editValue)} style={{ background:"#16a34a", border:"none", borderRadius:6, padding:"4px 10px", color:"white", fontSize:12, cursor:"pointer" }}>저장</button>
                <button onClick={()=>setEditTarget(null)} style={{ background:"rgba(15,33,71,0.08)", border:"none", borderRadius:6, padding:"4px 10px", color:"#0F2147", fontSize:12, cursor:"pointer" }}>취소</button>
              </>
            ) : (
              <>
                <span style={{ flex:1, fontSize:13, fontWeight:600 }}>{nick}</span>
                <button onClick={()=>{ setEditTarget(nick); setEditValue(nick); }} style={{ background:"rgba(59,130,246,0.2)", border:"1px solid rgba(59,130,246,0.3)", borderRadius:6, padding:"4px 10px", color:"#5B8DEF", fontSize:12, cursor:"pointer" }}>수정</button>
                <button onClick={()=>deleteNickname(nick)} style={{ background:"rgba(212,34,48,0.10)", border:"1px solid rgba(212,34,48,0.18)", borderRadius:6, padding:"4px 10px", color:"#E14C58", fontSize:12, cursor:"pointer" }}>삭제</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function OtherPredictions({ preds, myNickname, scores, officialPlayers, scorePreds, isHome, actualScore, match, squadMap }) {
  const [expanded, setExpanded] = useState(null);
  const sortedPreds = scores
    ? [...preds].sort((a, b) => (scores[b.nickname] || 0) - (scores[a.nickname] || 0))
    : preds;
  return (
    <div style={{ marginTop:16 }}>
      <div style={{ fontSize:11, color:"rgba(15,33,71,0.45)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.1em" }}>친구들 예측 ({preds.length}명)</div>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {sortedPreds.map((p, i) => {
          const isMe = p.nickname === myNickname;
          const isOpen = expanded === p.nickname;
          const fm = FORMATION_LAYOUTS[p.formation] || FORMATION_LAYOUTS["4-3-3"];
          const readonlySlots = fm.map((pos, idx) => ({
            pos: pos.pos,
            player: (p.slots||[])[idx]?.player || null,
          }));
          const sp = (scorePreds||[]).find(s => s.nickname === p.nickname);
          const matchScore = scores?.[p.nickname] || 0;
          const hitCount = officialPlayers
            ? readonlySlots.filter(s => s.player && officialPlayers.some(ap =>
                (s.player.number && String(s.player.number)===String(ap.number)) ||
                (s.player.nameKo && s.player.nameKo===ap.nameKo)
              )).length
            : null;
          const spDisplay = sp
            ? (isHome ? sp.homeScore : sp.awayScore) + ':' + (isHome ? sp.awayScore : sp.homeScore)
            : null;
          return (
            <div key={i} style={{ background:isMe?"rgba(59,130,246,0.1)":"rgba(15,33,71,0.04)", border:isMe?"1px solid rgba(59,130,246,0.3)":"1px solid rgba(15,33,71,0.06)", borderRadius:10, overflow:"hidden" }}>
              {/* 헤더 */}
              <div onClick={() => setExpanded(isOpen ? null : p.nickname)}
                style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:isMe?"#5B8DEF":"#0F2147" }}>
                    {p.nickname}{isMe && <span style={{ fontSize:10, marginLeft:4, color:"#5B8DEF" }}>나</span>}
                  </span>
                  {(() => {
                    const sp = (scorePreds||[]).find(s => s.nickname === p.nickname);
                    if (!sp) return <span style={{ fontSize:10, color:"rgba(15,33,71,0.18)", background:"rgba(15,33,71,0.04)", borderRadius:5, padding:"1px 6px" }}>승부예측 없음</span>;
                    const suwon = isHome ? sp.homeScore : sp.awayScore;
                    const opp   = isHome ? sp.awayScore : sp.homeScore;
                    return <span style={{ fontSize:11, fontWeight:700, color:"#5B8DEF", background:"rgba(96,165,250,0.1)", border:"1px solid rgba(96,165,250,0.3)", borderRadius:6, padding:"2px 7px" }}>{suwon}:{opp}</span>;
                  })()}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {scores && <span style={{ fontSize:13, fontWeight:900, color:"#0F2147", fontFamily:"monospace" }}>{matchScore}pt</span>}
                  <span style={{ fontSize:12, color:"rgba(15,33,71,0.45)" }}>{isOpen?"▲":"▼"}</span>
                </div>
              </div>

              {/* 펼쳤을 때 */}
              {isOpen && (
                <div style={{ padding:"0 12px 12px" }}>

                  {/* 선발적중 / 승부예측 / 총점 3칸 */}
                  {scores && (
                    <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                      {hitCount !== null && (
                        <div style={{ flex:1, background:"rgba(15,33,71,0.04)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:10, padding:"8px 10px", textAlign:"center" }}>
                          <div style={{ fontSize:9, color:"rgba(15,33,71,0.45)", marginBottom:3 }}>선발 적중</div>
                          <div style={{ fontSize:16, fontWeight:900, color:"#0F2147" }}>{hitCount}/11</div>
                        </div>
                      )}
                      {sp && (
                        <div style={{ flex:1, background:"rgba(15,33,71,0.04)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:10, padding:"8px 10px", textAlign:"center" }}>
                          <div style={{ fontSize:9, color:"rgba(15,33,71,0.45)", marginBottom:3 }}>승부예측</div>
                          <div style={{ fontSize:16, fontWeight:900, color:"#5B8DEF" }}>{spDisplay}</div>
                        </div>
                      )}
                      <div style={{ flex:1, background:"rgba(15,33,71,0.04)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:10, padding:"8px 10px", textAlign:"center" }}>
                        <div style={{ fontSize:9, color:"rgba(15,33,71,0.45)", marginBottom:3 }}>총점</div>
                        <div style={{ fontSize:16, fontWeight:900, color:"#0F2147" }}>{matchScore}pt</div>
                      </div>
                    </div>
                  )}

                  {/* 채점 내역 */}
                  {scores && (
                    <div style={{ marginBottom:12, padding:"10px 12px", background:"rgba(15,33,71,0.03)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:10 }}>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
                        {hitCount !== null && (
                          <span style={{ fontSize:11, background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:6, padding:"3px 8px", color:"#fbbf24", fontWeight:700 }}>
                            ⚽ {hitCount}명 적중 +{hitCount*5}pt
                          </span>
                        )}
                        {hitCount === 11 && (
                          <span style={{ fontSize:11, background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:6, padding:"3px 8px", color:"#fbbf24", fontWeight:700 }}>
                            🌟 전원 보너스 +30pt
                          </span>
                        )}
                        {(() => {
                          if (!sp || !actualScore) return null;
                          const [as, ao] = actualScore.split(':').map(Number);
                          const exact = (isHome ? sp.homeScore : sp.awayScore) === as && (isHome ? sp.awayScore : sp.homeScore) === ao;
                          const actualWin = as > ao; const spWin = (isHome ? sp.homeScore : sp.awayScore) > (isHome ? sp.awayScore : sp.homeScore);
                          const actualDraw = as === ao; const spDraw = sp.homeScore === sp.awayScore;
                          const resultMatch = !exact && spWin === actualWin && spDraw === actualDraw;
                          if (exact) return <span style={{ fontSize:11, background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:6, padding:"3px 8px", color:"#4ade80", fontWeight:700 }}>🎯 정확한 스코어 +15pt</span>;
                          if (resultMatch) return <span style={{ fontSize:11, background:"rgba(96,165,250,0.15)", border:"1px solid rgba(96,165,250,0.3)", borderRadius:6, padding:"3px 8px", color:"#5B8DEF", fontWeight:700 }}>✅ 승무패 적중 +5pt</span>;
                          return <span style={{ fontSize:11, background:"rgba(212,34,48,0.10)", border:"1px solid rgba(212,34,48,0.18)", borderRadius:6, padding:"3px 8px", color:"#E14C58", fontWeight:700 }}>❌ 승부예측 미적중</span>;
                        })()}
                        <span style={{ fontSize:13, fontWeight:900, color:"#0F2147", marginLeft:"auto", fontFamily:"monospace" }}>= {matchScore}pt</span>
                      </div>
                    </div>
                  )}

                  {/* 포메이션 + 작전판 */}
                  <div style={{ fontSize:10, color:"rgba(15,33,71,0.4)", marginBottom:8 }}>{p.formation} 포메이션</div>
                  <PitchView formation={p.formation} slots={readonlySlots} interactive={false} actualPlayers={officialPlayers} squadMap={squadMap} />

                  {/* 하단 배지 */}
                  <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:5 }}>
                    {readonlySlots.filter(s=>s.player).map((s,j) => {
                      const matched = officialPlayers
                        ? officialPlayers.some(ap =>
                            (s.player.number && String(s.player.number)===String(ap.number)) ||
                            (s.player.nameKo && s.player.nameKo===ap.nameKo)
                          )
                        : null;
                      const bg = matched===true ? "rgba(34,197,94,0.1)" : matched===false ? "rgba(212,34,48,0.10)" : "rgba(15,33,71,0.05)";
                      const border = matched===true ? "1px solid rgba(34,197,94,0.3)" : matched===false ? "1px solid rgba(212,34,48,0.28)" : "1px solid rgba(15,33,71,0.08)";
                      const color = matched===true ? "#4ade80" : matched===false ? "#E14C58" : "white";
                      const numColor = matched===true ? "#4ade80" : matched===false ? "#E14C58" : "#888";
                      return (
                        <div key={j} style={{ display:"flex", alignItems:"center", gap:4, background:bg, border, borderRadius:8, padding:"4px 8px" }}>
                          <span style={{ fontSize:9, color:numColor }}>#{s.player.number}</span>
                          <span style={{ fontSize:11, fontWeight:600, color }}>{(s.player.nameKo||s.player.name).trim()}</span>
                        </div>
                      );
                    })}
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


function MatchCard({ match, active, onClick, lineupAvailable, selectedMatch }) {
  const isPast = match.status === 'finished';
  const resultLabel = match.result === 'W' ? '승' : match.result === 'D' ? '무' : match.result === 'L' ? '패' : null;
  const resultColor = match.result === 'W' ? '#22c55e' : match.result === 'D' ? '#0F2147' : '#D42230';
  const d = new Date(match.kickoffISO || match.date);
  const dateStr = `${d.getMonth()+1}/${d.getDate()}`;
  const timeStr = d.toLocaleTimeString('ko-KR', { hour:'2-digit', minute:'2-digit' });
  return (
    <div onClick={onClick} style={{ padding:"10px 14px", borderRadius:10, border:active?"2px solid #3B82F6":"1.5px solid rgba(15,33,71,0.06)", background:active?"rgba(59,130,246,0.1)":"rgba(15,33,71,0.03)", cursor:"pointer" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:10, color:"rgba(15,33,71,0.45)", marginBottom:2 }}>{match.tournament === 'Korean Cup' ? `코리아컵 ${match.roundName || ''}` : match.round ? `${match.round}R` : ''} · {dateStr} {!isPast&&timeStr} · {match.home?"홈":"원정"}</div>
          <div style={{ fontSize:13, fontWeight:700, color:"#0F2147" }}>vs {match.opponent}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          {isPast && match.score && <>
            <div style={{ fontSize:16, fontWeight:900, color:resultColor, fontFamily:"monospace" }}>{match.score}</div>
            <div style={{ fontSize:10, color:resultColor, fontWeight:700 }}>{resultLabel}</div>
          </>}
          {!isPast && <div style={{ fontSize:10, color: lineupAvailable && selectedMatch?.id === match.id ? "#4ade80" : "#5B8DEF", fontWeight:700 }}>{lineupAvailable && selectedMatch?.id === match.id ? "라인업 발표" : "예측 가능"}</div>}
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
  const [squadMap, setSquadMap] = useState({}); // number/nameKo → playerId
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
  const [scoreAway, setScoreAway] = useState(0);
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
  const [adminPassword, setAdminPassword] = useState("");
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminMatch, setAdminMatch] = useState(null);
  const [adminFormation, setAdminFormation] = useState("4-3-3");
  const [adminPlayers, setAdminPlayers] = useState([]);
  const [adminHomeScore, setAdminHomeScore] = useState(0);
  const [adminAwayScore, setAdminAwayScore] = useState(0);
  const [adminStatus, setAdminStatus] = useState("");
  const [adminTapCount, setAdminTapCount] = useState(0);

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
      .then(d => {
        if (d.players) {
          setSquad(d.players);
          // 번호/이름 → playerId 매핑
          const map = {};
          d.players.forEach(p => {
            if (p.playerId) {
              map[String(p.number)] = p.playerId;
              map[p.nameKo] = p.playerId;
            }
          });
          setSquadMap(map);
        }
      })
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

  function changeFormationKeepPlayers(f) {
    const layout = FORMATION_LAYOUTS[f] || FORMATION_LAYOUTS["4-3-3"];
    setFormation(f);
    setSlots(prev => {
      const currentPlayers = prev.map(s => s.player).filter(Boolean);
      return layout.map((l, i) => ({ pos: l.pos, player: currentPlayers[i] || null }));
    });
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
      const predRes = await fetch(`${PROXY}?path=/api/predictions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const predJson = await predRes.json();
      if (predJson.locked) {
        setSaveStatus("🔒 킥오프 2시간 전부터 예측을 변경할 수 없어요");
        setTimeout(() => setSaveStatus(""), 3000);
        return;
      }
      store.set(`sw:pred_${selectedMatch.id}_${nickname}`, data);
      setMySubmission(data);

      // 승부예측도 함께 저장
      try {
        const spRes = await fetch(`${PROXY}?path=${encodeURIComponent(`/api/score-pred?matchId=${selectedMatch.id}`)}`, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ nickname, homeScore: scoreHome, awayScore: scoreAway }),
        });
        const spJson = await spRes.json();
        if (spJson.locked) {
          setSaveStatus("✅ 선발 저장 완료! (승부예측은 잠금됨)");
        } else if (spJson.ok) {
          setMyScorePred({ nickname, homeScore: scoreHome, awayScore: scoreAway });
          setScorePreds(prev => {
            const idx = prev.findIndex(p => p.nickname === nickname);
            const entry = { nickname, homeScore: scoreHome, awayScore: scoreAway };
            if (idx !== -1) { const n=[...prev]; n[idx]=entry; return n; }
            return [...prev, entry];
          });
          setSaveStatus("✅ 선발 예측 + 승부예측 저장 완료!");
        }
      } catch(e) {
        setSaveStatus("✅ 선발 저장 완료!");
      }
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
    <div style={{ minHeight:"100vh", background:"#F0F3F9", color:"#0F2147", fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap" rel="stylesheet" />

      <div style={{ height:4, background:"linear-gradient(90deg,#0F2147 0%,#0F2147 33%,#FFFFFF 33%,#FFFFFF 66%,#D42230 66%,#D42230 100%)" }} />
      <div style={{ background:"linear-gradient(135deg,#0F2147 0%,#1D4ED8 50%,#3B82F6 100%)", padding:"16px 20px 0", boxShadow:"0 4px 24px rgba(0,0,0,0.4)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
          <div onClick={() => {
            const next = adminTapCount + 1;
            setAdminTapCount(next);
            if (next >= 5) {
              setTab("admin");
              setAdminTapCount(0);
            }
          }} style={{ cursor:"pointer", width:40, height:40, borderRadius:"50%", background:"white", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", flexShrink:0 }}>
            <img src="/suwon.png" style={{ width:"85%", height:"85%", objectFit:"contain" }} onError={e => { e.target.style.display="none"; e.target.parentNode.innerHTML="⚽"; }} />
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:900, letterSpacing:"-0.02em", whiteSpace:"nowrap", color:"white" }}>수원삼성 선발 예측</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)" }}>2026 K리그2 · 이정효 감독</div>
          </div>
          <div style={{ marginLeft:"auto" }}>
            {isLoggedIn && (
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div onClick={()=>setShowChangeNick(!showChangeNick)} style={{ fontSize:12, background:"rgba(15,33,71,0.12)", padding:"4px 10px", borderRadius:20, fontWeight:700, cursor:"pointer" }}>👤 {nickname} ✏️</div>
                <button onClick={handleLogout} style={{ background:"rgba(15,33,71,0.08)", border:"none", borderRadius:8, padding:"4px 8px", color:"rgba(15,33,71,0.55)", fontSize:10, cursor:"pointer" }}>로그아웃</button>
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
          <div style={{ background:"#FFFFFF", border:"1px solid rgba(212,34,48,0.28)", borderRadius:16, padding:24, width:"100%", maxWidth:360 }}>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:4, color:"#0F2147" }}>🗑️ 닉네임 삭제</div>
            <div style={{ fontSize:12, color:"#E14C58", marginBottom:16 }}>삭제 후 복구가 불가능합니다.</div>
            <input type="password" value={deletePassword} onChange={e=>setDeletePassword(e.target.value)}
              placeholder="관리자 비밀번호 입력"
              onKeyDown={e=>e.key==="Enter"&&handleDeleteNickname()}
              style={{ width:"100%", background:"rgba(15,33,71,0.06)", border:"1px solid rgba(212,34,48,0.28)", borderRadius:8, padding:"10px 12px", color:"#0F2147", fontSize:13, outline:"none", marginBottom:8, boxSizing:"border-box" }} />
            {deleteError && <div style={{ fontSize:11, color:"#E14C58", marginBottom:8 }}>{deleteError}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>{setShowDeleteNick(false);setDeletePassword("");setDeleteError("");}} style={{ flex:1, padding:10, background:"rgba(15,33,71,0.05)", border:"1px solid rgba(15,33,71,0.08)", borderRadius:8, color:"#5B6B8C", fontSize:13, cursor:"pointer" }}>취소</button>
              <button onClick={handleDeleteNickname} style={{ flex:1, padding:10, background:"#dc2626", border:"none", borderRadius:8, color:"white", fontSize:13, fontWeight:700, cursor:"pointer" }}>삭제</button>
            </div>
          </div>
        </div>
      )}

      {/* 닉네임 변경 모달 */}
      {showChangeNick && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#FFFFFF", border:"1px solid rgba(15,33,71,0.08)", borderRadius:16, padding:24, width:"100%", maxWidth:360 }}>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>닉네임 변경</div>
            <input value={changeInput} onChange={e=>setChangeInput(e.target.value)}
              placeholder="새 닉네임 (최대 10자)" maxLength={10}
              onKeyDown={e=>e.key==="Enter"&&handleChangeNickname()}
              style={{ width:"100%", background:"rgba(15,33,71,0.06)", border:"1px solid rgba(15,33,71,0.12)", borderRadius:8, padding:"10px 12px", color:"#0F2147", fontSize:13, outline:"none", marginBottom:8, boxSizing:"border-box" }} />
            {changeError && <div style={{ fontSize:11, color:"#E14C58", marginBottom:8 }}>{changeError}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>{setShowChangeNick(false);setChangeError("");}} style={{ flex:1, padding:10, background:"rgba(15,33,71,0.05)", border:"1px solid rgba(15,33,71,0.08)", borderRadius:8, color:"#5B6B8C", fontSize:13, cursor:"pointer" }}>취소</button>
              <button onClick={handleChangeNickname} style={{ flex:1, padding:10, background:"#1D4ED8", border:"none", borderRadius:8, color:"white", fontSize:13, fontWeight:700, cursor:"pointer" }}>변경</button>
            </div>
            <button onClick={()=>{setShowChangeNick(false);setShowDeleteNick(true);}} style={{ width:"100%", marginTop:8, padding:8, background:"rgba(212,34,48,0.10)", border:"1px solid rgba(212,34,48,0.28)", borderRadius:8, color:"#E14C58", fontSize:12, cursor:"pointer" }}>🗑️ 닉네임 삭제</button>
          </div>
        </div>
      )}

      <div style={{ padding:16, maxWidth:480, margin:"0 auto" }}>

      {/* 로그인 화면 */}
      {!isLoggedIn ? (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:16 }}>
          <div style={{ fontSize:16, fontWeight:700, color:"rgba(15,33,71,0.75)", marginBottom:8 }}>닉네임을 입력해주세요</div>
          <div style={{ width:"100%", maxWidth:320, display:"flex", flexDirection:"column", gap:10 }}>
            <input value={loginInput} onChange={e=>setLoginInput(e.target.value)}
              placeholder="닉네임 입력 (최대 10자)" maxLength={10}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              style={{ width:"100%", background:"rgba(15,33,71,0.06)", border:"1px solid rgba(15,33,71,0.12)", borderRadius:10, padding:"12px 14px", color:"#0F2147", fontSize:14, outline:"none", boxSizing:"border-box" }} />
            {loginError && <div style={{ fontSize:12, color:"#E14C58", textAlign:"center" }}>{loginError}</div>}
            <button onClick={handleLogin} disabled={loginLoading} style={{ width:"100%", padding:14, background:"linear-gradient(135deg,#0F2147,#1D4ED8)", border:"none", borderRadius:10, color:"white", fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(37,99,235,0.4)" }}>
              {loginLoading ? "확인 중..." : "시작하기"}
            </button>
            <div style={{ fontSize:11, color:"rgba(15,33,71,0.35)", textAlign:"center", lineHeight:1.6 }}>
              닉네임만 입력하면 바로 시작할 수 있어요!
            </div>
          </div>
        </div>
      ) : (

        <>
        {tab === "predict" && (
          <div>
            {scheduleLoading && <div style={{ textAlign:"center", padding:40, color:"rgba(15,33,71,0.45)" }}>⚽ 경기 일정 불러오는 중...</div>}
            {!scheduleLoading && upcomingMatches.length === 0 && (
              <div style={{ textAlign:"center", padding:40, color:"rgba(15,33,71,0.35)", fontSize:13 }}>예정된 경기가 없습니다.</div>
            )}
            {!scheduleLoading && upcomingMatches.length > 0 && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, color:"rgba(15,33,71,0.45)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.1em" }}>예측할 경기 선택</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {upcomingMatches.slice(0,5).map(m => <MatchCard key={m.id} match={m} active={selectedMatch?.id===m.id} lineupAvailable={lineupAvailable} selectedMatch={selectedMatch} onClick={async ()=>{
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
                <div style={{ fontSize:11, color:"rgba(15,33,71,0.45)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.1em" }}>포메이션</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {Object.keys(FORMATION_LAYOUTS).map(f => (
                    <button key={f} onClick={()=>changeFormationKeepPlayers(f)} style={{ flex:1, padding:"8px 0", minWidth:70, background:formation===f?"#1D4ED8":"rgba(15,33,71,0.05)", border:formation===f?"1.5px solid #3B82F6":"1.5px solid rgba(15,33,71,0.08)", borderRadius:8, color:formation===f?"white":"#0F2147", fontSize:12, fontWeight:700, cursor:"pointer" }}>{f}</button>
                  ))}
                </div>
              </div>}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, color:"rgba(15,33,71,0.45)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.1em" }}>작전판 ({countFilled()}/11) · 포지션 클릭 후 선수 선택 · 선수끼리 클릭하면 위치 교체</div>
                <PitchView slots={slots} formation={formation} onSlotClick={handleSlotClick} squadMap={squadMap} selectedSlot={selectedSlot} interactive={true} actualPlayers={currentLineup?.players} squadMap={squadMap} />
              </div>
              {selectedSlot !== null && (
                <div style={{ marginBottom:12, background:"rgba(15,33,71,0.04)", border:"1.5px solid rgba(59,130,246,0.3)", borderRadius:12, padding:12 }}>
                  <div style={{ fontSize:11, color:"rgba(15,33,71,0.45)", marginBottom:6, fontWeight:700 }}>포메이션</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
                    {Object.keys(FORMATION_LAYOUTS).map(f => (
                      <button key={f} onClick={() => changeFormationKeepPlayers(f)} style={{ padding:"3px 8px", background:formation===f?"#1D4ED8":"rgba(15,33,71,0.05)", border:formation===f?"1px solid #3B82F6":"1px solid rgba(15,33,71,0.08)", borderRadius:6, color:formation===f?"white":"#0F2147", fontSize:11, cursor:"pointer" }}>{f}</button>
                    ))}
                  </div>
                  <div style={{ fontSize:11, color:"#5B8DEF", marginBottom:10, fontWeight:700 }}>[{slots[selectedSlot]?.pos}] 포지션 선수 선택</div>
                  {squad.length === 0 && <div style={{ fontSize:11, color:"rgba(15,33,71,0.35)", padding:8 }}>⚠️ 선수 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</div>}
                  {posOrder.map(posKey => {
                    const players = squadByPos[posKey] || [];
                    if (!players.length) return null;
                    return (
                      <div key={posKey} style={{ marginBottom:10 }}>
                        <div style={{ fontSize:10, color:"rgba(15,33,71,0.4)", marginBottom:5 }}>{posGroupLabel[posKey]}</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                          {players.map(p => {
                            const inUse = usedNumbers.has(p.number) && slots[selectedSlot]?.player?.number !== p.number;
                            return (
                              <button key={p.number} onClick={()=>!inUse&&handlePlayerSelect(p)} style={{ padding:"5px 8px", background:inUse?"rgba(15,33,71,0.03)":"rgba(29,78,216,0.3)", border:inUse?"1px solid rgba(15,33,71,0.05)":"1px solid rgba(59,130,246,0.4)", borderRadius:6, color:inUse?"rgba(15,33,71,0.22)":"white", fontSize:11, cursor:inUse?"default":"pointer", fontWeight:600, textDecoration:inUse?"line-through":"none", fontFamily:"'Noto Sans KR',sans-serif" }}>
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
              {mySubmission && (
                <div style={{ marginTop:10, padding:"10px 14px", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:8, fontSize:11, color:"#4ade80" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span>✅ 예측 완료!</span>
{selectedMatch && new Date(selectedMatch.kickoffISO || selectedMatch.date) > new Date() && !scoreData.detail?.[selectedMatch.id] && (
                      (new Date(selectedMatch.kickoffISO || selectedMatch.date) - new Date() > 2*60*60*1000)
                        ? <div style={{ display:"flex", gap:6 }}>
                            <button onClick={() => {
                              setFormation(mySubmission.formation);
                              resetSlots(mySubmission.formation);
                              if (mySubmission.slots) setSlots(mySubmission.slots);
                              setMySubmission(null);
                            }} style={{ background:"rgba(59,130,246,0.2)", border:"1px solid rgba(59,130,246,0.4)", borderRadius:6, padding:"2px 8px", color:"#5B8DEF", fontSize:10, cursor:"pointer" }}>수정</button>
                            <button onClick={handleDeletePred} style={{ background:"rgba(212,34,48,0.10)", border:"1px solid rgba(212,34,48,0.35)", borderRadius:6, padding:"2px 8px", color:"#D42230", fontSize:10, cursor:"pointer" }}>삭제</button>
                          </div>
                        : <span style={{ fontSize:10, color:"rgba(15,33,71,0.35)" }}>🔒 잠김</span>
                    )}
                  </div>
                  <div style={{ color:"rgba(15,33,71,0.45)", marginTop:3 }}>{mySubmission.formation} · {new Date(mySubmission.savedAt).toLocaleString("ko-KR",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                </div>
              )}

              {/* 승부 예측 섹션 */}
              {selectedMatch && (new Date(selectedMatch.kickoffISO || selectedMatch.date) - new Date() > 2*60*60*1000) && (
                <div style={{ marginBottom:12, padding:"12px 14px", background:"rgba(15,33,71,0.03)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:10 }}>
                  <div style={{ fontSize:11, color:"rgba(15,33,71,0.45)", marginBottom:10, fontWeight:700 }}>🎯 승부 예측</div>
                  {myScorePred ? (
                    // 저장된 스코어 표시 (홈:원정 순서)
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, justifyContent:"center" }}>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontSize:11, color:selectedMatch.home?"#5B8DEF":"#E14C58", marginBottom:4 }}>{selectedMatch.home?"수원":selectedMatch.opponent}</div>
                          <div style={{ fontSize:28, fontWeight:900, color:(selectedMatch.home?scoreHome>scoreAway:scoreAway>scoreHome)?"#4ade80":scoreHome===scoreAway?"#fbbf24":"#E14C58" }}>{scoreHome}</div>
                        </div>
                        <div style={{ fontSize:20, color:"rgba(15,33,71,0.35)", fontWeight:700 }}>:</div>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontSize:11, color:selectedMatch.home?"#E14C58":"#5B8DEF", marginBottom:4 }}>{selectedMatch.home?selectedMatch.opponent:"수원"}</div>
                          <div style={{ fontSize:28, fontWeight:900, color:(selectedMatch.home?scoreHome>scoreAway:scoreAway>scoreHome)?"#4ade80":scoreHome===scoreAway?"#fbbf24":"#E14C58" }}>{scoreAway}</div>
                        </div>
                      </div>
                      {!scoreData.detail?.[selectedMatch?.id] && ((new Date(selectedMatch?.kickoffISO || selectedMatch?.date) - new Date() > 2*60*60*1000) ? <button onClick={() => setMyScorePred(null)} style={{ background:"rgba(15,33,71,0.06)", border:"1px solid rgba(15,33,71,0.12)", borderRadius:6, padding:"4px 10px", color:"#5B6B8C", fontSize:11, cursor:"pointer" }}>수정</button> : <span style={{ fontSize:10, color:"rgba(15,33,71,0.35)" }}>🔒 잠김</span>)}
                    </div>
                  ) : (
                    // 입력 모드
                    <div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:10 }}>
                        <div style={{ textAlign:"center", flex:1 }}>
                          <div style={{ fontSize:11, color:"#5B8DEF", marginBottom:6, fontWeight:700 }}>수원</div>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                            <button onClick={()=>selectedMatch.home?setScoreHome(Math.max(0,scoreHome-1)):setScoreAway(Math.max(0,scoreAway-1))} style={{ width:26,height:26,borderRadius:6,background:"rgba(15,33,71,0.06)",border:"1px solid rgba(15,33,71,0.12)",color:"#0F2147",fontSize:14,cursor:"pointer" }}>−</button>
                            <span style={{ fontSize:26,fontWeight:900,minWidth:28,textAlign:"center" }}>{selectedMatch.home?scoreHome:scoreAway}</span>
                            <button onClick={()=>selectedMatch.home?setScoreHome(scoreHome+1):setScoreAway(scoreAway+1)} style={{ width:26,height:26,borderRadius:6,background:"rgba(15,33,71,0.06)",border:"1px solid rgba(15,33,71,0.12)",color:"#0F2147",fontSize:14,cursor:"pointer" }}>+</button>
                          </div>
                        </div>
                        <div style={{ fontSize:18,color:"rgba(15,33,71,0.35)",fontWeight:700 }}>:</div>
                        <div style={{ textAlign:"center", flex:1 }}>
                          <div style={{ fontSize:11, color:"#E14C58", marginBottom:6, fontWeight:700 }}>{selectedMatch.opponent}</div>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                            <button onClick={()=>selectedMatch.home?setScoreAway(Math.max(0,scoreAway-1)):setScoreHome(Math.max(0,scoreHome-1))} style={{ width:26,height:26,borderRadius:6,background:"rgba(15,33,71,0.06)",border:"1px solid rgba(15,33,71,0.12)",color:"#0F2147",fontSize:14,cursor:"pointer" }}>−</button>
                            <span style={{ fontSize:26,fontWeight:900,minWidth:28,textAlign:"center" }}>{selectedMatch.home?scoreAway:scoreHome}</span>
                            <button onClick={()=>selectedMatch.home?setScoreAway(scoreAway+1):setScoreHome(scoreHome+1)} style={{ width:26,height:26,borderRadius:6,background:"rgba(15,33,71,0.06)",border:"1px solid rgba(15,33,71,0.12)",color:"#0F2147",fontSize:14,cursor:"pointer" }}>+</button>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign:"center", fontSize:11, marginBottom:8, color: (selectedMatch.home ? scoreHome > scoreAway : scoreAway > scoreHome) ? "#4ade80" : scoreHome === scoreAway ? "#fbbf24" : "#E14C58" }}>
                        {(selectedMatch.home ? scoreHome > scoreAway : scoreAway > scoreHome) ? "🔵 수원 승리" : scoreHome === scoreAway ? "⚪ 무승부" : "🔴 상대팀 승리"}
                      </div>
                    </div>
                  )}
                  </div>
              )}

              {lineupAvailable && currentLineup && (
                <div style={{ marginTop:8 }}>
                  <div style={{ padding:"8px 12px", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:8, fontSize:11, color:"#4ade80", textAlign:"center", marginBottom:10 }}>
                    ✅ 선발 발표됨! {scoringStatus || "자동 채점 완료"}
                  </div>
                  <div style={{ background:"rgba(15,33,71,0.04)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:10, padding:"10px 12px", marginBottom:10 }}>
                    <div style={{ fontSize:11, color:"rgba(15,33,71,0.55)", marginBottom:6, fontWeight:700 }}>🏟️ 실제 선발 ({currentLineup.formation})</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                      {(currentLineup.players||[]).map((p,i) => (
                        <div key={i} style={{ fontSize:11, background:"rgba(34,197,94,0.2)", border:"1px solid rgba(34,197,94,0.4)", borderRadius:6, padding:"3px 8px", color:"#4ade80", fontWeight:700 }}>
                          {p.number} {p.nameKo}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {!lineupAvailable && selectedMatch && (
                <div style={{ marginTop:8, padding:"8px 12px", background:"rgba(15,33,71,0.03)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:8, fontSize:11, color:"rgba(15,33,71,0.35)", textAlign:"center" }}>
                  ⏳ 선발 발표 대기 중... (30초마다 자동 확인)
                </div>
              )}
              {scoringStatus && (
                <div style={{ textAlign:"center", fontSize:12, padding:8, color:scoringStatus.includes("✅")?"#22c55e":"#fbbf24" }}>{scoringStatus}</div>
              )}

              {/* 통합 저장 버튼 */}
              {!scoreData.detail?.[selectedMatch?.id] && <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:8 }}>
                <button onClick={handleSave} disabled={saveStatus==="저장 중..." || countFilled() < 11} style={{ width:"100%", padding:14, background:countFilled()===11?"linear-gradient(135deg,#0F2147,#1D4ED8)":"rgba(15,33,71,0.05)", border:"none", borderRadius:10, color:countFilled()===11?"white":"#0F2147", fontSize:14, fontWeight:700, cursor:(saveStatus==="저장 중..."||countFilled()<11)?"not-allowed":"pointer", boxShadow:countFilled()===11?"0 4px 16px rgba(37,99,235,0.4)":"none", opacity:(saveStatus==="저장 중..."||countFilled()<11)?0.6:1 }}>
                  {saveStatus==="저장 중..." ? "저장 중..." : `✅ 선발 예측 + 승부예측 저장 (${countFilled()}/11)`}
                </button>
                {mySubmission && (new Date(selectedMatch?.kickoffISO || selectedMatch?.date) - new Date() <= 2*60*60*1000) && new Date(selectedMatch?.kickoffISO || selectedMatch?.date) > new Date() && (
                  <div style={{ textAlign:"center", fontSize:11, color:"rgba(15,33,71,0.35)", marginTop:4 }}>🔒 킥오프 2시간 전부터 예측 수정이 불가합니다</div>
                )}
                {saveStatus && <div style={{ textAlign:"center", fontSize:12, padding:8, color:saveStatus.includes("✅")?"#22c55e":"#fbbf24" }}>{saveStatus}</div>}

              </div>}

              {otherPredictions.length > 0 && (
                <OtherPredictions squadMap={squadMap} preds={otherPredictions} myNickname={nickname} scores={selectedMatch ? scoreData.detail?.[selectedMatch.id] : undefined} officialPlayers={currentLineup?.players} scorePreds={scorePreds} isHome={selectedMatch?.home} actualScore={selectedMatch?.score} />
              )}
            </>}
          </div>
        )}

        {tab === "history" && (
          <div>
            <div style={{ fontSize:11, color:"rgba(15,33,71,0.45)", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.1em" }}>이전 경기 실제 선발</div>
            {viewingMatch ? (
              <div>
                <div style={{ background:"rgba(15,33,71,0.04)", border:"1.5px solid rgba(15,33,71,0.08)", borderRadius:12, overflow:"hidden", marginBottom:8 }}>
                  <div style={{ padding:"12px 14px", borderBottom:"1px solid rgba(15,33,71,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:10, color:"rgba(15,33,71,0.45)", marginBottom:2 }}>{viewingMatch.round}R · {new Date(viewingMatch.date).toLocaleDateString('ko-KR',{month:'short',day:'numeric'})} · {viewingMatch.home?"홈":"원정"}</div>
                      <div style={{ fontSize:14, fontWeight:700 }}>vs {viewingMatch.opponent}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      {viewingMatch.score && <div style={{ fontSize:18, fontWeight:900, color:viewingMatch.result==='W'?'#22c55e':viewingMatch.result==='D'?'#0F2147':'#D42230', fontFamily:"monospace" }}>{viewingMatch.score}</div>}
                      {viewingMatch.result && <div style={{ fontSize:11, fontWeight:700, color:viewingMatch.result==='W'?'#22c55e':viewingMatch.result==='D'?'#0F2147':'#D42230' }}>{viewingMatch.result==='W'?'승':viewingMatch.result==='D'?'무':'패'}</div>}
                    </div>
                  </div>
                  <div style={{ padding:12 }}>
                    {lineupLoading && <div style={{ textAlign:"center", padding:20, color:"rgba(15,33,71,0.45)" }}>선발 명단 불러오는 중...</div>}
                    {!lineupLoading && !officialLineup && <div style={{ textAlign:"center", padding:20, color:"rgba(15,33,71,0.35)" }}>선발 명단 데이터가 없습니다.</div>}
                    {!lineupLoading && officialLineup && (() => {
                      const fmKey = officialLineup.formation?.replace(/\s/g,'-')||'4-3-3';
                      const layout = FORMATION_LAYOUTS[fmKey]||FORMATION_LAYOUTS['4-3-3'];
                      const readonlySlots = layout.map((pos,i) => ({ pos:pos.pos, player:officialLineup.players[i]||null }));
                      return <>
                        {/* 코멘트 섹션 */}
                        <div style={{ marginBottom:12, padding:"10px 12px", background:"rgba(15,33,71,0.03)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:10 }}>
                          <div style={{ fontSize:11, color:"rgba(15,33,71,0.45)", marginBottom:8, fontWeight:700 }}>💬 한줄 코멘트</div>
                          {matchComments.length > 0 && (
                            <div style={{ marginBottom:8 }}>
                              {matchComments.map((c, i) => (
                                <div key={i} style={{ display:"flex", gap:6, marginBottom:4, fontSize:12, alignItems:"center" }}>
                                  <span style={{ color:"#5B8DEF", fontWeight:700, minWidth:60, flexShrink:0 }}>{c.nickname}</span>
                                  <span style={{ color:"rgba(15,33,71,0.75)", flex:1 }}>{c.comment}</span>
                                  {c.nickname === nickname && (
                                    <button onClick={async () => {
                                      await fetch(`${PROXY}?path=${encodeURIComponent(`/api/comments?matchId=${viewingMatch.id}&nickname=${encodeURIComponent(nickname)}`)}`, { method:'DELETE' });
                                      setMatchComments(prev => prev.filter(x => x.nickname !== nickname));
                                      setCommentInput('');
                                    }} style={{ background:"none", border:"none", color:"rgba(212,34,48,0.75)", cursor:"pointer", fontSize:10, flexShrink:0 }}>삭제</button>
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
                                style={{ flex:1, background:"rgba(15,33,71,0.05)", border:"1px solid rgba(15,33,71,0.10)", borderRadius:6, padding:"6px 10px", color:"#0F2147", fontSize:12, outline:"none" }} />
                              <button onClick={async () => {
                                if (!commentInput.trim()) return;
                                const r = await fetch(`${PROXY}?path=${encodeURIComponent(`/api/comments?matchId=${viewingMatch.id}`)}`, {
                                  method:'POST', headers:{'Content-Type':'application/json'},
                                  body: JSON.stringify({ nickname, comment: commentInput }),
                                });
                                const d = await r.json();
                                if (d.ok) { setMatchComments(prev => [...prev, { nickname, comment: commentInput.trim() }]); setCommentInput(''); }
                              }} style={{ background:"#1D4ED8", border:"none", borderRadius:6, padding:"6px 12px", color:"white", fontSize:12, cursor:"pointer", flexShrink:0 }}>등록</button>
                            </div>
                          )}
                          {nickname && matchComments.find(c => c.nickname === nickname) && (
                            <div style={{ fontSize:11, color:"rgba(15,33,71,0.35)" }}>삭제 후 다시 작성할 수 있습니다.</div>
                          )}
                          {!nickname && <div style={{ fontSize:11, color:"rgba(15,33,71,0.35)" }}>로그인 후 작성 가능합니다.</div>}
                        </div>

                        {/* 득점 기록 */}
                        {matchIncidents.length > 0 && (
                          <div style={{ marginBottom:12, padding:"10px 12px", background:"rgba(15,33,71,0.03)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:10 }}>
                            <div style={{ fontSize:11, color:"rgba(15,33,71,0.45)", marginBottom:8, fontWeight:700 }}>⚽ 득점 기록</div>
                            {matchIncidents.map((inc, idx) => (
                              <div key={idx} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4, fontSize:12 }}>
                                <span style={{ color:"#0F2147", fontWeight:700, minWidth:36 }}>
                                  {inc.time}{inc.addedTime > 0 ? `+${inc.addedTime}` : ""}'
                                </span>
                                <span>{(inc.incidentClass === 'ownGoal' || inc.isOwnGoal) ? '🔴' : inc.incidentClass === 'penalty' ? '⚽P' : '⚽'}</span>
                                <span style={{ color: (viewingMatch.home ? inc.isHome : !inc.isHome) ? "#5B8DEF" : "#E14C58", fontWeight:600 }}>{inc.player}{inc.isOwnGoal ? ' (자책골)' : ''}</span>
                                {inc.assist && <span style={{ color:"rgba(15,33,71,0.45)", fontSize:11 }}>🅰️ {inc.assist}</span>}
                                <span style={{ marginLeft:"auto", color:"rgba(15,33,71,0.55)", fontSize:11 }}>{inc.homeScore}:{inc.awayScore}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div style={{ fontSize:10, color:"rgba(15,33,71,0.4)", marginBottom:8 }}>{officialLineup.formation} 포메이션</div>
                        <PitchView formation={fmKey} slots={readonlySlots} interactive={false} squadMap={squadMap} />
                        <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:5 }}>
                          {officialLineup.players.map((p,i) => (
                            <div key={i} style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(15,33,71,0.05)", border:"1px solid rgba(15,33,71,0.08)", borderRadius:8, padding:"4px 8px" }}>
                              <span style={{ fontSize:9, color:"#888" }}>#{p.number}</span>
                              <span style={{ fontSize:11, fontWeight:600 }}>{(p.nameKo||p.name).trim()}</span>
                            </div>
                          ))}
                        </div>
                        {officialLineup.substitutes && officialLineup.substitutes.length > 0 && (
                          <div style={{ marginTop:12 }}>
                            <div style={{ fontSize:11, color:"rgba(15,33,71,0.45)", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>교체 명단</div>
                            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                              {officialLineup.substitutes.map((p, i) => (
                                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 8px", borderRadius:6, background:p.subIn?"rgba(34,197,94,0.08)":"rgba(15,33,71,0.03)" }}>
                                  <span style={{ fontSize:10, color:"rgba(15,33,71,0.35)", minWidth:20, textAlign:"right" }}>#{p.number}</span>
                                  <span style={{ fontSize:12, flex:1, color:p.subIn?"#4ade80":"rgba(15,33,71,0.55)", fontWeight:p.subIn?600:400 }}>{(p.nameKo||p.name||"").trim()}</span>
                                  {p.subIn
                                    ? <span style={{ fontSize:10, color:"#4ade80" }}>↑{p.subTime}' ({p.subOut}→)</span>
                                    : <span style={{ fontSize:10, color:"rgba(15,33,71,0.32)" }}>미출전</span>
                                  }
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>;
                    })()}
                  </div>
                </div>
                {matchPredictions.length > 0 && (
                  <OtherPredictions squadMap={squadMap} preds={matchPredictions} myNickname={nickname} scores={viewingMatch ? scoreData.detail?.[viewingMatch.id] : undefined} officialPlayers={officialLineup?.players} scorePreds={scorePreds} isHome={viewingMatch?.home} actualScore={viewingMatch?.score} />
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
                <button onClick={()=>{ setViewingMatch(null); setMatchIncidents([]); setMatchComments([]); setCommentInput(''); setCommentStatus(''); setScorePreds([]); setMyScorePred(null); setScoreHome(0); setScoreAway(0); setMatchComments([]); setCommentInput(''); setCommentStatus(''); }} style={{ width:"100%", padding:10, background:"rgba(15,33,71,0.05)", border:"1px solid rgba(15,33,71,0.08)", borderRadius:8, color:"rgba(15,33,71,0.55)", fontSize:12, cursor:"pointer" }}>← 목록으로</button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {pastMatches.length===0 && <div style={{ textAlign:"center", padding:24, color:"rgba(15,33,71,0.35)" }}>이전 경기 데이터가 없습니다.</div>}
                {pastMatches.map(m => (
                  <div key={m.id} onClick={()=>handleViewLineup(m)} style={{ background:"rgba(15,33,71,0.03)", border:"1.5px solid rgba(15,33,71,0.06)", borderRadius:12, padding:"12px 14px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:10, color:"rgba(15,33,71,0.45)", marginBottom:2 }}>{m.round}R · {new Date(m.date).toLocaleDateString('ko-KR',{month:'short',day:'numeric'})} · {m.home?"홈":"원정"}</div>
                      <div style={{ fontSize:14, fontWeight:700 }}>vs {m.opponent}</div>
                    </div>
                    <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2 }}>
                      {m.score && <div style={{ fontSize:16, fontWeight:900, color:m.result==='W'?'#22c55e':m.result==='D'?'#0F2147':'#D42230', fontFamily:"monospace" }}>{m.score}</div>}
                      {m.result && <div style={{ fontSize:10, fontWeight:700, color:m.result==='W'?'#22c55e':m.result==='D'?'#0F2147':'#D42230' }}>{m.result==='W'?'승':m.result==='D'?'무':'패'}</div>}
                      <div style={{ fontSize:9, color:"#5B8DEF" }}>라인업 보기 →</div>
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
              <div style={{ fontSize:13, fontWeight:700, color:"#0F2147" }}>📊 K리그2 순위</div>
              <button onClick={loadLeague} style={{ background:"rgba(15,33,71,0.05)", border:"1px solid rgba(15,33,71,0.08)", borderRadius:8, padding:"4px 10px", color:"#5B6B8C", fontSize:11, cursor:"pointer" }}>🔄 새로고침</button>
            </div>
            {leagueLoading && <div style={{ textAlign:"center", padding:40, color:"rgba(15,33,71,0.35)" }}>로딩 중...</div>}
            {!leagueLoading && leagueStandings.length === 0 && (
              <div style={{ textAlign:"center", padding:40, color:"rgba(15,33,71,0.35)", fontSize:13 }}>순위 데이터를 불러오지 못했습니다.</div>
            )}
            {!leagueLoading && leagueStandings.length > 0 && (
              <div style={{ borderRadius:10, overflow:"hidden", border:"1px solid rgba(15,33,71,0.06)" }}>
                {/* 헤더 */}
                <div style={{ display:"grid", gridTemplateColumns:"30px 1fr 36px 36px 50px 50px", gap:4, padding:"8px 12px", background:"rgba(15,33,71,0.05)", fontSize:10, color:"rgba(15,33,71,0.45)", fontWeight:700 }}>
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
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"30px 1fr 36px 36px 50px 50px", gap:4, padding:"9px 12px", background: isSuwon ? "rgba(37,99,235,0.08)" : i%2===0 ? "rgba(15,33,71,0.02)" : "transparent", borderTop:"1px solid rgba(15,33,71,0.04)", fontSize:12 }}>
                      <div style={{ color: row.position <= 2 ? "#4ade80" : row.position >= 9 ? "#E14C58" : "rgba(15,33,71,0.65)", fontWeight:700 }}>{row.position}</div>
                      <div style={{ color: isSuwon ? "#5B8DEF" : "#0F2147", fontWeight: isSuwon ? 700 : 400, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{row.team?.name}</div>
                      <div style={{ textAlign:"center", color:"rgba(15,33,71,0.65)" }}>{row.matches}</div>
                      <div style={{ textAlign:"center", color:"#0F2147", fontWeight:700 }}>{row.points}</div>
                      <div style={{ textAlign:"center", color:"rgba(15,33,71,0.65)" }}>{row.scoresFor}</div>
                      <div style={{ textAlign:"center", color: (row.scoresFor - row.scoresAgainst) > 0 ? "#4ade80" : (row.scoresFor - row.scoresAgainst) < 0 ? "#E14C58" : "rgba(15,33,71,0.65)" }}>
                        {(row.scoresFor - row.scoresAgainst) > 0 ? "+" : ""}{row.scoresFor - row.scoresAgainst}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}


        {tab === "admin" && (
          <div>
            {!adminAuthed ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:200, gap:12 }}>
                <div style={{ fontSize:15, fontWeight:700, color:"rgba(15,33,71,0.75)" }}>🔧 관리자 로그인</div>
                <input type="password" value={adminPassword} onChange={e=>setAdminPassword(e.target.value)}
                  placeholder="비밀번호" onKeyDown={e=>e.key==="Enter"&&(adminPassword==="3579"?setAdminAuthed(true):alert("비밀번호 오류"))}
                  style={{ background:"rgba(15,33,71,0.06)", border:"1px solid rgba(15,33,71,0.12)", borderRadius:8, padding:"10px 16px", color:"#0F2147", fontSize:14, textAlign:"center" }} />
                <button onClick={()=>adminPassword==="3579"?setAdminAuthed(true):alert("비밀번호 오류")}
                  style={{ padding:"10px 24px", background:"#1D4ED8", border:"none", borderRadius:8, color:"white", fontSize:14, fontWeight:700, cursor:"pointer" }}>로그인</button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>🔧 선발 라인업 입력</div>

                {/* 경기 선택 */}
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:11, color:"rgba(15,33,71,0.45)", marginBottom:6 }}>경기 선택</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {[...upcomingMatches, ...pastMatches].slice(0, 10).map(m => (
                      <div key={m.id} onClick={()=>{
                        setAdminMatch(m);
                        setAdminFormation("4-4-2");
                        setAdminPlayers([]);
                        setAdminHomeScore(0);
                        setAdminAwayScore(0);
                      }} style={{ padding:"8px 12px", borderRadius:8, border:adminMatch?.id===m.id?"1.5px solid #3B82F6":"1.5px solid rgba(15,33,71,0.06)", background:adminMatch?.id===m.id?"rgba(59,130,246,0.1)":"rgba(15,33,71,0.03)", cursor:"pointer", fontSize:12 }}>
                        {m.round ? `R${m.round}` : m.roundName || ""} vs {m.opponent} ({m.home?"홈":"원정"}) {m.status==="finished"?`[${m.score}]`:""}
                      </div>
                    ))}
                  </div>
                </div>

                {adminMatch && (
                  <div>
                    {/* 실제 스코어 입력 */}
                    <div style={{ marginBottom:12, padding:"10px 12px", background:"rgba(15,33,71,0.04)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:8 }}>
                      <div style={{ fontSize:11, color:"rgba(15,33,71,0.45)", marginBottom:8 }}>실제 스코어</div>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontSize:10, color:"rgba(15,33,71,0.45)", marginBottom:4 }}>수원</div>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <button onClick={()=>setAdminHomeScore(Math.max(0,adminHomeScore-1))} style={{ width:24, height:24, borderRadius:4, border:"1px solid rgba(15,33,71,0.18)", background:"rgba(15,33,71,0.05)", color:"#0F2147", cursor:"pointer", fontSize:14 }}>-</button>
                            <span style={{ fontSize:22,fontWeight:900,minWidth:24,textAlign:"center" }}>{adminHomeScore}</span>
                            <button onClick={()=>setAdminHomeScore(adminHomeScore+1)} style={{ width:24, height:24, borderRadius:4, border:"1px solid rgba(15,33,71,0.18)", background:"rgba(15,33,71,0.05)", color:"#0F2147", cursor:"pointer", fontSize:14 }}>+</button>
                          </div>
                        </div>
                        <span style={{ fontSize:18, color:"rgba(15,33,71,0.35)", fontWeight:700 }}>:</span>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontSize:10, color:"rgba(15,33,71,0.45)", marginBottom:4 }}>상대</div>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <button onClick={()=>setAdminAwayScore(Math.max(0,adminAwayScore-1))} style={{ width:24, height:24, borderRadius:4, border:"1px solid rgba(15,33,71,0.18)", background:"rgba(15,33,71,0.05)", color:"#0F2147", cursor:"pointer", fontSize:14 }}>-</button>
                            <span style={{ fontSize:22,fontWeight:900,minWidth:24,textAlign:"center" }}>{adminAwayScore}</span>
                            <button onClick={()=>setAdminAwayScore(adminAwayScore+1)} style={{ width:24, height:24, borderRadius:4, border:"1px solid rgba(15,33,71,0.18)", background:"rgba(15,33,71,0.05)", color:"#0F2147", cursor:"pointer", fontSize:14 }}>+</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 포메이션 선택 */}
                    <div style={{ marginBottom:10 }}>
                      <div style={{ fontSize:11, color:"rgba(15,33,71,0.45)", marginBottom:6 }}>포메이션</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {Object.keys(FORMATION_LAYOUTS).map(f => (
                          <button key={f} onClick={()=>{setAdminFormation(f);setAdminPlayers([]);}} style={{ padding:"4px 10px", background:adminFormation===f?"#1D4ED8":"rgba(15,33,71,0.05)", border:adminFormation===f?"1px solid #3B82F6":"1px solid rgba(15,33,71,0.08)", borderRadius:6, color:adminFormation===f?"white":"#0F2147", fontSize:11, cursor:"pointer" }}>{f}</button>
                        ))}
                      </div>
                    </div>

                    {/* 선수 선택 */}
                    <div style={{ marginBottom:10 }}>
                      {Object.entries({"G":"골키퍼","D":"수비수","M":"미드필더","F":"공격수"}).map(([pos, posLabel]) => {
                        const posPlayers = squad.filter(p => p.position === pos);
                        if (!posPlayers.length) return null;
                        return (
                          <div key={pos} style={{ marginBottom:8 }}>
                            <div style={{ fontSize:10, color:"rgba(15,33,71,0.4)", marginBottom:4 }}>{posLabel}</div>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                              {posPlayers.map(p => {
                                const selected = adminPlayers.some(ap => ap.number === p.number);
                                return (
                                  <button key={p.number} onClick={()=>{
                                    if (selected) {
                                      setAdminPlayers(prev => prev.filter(ap => ap.number !== p.number));
                                    } else if (adminPlayers.length < 11) {
                                      setAdminPlayers(prev => [...prev, { number: p.number, nameKo: p.nameKo, playerId: p.playerId }]);
                                    }
                                  }} style={{ padding:"5px 8px", background:selected?"rgba(29,78,216,0.12)":"rgba(15,33,71,0.05)", border:selected?"1px solid #3B82F6":"1px solid rgba(15,33,71,0.08)", borderRadius:6, color:selected?"#1D4ED8":"rgba(15,33,71,0.75)", fontSize:11, cursor:"pointer" }}>
                                    {p.number} {p.nameKo}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {adminPlayers.length > 0 && (
                      <div style={{ marginBottom:10, padding:"8px 10px", background:"rgba(22,163,74,0.1)", border:"1px solid rgba(22,163,74,0.3)", borderRadius:8 }}>
                        <div style={{ fontSize:11, color:"#4ade80", marginBottom:6, fontWeight:700 }}>선택된 선발 ({adminPlayers.length}/11)</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                          {adminPlayers.map(p => (
                            <span key={p.number} onClick={()=>setAdminPlayers(prev=>prev.filter(ap=>ap.number!==p.number))}
                              style={{ fontSize:11, background:"rgba(22,163,74,0.2)", border:"1px solid rgba(22,163,74,0.4)", borderRadius:6, padding:"3px 8px", color:"#4ade80", cursor:"pointer" }}>
                              {p.number} {p.nameKo} ✕
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 저장 버튼 */}
                    <button onClick={async () => {
                      if (adminPlayers.length !== 11) { setAdminStatus("❌ 선수 11명을 선택해주세요"); return; }
                      try {
                        const r = await fetch(`${PROXY}?path=/api/lineup/set`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            password: "3579",
                            matchId: adminMatch.id,
                            formation: adminFormation,
                            players: adminPlayers,
                            homeScore: adminHomeScore,
                            awayScore: adminAwayScore,
                          }),
                        });
                        const d = await r.json();
                        if (d.ok) {
                          const scored = d.scored;
                          const scores = d.scores || {};
                          const nicknames = Object.keys(scores);
                          const scoreMsg = scored
                            ? `채점 완료! 참여자 ${nicknames.length}명`
                            : "스코어 입력 후 채점됩니다";
                          setAdminStatus("✅ 저장 완료! " + scoreMsg);
                          // lineup 다시 fetch해서 슬롯 테두리 업데이트
                          fetch(`${PROXY}?path=/api/lineup?eventId=${adminMatch.id}`).then(r=>r.json()).then(d=>{
                            if (d.lineup) setCurrentLineup(d.lineup);
                          }).catch(()=>{});
                          fetch(`${PROXY}?path=/api/score`).then(r=>r.json()).then(d=>setScoreData(d)).catch(()=>{});
                        } else {
                          setAdminStatus("❌ " + (d.error || "저장 실패"));
                        }
                      } catch(e) {
                        setAdminStatus("❌ 오류: " + e.message);
                      }
                    }} style={{ width:"100%", padding:12, background:adminPlayers.length===11?"#16a34a":"rgba(15,33,71,0.08)", border:"none", borderRadius:8, color:adminPlayers.length===11?"white":"#0F2147", fontSize:14, fontWeight:700, cursor:adminPlayers.length===11?"pointer":"default", marginBottom:8 }}>
                      💾 선발 저장 & 채점
                    </button>

                    {adminStatus && <div style={{ textAlign:"center", fontSize:12, padding:8, color:adminStatus.includes("✅")?"#4ade80":"#E14C58" }}>{adminStatus}</div>}
                  </div>
                )}

                {/* 닉네임 관리 */}
                <div style={{ marginTop:16 }}>
                  <div style={{ fontSize:12, color:"rgba(15,33,71,0.45)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.1em" }}>닉네임 관리</div>
                  <NicknameManager adminPassword="3579" proxy={PROXY} />
                </div>
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
                  <button onClick={() => { setRankingView(null); setRankingPredDetail(null); }} style={{ background:"rgba(15,33,71,0.05)", border:"1px solid rgba(15,33,71,0.08)", borderRadius:8, padding:"5px 10px", color:"#5B6B8C", fontSize:12, cursor:"pointer" }}>← 순위표</button>
                  <div style={{ fontSize:15, fontWeight:700 }}>{rankingView.nickname}의 예측</div>
                </div>

                {rankingPredDetail ? (
                  <div>
                    <button onClick={() => { setRankingPredDetail(null); setRankingLineup(null); setRankingScorePred(null); }} style={{ background:"rgba(15,33,71,0.05)", border:"1px solid rgba(15,33,71,0.08)", borderRadius:8, padding:"5px 10px", color:"#5B6B8C", fontSize:12, cursor:"pointer", marginBottom:12 }}>← 경기 목록</button>

                    {/* 경기 정보 카드 */}
                    {(() => {
                      const m = pastMatches.find(m => String(m.id) === String(rankingPredDetail?.matchId));
                      if (!m) return null;
                      const rc = m.result==='W'?'#22c55e':m.result==='D'?'#0F2147':'#D42230';
                      const d = new Date(m.kickoffISO||m.date);
                      const dateStr = `${d.getMonth()+1}/${d.getDate()}`;
                      return (
                        <div style={{ background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:10, padding:"10px 14px", marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div>
                            <div style={{ fontSize:10, color:"rgba(15,33,71,0.45)", marginBottom:2 }}>{m.round}R · {dateStr} · {m.home?"홈":"원정"}</div>
                            <div style={{ fontSize:13, fontWeight:700 }}>vs {m.opponent}</div>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            <div style={{ fontSize:16, fontWeight:900, color:rc, fontFamily:"monospace" }}>{m.score}</div>
                            <div style={{ fontSize:10, color:rc, fontWeight:700 }}>{m.result==='W'?'승':m.result==='D'?'무':'패'}</div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* 선발적중 / 승부예측 / 총점 3칸 */}
                    {rankingLineup && (() => {
                      const m = pastMatches.find(m => String(m.id) === String(rankingPredDetail?.matchId));
                      const ih = m?.home;
                      const hitCount = (rankingPredDetail.slots||[]).filter(s => s.player && rankingLineup.players?.some(ap =>
                        (s.player.number && String(s.player.number)===String(ap.number)) ||
                        (s.player.nameKo && s.player.nameKo===ap.nameKo)
                      )).length;
                      const matchScore = scoreData.detail?.[rankingPredDetail.matchId]?.[rankingView.nickname] || 0;
                      const spScore = rankingScorePred ? (ih?rankingScorePred.homeScore:rankingScorePred.awayScore)+':'+(ih?rankingScorePred.awayScore:rankingScorePred.homeScore) : null;
                      return (
                        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                          <div style={{ flex:1, background:"rgba(15,33,71,0.04)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
                            <div style={{ fontSize:10, color:"rgba(15,33,71,0.45)", marginBottom:4 }}>선발 적중</div>
                            <div style={{ fontSize:18, fontWeight:900, color:"#0F2147" }}>{hitCount}/11</div>
                          </div>
                          {spScore && (
                            <div style={{ flex:1, background:"rgba(15,33,71,0.04)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
                              <div style={{ fontSize:10, color:"rgba(15,33,71,0.45)", marginBottom:4 }}>승부예측</div>
                              <div style={{ fontSize:18, fontWeight:900, color:"#5B8DEF" }}>{spScore}</div>
                            </div>
                          )}
                          <div style={{ flex:1, background:"rgba(15,33,71,0.04)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
                            <div style={{ fontSize:10, color:"rgba(15,33,71,0.45)", marginBottom:4 }}>총점</div>
                            <div style={{ fontSize:18, fontWeight:900, color:"#0F2147" }}>{matchScore}pt</div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* 채점 내역 */}
                    {(() => {
                      const m = pastMatches.find(m => String(m.id) === String(rankingPredDetail?.matchId));
                      const ih = m?.home;
                      if (!rankingLineup) return null;
                      const hitCount = (rankingPredDetail.slots||[]).filter(s => s.player && rankingLineup.players?.some(ap =>
                        (s.player.number && String(s.player.number)===String(ap.number)) ||
                        (s.player.nameKo && s.player.nameKo===ap.nameKo)
                      )).length;
                      const matchScore = scoreData.detail?.[rankingPredDetail.matchId]?.[rankingView.nickname] || 0;
                      const actualSc = m?.score;
                      const exact = rankingScorePred && actualSc ? (() => {
                        const [as, ao] = actualSc.split(':').map(Number);
                        return (ih?rankingScorePred.homeScore:rankingScorePred.awayScore)===as && (ih?rankingScorePred.awayScore:rankingScorePred.homeScore)===ao;
                      })() : false;
                      const resultMatch = rankingScorePred && actualSc && !exact ? (() => {
                        const [as, ao] = actualSc.split(':').map(Number);
                        const spSu = ih?rankingScorePred.homeScore:rankingScorePred.awayScore;
                        const spOp = ih?rankingScorePred.awayScore:rankingScorePred.homeScore;
                        return (spSu>spOp)===(as>ao) && (spSu===spOp)===(as===ao);
                      })() : false;
                      return (
                        <div style={{ marginBottom:12, padding:"10px 12px", background:"rgba(15,33,71,0.03)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:10 }}>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
                            <span style={{ fontSize:11, background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:6, padding:"3px 8px", color:"#fbbf24", fontWeight:700 }}>
                              ⚽ {hitCount}명 적중 +{hitCount*5}pt
                            </span>
                            {hitCount === 11 && (
                              <span style={{ fontSize:11, background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:6, padding:"3px 8px", color:"#fbbf24", fontWeight:700 }}>
                                🌟 전원 보너스 +30pt
                              </span>
                            )}
                            {rankingScorePred && (exact
                              ? <span style={{ fontSize:11, background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:6, padding:"3px 8px", color:"#4ade80", fontWeight:700 }}>🎯 정확한 스코어 +15pt</span>
                              : resultMatch
                                ? <span style={{ fontSize:11, background:"rgba(96,165,250,0.15)", border:"1px solid rgba(96,165,250,0.3)", borderRadius:6, padding:"3px 8px", color:"#5B8DEF", fontWeight:700 }}>✅ 승무패 적중 +5pt</span>
                                : <span style={{ fontSize:11, background:"rgba(212,34,48,0.10)", border:"1px solid rgba(212,34,48,0.18)", borderRadius:6, padding:"3px 8px", color:"#E14C58", fontWeight:700 }}>❌ 승부예측 미적중</span>
                            )}
                            <span style={{ fontSize:13, fontWeight:900, color:"#0F2147", marginLeft:"auto", fontFamily:"monospace" }}>= {matchScore}pt</span>
                          </div>
                        </div>
                      );
                    })()}

                                      {/* 토글 버튼 */}
                   {/* 토글 버튼 */}
                   <div style={{ display:"flex", gap:6, marginBottom:10, background:"rgba(15,33,71,0.05)", borderRadius:10, padding:4 }}>
                     <button onClick={()=>setRankingLineupToggle("pred")} style={{ flex:1, padding:"8px 0", borderRadius:8, border:"none", fontSize:12, fontWeight:700, cursor:"pointer", background:rankingLineupToggle==="pred"?"#1D4ED8":"transparent", color:rankingLineupToggle==="pred"?"white":"#0F2147" }}>{rankingView?.nickname}의 예측</button>
                     <button onClick={()=>setRankingLineupToggle("actual")} disabled={!rankingLineup} style={{ flex:1, padding:"8px 0", borderRadius:8, border:"none", fontSize:12, fontWeight:700, cursor:"pointer", background:rankingLineupToggle==="actual"?"#1D4ED8":"transparent", color:rankingLineupToggle==="actual"?(rankingLineup?"white":"rgba(15,33,71,0.35)"):(rankingLineup?"#0F2147":"rgba(15,33,71,0.35)") }}>실제 선발</button>
                   </div>
                   <div style={{ fontSize:10, color:"rgba(15,33,71,0.4)", marginBottom:8 }}>
                     {rankingLineupToggle==="pred" ? rankingPredDetail.formation : (rankingLineup?.formation||rankingPredDetail.formation)} 포메이션
                   </div>
                   {rankingLineupToggle === "pred"
                     ? <PitchView formation={rankingPredDetail.formation} slots={rankingPredDetail.slots} squadMap={squadMap} interactive={false} actualPlayers={rankingLineup?.players} squadMap={squadMap} />
                     : rankingLineup
                       ? <PitchView formation={rankingLineup.formation} squadMap={squadMap} slots={rankingLineup.players.map((p,i)=>({ pos:["GK","CB","CB","LB","RB","CM","CM","LM","RM","ST","ST"][i]||"CM", player:{...p, nameKo:p.nameKo||p.name} }))} interactive={false} />
                       : <div style={{textAlign:"center",padding:20,fontSize:12,color:"rgba(15,33,71,0.35)"}}>선발 데이터 없음</div>
                   }
                    <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:5 }}>
                      {rankingLineupToggle === "pred"
                        ? (rankingPredDetail.slots||[]).filter(s=>s.player).map((s,j) => {
                            const matched = rankingLineup?.players
                              ? rankingLineup.players.some(ap =>
                                  (s.player.number && String(s.player.number) === String(ap.number)) ||
                                  (s.player.nameKo && s.player.nameKo === ap.nameKo)
                                )
                              : null;
                            const bg = matched === true ? "rgba(34,197,94,0.1)" : matched === false ? "rgba(212,34,48,0.10)" : "rgba(15,33,71,0.05)";
                            const border = matched === true ? "1px solid rgba(34,197,94,0.3)" : matched === false ? "1px solid rgba(212,34,48,0.28)" : "1px solid rgba(15,33,71,0.08)";
                            const color = matched === true ? "#4ade80" : matched === false ? "#E14C58" : "white";
                            const numColor = matched === true ? "#4ade80" : matched === false ? "#E14C58" : "#888";
                            return (
                              <div key={j} style={{ display:"flex", alignItems:"center", gap:4, background:bg, border, borderRadius:8, padding:"4px 8px" }}>
                                <span style={{ fontSize:9, color:numColor }}>#{s.player.number}</span>
                                <span style={{ fontSize:11, fontWeight:600, color }}>{(s.player.nameKo||s.player.name).trim()}</span>
                              </div>
                            );
                          })
                        : (rankingLineup?.players||[]).map((p,j) => (
                            <div key={j} style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:8, padding:"4px 8px" }}>
                              <span style={{ fontSize:9, color:"#4ade80" }}>#{p.number}</span>
                              <span style={{ fontSize:11, fontWeight:600, color:"#4ade80" }}>{p.nameKo||p.name}</span>
                            </div>
                          ))
                      }
                    </div>
                    {rankingLineupToggle === "actual" && rankingLineup?.substitutes && rankingLineup.substitutes.length > 0 && (
                      <div style={{ marginTop:10 }}>
                        <div style={{ fontSize:11, color:"rgba(15,33,71,0.45)", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>교체 명단</div>
                        <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                          {rankingLineup.substitutes.map((p, j) => (
                            <div key={j} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 8px", borderRadius:6, background:p.subIn?"rgba(34,197,94,0.08)":"rgba(15,33,71,0.03)" }}>
                              <span style={{ fontSize:10, color:"rgba(15,33,71,0.35)", minWidth:20, textAlign:"right" }}>#{p.number}</span>
                              <span style={{ fontSize:11, flex:1, color:p.subIn?"#4ade80":"rgba(15,33,71,0.45)", fontWeight:p.subIn?600:400 }}>{(p.nameKo||p.name||"").trim()}</span>
                              {p.subIn
                                ? <span style={{ fontSize:10, color:"#4ade80" }}>↑{p.subTime}' ({p.subOut}→)</span>
                                : <span style={{ fontSize:10, color:"rgba(15,33,71,0.32)" }}>미출전</span>
                              }
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {rankingView.preds.length === 0 && <div style={{ textAlign:"center", padding:24, color:"rgba(15,33,71,0.35)" }}>예측 데이터가 없습니다.</div>}
                    {rankingView.preds.map((p, i) => {
                      const d = new Date(p.kickoffISO || p.savedAt);
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
                          style={{ background:"rgba(15,33,71,0.04)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:10, padding:"10px 14px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div>
                            <div style={{ fontSize:12, fontWeight:700 }}>{p.round ? `${p.round}R` : ''} vs {p.opponent}</div>
                            <div style={{ fontSize:10, color:"rgba(15,33,71,0.45)", marginTop:2 }}>{p.formation} · {d.toLocaleDateString('ko-KR',{month:'short',day:'numeric'})}</div>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            {scoreData.detail?.[p.matchId]?.[rankingView.nickname] !== undefined && (
                              <div style={{ fontSize:14, fontWeight:900, color:"#0F2147", fontFamily:"monospace" }}>{scoreData.detail[p.matchId][rankingView.nickname]}pt</div>
                            )}
                            <div style={{ fontSize:12, color:"#5B8DEF" }}>보기 →</div>
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
                  <div style={{ fontSize:11, color:"rgba(15,33,71,0.45)", textTransform:"uppercase", letterSpacing:"0.1em" }}>예측 순위표</div>
                  <button onClick={loadRanking} style={{ background:"rgba(15,33,71,0.06)", border:"1px solid rgba(15,33,71,0.10)", borderRadius:6, padding:"5px 10px", color:"rgba(15,33,71,0.65)", fontSize:11, cursor:"pointer" }}>🔄 새로고침</button>
                </div>
                {loadingRanking ? (
                  <div style={{ textAlign:"center", padding:40, color:"rgba(15,33,71,0.35)" }}>로딩 중...</div>
                ) : rankingData.length===0 ? (
                  <div style={{ textAlign:"center", padding:40, color:"rgba(15,33,71,0.22)", fontSize:13, lineHeight:1.8 }}>아직 예측 데이터가 없어요.<br/>친구들과 링크를 공유하고<br/>선발을 예측해보세요! ⚽</div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {rankingData.map((entry,idx) => {
                      // 이 닉네임의 전체 예측 수집
                      const myPreds = Object.entries(allPredData).flatMap(([matchId, preds]) =>
                        preds.filter(p => p.nickname === entry.nickname).map(p => {
                          const matchInfo = [...(pastMatches||[]), ...(upcomingMatches||[])].find(m => m.id === matchId);
                          return { ...p, isHome: matchInfo?.home, score: matchInfo?.score, kickoffISO: matchInfo?.kickoffISO };
                        })
                      ).sort((a, b) => new Date(a.kickoffISO||0) - new Date(b.kickoffISO||0));
                      return (
                        <div key={idx} onClick={() => { setRankingView({ nickname: entry.nickname, preds: myPreds }); setRankingPredDetail(null); }}
                          style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:entry.nickname===nickname?"rgba(59,130,246,0.1)":"rgba(15,33,71,0.03)", border:entry.nickname===nickname?"1.5px solid rgba(59,130,246,0.4)":"1.5px solid rgba(15,33,71,0.05)", borderRadius:10, cursor:"pointer" }}>
                          <div style={{ width:28, height:28, borderRadius:"50%", background:idx===0?"#fbbf24":idx===1?"#94a3b8":idx===2?"#cd7c3f":"rgba(15,33,71,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:idx<3?"#FFFFFF":"rgba(15,33,71,0.45)", flexShrink:0 }}>{entry.scoredCount >= 5 ? idx+1 : "-"}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:700 }}>{entry.nickname}{entry.nickname===nickname&&<span style={{ fontSize:10, color:"#5B8DEF", marginLeft:6 }}>나</span>}</div>
                            <div style={{ fontSize:10, color: entry.scoredCount >= 5 ? "rgba(15,33,71,0.35)" : "#E14C58" }}>예측 {entry.scoredCount}경기{entry.scoredCount < 5 ? ` (${5-entry.scoredCount}경기 더 필요)` : ""}</div>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            <div style={{ fontSize:18, fontWeight:900, color:"#0F2147", fontFamily:"monospace" }}>{entry.avg}pt</div>
                            <div style={{ fontSize:10, color:"rgba(15,33,71,0.35)" }}>총 {entry.score}pt · ›</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div style={{ marginTop:16, padding:"12px 14px", background:"rgba(15,33,71,0.03)", border:"1px solid rgba(15,33,71,0.06)", borderRadius:10, fontSize:11, color:"rgba(15,33,71,0.4)", lineHeight:1.8 }}>
                  <div style={{ fontWeight:700, color:"rgba(15,33,71,0.55)", marginBottom:4 }}>📌 채점 기준</div>
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
}