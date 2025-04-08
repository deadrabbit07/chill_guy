import { cn } from "@/lib/utils";

export default function AppContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="mx-auto h-dvh w-full max-w-md bg-background">
      <div className={cn("relative h-full", className)}>{children}</div>
    </div>
  );
}
