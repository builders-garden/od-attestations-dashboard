"use client";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { schemasFromWallets } from "@/lib/eas";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { FieldType, Schema, SchemaField } from "@/lib/eas/types";
import { NewBadgeForm } from "@/components/ui/user/new-badge/NewBadgeForm";
import { SchemaSelector } from "@/components/ui/user/new-badge/SchemaSelector";
import { Wrapper } from "@/components/ui/wrapper";
import { useSafeContext } from "@/components/providers/SafeProvider";

export default function NewBadgePage() {
  const account = useAccount();
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<Schema | undefined>(
    undefined,
  );
  const [schemaFields, setSchemaFields] = useState<SchemaField[] | undefined>(
    undefined,
  );
  const { adminAddresses } = useSafeContext();

  useEffect(() => {
    const fetchSchemas = async () => {
      if (adminAddresses.length <= 0) return;
      const schemas = await schemasFromWallets(
        adminAddresses,
        account.chain?.id,
      );
      if (schemas.length === 0) return;
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
  }, [account.chain?.id, adminAddresses]);

  return (
    <Wrapper>
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
          account={account}
        />

        <NewBadgeForm
          account={account}
          selectedSchema={selectedSchema}
          schemaFields={schemaFields}
        />
      </div>
    </Wrapper>
  );
}
