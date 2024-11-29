import { createPublicClient, GetEnsNameReturnType, http } from "viem";
import { mainnet, sepolia } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export interface EnsProfileType {
  name: GetEnsNameReturnType;
  avatar: string | undefined;
}

/**
 * An utility function to get the ENS profile of an address
 * @param address - The address to get the ENS profile of
 * @returns The ENS profile of the address
 */
export const getEnsProfile = async (address: `0x${string}`) => {
  const ensName = await client.getEnsName({ address: address });
  let avatar: string | undefined = undefined;
  if (ensName) {
    avatar = (await client.getEnsAvatar({ name: ensName as string })) as string;
  }
  return { name: ensName, avatar };
};

/**
 * A utility function to get the address of an ENS name
 * @param ensName - The ENS name to get the address of
 * @returns The address of the ENS name
 */
export const getEnsAddress = async (ensName: `${string}.eth`) => {
  const ensAddress = await client.getEnsAddress({ name: ensName });
  return ensAddress?.toLowerCase() as `0x${string}`;
};
