import { isAddress } from "viem";
import { EnsProfileType } from "./types";

/**
 * A function to get the ENS profile from the ENS name or wallet address
 * @param nameOrAddress - The ENS name or wallet address
 * @returns The ENS profile or null if not found or an error occurred
 */
export const getEnsProfileFromNameOrAddress = async (
  nameOrAddress: string,
): Promise<EnsProfileType | null> => {
  // If the profile is already stored in the session storage, return it
  const profile = sessionStorage.getItem(nameOrAddress.toLowerCase());
  if (profile) {
    return JSON.parse(profile);
  }

  // Fetch the profile from the API
  try {
    const response = await fetch(
      `https://api.web3.bio/ns/ens/${nameOrAddress}`,
    );
    const data = await response.json();
    if (data.error) {
      return null;
    }
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * A function to get the ENS profiles from an array of ENS names or wallet addresses
 * @param namesOrAddresses - The array of ENS names or wallet addresses
 * @returns The ENS profiles as an Object associating addresses and profiles, or null if not found or an error occurred
 */
export const getEnsProfilesFromNamesOrAddresses = async (
  namesOrAddresses: string[],
): Promise<{ [key: string]: EnsProfileType } | null> => {
  // If there are no names or addresses, return null
  if (!namesOrAddresses.length) {
    return null;
  }

  // Create the object that will be returned in the form address->profile and a pending array
  const profilesObject: { [key: string]: EnsProfileType } = {};
  const pending: string[] = [];

  // For each name or address, check if it exists already in the session storage
  // If it does, add it to the data object
  // If it doesn't, add it to the pending array
  namesOrAddresses.forEach((nameOrAddress) => {
    const profile = sessionStorage.getItem(nameOrAddress.toLowerCase());
    if (profile) {
      profilesObject[nameOrAddress.toLowerCase()] = JSON.parse(profile);
    } else {
      pending.push(
        isAddress(nameOrAddress)
          ? `ethereum,${nameOrAddress}`
          : `ens,${nameOrAddress}`,
      );
    }
  });

  // If there are no pending names or addresses, return the data object
  if (!pending.length) {
    return profilesObject;
  }

  // Fetch the profiles of the pending names or addresses by encoding them in the URL
  const encodedPendingArray = encodeURIComponent(JSON.stringify(pending));
  try {
    const response = await fetch(
      `https://api.web3.bio/ns/batch/${encodedPendingArray}`,
    );
    const data = await response.json();

    // If there is an error, return null
    if (data.error) {
      return null;
    }

    // For each profile, add it to the data object and store it in the session storage
    data.forEach((profile: EnsProfileType) => {
      profilesObject[profile.address.toLowerCase()] = profile;
      sessionStorage.setItem(
        profile.address.toLowerCase(),
        JSON.stringify(profile),
      );
    });

    return profilesObject;
  } catch (e) {
    console.log(e);
    return null;
  }
};
