import { LinkTextWithIcon } from "@/components/ui/linkTextWithIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldType, Schema, SchemaField } from "@/lib/eas/types";
import { getEnvironmentChainId, shorten } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect } from "react";
import { ChangeSchemaName } from "./ChangeSchemaName";
import { EAS_EXPLORER_ROOT_URLS } from "@/lib/eas/constants";

interface SchemaSelectorProps {
  selectedSchema: Schema | undefined;
  setSelectedSchema: (schema: Schema | undefined) => void;
  schemas: Schema[];
  setSchemaFields: Dispatch<SetStateAction<SchemaField[] | undefined>>;
}

export const SchemaSelector: React.FC<SchemaSelectorProps> = ({
  selectedSchema,
  setSelectedSchema,
  schemas,
  setSchemaFields,
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
  }, [selectedSchema]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full justify-between">
        <span className="text-sm">Select a Schema</span>
        {selectedSchema?.id && (
          <LinkTextWithIcon
            href={`${EAS_EXPLORER_ROOT_URLS[getEnvironmentChainId()]}/schema/view/${selectedSchema.id}`}
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
                  {schema.schemaNames[0]?.name.length > 20
                    ? `${schema.schemaNames[0].name.substring(0, 20)}...`
                    : (schema.schemaNames[0]?.name ?? shorten(schema.id, 6))}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <ChangeSchemaName
          schemaId={selectedSchema?.id}
          chainId={getEnvironmentChainId()}
        />
      </div>
    </div>
  );
};
