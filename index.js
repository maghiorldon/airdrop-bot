const { fetchGalxeAirdrops } = require('./airdrop-monitor');
const { twitterFollow } = require('./task-runner');
const { claimAirdrops } = require('./claim-airdrop');

async function main() {
  try {
    await fetchGalxeAirdrops();

    // 示範任務: 自動追蹤 Twitter @galxe
    await twitterFollow('your_twitter_username', 'galxe');

    // 自動領空投
    await claimAirdrops();

    console.log('全部任務完成');
  } catch (e) {
    console.error('主程序錯誤:', e);
  }
}

main();
