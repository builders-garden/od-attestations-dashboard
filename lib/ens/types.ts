export interface EnsProfileType {
  address: string;
  identity: string;
  platform: string;
  displayName: string;
  avatar: string;
  description: string | null;
  aliases?: string[];
  error?: string;
}
