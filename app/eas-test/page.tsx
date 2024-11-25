"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useAccount } from "wagmi";
import { getAllAttestationsFromIssuers, schemasFromWallets } from "@/lib/eas";
import * as React from "react";
import { useWriteContract } from "wagmi";
import {
  EAS_CONTRACT_ADDRESSES,
  SCHEMA_REGISTRY_CONTRACT_ADDRESSES,
} from "@/lib/eas/constants";
import { SchemaRegistryAbi } from "@/lib/abi/SchemaRegistry";
import {
  NO_EXPIRATION,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { EASAbi } from "@/lib/abi/EAS";

function Separator() {
  return <div className="border-b border-gray-300 w-full my-3" />;
}

export default function AdminHome() {
  const account = useAccount();
  const [loading, setLoading] = useState(false);
  const { data: hash, error, writeContract } = useWriteContract();
  const [deployedSchemasAddress, setDeployedSchemasAddress] = useState<
    `0x${string}` | ""
  >("");
  const [attestAddress, setAttestAddress] = useState<`0x${string}` | "">("");
  const [checkAttestationsRecipient, setCheckAttestationsRecipient] = useState<
    `0x${string}` | ""
  >("");
  const [checkAttestationsIssuer, setCheckAttestationsIssuer] = useState<
    `0x${string}` | ""
  >("");
  const [revokeAttestationUID, setRevokeAttestationUID] = useState<
    `0x${string}` | ""
  >("");
  const [revokeAttestationsSchemaUID, setRevokeAttestationsSchemaUID] =
    useState<`0x${string}` | "">("");

  const registerSchema = async (
    schemaAddress: `0x${string}`,
    schema: string,
    resolverAddress: `0x${string}`,
    isRevocable: boolean,
  ) => {
    writeContract({
      address: schemaAddress,
      abi: SchemaRegistryAbi,
      functionName: "register",
      args: [schema, resolverAddress, isRevocable],
    });
  };

  const attestToAddress = async (
    easAddress: `0x${string}`,
    schemaUID: `0x${string}`,
    recipientAddress: `0x${string}` | "",
    encodedData: `0x${string}`,
    isRevocable: boolean,
    refUID?: `0x${string}`,
  ) => {
    console.log("easAddress", easAddress);
    console.log("schemaUID", schemaUID);
    console.log("recipientAddress", recipientAddress);
    console.log("expirationTime", NO_EXPIRATION);
    console.log("isRevocable", isRevocable);
    console.log(
      "refUID",
      refUID ||
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    );
    console.log("encodedData", encodedData);

    if (!recipientAddress) {
      console.error("Recipient address is required.");
      return;
    }

    writeContract({
      address: easAddress,
      abi: EASAbi,
      functionName: "attest",
      args: [
        {
          schema: schemaUID,
          data: {
            recipient: recipientAddress,
            expirationTime: NO_EXPIRATION,
            revocable: isRevocable,
            refUID:
              refUID ||
              "0x0000000000000000000000000000000000000000000000000000000000000000",
            data: encodedData,
            value: BigInt(0),
          },
        },
      ],
    });
  };

  const revokeFromAddress = async (
    easAddress: `0x${string}`,
    schemaUID: `0x${string}` | "",
    attestationUID: `0x${string}` | "",
  ) => {
    if (!attestationUID || !schemaUID) {
      console.error("Attestation UID is required.");
      return;
    }

    writeContract({
      address: easAddress,
      abi: EASAbi,
      functionName: "revoke",
      args: [
        {
          schema: schemaUID,
          data: {
            uid: attestationUID,
            value: BigInt(0),
          },
        },
      ],
    });
  };

  if (!account.address) {
    return (
      <div className="flex justify-center items-center min-h-screen h-full w-full bg-background">
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-background sm:p-6">
      <div className="flex flex-col justify-start items-center min-h-screen w-full sm:max-w-2xl bg-background rounded-lg sm:shadow-lg p-6 gap-1">
        <h1 className="text-md font-bold">{account.address}</h1>
        <p className="text-sm text-gray-500">{account.chain?.id}</p>

        <Separator />

        {/* Check schemas deployed by an address */}
        <div className="flex flex-col justify-center items-center gap-2 py-2">
          <div>Check schemas deployed by an address</div>
          <div className="flex justify-center items-center gap-2">
            <input
              type="text"
              placeholder="Address"
              className="border-2 border-black"
              value={deployedSchemasAddress}
              onChange={(e) =>
                setDeployedSchemasAddress(e.target.value as `0x${string}`)
              }
            />
            <button
              disabled={loading}
              className="flex justify-center items-center bg-gray-200 py-1 px-5 rounded-lg"
              onClick={async () => {
                const schemas = await schemasFromWallets(
                  [deployedSchemasAddress],
                  account.chain?.id,
                );
                console.log(schemas);
              }}
            >
              Check
            </button>
          </div>
        </div>

        <Separator />

        {/* Register schema */}
        <div className="flex flex-col justify-center items-center gap-2 py-2">
          <div>
            Register a schema with <b>hardcoded</b> values
          </div>
          <button
            disabled={loading}
            className="flex justify-center items-center bg-gray-200 py-1 px-5 rounded-lg"
            onClick={async () => {
              setLoading(true);
              // Creates a transaction to register a schema.
              if (account.chain) {
                registerSchema(
                  SCHEMA_REGISTRY_CONTRACT_ADDRESSES[
                    account.chain
                      .id as keyof typeof SCHEMA_REGISTRY_CONTRACT_ADDRESSES
                  ],
                  "string dio, bool caro",
                  "0x0000000000000000000000000000000000000000",
                  true,
                );
              }
              setLoading(false);
            }}
          >
            Register
          </button>
        </div>

        <Separator />

        {/* Attest to address */}
        <div className="flex flex-col justify-center items-center gap-2 py-2">
          <div>
            Attest to an address with <b>hardcoded</b> values
          </div>
          <div className="flex gap-2 py-2">
            <input
              type="text"
              placeholder="Address"
              className="border-2 border-black"
              value={attestAddress}
              onChange={(e) =>
                setAttestAddress(e.target.value as `0x${string}`)
              }
            />
            <button
              disabled={loading}
              className="flex justify-center items-center bg-gray-200 py-1 px-5 rounded-lg"
              onClick={async () => {
                setLoading(true);
                // Creates a transaction to attest to an address.
                if (account.chain) {
                  const schemaEncoder = new SchemaEncoder(
                    "string pippo, bool fortissimo",
                  );
                  const encodedData = schemaEncoder.encodeData([
                    { name: "pippo", value: "Un Sacco", type: "string" },
                    { name: "fortissimo", value: true, type: "bool" },
                  ]);

                  attestToAddress(
                    EAS_CONTRACT_ADDRESSES[
                      account.chain.id as keyof typeof EAS_CONTRACT_ADDRESSES
                    ],
                    "0x295dfcc122f135bc87b607026daa8834d0341381402717574a482b6895b07d3e",
                    attestAddress,
                    encodedData as `0x${string}`,
                    true,
                  );
                }
                setLoading(false);
              }}
            >
              Attest
            </button>
          </div>
        </div>

        <Separator />

        {/* Check Attested Schemas for address */}
        <div className="flex flex-col justify-center items-center gap-2 py-2">
          <div>
            Check issued attestations to an address from another address
          </div>
          <div className="flex gap-2 py-2">
            <input
              type="text"
              placeholder="Recipient Address"
              className="border-2 border-black"
              value={checkAttestationsRecipient}
              onChange={(e) =>
                setCheckAttestationsRecipient(e.target.value as `0x${string}`)
              }
            />
            <input
              type="text"
              placeholder="Issuer Address"
              className="border-2 border-black"
              value={checkAttestationsIssuer}
              onChange={(e) =>
                setCheckAttestationsIssuer(e.target.value as `0x${string}`)
              }
            />
            <button
              disabled={loading}
              className="flex justify-center items-center bg-gray-200 py-1 px-5 rounded-lg"
              onClick={async () => {
                const attestations = await getAllAttestationsFromIssuers(
                  checkAttestationsRecipient,
                  [checkAttestationsIssuer],
                  account.chain?.id,
                );
                console.log(attestations);
              }}
            >
              Check
            </button>
          </div>
        </div>

        <Separator />

        {/* Revoke attestation given its UID and schema UID */}
        <div className="flex flex-col justify-center items-center gap-2 py-2">
          <div>Revoke an attestation given its UID and the schema UID</div>
          <div className="flex gap-2 py-2">
            <input
              type="text"
              placeholder="Attestation UID"
              className="border-2 border-black"
              value={revokeAttestationUID}
              onChange={(e) =>
                setRevokeAttestationUID(e.target.value as `0x${string}`)
              }
            />
            <input
              type="text"
              placeholder="Schema UID"
              className="border-2 border-black"
              value={revokeAttestationsSchemaUID}
              onChange={(e) =>
                setRevokeAttestationsSchemaUID(e.target.value as `0x${string}`)
              }
            />
            <button
              disabled={loading}
              className="flex justify-center items-center bg-gray-200 py-1 px-5 rounded-lg"
              onClick={async () => {
                setLoading(true);
                // Revoke the attestation
                if (account.chain) {
                  revokeFromAddress(
                    EAS_CONTRACT_ADDRESSES[
                      account.chain.id as keyof typeof EAS_CONTRACT_ADDRESSES
                    ],
                    revokeAttestationsSchemaUID,
                    revokeAttestationUID,
                  );
                }
                setLoading(false);
              }}
            >
              Revoke
            </button>
          </div>
        </div>

        {/* Transaction Hash */}
        {hash && (
          <>
            <Separator />
            <div className="text-center">
              Transaction Hash: <br />
              {hash}
            </div>
          </>
        )}

        {/* Error */}
        {error && (
          <>
            <Separator />
            <div className="flex pt-10 text-center text-red-600 break-words text-wrap w-full">
              {error.message}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
