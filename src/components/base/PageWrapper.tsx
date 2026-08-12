import { type ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background-50 font-sans">
      {children}
    </div>
  );
}