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
import { collectors, userBadges } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

export default function BadgeRevokePage({
  params,
}: {
  params: Promise<{ index: string }>;
}) {
  const { index } = use(params);

  const badge = userBadges[parseInt(index) - 1];

  const [selectedCollectors, setSelectedCollectors] = useState<string[]>([]);

  const handleSelect = (collector: string) => {
    setSelectedCollectors((prev) =>
      prev.includes(collector)
        ? prev.filter((c) => c !== collector)
        : [...prev, collector],
    );
  };

  const [input, setInput] = useState("");

  const atLeastOneSelected = selectedCollectors.length > 0;

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
            <h1 className="font-black text-2xl">Revoke 🚫</h1>
          </motion.div>

          <span className="w-full">
            Select one or more users to revoke the selected badge from them.
          </span>

          <div className="grid grid-cols-1 justify-start items-center gap-3 w-full">
            <div className="flex w-full justify-between">
              <span className="font-bold">{badge.title} collectors</span>
              <LinkTextWithIcon>Easscan</LinkTextWithIcon>
            </div>
            <div
              className={cn(
                "flex w-full gap-0 justify-between",
                atLeastOneSelected && "gap-4",
              )}
            >
              <Input
                placeholder="Search..."
                className="focus-visible:ring-primary w-full"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button
                onClick={() => setSelectedCollectors([])}
                className={cn(
                  "w-fit transition-all duration-200 ease-in-out",
                  atLeastOneSelected && "w-fit px-4",
                  !atLeastOneSelected && "w-0 p-0",
                )}
              >
                Reset Selection
              </Button>
            </div>
            <div className="flex flex-col gap-3 w-full max-h-[50rem] overflow-y-auto">
              {collectors
                .filter((collector) => collector.includes(input))
                .map((collector, index) => (
                  <CollectorRow
                    key={index}
                    collector={collector}
                    selectable
                    selected={selectedCollectors.includes(collector)}
                    onClick={() => handleSelect(collector)}
                  />
                ))}
            </div>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className={cn(
                "text-2xl px-8 py-6 rounded-lg w-full transition-opacity duration-200 ease-in-out",
                atLeastOneSelected && "opacity-1",
                !atLeastOneSelected && "opacity-0",
              )}
            >
              Revoke
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm gap-6">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-extrabold">
                Confirm Revocation
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-center">
              Are you sure you want to permanently revoke this badge from the
              selected users? This action cannot be undone.
            </DialogDescription>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" variant="destructive" className="w-full">
                Revoke
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
