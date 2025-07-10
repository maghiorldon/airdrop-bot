const puppeteer = require('puppeteer');
const { sendTelegramMessage } = require('./telegram');

async function twitterFollow(username, twitterAccount) {
  console.log(`開始自動追蹤 Twitter @${twitterAccount}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 需先登入你的 Twitter 帳號，這裡假設你有 cookie 或 token 可載入
  // 以下示範不含登入邏輯，實務中需先登入或使用已保存 cookie

  await page.goto(`https://twitter.com/${twitterAccount}`, {waitUntil:'networkidle2'});

  // 找追蹤按鈕
  const followBtn = await page.$('div[data-testid$="-follow"]');
  if (!followBtn) {
    console.log(`你已經追蹤 @${twitterAccount}，或找不到按鈕`);
    await sendTelegramMessage(`Twitter追蹤: 你已經追蹤 @${twitterAccount} 或找不到按鈕`);
  } else {
    await followBtn.click();
    console.log(`成功追蹤 @${twitterAccount}`);
    await sendTelegramMessage(`Twitter追蹤成功: @${twitterAccount}`);
  }

  await browser.close();
}

if (require.main === module) {
  twitterFollow('your_twitter_username', 'galxe').catch(console.error);
}

module.exports = { twitterFollow };
