// This query gets many schemas
// This can be filtered specifying a wallet address that created the schemas.
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

// This query gets many attestations
// This can be filtered specifying a recipient address and/or attester.
export const AttestationsFromWalletQuery = `
query Attestations($where: AttestationWhereInput, $distinct: [AttestationScalarFieldEnum!]) {
  attestations(where: $where, distinct: $distinct) {
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
    schema {
      schema
      id
      creator
      revocable
      index
      txid
      time
    }
  }
}
`;
