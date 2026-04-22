// netlify/functions/proxy.js
// 태블릿 pinggy 서버로 요청을 중계

const PINGGY_BASE = 'https://kvmld-180-228-163-44.run.pinggy-free.link';

exports.handler = async (event) => {
  const path = event.queryStringParameters?.path || '/api/schedule';
  const url = PINGGY_BASE + path;

  try {
    const res = await fetch(url);
    const data = await res.text();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: data,
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
