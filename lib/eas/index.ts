import { GRAPHQL_ENDPOINTS } from "./constants";
import { AttestationsFromWalletQuery, SchemasFromWalletQuery } from "./queries";
import { AttestationsResponse, SchemataResponse } from "./types";

/**
 * A function that fetches all the schemas registered by a specific wallet.
 * @param creatorAddress - The wallet address of the schemas' creator.
 * @param chainId - The chain ID of the blockchain where the schemas are registered.
 * @returns The response from the GraphQL query or null if there was an error.
 */
export const schemasFromWallet = async (
  creatorAddress: string,
  chainId: number | undefined,
): Promise<SchemataResponse | null> => {
  if (!chainId) {
    console.error("Chain ID was not provided.");
    return {
      data: {
        schemata: [],
      },
    };
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
              equals: creatorAddress,
            },
          },
        },
      }),
    });

    return await response.json();
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * A function that fetches all the attestations received by a specific wallet.
 * @param recipientAddress - The wallet address of the attestations' recipient.
 * @param issuerAddress - The wallet address of the attestations' issuer.
 * @param chainId - The chain ID of the blockchain where the attestations are registered.
 * @returns The response from the GraphQL query or null if there was an error.
 */
export const getAttestationsFromWallet = async (
  recipientAddress: string,
  issuerAddress: string,
  chainId: number | undefined,
): Promise<AttestationsResponse | null> => {
  if (!chainId) {
    console.error("Chain ID was not provided.");
    return {
      data: {
        attestations: [],
      },
    };
  }
  const endpoint = GRAPHQL_ENDPOINTS[chainId as keyof typeof GRAPHQL_ENDPOINTS];
  try {
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

    return await response.json();
  } catch (e) {
    console.log(e);
    return null;
  }
};
