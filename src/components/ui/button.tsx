import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: ComponentProps<"button">) {
  return <button className={cn("rounded-md px-4 py-2", className)} {...props} />;
}
