"use client";

import { Button } from "@/components/ui/button";
import CollectorRow from "@/components/ui/collectors/CollectorRow";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LinkTextWithIcon } from "@/components/ui/linkTextWithIcon";
import { userBadges } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

export default function BadgeReissuePage({
  params,
}: {
  params: Promise<{ index: string }>;
}) {
  const { index } = use(params);

  const badge = userBadges[parseInt(index) - 1];

  const [input, setInput] = useState("");

  const [collectors, setCollectors] = useState<string[]>([]);

  const handleRemove = (collector: string) => {
    setCollectors((prev) => prev.filter((c) => c !== collector));
  };

  const handleAdd = (collector: string) => {
    setCollectors((prev) =>
      prev.includes(collector) ? prev : [...prev, collector],
    );
    setInput("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col justify-between items-center min-h-screen w-full sm:max-w-md bg-background rounded-lg sm:shadow-lg p-6"
      >
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center w-full"
          >
            <Link href={`/user/badge/${index}`} className="rounded-full">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="font-black text-2xl">Reissue 📤</h1>
          </motion.div>

          <span className="w-full">
            Insert one or more users to reissue the selected badge to them.
          </span>

          <div className="grid grid-cols-1 justify-start items-center gap-3 w-full">
            <div className="flex w-full justify-between">
              <span className="font-bold">New {badge.title} collectors</span>
              <LinkTextWithIcon>Easscan</LinkTextWithIcon>
            </div>
            <div
              className={cn(
                "flex w-full gap-0 justify-between",
                input.length > 0 && "gap-4",
              )}
            >
              <Input
                placeholder="ENS or Address..."
                className="w-full"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button
                onClick={() => handleAdd(input)}
                className={cn(
                  "w-fit transition-all duration-200 ease-in-out",
                  input.length > 0 && "w-fit px-4",
                  input.length === 0 && "w-0 p-0",
                )}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-col gap-3 w-full max-h-[50rem] overflow-y-auto">
              {collectors.map((collector, index) => (
                <CollectorRow
                  key={index}
                  collector={collector}
                  removable
                  handleRemove={handleRemove}
                />
              ))}
            </div>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className={cn(
                "text-2xl px-8 py-6 rounded-lg w-full transition-opacity duration-200 ease-in-out",
                collectors.length > 0 && "opacity-1",
                collectors.length === 0 && "opacity-0",
              )}
              variant="green"
            >
              Reissue
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm gap-6">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-extrabold">
                Confirm Reissuance
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-center">
              Are you sure you want to reissue this badge to the users you
              selected?
            </DialogDescription>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" variant="green" className="w-full">
                Reissue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
