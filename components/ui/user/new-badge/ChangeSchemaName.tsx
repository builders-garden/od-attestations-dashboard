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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { easAttest } from "@/lib/eas/calls";
import {
  EAS_CONTRACT_ADDRESSES,
  EAS_NAME_SCHEMA_UID,
} from "@/lib/eas/constants";
import {
  SchemaEncoder,
  SchemaItem,
} from "@ethereum-attestation-service/eas-sdk";
import { SafeDashboardDialog } from "../../SafeDashboardDialog";
import { toast } from "sonner";
import { useSendSafeTransaction } from "@/components/hooks/useSendSafeTransaction";
import { Loader2 } from "lucide-react";

export const ChangeSchemaName: React.FC<{
  schemaId: string | undefined;
  chainId: number | undefined;
}> = ({ schemaId, chainId }) => {
  const [schemaName, setSchemaName] = useState("");
  const { sendSafeTransaction } = useSendSafeTransaction();
  const [openChangeNameDialog, setOpenChangeNameDialog] = useState(false);
  const [openSafeDialog, setOpenSafeDialog] = useState(false);
  const [safeTxHash, setSafeTxHash] = useState<`0x${string}`>();

  const dataToEncode: SchemaItem[] = [
    {
      name: "schemaId",
      type: "bytes32",
      value: schemaId as string,
    },
    {
      name: "name",
      type: "string",
      value: schemaName,
    },
  ];

  const [txLoading, setTxLoading] = useState(false);

  const handleChangeName = async () => {
    try {
      if (schemaName && chainId) {
        const schemaEncoder = new SchemaEncoder("bytes32 schemaId,string name");
        const encodedData = schemaEncoder.encodeData(dataToEncode);
        setTxLoading(true);
        const txHash = await sendSafeTransaction(
          easAttest(
            EAS_CONTRACT_ADDRESSES[
              chainId as keyof typeof EAS_CONTRACT_ADDRESSES
            ],
            EAS_NAME_SCHEMA_UID,
            undefined,
            encodedData as `0x${string}`,
            true,
          ),
        );
        setTxLoading(false);
        setOpenChangeNameDialog(false);
        if (txHash) {
          setSafeTxHash(txHash);
          setOpenSafeDialog(true);
        }
      }
    } catch (err) {
      setTxLoading(false);
      setOpenChangeNameDialog(false);
      console.error(err);
      toast.error("An error occurred while changing the schema name.");
    }
  };

  return (
    <>
      <Dialog
        open={openChangeNameDialog}
        onOpenChange={(open) => {
          setSchemaName("");
          setOpenChangeNameDialog(open);
        }}
      >
        <DialogTrigger asChild>
          <Button className="w-1/2 transition-opacity duration-200 ease-in-out">
            Change Name
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm gap-6">
          <DialogHeader>
            <DialogTitle>Change Schema Name</DialogTitle>
          </DialogHeader>
          <DialogDescription className="flex flex-col gap-2">
            <span>Choose a new name for your schema.</span>
            <Input
              placeholder="My Beatiful Schema"
              className="focus-visible:ring-primary w-full"
              value={schemaName}
              onChange={(e) => setSchemaName(e.target.value)}
            />
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
              onClick={handleChangeName}
              disabled={!schemaName || txLoading}
            >
              {txLoading && <Loader2 className="w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SafeDashboardDialog
        hash={safeTxHash}
        open={openSafeDialog}
        onOpenChange={setOpenSafeDialog}
      />
    </>
  );
};
