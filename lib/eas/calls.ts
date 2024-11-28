import { NO_EXPIRATION } from "@ethereum-attestation-service/eas-sdk";
import { EASAbi } from "../abi/EAS";
import { type WriteContractParameters } from "@wagmi/core";

export const easMultiAttest = (
  easAddress: `0x${string}`,
  schemaUID: `0x${string}`,
  recipientAddresses: `0x${string}`[],
  encodedData: `0x${string}`,
  isRevocable: boolean,
  refUID?: `0x${string}`,
): WriteContractParameters => {
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
    address: easAddress,
    abi: EASAbi,
    functionName: "multiAttest",
    args: [[request]],
  };
};

export const easMultiRevoke = (
  easAddress: `0x${string}`,
  schemaUID: `0x${string}`,
  attestationUIDs: `0x${string}`[],
): WriteContractParameters => {
  const request = {
    schema: schemaUID as `0x${string}`,
    data: attestationUIDs.map((attestationUID) => ({
      uid: attestationUID,
      value: BigInt(0),
    })),
  };

  return {
    address: easAddress,
    abi: EASAbi,
    functionName: "multiRevoke",
    args: [[request]],
  };
};
