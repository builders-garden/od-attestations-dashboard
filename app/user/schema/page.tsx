"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowLeft, CircleX } from "lucide-react";
import Link from "next/link";

enum FieldType {
  String = "String",
  Address = "Address",
  Number = "Number",
  Boolean = "Boolean",
}

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

export default function BadgeRevokePage() {
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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

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
            <h1 className="font-black text-2xl">Create Schema ✨</h1>
          </motion.div>

          <span className="w-full">
            Create a new schema adding the fields and their value types.
          </span>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      type="submit"
                      variant="green"
                      className="text-2xl px-8 py-6 rounded-lg w-full transition-opacity duration-200 ease-in-out"
                    >
                      Create
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm gap-6">
                    <DialogHeader>
                      <DialogTitle className="text-center text-2xl font-extrabold">
                        Confirm Schema creation
                      </DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-center">
                      Are you sure you want to create this schema?
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
                      <Button type="button" variant="green" className="w-full">
                        Create
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}
