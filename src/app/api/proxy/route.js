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
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
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

function httpsRequestBuffer(url, method) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      method: method || 'GET',
      rejectUnauthorized: false,
      headers: { 'User-Agent': 'Mozilla/5.0' },
    };
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] || 'application/octet-stream', statusCode: res.statusCode }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function getServeoUrl() {
  const data = await httpsRequest(`https://api.github.com/gists/${GIST_ID}`, 'GET', null);
  const json = JSON.parse(data);
  const url = json.files?.['url.txt']?.content?.trim();
  if (!url) throw new Error('Gist에 URL 없음');
  return url;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

async function handler(request, method) {
  const { searchParams } = new URL(request.url);
  const rawPath = searchParams.get('path') || '/api/schedule';
  const path = decodeURIComponent(rawPath);

  // 이미지 요청 처리
  const isImage = path.startsWith('/api/player-image');

  try {
    const base = await getServeoUrl();
    const targetUrl = base.replace(/\/$/, '') + path;

    if (isImage) {
      const { buffer, contentType, statusCode } = await httpsRequestBuffer(targetUrl, 'GET');
      const isSuccess = statusCode === 200 && contentType?.startsWith('image/');
      return new Response(buffer, {
        status: isSuccess ? 200 : 404,
        headers: {
          ...corsHeaders,
          'Content-Type': isSuccess ? contentType : 'text/plain',
          'Cache-Control': isSuccess ? 'public, max-age=86400' : 'no-store',
        },
      });
    }

    let body = null;
    if (method !== 'GET' && method !== 'DELETE') {
      body = await request.text();
    }

    let lastError = null;
    for (let i = 0; i < 3; i++) {
      try {
        const text = await httpsRequest(targetUrl, method, body);
        const trimmed = text.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          return new Response(trimmed, {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        lastError = `Non-JSON: ${trimmed.slice(0, 100)}`;
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        lastError = e.message;
        await new Promise(r => setTimeout(r, 500));
      }
    }
    return new Response(JSON.stringify({ error: lastError }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(request) { return handler(request, 'GET'); }
export async function POST(request) { return handler(request, 'POST'); }
export async function DELETE(request) { return handler(request, 'DELETE'); }
