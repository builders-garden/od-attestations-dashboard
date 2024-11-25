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
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { FieldType, Schema, SchemaField } from "@/lib/eas/types";
import { multisigSigners } from "@/lib/constants";
import { shorten } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray, set } from "react-hook-form";
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
      fieldValue: z.string(),
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
  }, []);

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
          fieldName: field.name,
          fieldType: field.type,
          fieldValue: "",
        })),
      });
    }
  }, [schemaFields, form]);

  const { fields } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const handleCreateBadge = (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    console.log(data);
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
            <span className="text-sm">Select a Schema</span>
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
              {form.formState.errors.fields && (
                <FormMessage>
                  {form.formState.errors.fields.message}
                </FormMessage>
              )}

              {fields.map((field, index) => (
                <div
                  className="flex w-full gap-4 justify-between items-end"
                  key={field.id}
                >
                  <Controller
                    control={form.control}
                    name={`fields.${index}.fieldValue` as const}
                    render={({ field: subField }) => (
                      <FormItem className="w-full">
                        <FormLabel>{field.fieldName}</FormLabel>
                        <FormControl>
                          <Input placeholder={field.fieldType} {...subField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

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
