"use client";

import { useAccount } from "wagmi";
import {
  useApiKit,
  useProtocolKitOwner,
} from "@/components/providers/SafeProvider";
import { Button } from "@/components/ui/button";
import { encodeFunctionData, erc20Abi } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function SafePage() {
  const { address } = useAccount();
  const protocolKit = useProtocolKitOwner();
  const apiKit = useApiKit();

  const handleClick = async () => {
    console.log(protocolKit, apiKit);
    if (!protocolKit || !apiKit) return;
    const tx = await protocolKit?.createTransaction({
      transactions: [
        {
          to: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
          value: "0",
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: "transfer",
            args: [address as `0x${string}`, BigInt(1 * 10 ** 6)],
          }),
        },
      ],
    });
    const safeTxHash = await protocolKit?.getTransactionHash(tx!);
    const signature = await protocolKit?.signHash(safeTxHash!);

    // Propose transaction to the service
    await apiKit.proposeTransaction({
      safeAddress: "0x883ac919B42b9065C1Bc1Ea7560ba2924655762E",
      safeTransactionData: tx!.data,
      safeTxHash: safeTxHash!,
      senderAddress: address as `0x${string}`,
      senderSignature: signature!.data,
    });
    console.log(tx);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        {address ? <>Connected Wallet: {address}</> : <ConnectButton />}
      </div>
      {address && <Button onClick={handleClick}>Simple Button</Button>}
    </div>
  );
}
