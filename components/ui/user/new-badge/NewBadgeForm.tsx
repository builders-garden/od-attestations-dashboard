import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldType, Schema, SchemaField } from "@/lib/eas/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { InputCollectorList } from "@/components/ui/collectors/InputCollectorList";
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
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CircleX, Loader2 } from "lucide-react";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { Config, UseAccountReturnType, useWriteContract } from "wagmi";
import { easMultiAttest } from "@/lib/eas/calls";
import { EAS_CONTRACT_ADDRESSES } from "@/lib/eas/constants";
import { getImageFromIpfs, uploadImageToIpfs } from "@/lib/ipfs";

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

interface NewBadgeFormProps {
  account: UseAccountReturnType<Config>;
  selectedSchema: Schema | undefined;
  schemaFields: SchemaField[] | undefined;
}

export const NewBadgeForm: React.FC<NewBadgeFormProps> = ({
  account,
  selectedSchema,
  schemaFields,
}) => {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const { data: hash, error, writeContract } = useWriteContract();
  const [collectors, setCollectors] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | undefined>(
    undefined,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fields: [],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "fields",
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

  const imageError = "Failed to upload image to IPFS, please retry.";

  const setFormError = (message: string) => {
    form.setError("fields", {
      type: "manual",
      message,
    });
  };

  const handleUploadImage = async () => {
    setImageLoading(true);
    const ipfsHash = await uploadImageToIpfs(imageFile);
    if (!ipfsHash) {
      setFormError(imageError);
      setImageLoading(false);
      return;
    }
    const url = await getImageFromIpfs(ipfsHash);
    setUploadedImageUrl(url);
    setImageLoading(false);
    return ipfsHash;
  };

  const handleCreateBadge = (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    if (account.chain) {
      const schemaEncoder = new SchemaEncoder(selectedSchema?.schema as string);
      const encodedData = schemaEncoder.encodeData(data.fields);
      writeContract(
        easMultiAttest(
          EAS_CONTRACT_ADDRESSES[
            account.chain.id as keyof typeof EAS_CONTRACT_ADDRESSES
          ],
          selectedSchema?.id as `0x${string}`,
          collectors as `0x${string}`[],
          encodedData as `0x${string}`,
          true,
        ),
      );
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    form.handleSubmit(handleCreateBadge)();
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="p-4 rounded-md bg-secondary">
          {form.formState.errors.fields && (
            <FormMessage className="mb-3">
              Error: {form.formState.errors.fields.message}
            </FormMessage>
          )}

          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="form-fields"
          >
            <AccordionItem value="form-fields" className="border-none">
              <AccordionTrigger className="p-0 font-bold">
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
                            {field.name.toLowerCase().includes("image") ? (
                              <div className="flex flex-col gap-4">
                                <div className="flex w-full gap-4">
                                  <Input
                                    id="picture"
                                    type="file"
                                    className="h-auto hover:cursor-pointer"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        form.clearErrors("fields");
                                        setUploadedImageUrl(undefined);
                                        setImageFile(file);
                                      }
                                    }}
                                  />
                                  <Input type="hidden" {...subField} />
                                  <Button
                                    variant="outline"
                                    type="button"
                                    className="w-1/4"
                                    onClick={async () => {
                                      const hash = await handleUploadImage();
                                      if (hash) {
                                        subField.onChange({
                                          target: { value: hash },
                                        });
                                      } else {
                                        setFormError(imageError);
                                        subField.onChange({
                                          target: { value: "" },
                                        });
                                      }
                                    }}
                                    disabled={
                                      !imageFile ||
                                      !!uploadedImageUrl ||
                                      imageLoading
                                    }
                                  >
                                    {imageLoading && (
                                      <Loader2 className="animate-spin" />
                                    )}
                                    Upload
                                  </Button>
                                  {imageFile && (
                                    <Button
                                      variant="outline"
                                      type="button"
                                      className="w-auto"
                                      onClick={() => {
                                        form.clearErrors("fields");
                                        subField.onChange({
                                          target: { value: "" },
                                        });
                                        setImageFile(null);
                                        setUploadedImageUrl(undefined);
                                      }}
                                      disabled={imageLoading}
                                    >
                                      <CircleX />
                                    </Button>
                                  )}
                                </div>
                                {uploadedImageUrl && (
                                  <img
                                    src={uploadedImageUrl}
                                    alt="Uploaded image"
                                    className="mx-auto w-1/2"
                                  />
                                )}
                              </div>
                            ) : (
                              <Input placeholder={field.type} {...subField} />
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
              <AccordionTrigger className="p-0 font-bold">
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
      </form>
    </Form>
  );
};
