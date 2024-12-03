import { EAS_NAME_SCHEMA_UID, GRAPHQL_ENDPOINTS } from "./constants";
import {
  AttestationQuery,
  AttestationsQuery,
  SchemasNamesQuery,
  SchemasQuery,
} from "./queries";
import {
  Attestation,
  AttestationsResponse,
  Schema,
  SchemataResponse,
  AttestationDecodedDataType,
  AttestationResponse,
} from "./types";

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
        query: SchemasQuery,
        variables: {
          where: {
            creator: {
              in: creatorAddresses,
            },
            schema: {
              startsWith:
                "string BadgeTitle, string BadgeDescription, string BadgeImageCID, bool ODPassport",
            },
          },
          schemaNamesWhere2: {
            attesterAddress: {
              in: creatorAddresses,
            },
          },
        },
      }),
    });

    const payload: SchemataResponse = await response.json();
    return payload.data.schemata;
  } catch (e) {
    console.error(e);
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
          query: AttestationsQuery,
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
    console.error(e);
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
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: AttestationsQuery,
        variables: {
          where: {
            recipient: {
              equals: recipientAddress,
            },
            attester: {
              in: issuerAddresses,
            },
            revoked: {
              equals: false,
            },
            decodedDataJson: {
              contains:
                '{"name":"ODPassport","type":"bool","signature":"bool ODPassport","value":{"name":"ODPassport","type":"bool","value":true}}',
            },
            schema: {
              is: {
                schema: {
                  contains:
                    "string BadgeTitle, string BadgeDescription, string BadgeImageCID",
                },
              },
            },
          },
          distinct: "decodedDataJson",
        },
      }),
    });
    const payload: AttestationsResponse = await response.json();

    return payload.data.attestations;
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * A function that fetches all the unrevoked and unique attestations issued by various wallets.
 * @param issuerAddresses - An array of wallet addresses of the attestations' issuers.
 * @param chainId - The chain ID of the blockchain where the attestations are registered.
 * @returns An array of Attestations or [] if there was an error.
 */
export const getEveryUniqueAttestation = async (
  issuerAddresses: string[],
  chainId: number | undefined,
): Promise<Attestation[]> => {
  // Check if the chain ID or issuer addresses were not provided
  if (!chainId || issuerAddresses.length === 0) {
    console.error("Chain ID or issuer addresses were not provided.");
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
        query: AttestationsQuery,
        variables: {
          where: {
            attester: {
              in: issuerAddresses,
            },
            revoked: {
              equals: false,
            },
            decodedDataJson: {
              contains:
                '{"name":"ODPassport","type":"bool","signature":"bool ODPassport","value":{"name":"ODPassport","type":"bool","value":true}}',
            },
            schema: {
              is: {
                schema: {
                  contains:
                    "string BadgeTitle, string BadgeDescription, string BadgeImageCID",
                },
              },
            },
          },
          distinct: "decodedDataJson",
        },
      }),
    });
    const payload: AttestationsResponse = await response.json();

    return payload.data.attestations;
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * A function that fetches an attestation given its UID.
 * @param attestationUID - The UID of the attestation.
 * @param chainId - The chain ID of the blockchain where the attestation is registered.
 * @returns An Attestation or null if there was an error.
 */
export const getAttestationFromUID = async (
  attestationUID: string,
  chainId: number | undefined,
): Promise<Attestation | null> => {
  if (!chainId) {
    console.error("Chain ID was not provided.");
    return null;
  }
  const endpoint = GRAPHQL_ENDPOINTS[chainId as keyof typeof GRAPHQL_ENDPOINTS];
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: AttestationQuery,
        variables: {
          where: {
            id: attestationUID,
          },
        },
      }),
    });
    const payload: AttestationResponse = await response.json();
    return payload.data.attestation;
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * A function to get all the attestations of a specific kind.
 * @param decodedDataJson - The decoded data of the attestation.
 * @param chainId - The chain ID of the blockchain where the attestations are registered.
 * @returns An array of Attestations or [] if there was an error.
 */
export const getAllAttestationsOfAKind = async (
  decodedDataJson: string | undefined,
  chainId: number | undefined,
): Promise<Attestation[]> => {
  if (!chainId || !decodedDataJson) {
    console.error("Chain ID or decodedDataJson was not provided.");
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
        query: AttestationsQuery,
        variables: {
          where: {
            decodedDataJson: {
              equals: decodedDataJson,
            },
            revoked: {
              equals: false,
            },
          },
          distinct: "recipient",
        },
      }),
    });
    const payload: AttestationsResponse = await response.json();
    return payload.data.attestations;
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * A function to get all the attestation names of one or more schemas.
 * @param schemaIds - An array of schema IDs.
 * @param chainId - The chain ID of the blockchain where the attestations are registered.
 * @returns An array of Attestations or [] if there was an error - data and decodedDataJson will contain the schema name.
 */
export const getSchemasNamesAttestations = async (
  schemaIds: string[],
  chainId: number | undefined,
): Promise<Attestation[]> => {
  if (!chainId || schemaIds.length === 0) {
    console.error("Chain ID or schema IDs were not provided.");
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
        query: SchemasNamesQuery,
        variables: {
          where: {
            schemaId: {
              equals: EAS_NAME_SCHEMA_UID,
            },
            attester: {
              equals: process.env.NEXT_PUBLIC_SAFE_ADDRESS,
            },
            OR: schemaIds.map((id) => ({
              decodedDataJson: {
                contains: id,
              },
            })),
          },
        },
      }),
    });
    const payload: AttestationsResponse = await response.json();
    return payload.data.attestations;
  } catch (e) {
    console.error(e);
    return [];
  }
};
