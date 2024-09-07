// Майнет префиксы
const MAINNET_P2PKH = '1';
const MAINNET_P2SH = '3';
const MAINNET_BECH32_SEGWIT = 'bc1q';
const MAINNET_BECH32M_TAPROOT = 'bc1p';
const MAINNET_PREFIX_LIST = ['1', '3', 'bc1'];

// Сигнет префиксы
const SIGNET_P2PKH = 'tb1';
const SIGNET_P2SH = '2';
const SIGNET_BECH32_SEGWIT = 'tb1q';
const SIGNET_BECH32M_TAPROOT = 'tb1p';
const SIGNET_PREFIX_LIST = ['tb1', '2'];
// Экспорт констант для использования в других файлах
module.exports = {
  MAINNET_P2PKH,
  MAINNET_P2SH,
  MAINNET_BECH32_SEGWIT,
  MAINNET_BECH32M_TAPROOT,
  SIGNET_P2PKH,
  SIGNET_P2SH,
  SIGNET_BECH32_SEGWIT,
  SIGNET_BECH32M_TAPROOT,
  MAINNET_PREFIX_LIST,
  SIGNET_PREFIX_LIST
};
