require('dotenv').config();

module.exports = {
  GALXE_URL: 'https://galxe.com/explore',
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  ETH_RPC_URL: process.env.ETH_RPC_URL,
  AIRDROP_CONTRACT_ADDRESS: process.env.AIRDROP_CONTRACT_ADDRESS,
  AIRDROP_CONTRACT_ABI: [ 
    // claim() 與 claimable() 函數 ABI 範例
    "function claim() external",
    "function claimable(address) external view returns (uint256)"
  ],
  WALLETS_FILE: './wallets.json'
};
