// netlify/functions/proxy.js
// Gist에서 최신 pinggy URL을 읽어서 태블릿 서버로 중계

const GIST_ID = '18d30d84225a0ce6f35a3914b9c2bdcd';

async function getPinggyUrl() {
  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    headers: { 'User-Agent': 'suwon-netlify' }
  });
  const data = await res.json();
  const url = data.files?.['url.txt']?.content?.trim();
  if (!url) throw new Error('Gist에 URL 없음');
  return url;
}

exports.handler = async (event) => {
  const path = event.queryStringParameters?.path || '/api/schedule';

  try {
    const base = await getPinggyUrl();
    const targetUrl = base.replace(/\/$/, '') + path;

    const res = await fetch(targetUrl);
    const text = await res.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: text,
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
