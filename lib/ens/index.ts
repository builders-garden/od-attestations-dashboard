import { http } from "viem";
import { mainnet } from "viem/chains";
import { getRecords, getName, getOwner } from "@ensdomains/ensjs/public";
import { createEnsPublicClient } from "@ensdomains/ensjs";

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});

export interface EnsProfileType {
  name: string;
  avatar: string | undefined;
  address: string;
}

/**
 * An utility function to get the ENS profiles of an array of addresses
 * @param addresses - The addresses to get the ENS profiles of
 * @returns The ENS profiles of the addresses
 */
export const getEnsProfiles = async (addresses: `0x${string}`[]) => {
  try {
    // Get the ENS names of the addresses
    const namesBatch = [];
    for (const address of addresses) {
      namesBatch.push(getName.batch({ address }));
    }
    const names = await client.ensBatch(...namesBatch);

    // Get the avatars of the ENS names
    const avatarBatch = [];
    for (const name of names) {
      if (name?.match) {
        avatarBatch.push(
          getRecords.batch({ name: name.name, texts: ["avatar"] }),
        );
      }
    }
    const avatars = await client.ensBatch(...avatarBatch);

    // Create the EnsProfileType array
    const profiles: EnsProfileType[] = [];
    for (let i = 0; i < addresses.length; i++) {
      profiles.push({
        name: names[i]?.name ?? "",
        avatar: avatars[i]?.texts[0].value ?? undefined,
        address: addresses[i],
      });
    }

    return profiles;
  } catch (e) {
    console.log(e);
    return [];
  }
};

/**
 * A utility function to get the address of an ENS name
 * @param ensName - The ENS name to get the address of
 * @returns The address of the ENS name
 */
export const getEnsAddress = async (ensName: `${string}.eth`) => {
  try {
    const ensAddress = await client.ensBatch(getOwner.batch({ name: ensName }));
    return ensAddress?.[0]?.owner.toLowerCase() as `0x${string}`;
  } catch (e) {
    console.log(e);
    return "";
  }
};
