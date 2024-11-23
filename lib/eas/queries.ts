// This query gets all the schemas registered by a specific wallet.
export const SchemasFromWalletQuery = `
query Schemata($where: SchemaWhereInput) {
  schemata(where: $where) {
    id
    schema
    creator
    revocable
    index
    txid
    time
  }
}
`;

// This query gets all the attestations received by a specific wallet.
export const AttestationsFromWalletQuery = `
query Attestations($where: AttestationWhereInput) {
  attestations(where: $where) {
    id
    attester
    recipient
    decodedDataJson
    time
    timeCreated
    expirationTime
    revocationTime
    revocable
    revoked
    schemaId
  }
}
`;
