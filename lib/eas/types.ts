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
};
