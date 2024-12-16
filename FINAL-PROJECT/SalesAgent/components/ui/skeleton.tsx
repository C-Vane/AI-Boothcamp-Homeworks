import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-500/30 backdrop-blur-lg",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
