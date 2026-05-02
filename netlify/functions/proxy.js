const https = require('https');
const GIST_ID = '18d30d84225a0ce6f35a3914b9c2bdcd';

const agent = new https.Agent({ rejectUnauthorized: false });

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
    const base = await getPinggyUrl();
    const targetUrl = base.replace(/\/$/, '') + path;

    const options = {
      method: event.httpMethod || 'GET',
      headers: { 'Content-Type': 'application/json' },
      agent,
    };
    if (event.body) options.body = event.body;

    const res = await fetch(targetUrl, options);
    const text = await res.text();

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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
