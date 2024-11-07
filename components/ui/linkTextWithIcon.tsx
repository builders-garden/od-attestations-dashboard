import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

const LinkTextWithIcon: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex items-center gap-1">
      <Link
        href={
          "https://easscan.org/offchain/attestation/view/0xb792c26858a5aaf25d48ef0773ecc15bb723ebf07b237448d337dba25bdcd5fb"
        }
        className="text-primary-light leading-none"
        target="_blank"
      >
        {children}
      </Link>
      <SquareArrowOutUpRight size={16} className="text-primary-light" />
    </div>
  );
};

export { LinkTextWithIcon };
