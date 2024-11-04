"use client";
import { ADMIN_ADDRESSES } from "@/lib/constants";
import { User, Shield } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { NavButton } from "./NavButton";

const BottomNavigationBar = () => {
  const account = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (!account.address) return null;

  return (
    <motion.nav
      className="fixed z-40 bottom-0 left-0 right-0 bg-gradient-to-t from-[#fcf9e7] to-[#f5efd6] w-full min-w-screen border-t-2 border-[#c1a68d] shadow-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
    >
      <div className="flex justify-between items-center w-full max-w-md mx-auto px-4 py-2">
        <NavButton
          path="/user"
          icon={<User className="h-6 w-6" />}
          label="User"
          isActive={pathname === "/"}
          onClick={() => handleNavigation("/")}
        />
        {account.address && ADMIN_ADDRESSES.includes(account.address) && (
          <NavButton
            path="/admin"
            icon={<Shield className="h-6 w-6" />}
            label="Admin"
            isActive={pathname === "/admin"}
            onClick={() => handleNavigation("/admin")}
          />
        )}
      </div>
    </motion.nav>
  );
};

export default BottomNavigationBar;
