import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DialogProps } from "@radix-ui/react-dialog";
import { getEnvironmentChainId } from "@/lib/utils";
import { SAFE_TRANSACTION_LIST_URLS } from "@/lib/eas/constants";

interface SafeDashboardDialogProps extends DialogProps {
  hash?: `0x${string}`;
}

export const SafeDashboardDialog: React.FC<SafeDashboardDialogProps> = ({
  hash,
  ...props
}) => {
  const safeAddress = process.env.NEXT_PUBLIC_SAFE_ADDRESS;
  return (
    <Dialog {...props}>
      <DialogContent className="max-w-sm gap-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-extrabold">
            Confirm on Safe
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center">
          Go to safe dashboard to confirm the transaction.
          <br />
          <br />
          Notify the other multisig signers to confirm the transaction on the{" "}
          <Link
            href={`${SAFE_TRANSACTION_LIST_URLS[getEnvironmentChainId()]}:${safeAddress}&id=multisig_${safeAddress}_${hash}`}
            target="_blank"
            className="text-green-500 no-underline hover:underline"
          >
            Safe Dashboard
          </Link>
        </DialogDescription>
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
