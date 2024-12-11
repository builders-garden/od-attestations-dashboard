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
import { Config, UseAccountReturnType } from "wagmi";
import { easMultiAttest } from "@/lib/eas/calls";
import { EAS_CONTRACT_ADDRESSES } from "@/lib/eas/constants";
import { getIpfsImageUrl, uploadImageToIpfs } from "@/lib/ipfs";
import { Checkbox } from "@/components/ui/checkbox";
import { SafeDashboardDialog } from "@/components/ui/SafeDashboardDialog";
import { toast } from "sonner";
import { useSendSafeTransaction } from "@/components/hooks/useSendSafeTransaction";

const formSchema = z.object({
  fields: z.array(
    z.object({
      name: z.string(),
      type: z.nativeEnum({
        String: FieldType.String,
        Number: FieldType.Number,
        Boolean: FieldType.Boolean,
      }),
      value: z.union([z.string(), z.number(), z.boolean()]),
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
  const [imageLoading, setImageLoading] = useState(false);
  const [collectors, setCollectors] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | undefined>(
    undefined,
  );
  const [openTxDialog, setOpenTxDialog] = useState(false);
  const [openSafeDialog, setOpenSafeDialog] = useState(false);
  const [safeTxHash, setSafeTxHash] = useState<`0x${string}`>();
  const { sendSafeTransaction } = useSendSafeTransaction();

  const ODPASSPORT_BOOLEAN_FIELD = "ODPassport";

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
          value: field.name === ODPASSPORT_BOOLEAN_FIELD ? true : "",
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
    const url = getIpfsImageUrl(ipfsHash);
    setUploadedImageUrl(url);
    setImageLoading(false);
    return ipfsHash;
  };

  const [txLoading, setTxLoading] = useState(false);

  const handleCreateBadge = async (data: z.infer<typeof formSchema>) => {
    try {
      if (account.chain) {
        const schemaEncoder = new SchemaEncoder(
          selectedSchema?.schema as string,
        );
        const encodedData = schemaEncoder.encodeData(data.fields);
        setTxLoading(true);
        const txHash = await sendSafeTransaction(
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
        setTxLoading(false);
        setOpenTxDialog(false);
        if (txHash) {
          setSafeTxHash(txHash);
          setOpenSafeDialog(true);
        }
      }
    } catch (err) {
      console.error(err);
      setTxLoading(false);
      setOpenTxDialog(false);
      toast.error("Failed to issue badge, please try again.");
    }
  };

  const handleSubmit = () => {
    form.handleSubmit(handleCreateBadge)();
  };

  const currentFields = form.getValues("fields");
  const requiredFields = ["BadgeTitle", "BadgeDescription", "BadgeImageCID"];
  const missingFields = requiredFields.filter(
    (field) => currentFields.find((f) => f.name === field)?.value === "",
  );
  const disableIssueButton =
    missingFields.length > 0 || collectors.length === 0;

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="p-4 rounded-md border-[1px]">
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
                {fields.map(
                  (field, index) =>
                    field.name !== ODPASSPORT_BOOLEAN_FIELD && (
                      <div
                        className="flex w-full gap-4 justify-between items-end"
                        key={field.id}
                      >
                        <Controller
                          control={form.control}
                          name={`fields.${index}.value` as const}
                          render={({ field: subField }) => (
                            <FormItem className="w-full flex flex-col">
                              <FormLabel>{field.name}</FormLabel>
                              <FormControl>
                                {field.name === "BadgeImageCID" ? (
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
                                      <Input
                                        type="hidden"
                                        {...subField}
                                        value={String(subField.value)}
                                      />
                                      <Button
                                        variant="outline"
                                        type="button"
                                        className="w-1/4"
                                        onClick={async () => {
                                          const hash =
                                            await handleUploadImage();
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
                                          <Loader2 className="animate-spin w-4" />
                                        )}
                                        Upload
                                      </Button>
                                      {imageFile && (
                                        <Button
                                          variant="destructive"
                                          type="button"
                                          className="w-9"
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
                                ) : field.type === FieldType.Boolean ? (
                                  <Checkbox
                                    {...subField}
                                    value={subField.value as string}
                                    checked={subField.value as boolean}
                                    onCheckedChange={(e) => {
                                      subField.onChange({
                                        target: { value: e.valueOf() },
                                      });
                                    }}
                                  />
                                ) : (
                                  <Input
                                    placeholder={field.type}
                                    {...subField}
                                    type={
                                      field.type === FieldType.Number
                                        ? "number"
                                        : "text"
                                    }
                                    value={
                                      field.type === FieldType.Number
                                        ? Number(subField.value)
                                        : String(subField.value)
                                    }
                                    onChange={(e) =>
                                      subField.onChange({
                                        target: {
                                          value:
                                            field.type === FieldType.Number
                                              ? Number(e.target.value)
                                              : String(e.target.value),
                                        },
                                      })
                                    }
                                  />
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ),
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="p-4 rounded-md border-[1px] !mb-[80px]">
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

        <div className="flex flex-col gap-4 m-auto fixed bottom-0 left-0 right-0 bg-white p-4 w-full sm:max-w-md shadow-top-2xl shadow-zinc-500 rounded-2xl">
          <Dialog open={openTxDialog} onOpenChange={setOpenTxDialog}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="success"
                className="text-2xl px-8 py-6 w-full transition-opacity duration-200 ease-in-out"
                disabled={disableIssueButton}
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
                  variant="success"
                  className="w-full"
                  type="button"
                  onClick={handleSubmit}
                  disabled={txLoading}
                >
                  {txLoading && <Loader2 className="w-4 animate-spin" />}
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <SafeDashboardDialog
            hash={safeTxHash}
            open={openSafeDialog}
            onOpenChange={setOpenSafeDialog}
          />
        </div>
      </form>
    </Form>
  );
};
