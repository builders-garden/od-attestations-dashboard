import { NO_EXPIRATION } from "@ethereum-attestation-service/eas-sdk";
import { EASAbi } from "../abi/EAS";
import { SendSafeTransactionParams } from "@/components/hooks/useSendSafeTransaction";
import { EAS_CONTRACT_ADDRESSES } from "./constants";
import { getEnvironmentChainId } from "../utils";

export const easAttest = (
  schemaUID: `0x${string}`,
  recipientAddress: `0x${string}` | undefined,
  encodedData: `0x${string}`,
  isRevocable: boolean,
  refUID?: `0x${string}`,
): SendSafeTransactionParams => {
  const request = {
    schema: schemaUID as `0x${string}`,
    data: {
      recipient:
        recipientAddress || "0x0000000000000000000000000000000000000000",
      expirationTime: NO_EXPIRATION,
      revocable: isRevocable,
      refUID:
        refUID ||
        ("0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`),
      data: encodedData,
      value: BigInt(0),
    },
  };

  return {
    abi: EASAbi,
    contractAddress: EAS_CONTRACT_ADDRESSES[getEnvironmentChainId()],
    functionName: "attest",
    args: [request],
    value: "0",
  };
};

export const easMultiAttest = (
  schemaUID: `0x${string}`,
  recipientAddresses: `0x${string}`[],
  encodedData: `0x${string}`,
  isRevocable: boolean,
  refUID?: `0x${string}`,
): SendSafeTransactionParams => {
  const request = {
    schema: schemaUID as `0x${string}`,
    data: recipientAddresses.map((recipientAddress) => ({
      recipient: recipientAddress,
      expirationTime: NO_EXPIRATION,
      revocable: isRevocable,
      refUID:
        refUID ||
        ("0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`),
      data: encodedData,
      value: BigInt(0),
    })),
  };

  return {
    abi: EASAbi,
    contractAddress: EAS_CONTRACT_ADDRESSES[getEnvironmentChainId()],
    functionName: "multiAttest",
    args: [[request]],
    value: "0",
  };
};

export const easMultiRevoke = (
  schemaUID: `0x${string}`,
  attestationUIDs: `0x${string}`[],
): SendSafeTransactionParams => {
  const request = {
    schema: schemaUID as `0x${string}`,
    data: attestationUIDs.map((attestationUID) => ({
      uid: attestationUID,
      value: BigInt(0),
    })),
  };

  return {
    abi: EASAbi,
    contractAddress: EAS_CONTRACT_ADDRESSES[getEnvironmentChainId()],
    functionName: "multiRevoke",
    args: [[request]],
    value: "0",
  };
};
