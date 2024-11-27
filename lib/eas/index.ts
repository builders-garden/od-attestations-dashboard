import { GRAPHQL_ENDPOINTS } from "./constants";
import { AttestationsFromWalletQuery, SchemasFromWalletQuery } from "./queries";
import {
  Attestation,
  AttestationsResponse,
  Schema,
  SchemataResponse,
  AttestationDecodedDataType,
} from "./types";

/**
 * A utility function that filters out the valid attestations from a list of attestations. A valid attestation is one that is not revoked and has the ODPassport flag set to true.
 * @param attestations - An array of Attestations.
 * @returns The array of valid attestations.
 */
const getValidODAttestations = (attestations: Attestation[]) => {
  const validAttestations = attestations.filter((attestation: Attestation) => {
    if (attestation.revoked || !attestation.decodedDataJson) {
      return false;
    }
    // Since the decodedDataJson is an array of objects, we need to check element by element
    const attestationDecodedDataArray = JSON.parse(attestation.decodedDataJson);
    for (const element of attestationDecodedDataArray) {
      if (element.value.name === "ODPassport" && element.value.value) {
        return true;
      }
    }
    return false;
  });
  return validAttestations;
};

/**
 * A utility function that filters out all the attestations that haven't the ODPassport flag set to true.
 * @param attestations - An array of Attestations.
 * @returns The array of valid attestations.
 */
const getODAttestations = (attestations: Attestation[]) => {
  const validAttestations = attestations.filter((attestation: Attestation) => {
    if (!attestation.decodedDataJson) {
      return false;
    }
    // Since the decodedDataJson is an array of objects, we need to check element by element
    const attestationDecodedDataArray = JSON.parse(attestation.decodedDataJson);
    for (const element of attestationDecodedDataArray) {
      if (element.value.name === "ODPassport" && element.value.value) {
        return true;
      }
    }
    return false;
  });
  return validAttestations;
};

/**
 * A utility function to find all the unique attestations from a list of attestations. An attestation is considered unique if it has a different key composed by the concatenation of schema ID, BadgeTitle, and BadgeImageCID.
 * @param attestations - An array of Attestations.
 * @returns An array of unique Attestations.
 */
const getUniqueAttestations = (attestations: Attestation[]) => {
  const uniqueAttestationsMap = new Map<string, Attestation>();
  attestations.forEach((attestation) => {
    if (!attestation.decodedDataJson) {
      return;
    }
    const attestationDecodedDataArray = JSON.parse(attestation.decodedDataJson);
    console.log("attestationDecodedDataArray: ", attestationDecodedDataArray);
    // Create a unique key for the attestation
    const uniqueKey = createUniqueKey(
      attestation.schemaId,
      attestationDecodedDataArray,
    );
    if (!uniqueKey) return;
    uniqueAttestationsMap.set(uniqueKey, attestation);
  });
  const uniqueAttestationsArray = Array.from(uniqueAttestationsMap.values());
  return uniqueAttestationsArray;
};

/**
 * A utility function that creates a unique key for an attestation based on the schema ID, BadgeTitle, and BadgeImageCID.
 * @param schemaId - The attestation's schema ID.
 * @param attestationDecodedDataArray - The decoded data of the attestation.
 * @returns A unique key or undefined if the BadgeTitle or BadgeImageCID were not found.
 */
export const createUniqueKey = (
  schemaId: string,
  attestationDecodedDataArray: AttestationDecodedDataType[],
): string | undefined => {
  // Since the decodedDataJson is an array of objects, we need to check element by element
  let badgeTitle = "";
  let badgeImageCID = "";
  for (const element of attestationDecodedDataArray) {
    if (element.value.name === "BadgeTitle") {
      badgeTitle = (element.value.value as string)
        .replace(" ", "_")
        .toLowerCase();
    } else if (element.value.name === "BadgeImageCID") {
      badgeImageCID = element.value.value as string;
    }
  }
  if (!badgeTitle || !badgeImageCID) {
    return;
  }
  return schemaId + badgeTitle + badgeImageCID;
};

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
 * A function that fetches ALL the OD Passport attestations received by a specific wallet and issued by various wallets.
 * @param recipientAddress - The wallet address of the attestations' recipient.
 * @param issuerAddresses - An array of wallet addresses of the attestations' issuers.
 * @param chainId - The chain ID of the blockchain where the attestations are registered.
 * @returns An array of Attestations or [] if there was an error.
 */
export const getUserAttestations = async (
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
    // Remove all the attestations that are not relative to OD Passport
    attestations = getODAttestations(attestations);
    return attestations;
  } catch (e) {
    console.log(e);
    return [];
  }
};

/**
 * A function that fetches all the unrevoked and unique attestations received by a specific wallet and issued by various wallets.
 * @param recipientAddress - The wallet address of the attestations' recipient.
 * @param issuerAddresses - An array of wallet addresses of the attestations' issuers.
 * @param chainId - The chain ID of the blockchain where the attestations are registered.
 * @returns An array of Attestations or [] if there was an error.
 */
export const getUserUniqueAttestations = async (
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
    const validAttestations = getValidODAttestations(attestations);
    const uniqueAttestations = getUniqueAttestations(validAttestations);

    return uniqueAttestations;
  } catch (e) {
    console.log(e);
    return [];
  }
};

/**
 * A function that fetches all the unrevoked and unique attestations issued by various wallets.
 * @param issuerAddresses - An array of wallet addresses of the attestations' issuers.
 * @param chainId - The chain ID of the blockchain where the attestations are registered.
 * @returns An array of Attestations or [] if there was an error.
 */
export const getEveryUniqueAttestations = async (
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
              // In this case only the attester is important to filter out the attestations
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

    // Since different attestations could have the same schema ID, we need to filter by their structure
    const validAttestations = getValidODAttestations(attestations);
    const uniqueAttestations = getUniqueAttestations(validAttestations);

    return uniqueAttestations;
  } catch (e) {
    console.log(e);
    return [];
  }
};
