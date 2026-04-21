// src/app/api/predictions/route.js
// 예측 데이터를 Vercel Edge Config 대신 간단한 파일 기반 저장
// (무료 플랜에서는 Vercel KV가 필요하므로, localStorage 기반으로 클라이언트 저장)

export async function GET() {
  return Response.json({ message: "predictions are stored client-side" });
}
