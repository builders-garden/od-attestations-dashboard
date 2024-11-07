import BadgeClass from "@/lib/classes/BadgeClass";
import { Calendar, CircleX, Hash, IdCard, Send, Tag } from "lucide-react";
import { Button } from "../button";
import { useRouter } from "next/navigation";
import { Separator } from "../separator";

interface BadgeInfoProps {
  badge: BadgeClass;
}

export default function BadgeInfo({ badge }: BadgeInfoProps) {
  const Router = useRouter();
  return (
    <>
      <h1 className="text-2xl font-black text-black">{badge.title}</h1>

      <div className="flex gap-3 items-center justify-center">
        <div className="flex justify-start items-center gap-2 px-2 h-7 bg-primary rounded-md">
          <IdCard className="text-white" size={24} />
          <label className="text-white font-medium">12345678</label>
        </div>
        <div className="flex justify-start items-center gap-1 px-2 h-7 bg-primary rounded-md">
          <Hash className="text-white" size={20} />
          <label className="text-white font-medium">2/13</label>
        </div>
      </div>

      <div className="flex gap-3 items-center justify-center">
        <div className="flex justify-start items-center gap-1 px-2 h-7 rounded-md">
          <Tag className="text-primary" size={20} />
          <label className="text-primary font-bold">ACTIVITY</label>
        </div>
        <div className="flex justify-start items-center gap-1 px-2 h-7 rounded-md">
          <Calendar className="text-primary" size={20} />
          <label className="text-primary font-bold">04 OCT 2024</label>
        </div>
      </div>

      <Button
        className="flex justify-start items-center gap-2 px-2 h-fit p-0 rounded-md hover:bg-none"
        variant="ghost"
        onClick={() => Router.push(`/user/badge/${badge.index}/collectors`)}
      >
        <div className="flex justify-center items-center rounded-full bg-pink-400 w-4 h-4 p-2.5 text-xs">
          S
        </div>
        <div className="flex justify-center items-center rounded-full bg-yellow-400 w-4 h-4 p-2.5 text-xs -ml-4">
          V
        </div>
        <div className="flex justify-center items-center rounded-full bg-slate-200 w-4 h-4 p-2.5 text-xs -ml-4">
          H
        </div>
        <label className="text-black font-medium cursor-pointer">
          and 10 more...
        </label>
      </Button>

      <div className="flex flex-col gap-0 w-full items-center">
        <Separator />
        <div className="flex gap-4">
          <Button className="h-fit py-1 px-2" variant="destructive">
            <CircleX size={16} />
            Revoke
          </Button>
          <Button
            className="h-fit py-1 px-2 bg-green-500 hover:bg-green-400"
            variant="default"
          >
            <Send size={16} />
            Reissue
          </Button>
        </div>
        <Separator />
      </div>

      <p className="text-sm font-medium text-center text-muted-foreground mt-2">
        {badge.description}
      </p>
    </>
  );
}
