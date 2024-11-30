import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAccount, useWriteContract } from "wagmi";
import { useState } from "react";
import { SchemaRegistryAbi } from "@/lib/abi/SchemaRegistry";
import { SCHEMA_REGISTRY_CONTRACT_ADDRESSES } from "@/lib/eas/constants";
import { FieldType } from "@/lib/eas/types";

const formSchema = z.object({
  fields: z.array(
    z.object({
      fieldName: z.string(),
      fieldType: z.nativeEnum({
        String: FieldType.String,
        Number: FieldType.Number,
        Boolean: FieldType.Boolean,
      }),
    }),
  ),
});

const mandatoryFields: z.infer<typeof formSchema>["fields"] = [
  {
    fieldName: "BadgeTitle",
    fieldType: FieldType.String,
  },
  {
    fieldName: "BadgeDescription",
    fieldType: FieldType.String,
  },
  {
    fieldName: "BadgeImageCID",
    fieldType: FieldType.String,
  },
  {
    fieldName: "ODPassport",
    fieldType: FieldType.Boolean,
  },
];

export const RegisterSchemaForm: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fields: [
        ...mandatoryFields,
        { fieldName: "", fieldType: FieldType.String },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const account = useAccount();
  const { data: hash, error, writeContractAsync } = useWriteContract();
  const [loading, setLoading] = useState(false);

  const registerSchema = async (
    schemaAddress: `0x${string}`,
    schema: string,
    resolverAddress: `0x${string}`,
    isRevocable: boolean,
  ) => {
    await writeContractAsync({
      address: schemaAddress,
      abi: SchemaRegistryAbi,
      functionName: "register",
      args: [schema, resolverAddress, isRevocable],
    });
  };

  const stringifyFields = (fields: z.infer<typeof formSchema>["fields"]) => {
    return fields
      .map((field) => `${field.fieldType} ${field.fieldName}`)
      .join(", ");
  };

  const handleRegisterSchema = async (values: z.infer<typeof formSchema>) => {
    try {
      if (account.chain) {
        setLoading(true);
        await registerSchema(
          SCHEMA_REGISTRY_CONTRACT_ADDRESSES[
            account.chain.id as keyof typeof SCHEMA_REGISTRY_CONTRACT_ADDRESSES
          ],
          stringifyFields(values.fields),
          "0x0000000000000000000000000000000000000000",
          true,
        );
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const startFieldsIndex = mandatoryFields.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full flex gap-4 px-4 py-2 bg-secondary rounded-md">
        <span className="text-sm">
          By default, the fields{" "}
          {mandatoryFields
            .map((field) => (
              <strong key={field.fieldName}>{field.fieldName}</strong>
            ))
            .reduce((prev, curr) => (
              <>
                {prev}, {curr}
              </>
            ))}{" "}
          will be added to the schema, so you don&apos;t need to add them again.
        </span>
      </div>
      <Form {...form}>
        <form className="space-y-6 flex flex-col max-h-[528px] overflow-y-auto p-1">
          {form.formState.errors.fields && (
            <FormMessage>
              {
                // @ts-ignore
                form.formState.errors.fields.map(
                  (error, i) =>
                    error && (
                      <span key={i} className="text-red-500 text-sm">
                        {error.fieldName?.message}
                      </span>
                    ),
                )
              }
            </FormMessage>
          )}

          {fields
            .filter((_, i) => i >= startFieldsIndex)
            .map((field, j) => (
              <div
                className="flex w-full gap-4 justify-between items-end"
                key={field.id}
              >
                <Controller
                  control={form.control}
                  name={`fields.${startFieldsIndex + j}.fieldName` as const}
                  render={({ field }) => (
                    <FormItem className="w-2/5">
                      <FormLabel>Field</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Field name"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            const value = e.target.value;
                            const isValid = /^[a-zA-Z]+$/.test(value);
                            if (e.target.value && !isValid) {
                              form.setError(
                                `fields.${startFieldsIndex + j}.fieldName`,
                                {
                                  type: "manual",
                                  message:
                                    "The field names must not contain any special characters, numbers or spaces (and must not be empty).",
                                },
                              );
                            } else {
                              form.clearErrors(
                                `fields.${startFieldsIndex + j}.fieldName`,
                              );
                            }
                            field.onBlur();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Controller
                  control={form.control}
                  name={`fields.${startFieldsIndex + j}.fieldType` as const}
                  render={({ field }) => (
                    <FormItem className="w-2/5">
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(FieldType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  onClick={() => remove(startFieldsIndex + j)}
                  variant="destructive"
                  className="w-9 p-0"
                  type="button"
                >
                  <CircleX className="w-full" />
                </Button>
              </div>
            ))}

          <div className="flex flex-col gap-4 m-auto fixed bottom-0 left-0 right-0 bg-white p-4 w-full sm:max-w-md">
            <Button
              type="button"
              className="w-full"
              onClick={() =>
                append({ fieldName: "", fieldType: FieldType.String })
              }
            >
              Add Field
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="green"
                  className="text-2xl px-8 py-6 rounded-lg w-full transition-opacity duration-200 ease-in-out"
                  onClick={(e) => {
                    // @ts-ignore
                    if (form.formState.errors.fields?.some((error) => error)) {
                      e.preventDefault();
                    }
                    const emptyFieldIndex = form
                      .getValues()
                      .fields.findIndex((field) => !field.fieldName);
                    if (emptyFieldIndex !== -1) {
                      form.setError(`fields.${emptyFieldIndex}.fieldName`, {
                        type: "manual",
                        message: "Field name cannot be empty.",
                      });
                      e.preventDefault();
                    }
                  }}
                >
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm gap-6">
                <DialogHeader>
                  <DialogTitle className="text-center text-2xl font-extrabold">
                    Confirm Schema Registration
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-center">
                  Are you sure you want to create this schema?
                </DialogDescription>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    variant="green"
                    className="w-full"
                    type="button"
                    disabled={loading}
                    onClick={form.handleSubmit(handleRegisterSchema)}
                  >
                    {loading && <Loader2 className="animate-spin w-4" />}
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </Form>
    </div>
  );
};
