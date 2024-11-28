// This query gets many schemas and can be filtered.
export const SchemasQuery = `
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

// This query gets one attestation and can be filtered.
export const AttestationQuery = `
query Attestation($where: AttestationWhereUniqueInput!) {
  attestation(where: $where) {
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

// This query gets many attestations and can be filtered.
export const AttestationsQuery = `
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
