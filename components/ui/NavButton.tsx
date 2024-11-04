import { motion } from "framer-motion";

interface NavButtonProps {
  path: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const NavButton = ({ icon, label, isActive, onClick }: NavButtonProps) => {
  return (
    <button
      className={`relative flex flex-col items-center justify-center h-16 w-full transition-all duration-300 ${
        isActive ? "text-black" : "text-[#f3d38d]"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="mt-1 text-xs font-medium">{label}</span>
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#481204]"
          layoutId="activeTab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </button>
  );
};
