import { getSchemasNamesAttestations } from "@/lib/eas";
import { Schema } from "@/lib/eas/types";
import { useEffect, useState } from "react";

export const useGetSchemasNames = (
  schemas: Schema[],
  chainId: number | undefined,
) => {
  const schemaIds = schemas.map((schema) => schema.id);
  const [schemaNames, setSchemaNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchNames = async (): Promise<void> => {
      const namesAttestations = await getSchemasNamesAttestations(
        schemaIds,
        chainId,
      );
      namesAttestations.forEach((attestation) => {
        const decodedData = JSON.parse(attestation.decodedDataJson);
        const schemaId = decodedData.find(
          (element: any) => element.value.name === "schemaId",
        )?.value.value;
        const name = decodedData.find(
          (element: any) => element.value.name === "name",
        )?.value.value;
        schemaNames[schemaId] = name;
      });
      setSchemaNames({ ...schemaNames });
    };
    if (chainId) {
      fetchNames();
    }
  }, [schemas, chainId]);

  return schemaNames;
};
