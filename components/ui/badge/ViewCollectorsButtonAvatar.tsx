import { useEnsProfile } from "@/components/hooks/useEnsProfile";
import { cn } from "@/lib/utils";

export const ViewCollectorsButtonAvatar: React.FC<{
  bgColor: string;
  collector: string;
}> = ({ bgColor, collector }) => {
  const { ensProfile, loadingProfile } = useEnsProfile(
    collector as `0x${string}`,
  );

  if (loadingProfile) {
    return (
      <div
        className={
          "flex justify-center items-center rounded-full w-4 h-4 p-2.5 text-xs bg-skeleton animate-pulse"
        }
      />
    );
  }

  return ensProfile?.avatar ? (
    <img
      src={ensProfile.avatar}
      alt="avatar"
      className="w-5 h-5 rounded-full"
    />
  ) : (
    <div
      className={cn(
        "flex justify-center items-center rounded-full w-4 h-4 p-2.5 text-xs",
        bgColor,
      )}
    >
      {collector.slice(2, 3).toUpperCase()}
    </div>
  );
};
