import { motion } from "framer-motion";

export const Clouds = () => {
  return (
    <>
      {/* Bottom right cloud */}
      <motion.img
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
        className="z-10 absolute -bottom-10 -right-24"
        src="/assets/cloud_1.png"
        layoutId="cloud1"
      />
      {/* Top right cloud */}
      <motion.img
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0 }}
        style={{ scale: 1.1 }}
        className="z-10 absolute top-0 left-28"
        src="/assets/cloud_2.png"
        layoutId="cloud1"
      />
      {/* Top left cloud */}
      <motion.img
        initial={{ opacity: 0, x: -225 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{ scale: 1.1 }}
        className="z-10 absolute top-40 right-56"
        src="/assets/cloud_3.png"
        layoutId="cloud1"
      />
      {/* Bottom left cloud */}
      <motion.img
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{ scale: 1.1 }}
        className="z-10 absolute bottom-52 left-7"
        src="/assets/cloud_4.png"
        layoutId="cloud1"
      />
    </>
  );
};
