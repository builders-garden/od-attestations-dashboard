"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RegisterSchemaForm } from "@/components/ui/user/schema/RegisterSchemaForm";

export default function BadgeRevokePage() {
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
            <h1 className="font-black text-2xl">Create Schema ✨</h1>
          </motion.div>

          <span className="w-full">
            Create a new schema adding the fields and their value types.
          </span>

          <RegisterSchemaForm />
        </div>
      </motion.div>
    </div>
  );
}
