export const ETHEREUM_SEPOLIA_CHAIN_ID = 11155111;
export const BASE_CHAIN_ID = 8453;

export const GRAPHQL_ENDPOINTS = {
  [ETHEREUM_SEPOLIA_CHAIN_ID]: "https://sepolia.easscan.org/graphql",
  [BASE_CHAIN_ID]: "https://base.easscan.org/graphql",
};

export const SCHEMA_REGISTRY_CONTRACT_ADDRESSES = {
  [ETHEREUM_SEPOLIA_CHAIN_ID]:
    "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0" as `0x${string}`,
  [BASE_CHAIN_ID]:
    "0x4200000000000000000000000000000000000020" as `0x${string}`,
};

export const EAS_CONTRACT_ADDRESSES = {
  [ETHEREUM_SEPOLIA_CHAIN_ID]:
    "0xC2679fBD37d54388Ce493F1DB75320D236e1815e" as `0x${string}`,
  [BASE_CHAIN_ID]:
    "0x4200000000000000000000000000000000000021" as `0x${string}`,
};

export const EAS_NAME_SCHEMA_UID =
  "0x44d562ac1d7cd77e232978687fea027ace48f719cf1d58c7888e509663bb87fc" as `0x${string}`;

export const EAS_EXPLORER_ROOT_URLS = {
  [ETHEREUM_SEPOLIA_CHAIN_ID]: "https://sepolia.easscan.org",
  [BASE_CHAIN_ID]: "https://base.easscan.org",
};

export const SAFE_TRANSACTION_LIST_URLS = {
  [ETHEREUM_SEPOLIA_CHAIN_ID]:
    "https://app.safe.global/transactions/tx?safe=sep",
  [BASE_CHAIN_ID]: "https://app.safe.global/transactions/tx?safe=base",
};

export const ETH_EXPLORER_ROOT_URLS = {
  [ETHEREUM_SEPOLIA_CHAIN_ID]: "https://sepolia.etherscan.io",
  [BASE_CHAIN_ID]: "https://basescan.org",
};
