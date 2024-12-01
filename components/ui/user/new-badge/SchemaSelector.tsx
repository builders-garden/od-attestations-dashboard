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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSchema]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full justify-between">
        <span className="text-sm">Select a Schema</span>
        {selectedSchema?.id && (
          <LinkTextWithIcon
            href={`https://sepolia.easscan.org/schema/view/${selectedSchema.id}`}
          >
            Easscan
          </LinkTextWithIcon>
        )}
      </div>
      <Select
        value={selectedSchema?.id}
        onValueChange={(e) =>
          setSelectedSchema(schemas.find((schema) => schema.id === e))
        }
      >
        <SelectTrigger>
          <SelectValue className="font-mono" placeholder="..." />
        </SelectTrigger>
        <SelectContent>
          {schemas.map((schema) => (
            <SelectItem key={schema.id} value={schema.id} className="font-mono">
              {shorten(schema.id)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
