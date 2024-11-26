"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { schemasFromWallets } from "@/lib/eas";
import { useAccount, useWriteContract } from "wagmi";
import { useEffect, useState } from "react";
import { FieldType, Schema, SchemaField } from "@/lib/eas/types";
import { multisigSigners } from "@/lib/constants";
import { shorten } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InputCollectorList } from "@/components/ui/collectors/InputCollectorList";
import {
  NO_EXPIRATION,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { EASAbi } from "@/lib/abi/EAS";
import { EAS_CONTRACT_ADDRESSES } from "@/lib/eas/constants";
import { LinkTextWithIcon } from "@/components/ui/linkTextWithIcon";

const formSchema = z.object({
  fields: z.array(
    z.object({
      name: z.string(),
      type: z.nativeEnum({
        String: FieldType.String,
        Address: FieldType.Address,
        Number: FieldType.Number,
        Boolean: FieldType.Boolean,
      }),
      value: z.string(),
    }),
  ),
});

export default function NewBadgePage() {
  const account = useAccount();
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<Schema | undefined>(
    undefined,
  );
  const [schemaFields, setSchemaFields] = useState<SchemaField[] | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [collectors, setCollectors] = useState<string[]>([]);
  const { data: hash, error, writeContract } = useWriteContract();

  useEffect(() => {
    const fetchSchemas = async () => {
      const schemas = await schemasFromWallets(
        multisigSigners,
        account.chain?.id,
      );
      if (!schemas) return;
      setSchemas(schemas);
      setSelectedSchema(schemas[0]);
      setSchemaFields(
        schemas[0].schema.split(", ").map((field) => {
          const [type, ...nameParts] = field.split(" ") as [
            FieldType,
            ...string[],
          ];
          const name = nameParts.join(" ");
          return { name, type };
        }),
      );
    };
    fetchSchemas();
  }, [account.chain?.id]);

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fields: [],
    },
  });

  useEffect(() => {
    if (schemaFields) {
      form.reset({
        fields: schemaFields.map((field) => ({
          name: field.name,
          type: field.type,
          value: "",
        })),
      });
    }
  }, [schemaFields, form]);

  const { fields } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const attestToAddresses = async (
    easAddress: `0x${string}`,
    schemaUID: `0x${string}`,
    recipientAddresses: `0x${string}`[],
    encodedData: `0x${string}`,
    isRevocable: boolean,
    refUID?: `0x${string}`,
  ) => {
    const request = {
      schema: schemaUID as `0x${string}`,
      data: recipientAddresses.map((recipientAddress) => ({
        recipient: recipientAddress,
        expirationTime: NO_EXPIRATION,
        revocable: isRevocable,
        refUID:
          refUID ||
          ("0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`),
        data: encodedData,
        value: BigInt(0),
      })),
    };

    writeContract({
      address: easAddress,
      abi: EASAbi,
      functionName: "multiAttest",
      args: [[request]],
    });
  };

  const handleCreateBadge = (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    if (account.chain) {
      const schemaEncoder = new SchemaEncoder(selectedSchema?.schema as string);
      const encodedData = schemaEncoder.encodeData(data.fields);
      attestToAddresses(
        EAS_CONTRACT_ADDRESSES[
          account.chain.id as keyof typeof EAS_CONTRACT_ADDRESSES
        ],
        selectedSchema?.id as `0x${string}`,
        collectors as `0x${string}`[],
        encodedData as `0x${string}`,
        true,
      );
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    form.handleSubmit(handleCreateBadge)();
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col justify-between items-center min-h-screen w-full sm:max-w-md bg-background rounded-lg sm:shadow-lg p-6"
      >
        <div className="flex flex-col gap-6 w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center w-full"
          >
            <Link href={`/user`} className="rounded-full">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="font-black text-2xl">New Badge ✨</h1>
          </motion.div>

          <span className="w-full">
            Create and issue a new badge to one or more users.
          </span>

          <div className="flex flex-col gap-2">
            <div className="flex w-full justify-between">
              <span className="text-sm">Select a Schema</span>
              {selectedSchema?.id && (
                <LinkTextWithIcon
                  href={`https://base.easscan.org/schema/view/${selectedSchema.id}`}
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
                  <SelectItem
                    key={schema.id}
                    value={schema.id}
                    className="font-mono"
                  >
                    {shorten(schema.id)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Form {...form}>
            <form className="space-y-6">
              <div className="p-4 rounded-md bg-secondary">
                {form.formState.errors.fields && (
                  <FormMessage>
                    {form.formState.errors.fields.message}
                  </FormMessage>
                )}

                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  defaultValue="form-fields"
                >
                  <AccordionItem value="form-fields" className="border-none">
                    <AccordionTrigger className="p-0">
                      Please fill the badge info
                    </AccordionTrigger>
                    <AccordionContent className="p-1 pt-4 space-y-6">
                      {fields.map((field, index) => (
                        <div
                          className="flex w-full gap-4 justify-between items-end"
                          key={field.id}
                        >
                          <Controller
                            control={form.control}
                            name={`fields.${index}.value` as const}
                            render={({ field: subField }) => (
                              <FormItem className="w-full">
                                <FormLabel>{field.name}</FormLabel>
                                <FormControl>
                                  {field.name.toLowerCase() === "image" ? (
                                    <Input
                                      id="picture"
                                      type="file"
                                      className="h-auto"
                                      {...subField}
                                    />
                                  ) : (
                                    <Input
                                      placeholder={field.type}
                                      {...subField}
                                    />
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="p-4 rounded-md bg-secondary">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="collectors" className="border-none">
                    <AccordionTrigger className="p-0">
                      Please add the collectors addresses
                    </AccordionTrigger>
                    <AccordionContent className="pb-1 pt-4 px-1">
                      <InputCollectorList
                        collectors={collectors}
                        setCollectors={setCollectors}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="green"
                    className="text-2xl px-8 py-6 rounded-lg w-full transition-opacity duration-200 ease-in-out"
                  >
                    Issue
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm gap-6">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-extrabold">
                      Confirm New Badge Issuance
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription className="text-center">
                    Are you sure you want to issue this badge?
                  </DialogDescription>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                      >
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
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}
