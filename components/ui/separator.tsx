import { motion } from "framer-motion";

const Separator = () => {
  return (
    <motion.div
      className="max-w-72 w-full h-1 my-5 border-b border-primary-light"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
};

export { Separator };
