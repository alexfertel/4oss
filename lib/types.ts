export type Falsy = false | null | undefined;

export type DeviceType = "desktop" | "mobile";

export type ProjectInfo = {
  id: string;
  title: string;
  url: string;
};

export interface Project {
  src: string;
  info: ProjectInfo;
}

export interface RawProject {
  version: number;
  name: string;
  display_name: string;
  description?: string;
  websites?: URL[];
  social?: SocialProfile;
  github?: URL[];
  npm?: URL[];
  crates?: URL[];
  pypi?: URL[];
  go?: URL[];
  open_collective?: URL[];
  blockchain?: BlockchainAddress[];
  defillama?: URL[];
  comments?: string[];
  [k: string]: unknown;
}

export interface URL {
  url: string;
  [k: string]: unknown;
}

export interface SocialProfile {
  farcaster?: URL[];
  medium?: URL[];
  mirror?: URL[];
  telegram?: URL[];
  twitter?: URL[];
  [k: string]: unknown;
}

export interface BlockchainAddress {
  address: string;
  tags: [
    (
      | "bridge"
      | "contract"
      | "creator"
      | "deployer"
      | "eoa"
      | "factory"
      | "proxy"
      | "safe"
      | "wallet"
    ),
    ...(
      | "bridge"
      | "contract"
      | "creator"
      | "deployer"
      | "eoa"
      | "factory"
      | "proxy"
      | "safe"
      | "wallet"
    )[],
  ];
  networks: [
    (
      | "any_evm"
      | "arbitrum_one"
      | "automata"
      | "base"
      | "bob"
      | "cyber"
      | "frax"
      | "ham"
      | "ink"
      | "kroma"
      | "linea"
      | "lisk"
      | "lyra"
      | "mainnet"
      | "mantle"
      | "matic"
      | "metal"
      | "mint"
      | "mode"
      | "optimism"
      | "orderly"
      | "pgn"
      | "polynomial"
      | "polygon_zkevm"
      | "race"
      | "redstone"
      | "scroll"
      | "shape"
      | "soneium"
      | "swan"
      | "swell"
      | "unichain"
      | "worldchain"
      | "xterio"
      | "zksync_era"
      | "zora"
    ),
    ...(
      | "any_evm"
      | "arbitrum_one"
      | "automata"
      | "base"
      | "bob"
      | "cyber"
      | "frax"
      | "ham"
      | "ink"
      | "kroma"
      | "linea"
      | "lisk"
      | "lyra"
      | "mainnet"
      | "mantle"
      | "matic"
      | "metal"
      | "mint"
      | "mode"
      | "optimism"
      | "orderly"
      | "pgn"
      | "polynomial"
      | "polygon_zkevm"
      | "race"
      | "redstone"
      | "scroll"
      | "shape"
      | "soneium"
      | "swan"
      | "swell"
      | "unichain"
      | "worldchain"
      | "xterio"
      | "zksync_era"
      | "zora"
    )[],
  ];
  name?: string;
  [k: string]: unknown;
}
