const fetch = require('node-fetch');
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = require('./config');

async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
  });
  const data = await res.json();
  if (!data.ok) {
    console.error('Telegram 發送失敗:', data.description);
  }
}
module.exports = { sendTelegramMessage };
