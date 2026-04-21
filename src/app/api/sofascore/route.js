// src/app/api/sofascore/route.js
// Vercel 서버에서 Sofascore API를 중계 (CORS 우회)

const TEAM_ID = 7652; // 수원삼성블루윙즈
const SOFA_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "application/json",
  "Accept-Language": "ko-KR,ko;q=0.9",
  "Referer": "https://www.sofascore.com/",
  "Origin": "https://www.sofascore.com",
};

async function sofaFetch(path) {
  const res = await fetch(`https://api.sofascore.com/api/v1${path}`, {
    headers: SOFA_HEADERS,
    next: { revalidate: 300 }, // 5분 캐시
  });
  if (!res.ok) throw new Error(`Sofascore ${res.status}`);
  return res.json();
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "schedule" | "lineup"
  const eventId = searchParams.get("eventId");

  try {
    if (type === "schedule") {
      // 최근 경기 + 예정 경기 동시에 가져오기
      const [lastData, nextData] = await Promise.all([
        sofaFetch(`/team/${TEAM_ID}/events/last/0`),
        sofaFetch(`/team/${TEAM_ID}/events/next/0`),
      ]);

      const parseEvent = (e) => {
        const isHome = e.homeTeam.id === TEAM_ID;
        const myScore = isHome ? e.homeScore?.current : e.awayScore?.current;
        const oppScore = isHome ? e.awayScore?.current : e.homeScore?.current;
        const opponent = isHome ? e.awayTeam.name : e.homeTeam.name;
        const finished = e.status?.type === "finished";

        let result = null;
        if (finished && myScore !== undefined && oppScore !== undefined) {
          result = myScore > oppScore ? "W" : myScore < oppScore ? "L" : "D";
        }

        return {
          id: String(e.id),
          date: new Date(e.startTimestamp * 1000).toISOString(),
          opponent,
          home: isHome,
          status: finished ? "finished" : "upcoming",
          score: finished ? `${myScore}:${oppScore}` : null,
          result,
          tournament: e.tournament?.name || "K리그2",
          round: e.roundInfo?.round || null,
        };
      };

      const past = (lastData.events || []).map(parseEvent).reverse();
      const next = (nextData.events || []).map(parseEvent);

      return Response.json({ past, next });
    }

    if (type === "lineup" && eventId) {
      const data = await sofaFetch(`/event/${eventId}/lineups`);

      const parseLineup = (side) => {
        if (!side?.players) return null;
        const starters = side.players
          .filter((p) => p.position !== "Sub" && !p.substitute)
          .map((p) => ({
            name: p.player.name,
            nameKo: p.player.shortName || p.player.name,
            number: p.jerseyNumber,
            position: p.position, // G, D, M, F
          }));
        return {
          formation: side.formation || null,
          players: starters,
        };
      };

      // 수원삼성이 홈/어웨이인지 판별하기 위해 이벤트 정보도 가져오기
      const eventData = await sofaFetch(`/event/${eventId}`);
      const isHome = eventData.event?.homeTeam?.id === TEAM_ID;

      const suwonLineup = isHome ? parseLineup(data.home) : parseLineup(data.away);

      return Response.json({ lineup: suwonLineup, eventId });
    }

    return Response.json({ error: "type 파라미터가 필요합니다" }, { status: 400 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
