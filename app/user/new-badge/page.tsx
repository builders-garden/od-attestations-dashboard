"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { schemasFromWallets } from "@/lib/eas";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { FieldType, Schema, SchemaField } from "@/lib/eas/types";
import { multisigSigners } from "@/lib/constants";
import { NewBadgeForm } from "@/components/ui/user/new-badge/NewBadgeForm";
import { SchemaSelector } from "@/components/ui/user/new-badge/SchemaSelector";

export default function NewBadgePage() {
  const account = useAccount();
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<Schema | undefined>(
    undefined,
  );
  const [schemaFields, setSchemaFields] = useState<SchemaField[] | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchSchemas = async () => {
      const schemas = await schemasFromWallets(
        multisigSigners,
        account.chain?.id,
      );
      if (!schemas) return;
      setSchemas(schemas);
      setSelectedSchema(schemas[0]);
      setSchemaFields(
        schemas[0].schema.split(", ").map((field) => {
          const [type, ...nameParts] = field.split(" ") as [
            FieldType,
            ...string[],
          ];
          const name = nameParts.join(" ");
          return { name, type };
        }),
      );
    };
    fetchSchemas();
  }, [account.chain?.id]);

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
            <h1 className="font-black text-2xl">New Badge ✨</h1>
          </motion.div>

          <span className="w-full">
            Create and issue a new badge to one or more users.
          </span>

          <SchemaSelector
            schemas={schemas}
            selectedSchema={selectedSchema}
            setSelectedSchema={setSelectedSchema}
            setSchemaFields={setSchemaFields}
          />

          <NewBadgeForm
            account={account}
            selectedSchema={selectedSchema}
            schemaFields={schemaFields}
          />
        </div>
      </motion.div>
    </div>
  );
}
