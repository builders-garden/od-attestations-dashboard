export type SchemataResponse = {
  data: {
    schemata: Schema[];
  };
};

export type AttestationsResponse = {
  data: {
    attestations: Attestation[];
  };
};

export type Schema = {
  id: string;
  schema: string;
  creator: string;
  revocable: boolean;
  index: string;
  txid: string;
  time: number;
};

export type Attestation = {
  id: string;
  attester: string;
  recipient: string;
  decodedDataJson: string;
  time: number;
  timeCreated: number;
  expirationTime: number;
  revocationTime: number;
  revocable: boolean;
  revoked: boolean;
  schemaId: string;
  schema: Schema;
};

export enum FieldType {
  String = "string",
  Address = "address",
  Number = "number",
  Boolean = "boolean",
}

export type SchemaField = {
  name: string;
  type: FieldType;
};

export type AttestationDecodedDataType = {
  name: string;
  signature: string;
  type: string;
  value: {
    name: string;
    type: string;
    value: string | number | boolean;
  };
};
