const https = require('https');
const GIST_ID = '18d30d84225a0ce6f35a3914b9c2bdcd';

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function httpsRequest(url, method, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      method: method || 'GET',
      rejectUnauthorized: false,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.headers['Content-Length'] = Buffer.byteLength(body);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getServeoUrl() {
  const data = await httpsGet(`https://api.github.com/gists/${GIST_ID}`);
  const json = JSON.parse(data);
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
    const text = await httpsRequest(targetUrl, event.httpMethod || 'GET', event.body || null);

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
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
