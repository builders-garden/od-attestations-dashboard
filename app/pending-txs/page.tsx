"use client";

import {
  useSafe,
  SafeMultisigTransaction,
  SendTransactionVariables,
  useConfirmTransaction,
  ConfirmTransactionVariables,
} from "@safe-global/safe-react-hooks";

// data is an array of pendingTransactions
// each pendingTransaction is like this
// {
//   "safe": "0x883ac919B42b9065C1Bc1Ea7560ba2924655762E",
//   "to": "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
//   "value": "0",
//   "data": "0x60d7a2780000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000015737472696e672064696f2c20626f6f6c206361726f0000000000000000000000",
//   "operation": 0,
//   "gasToken": "0x0000000000000000000000000000000000000000",
//   "safeTxGas": 0,
//   "baseGas": 0,
//   "gasPrice": "0",
//   "refundReceiver": "0x0000000000000000000000000000000000000000",
//   "nonce": 0,
//   "executionDate": null,
//   "submissionDate": "2024-11-23T21:11:25.177807Z",
//   "modified": "2024-11-23T21:18:39.441556Z",
//   "blockNumber": null,
//   "transactionHash": null,
//   "safeTxHash": "0xb5a92ad609917e361ccfb47d05123513b53218710be09912d03763336cbd6a22",
//   "proposer": "0xb5C99bf3F9B8EDf2A532614049e9EE4302670a4a",
//   "proposedByDelegate": null,
//   "executor": null,
//   "isExecuted": false,
//   "isSuccessful": null,
//   "ethGasPrice": null,
//   "maxFeePerGas": null,
//   "maxPriorityFeePerGas": null,
//   "gasUsed": null,
//   "fee": null,
//   "origin": "{\"url\": \"https://apps-portal.safe.global/wallet-connect\", \"name\": \"OD Passport App\"}",
//   "dataDecoded": {
//       "method": "register",
//       "parameters": [
//           {
//               "name": "schema",
//               "type": "string",
//               "value": "string dio, bool caro"
//           },
//           {
//               "name": "resolver",
//               "type": "address",
//               "value": "0x0000000000000000000000000000000000000000"
//           },
//           {
//               "name": "revocable",
//               "type": "bool",
//               "value": "True"
//           }
//       ]
//   },
//   "confirmationsRequired": 2,
//   "confirmations": [
//       {
//           "owner": "0xb5C99bf3F9B8EDf2A532614049e9EE4302670a4a",
//           "submissionDate": "2024-11-23T21:18:39.441556Z",
//           "transactionHash": null,
//           "signature": "0xc0ba43a57bfba308753c441a4c7943e92a4a7b6eb21ab3e48dc4790ea1f9d4575b88850bbe69f286fe67390c1e2cf6c4de471156f2298c6077d0adc102c6608a1c",
//           "signatureType": "EOA"
//       }
//   ],
//   "trusted": true,
//   "signatures": null
// }

export default function PendingTxs() {
  const { getPendingTransactions } = useSafe();

  const { data: pendingTxs } = getPendingTransactions();

  const { confirmTransaction, data: confirmData } = useConfirmTransaction();

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-background sm:p-6">
      <div className="flex flex-col justify-start items-center min-h-screen w-full sm:max-w-md bg-background rounded-lg sm:shadow-lg p-6 gap-3">
        {pendingTxs &&
          pendingTxs.map((tx: SafeMultisigTransaction, index: number) => (
            <div key={index}>
              <button
                onClick={() =>
                  confirmTransaction({ safeTxHash: tx.safeTxHash })
                }
              >
                Confirm
              </button>
              {confirmData && JSON.stringify(confirmData)}
            </div>
          ))}
      </div>
    </div>
  );
}
