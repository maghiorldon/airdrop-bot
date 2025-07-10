const { ethers } = require('ethers');
const fs = require('fs');
const {
  ETH_RPC_URL,
  AIRDROP_CONTRACT_ADDRESS,
  AIRDROP_CONTRACT_ABI,
  WALLETS_FILE
} = require('./config');
const { sendTelegramMessage } = require('./telegram');

async function claimAirdrops() {
  const provider = new ethers.JsonRpcProvider(ETH_RPC_URL);
  const contract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, AIRDROP_CONTRACT_ABI, provider);

  // 載入多錢包
  const wallets = JSON.parse(fs.readFileSync(WALLETS_FILE));

  for (const walletInfo of wallets) {
    try {
      const wallet = new ethers.Wallet(walletInfo.privateKey, provider);
      const claimable = await contract.claimable(wallet.address);
      if (claimable > 0) {
        console.log(`錢包 ${wallet.address} 有 ${claimable} 代幣可領取，開始領取...`);
        const contractWithSigner = contract.connect(wallet);
        const tx = await contractWithSigner.claim({ gasLimit: 200000 });
        await tx.wait();
        console.log(`錢包 ${wallet.address} 領取成功，TX: ${tx.hash}`);
        await sendTelegramMessage(`✅ 錢包 ${wallet.address} 領空投成功，TX: ${tx.hash}`);
      } else {
        console.log(`錢包 ${wallet.address} 沒有可領空投`);
      }
    } catch (e) {
      console.error(`錢包 ${walletInfo.address || '未知'} 領取失敗`, e);
      await sendTelegramMessage(`❌ 錢包 ${walletInfo.address || '未知'} 領取失敗: ${e.message}`);
    }
  }
}

if (require.main === module) {
  claimAirdrops().catch(console.error);
}

module.exports = { claimAirdrops };
