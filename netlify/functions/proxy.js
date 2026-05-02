const https = require('https');
const GIST_ID = '18d30d84225a0ce6f35a3914b9c2bdcd';

function httpsRequest(url, method, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      method: method || 'GET',
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
    };
    if (body) options.headers['Content-Length'] = Buffer.byteLength(body);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getServeoUrl() {
  const res = await httpsRequest(`https://api.github.com/gists/${GIST_ID}`, 'GET', null);
  const json = JSON.parse(res.body);
  const url = json.files?.['url.txt']?.content?.trim();
  if (!url) throw new Error('Gist에 URL 없음');
  return url;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
      body: '',
    };
  }

  const rawPath = event.queryStringParameters?.path || '/api/schedule';
  const path = decodeURIComponent(rawPath);

  try {
    const base = await getServeoUrl();
    const targetUrl = base.replace(/\/$/, '') + path;

    // 최대 3번 재시도
    let lastError = null;
    for (let i = 0; i < 3; i++) {
      try {
        const res = await httpsRequest(targetUrl, event.httpMethod || 'GET', event.body || null);
        // JSON 응답인지 확인
        const text = res.body.trim();
        if (text.startsWith('{') || text.startsWith('[')) {
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': '*',
            },
            body: text,
          };
        }
        lastError = `Non-JSON response: ${text.slice(0, 100)}`;
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        lastError = e.message;
        await new Promise(r => setTimeout(r, 500));
      }
    }

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: lastError }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
