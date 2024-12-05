// FILE: useRegisterSchema.ts
import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
import { useCallback } from "react";
import { encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import { useSafeContext } from "../providers/SafeProvider";

export interface SendSafeTransactionParams {
  abi: any;
  contractAddress: `0x${string}`;
  functionName: string;
  args: any[];
  value: string;
}

export const useSendSafeTransaction = () => {
  const { protocolKit, apiKit } = useSafeContext();
  const account = useAccount();

  const sendSafeTransaction = useCallback(
    async ({
      abi,
      contractAddress,
      functionName,
      args,
      value,
    }: SendSafeTransactionParams) => {
      try {
        if (
          !protocolKit ||
          !apiKit ||
          !process.env.NEXT_PUBLIC_SAFE_ADDRESS ||
          !account.address
        )
          return;

        // Encode the function data for the register function of the SchemaRegistry contract
        const data = encodeFunctionData({
          abi,
          functionName,
          args,
        });

        // Create the safe transaction
        const safeTransactionData: MetaTransactionData = {
          to: contractAddress,
          data,
          value,
        };
        const safeTransaction = await protocolKit.createTransaction({
          transactions: [safeTransactionData],
        });

        // Sign the transaction and propose
        const safeTxHash =
          await protocolKit.getTransactionHash(safeTransaction);
        const senderSignature = await protocolKit.signHash(safeTxHash);

        await apiKit.proposeTransaction({
          safeAddress: process.env.NEXT_PUBLIC_SAFE_ADDRESS,
          safeTransactionData: safeTransaction.data,
          safeTxHash,
          senderAddress: account.address,
          senderSignature: senderSignature.data,
        });

        return safeTxHash as `0x${string}`;
      } catch (e) {
        console.error("Error while sending Safe tx:", e);
      }
    },
    [protocolKit, apiKit, account],
  );

  return { sendSafeTransaction };
};
