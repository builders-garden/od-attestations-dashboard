"use client";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RegisterSchemaForm } from "@/components/ui/user/new-schema/RegisterSchemaForm";
import { Wrapper } from "@/components/ui/wrapper";

export default function NewSchemaPage() {
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
          <h1 className="font-black text-2xl">New Schema ✨</h1>
        </motion.div>

        <span className="w-full">
          Create a new schema adding the fields and their types.
        </span>

        <RegisterSchemaForm />
      </div>
    </Wrapper>
  );
}
