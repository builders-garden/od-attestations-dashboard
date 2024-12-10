import { LinkTextWithIcon } from "@/components/ui/linkTextWithIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldType, Schema, SchemaField } from "@/lib/eas/types";
import { shorten } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect } from "react";
import { ChangeSchemaName } from "./ChangeSchemaName";
import { Config, UseAccountReturnType } from "wagmi";
import { useGetSchemasNames } from "@/components/hooks/useGetSchemasNames";

interface SchemaSelectorProps {
  selectedSchema: Schema | undefined;
  setSelectedSchema: (schema: Schema | undefined) => void;
  schemas: Schema[];
  setSchemaFields: Dispatch<SetStateAction<SchemaField[] | undefined>>;
  account: UseAccountReturnType<Config>;
}

export const SchemaSelector: React.FC<SchemaSelectorProps> = ({
  selectedSchema,
  setSelectedSchema,
  schemas,
  setSchemaFields,
  account,
}) => {
  useEffect(() => {
    if (selectedSchema) {
      setSchemaFields(
        selectedSchema.schema.split(", ").map((field) => {
          const [type, ...nameParts] = field.split(" ") as [
            FieldType,
            ...string[],
          ];
          const name = nameParts.join(" ");
          return { name, type };
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSchema]);

  const schemaNames = useGetSchemasNames(schemas, account.chain?.id);
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full justify-between">
        <span className="text-sm">Select a Schema</span>
        {selectedSchema?.id && (
          <LinkTextWithIcon
            href={`https://${isProduction ? "base" : "sepolia"}.easscan.org/schema/view/${selectedSchema.id}`}
          >
            Easscan
          </LinkTextWithIcon>
        )}
      </div>
      <div className="flex w-full gap-4">
        <Select
          value={selectedSchema?.id}
          onValueChange={(e) =>
            setSelectedSchema(schemas.find((schema) => schema.id === e))
          }
        >
          <SelectTrigger className="font-mono">
            <SelectValue placeholder="..." />
          </SelectTrigger>
          <SelectContent>
            {schemas.map((schema) => {
              return (
                <SelectItem
                  key={schema.id}
                  value={schema.id}
                  className="font-mono cursor-pointer"
                >
                  {schemaNames[schema.id]?.length > 20
                    ? `${schemaNames[schema.id].substring(0, 20)}...`
                    : (schemaNames[schema.id] ?? shorten(schema.id, 6))}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <ChangeSchemaName
          schemaId={selectedSchema?.id}
          chainId={account.chain?.id}
        />
      </div>
    </div>
  );
};
