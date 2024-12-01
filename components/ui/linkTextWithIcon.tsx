import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

const LinkTextWithIcon: React.FC<{
  children: React.ReactNode;
  href: string;
}> = ({ children, href }) => {
  return (
    <div className="flex items-center gap-1">
      <Link
        href={href}
        className="text-primary-light leading-none hover:underline"
        target="_blank"
      >
        {children}
      </Link>
      <SquareArrowOutUpRight size={16} className="text-primary-light" />
    </div>
  );
};

export { LinkTextWithIcon };
