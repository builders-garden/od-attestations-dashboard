import { GRAPHQL_ENDPOINTS } from "./constants";
import { AttestationsFromWalletQuery, SchemasFromWalletQuery } from "./queries";
import {
  Attestation,
  AttestationsResponse,
  Schema,
  SchemataResponse,
} from "./types";

/**
 * A function that fetches all the schemas registered by specific wallets.
 * @param creatorAddresses - An array of wallet addresses of the schemas' creators.
 * @param chainId - The chain ID of the blockchain where the schemas are registered.
 * @returns An array of Schemas or [] if there was an error.
 */
export const schemasFromWallets = async (
  creatorAddresses: string[],
  chainId: number | undefined,
): Promise<Schema[]> => {
  // Check if the chain ID was not provided
  if (!chainId) {
    console.error("Chain ID was not provided.");
    return [];
  }
  const endpoint = GRAPHQL_ENDPOINTS[chainId as keyof typeof GRAPHQL_ENDPOINTS];
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: SchemasFromWalletQuery,
        variables: {
          where: {
            creator: {
              in: creatorAddresses,
            },
          },
        },
      }),
    });

    const payload: SchemataResponse = await response.json();
    return payload.data.schemata;
  } catch (e) {
    console.log(e);
    return [];
  }
};

/**
 * A function that fetches ALL the attestations received by a specific wallet and issued by various wallets.
 * @param recipientAddress - The wallet address of the attestations' recipient.
 * @param issuerAddresses - An array of wallet addresses of the attestations' issuers.
 * @param chainId - The chain ID of the blockchain where the attestations are registered.
 * @returns An array of Attestations or [] if there was an error.
 */
export const getAllAttestationsFromIssuers = async (
  recipientAddress: string,
  issuerAddresses: string[],
  chainId: number | undefined,
): Promise<Attestation[]> => {
  // Check if the chain ID or issuer addresses were not provided
  if (!chainId || issuerAddresses.length === 0) {
    console.error("Chain ID or issuer addresses were not provided.");
    return [];
  }

  const endpoint = GRAPHQL_ENDPOINTS[chainId as keyof typeof GRAPHQL_ENDPOINTS];
  let attestations: Attestation[] = [];
  try {
    for (const issuerAddress of issuerAddresses) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: AttestationsFromWalletQuery,
          variables: {
            where: {
              recipient: {
                equals: recipientAddress,
              },
              attester: {
                equals: issuerAddress,
              },
            },
          },
        }),
      });
      const payload: AttestationsResponse = await response.json();
      attestations = [...attestations, ...payload.data.attestations];
    }
    return attestations;
  } catch (e) {
    console.log(e);
    return [];
  }
};

/**
 * A function that fetches ALL the unique attestations received by a specific wallet and issued by various wallets.
 * @param recipientAddress - The wallet address of the attestations' recipient.
 * @param issuerAddresses - An array of wallet addresses of the attestations' issuers.
 * @param chainId - The chain ID of the blockchain where the attestations are registered.
 * @returns An array of Attestations or [] if there was an error.
 */
export const getAllUniqueAttestationsFromIssuers = async (
  recipientAddress: string,
  issuerAddresses: string[],
  chainId: number | undefined,
): Promise<Attestation[]> => {
  // Check if the chain ID or issuer addresses were not provided
  if (!chainId || issuerAddresses.length === 0) {
    console.error("Chain ID or issuer addresses were not provided.");
    return [];
  }

  const endpoint = GRAPHQL_ENDPOINTS[chainId as keyof typeof GRAPHQL_ENDPOINTS];
  let attestations: Attestation[] = [];
  try {
    for (const issuerAddress of issuerAddresses) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: AttestationsFromWalletQuery,
          variables: {
            where: {
              recipient: {
                equals: recipientAddress,
              },
              attester: {
                equals: issuerAddress,
              },
            },
          },
        }),
      });
      const payload: AttestationsResponse = await response.json();
      attestations = [...attestations, ...payload.data.attestations];
    }

    // Since a wallet could have multiple attestations from the same issuer
    // or have them doubled because of revoking and reissuing, we need to count the unique attestations
    // by filtering out the revoked ones and getting the ones that are unique by their schema ID.
    const validAttestations = attestations.filter(
      (attestation: Attestation) => {
        return !attestation.revoked;
      },
    );
    const uniqueAttestationsMap = new Map<string, Attestation>();
    validAttestations.forEach((attestation) => {
      uniqueAttestationsMap.set(attestation.schemaId, attestation);
    });
    const uniqueAttestationsArray = Array.from(uniqueAttestationsMap.values());
    return uniqueAttestationsArray;
  } catch (e) {
    console.log(e);
    return [];
  }
};
