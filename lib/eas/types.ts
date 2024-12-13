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

export type AttestationResponse = {
  data: {
    attestation: Attestation;
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
  schemaNames: SchemaName[];
};

export type SchemaName = {
  name: string;
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
  Number = "uint256",
  Boolean = "bool",
}

export type SchemaField = {
  name: string;
  type: FieldType;
};

export type AttestationDecodedDataTypeValue = {
  name: string;
  type: string;
  value:
    | string
    | number
    | boolean
    | {
        type: string;
        hex: string;
      };
};

export type AttestationDecodedDataType = {
  name: string;
  signature: string;
  type: string;
  value: AttestationDecodedDataTypeValue;
};
