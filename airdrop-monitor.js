const fetch = require('node-fetch');
const fs = require('fs');
const { GALXE_URL } = require('./config');
const { sendTelegramMessage } = require('./telegram');

async function fetchGalxeAirdrops() {
  console.log('開始爬取 Galxe 空投任務...');
  const res = await fetch(GALXE_URL);
  const text = await res.text();

  // 利用正規表達式或簡單字串解析「任務名稱 + 連結」
  const regex = /<a[^>]*class="sc-jcFJkz.*?"[^>]*href="(\/activity\/[^"]+)"[^>]*>([^<]+)<\/a>/g;
  let match;
  const tasks = [];
  while ((match = regex.exec(text)) !== null) {
    const link = 'https://galxe.com' + match[1];
    const title = match[2].trim();
    tasks.push({ title, link });
  }

  if (tasks.length === 0) {
    console.log('找不到任何空投任務');
    return;
  }

  // 將結果存成 JSON
  fs.writeFileSync('./airdrops.json', JSON.stringify(tasks, null, 2));
  console.log(`爬取到 ${tasks.length} 個任務，已存至 airdrops.json`);

  // Telegram 通知
  await sendTelegramMessage(`🔔 Galxe 最新空投任務:\n` + tasks.map(t => `- ${t.title}\n${t.link}`).join('\n'));
}

if (require.main === module) {
  fetchGalxeAirdrops().catch(console.error);
}

module.exports = { fetchGalxeAirdrops };
