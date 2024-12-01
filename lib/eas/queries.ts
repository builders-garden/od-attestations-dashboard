// This query gets many schemas and can be filtered.
export const SchemasQuery = `
query Schemata($where: SchemaWhereInput, $schemaNamesWhere2: SchemaNameWhereInput) {
  schemata(where: $where) {
    id
    schema
    creator
    revocable
    index
    txid
    time
    schemaNames(where: $schemaNamesWhere2) {
      name
    }
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

export const SchemasNamesQuery = `
query Attestations($where: AttestationWhereInput, $orderBy: [AttestationOrderByWithRelationInput!]) {
  attestations(where: $where, orderBy: $orderBy) {
    data
    decodedDataJson
    timeCreated
    schemaId
    refUID
    recipient
    attester
  }
}
`;
