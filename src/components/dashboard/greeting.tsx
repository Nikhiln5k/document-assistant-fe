"use client"; // Reads the visitor's local time

import { useClientValue } from "@/lib/use-client-value";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Greeting({ name }: { name: string }) {
  const greeting = useClientValue(getGreeting, "Welcome");

  return (
    <h2 className="text-heading text-foreground">
      {greeting}, {name} 👋
    </h2>
  );
}
