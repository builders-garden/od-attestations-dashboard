"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useAccount } from "wagmi";
import { getAttestationsFromWallet, schemasFromWallet } from "@/lib/eas";
import * as React from "react";
import { useWriteContract } from "wagmi";
import {
  EAS_CONTRACT_ADDRESSES,
  SCHEMA_REGISTRY_CONTRACT_ADDRESSES,
} from "@/lib/eas/constants";
import { SchemaRegistryAbi } from "@/lib/abi/SchemaRegistry";
import {
  EAS,
  NO_EXPIRATION,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { EASAbi } from "@/lib/abi/EAS";

export default function AdminHome() {
  const account = useAccount();
  const [loading, setLoading] = useState(false);
  const { data: hash, error, writeContract } = useWriteContract();
  const [deployedSchemasAddress, setDeployedSchemasAddress] =
    useState<`0x${string}`>("0x000");
  const [registerSchemaAddress, setRegisterSchemaAddress] =
    useState<`0x${string}`>("0x000");
  const [attestationAddress, setAttestationAddress] =
    useState<`0x${string}`>("0x000");

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
    recipientAddress: `0x${string}`,
    encodedData: `0x${string}`,
    isRevocable: boolean,
  ) => {
    console.log("easAddress", easAddress);
    console.log("schemaUID", schemaUID);
    console.log("recipientAddress", recipientAddress);
    console.log("encodedData", encodedData);
    console.log("isRevocable", isRevocable);

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
              "0x0000000000000000000000000000000000000000000000000000000000000000",
            data: encodedData,
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
      <div className="flex flex-col justify-start items-center min-h-screen w-full sm:max-w-md bg-background rounded-lg sm:shadow-lg p-6 gap-3">
        <h1 className="text-md font-bold">{account.address}</h1>
        <p className="text-sm text-gray-500">{account.chain?.id}</p>
        {/* Check schemas deployed by an address */}
        <div className="flex gap-2 py-2">
          <input
            type="text"
            placeholder="address"
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
              const schemas = await schemasFromWallet(
                deployedSchemasAddress,
                account.chain?.id,
              );
              console.log(schemas?.data.schemata);
            }}
          >
            Check registered Schemas
          </button>
        </div>

        {/* Register schema */}
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
          Register schema
        </button>

        {/* Attest to address */}
        <div className="flex gap-2 py-2">
          <input
            type="text"
            placeholder="address"
            className="border-2 border-black"
            value={registerSchemaAddress}
            onChange={(e) =>
              setRegisterSchemaAddress(e.target.value as `0x${string}`)
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
                  registerSchemaAddress,
                  encodedData as `0x${string}`,
                  true,
                );
              }
              setLoading(false);
            }}
          >
            Attest to address
          </button>
        </div>

        {/* Check Attested Schemas for address */}
        <div className="flex gap-2 py-2">
          <input
            type="text"
            placeholder="address"
            className="border-2 border-black"
            value={attestationAddress}
            onChange={(e) =>
              setAttestationAddress(e.target.value as `0x${string}`)
            }
          />
          <button
            disabled={loading}
            className="flex justify-center items-center bg-gray-200 py-1 px-5 rounded-lg"
            onClick={async () => {
              const attestations = await getAttestationsFromWallet(
                attestationAddress,
                account.chain?.id,
              );
              console.log(attestations?.data.attestations);
            }}
          >
            Check Attested Schemas for address
          </button>
        </div>

        {/* Transaction Hash */}
        {hash && (
          <div className="pt-10 text-center">
            Transaction Hash: <br />
            {hash}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex pt-10 text-center text-red-600 break-words text-wrap w-full">
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
}
