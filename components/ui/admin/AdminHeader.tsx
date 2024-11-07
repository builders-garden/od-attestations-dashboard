import { motion } from "framer-motion";

export default function AdminHeader() {
  return (
    <>
      {/* Admin Header with label and profile pic */}
      <motion.div
        className="flex flex-row justify-between items-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl font-black text-start text-black">
            Admin Panel
          </h1>
          <div className="text-sm text-start text-black">
            Create, Revoke and Reissue Badges
          </div>
        </div>
        <img
          alt="Profile Picture"
          src="./propic_placeholder.png"
          className="h-14 w-14"
        />
      </motion.div>
      {/* Separator */}
      <motion.div
        className="max-w-72 w-full h-1 my-5 border-b border-primary-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
    </>
  );
}
