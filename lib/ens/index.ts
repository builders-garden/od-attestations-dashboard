import { EnsProfileType } from "./types";

/**
 * A function to get the ENS profile from the ENS name or wallet address
 * @param nameOrAddress - The ENS name or wallet address
 * @returns The ENS profile or null if not found
 */
export const getEnsProfileFromNameOrAddress = async (
  nameOrAddress: string,
): Promise<EnsProfileType | null> => {
  const response = await fetch(`https://api.web3.bio/ns/ens/${nameOrAddress}`);
  const data = await response.json();
  if (data.error) {
    return null;
  }
  return data;
};
