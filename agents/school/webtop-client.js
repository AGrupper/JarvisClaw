/**
 * Webtop SmartSchool API Client
 * Authenticated via session cookies (no login needed)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load cookies from env or cookies.json
function getCookies() {
  const env = process.env;
  if (env.WEBTOP_WEB_TOKEN) {
    return `webToken=${env.WEBTOP_WEB_TOKEN}; input=0`;
  }
  // Fallback: load from cookies.json and extract webToken
  const cookiesPath = path.join(__dirname, 'cookies.json');
  if (fs.existsSync(cookiesPath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));
    const parts = cookies.map(c => `${c.name}=${c.value}`);
    return parts.join('; ');
  }
  throw new Error('No Webtop credentials found');
}

function post(apiPath, body = {}) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const cookies = getCookies();
    const opts = {
      hostname: 'webtopserver.smartschool.co.il',
      path: '/server' + apiPath,
      method: 'POST',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
        'language': 'he',
        'origin': 'https://webtop.smartschool.co.il',
        'referer': 'https://webtop.smartschool.co.il/',
        'rememberme': '0',
        'cookie': cookies,
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
        'content-length': Buffer.byteLength(bodyStr),
        'accept-encoding': 'identity'
      }
    };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data: null, raw: data }); }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function getMenuCounters() {
  const r = await post('/api/Menu/GetMenuCounters');
  return r.data?.data || null;
}

async function getUnreadMessages(count = 5) {
  const r = await post('/api/Menu/GetPreviewUnreadMessages');
  const messages = r.data?.data || [];
  return messages.slice(0, count);
}

async function getUnreadNotifications() {
  const r = await post('/api/Menu/GetPreviewUnreadNotifications');
  return r.data?.data || null;
}

async function getChangesAndMessagesToday() {
  const r = await post('/api/shotef/ChangesAndMessagesDataForToday');
  return r.data?.data || null;
}

async function getInboxMessages() {
  const r = await post('/api/messageBox/GetMessagesInboxData');
  return r.data?.data || null;
}

// Main: fetch everything and print a summary
async function fetchAll() {
  console.log('=== Webtop School Data ===\n');

  const counters = await getMenuCounters();
  console.log('📬 Counters:', JSON.stringify(counters, null, 2));

  const messages = await getUnreadMessages(3);
  console.log('\n📨 Recent Unread Messages:');
  messages.forEach(m => {
    console.log(`  - [${m.sendingDate}] ${m.student_F_name} ${m.student_L_name}: ${m.subject}`);
  });

  const notifs = await getUnreadNotifications();
  console.log('\n🔔 Notifications:');
  if (notifs?.personalNotifications?.length) {
    notifs.personalNotifications.slice(0, 5).forEach(n => {
      console.log(`  - [${n.date}] ${n.message?.slice(0, 100)}`);
    });
  } else {
    console.log('  None');
  }

  const changes = await getChangesAndMessagesToday();
  console.log('\n📅 Today Changes/Events:');
  console.log(JSON.stringify(changes, null, 2));
}

if (require.main === module) {
  fetchAll().catch(console.error);
} else {
  module.exports = { getMenuCounters, getUnreadMessages, getUnreadNotifications, getChangesAndMessagesToday, getInboxMessages };
}
