import { ReactNode } from "react";
import BarraLateral from "./BarraLateral";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutAppProps {
  children: ReactNode;
  aoSair?: () => void;
}

export default function LayoutApp({ children, aoSair }: LayoutAppProps) {
  const eMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <BarraLateral aoSair={aoSair} />
      <main
        className={`transition-all duration-200 ${
          eMobile ? "p-4 pt-16" : "ml-[72px] p-8"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
