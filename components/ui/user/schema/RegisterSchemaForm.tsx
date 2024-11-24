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
import { Switch } from "@/components/ui/switch";
import { FieldType } from "@/lib/eas/types";

const formSchema = z.object({
  fields: z.array(
    z.object({
      fieldName: z.string(),
      fieldType: z.nativeEnum({
        String: FieldType.String,
        Address: FieldType.Address,
        Number: FieldType.Number,
        Boolean: FieldType.Boolean,
      }),
    }),
  ),
});

export const RegisterSchemaForm: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fields: [
        {
          fieldName: "OD Member Name",
          fieldType: FieldType.String,
        },
        {
          fieldName: "OD Member Address",
          fieldType: FieldType.Address,
        },
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
  const [isRevocable, setIsRevocable] = useState(true);

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
          isRevocable,
        );
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    form.handleSubmit(handleRegisterSchema)();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full flex justify-between">
        <span className="font-bold">Revocable Attestations</span>
        <Switch checked={isRevocable} onCheckedChange={setIsRevocable} />
      </div>
      <Form {...form}>
        <form className="space-y-6">
          {form.formState.errors.fields && (
            <FormMessage>{form.formState.errors.fields.message}</FormMessage>
          )}

          {fields.map((field, index) => (
            <div
              className="flex w-full gap-4 justify-between items-end"
              key={field.id}
            >
              <Controller
                control={form.control}
                name={`fields.${index}.fieldName` as const}
                render={({ field }) => (
                  <FormItem className="w-2/5">
                    <FormLabel>Field</FormLabel>
                    <FormControl>
                      <Input placeholder="Field name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                control={form.control}
                name={`fields.${index}.fieldType` as const}
                render={({ field }) => (
                  <FormItem className="w-2/5">
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(FieldType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() +
                                type.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CircleX
                className="bg-destructive p-1 w-9 h-9 rounded-md text-white transition-all duration-200 ease-in-out cursor-pointer"
                onClick={() => remove(index)}
              />
            </div>
          ))}

          <div className="flex flex-col gap-4 pt-2">
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
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading && <Loader2 className="animate-spin" />}
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
