import { motion } from "framer-motion";

interface CollectorRowProps {
  collector: string;
  index: number;
}

export default function CollectorRow({ collector, index }: CollectorRowProps) {
  return (
    <motion.div
      className="flex flex-row justify-between items-center w-full p-2 gap-2 bg-secondary rounded-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <div className="flex justify-start items-center gap-2">
        <div className="p-4 bg-primary-light rounded-lg" />
        <label className="font-medium">{collector}</label>
      </div>
      <div className="flex justify-center items-center font-medium px-2.5 bg-primary rounded-lg text-white">
        12
      </div>
    </motion.div>
  );
}
