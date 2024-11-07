import BadgeClass from "./classes/BadgeClass";

// Add your admin address here to test
export const ADMIN_ADDRESSES = [
  "0x82A29547CA8970c2aDECF4C2db7e364339f9a4B7",
  "0xb5C99bf3F9B8EDf2A532614049e9EE4302670a4a",
];

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

// Badges used to test the UI
export const userBadges = [
  new BadgeClass(1, "/badges/badge1.png", "First Buyer", true, lorem),
  new BadgeClass(2, "/badges/badge2.png", "Onchain Sherpa", true, lorem),
  new BadgeClass(3, "/badges/badge3.png", "MEV Slayer", true, lorem),
  new BadgeClass(4, "/badges/badge4.png", "Spirit Guide", false, lorem),
  new BadgeClass(5, "/badges/badge5.png", "Pulcino Pio", false, lorem),
  new BadgeClass(6, "/badges/badge6.png", "OCCHIO BRUCIA AHIA!!", false, lorem),
];
export const adminBadges = [
  new BadgeClass(1, "/badges/badge1.png", "First Buyer", true, lorem),
  new BadgeClass(2, "/badges/badge2.png", "Onchain Sherpa", true, lorem),
  new BadgeClass(3, "/badges/badge3.png", "MEV Slayer", true, lorem),
  new BadgeClass(4, "/badges/badge4.png", "Spirit Guide", true, lorem),
  new BadgeClass(5, "/badges/badge5.png", "Pulcino Pio", true, lorem),
  new BadgeClass(6, "/badges/badge6.png", "OCCHIO BRUCIA AHIA!!", true, lorem),
];

// Users used to test the UI
export const collectors = [
  "limone.eth",
  "0x82A29547........364339f9a4B7",
  "0x82A29547........364339f9a4B7",
  "0x82A29547........364339f9a4B7",
  "blackicon.eth",
  "0x82A29547........364339f9a4B7",
  "camparimaximalist.eth",
];
