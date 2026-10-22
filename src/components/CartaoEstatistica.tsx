import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface CartaoEstatisticaProps {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  icone: LucideIcon;
  tendencia?: { valor: string; positivo: boolean };
  gradiente?: boolean;
}

export default function CartaoEstatistica({ titulo, valor, subtitulo, icone: Icone, tendencia, gradiente }: CartaoEstatisticaProps) {
  return (
    <div className={`rounded-xl p-5 border ${gradiente ? "gradient-primary border-transparent" : "glass-card"}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium ${gradiente ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {titulo}
          </p>
          <p className={`text-2xl font-bold mt-1 ${gradiente ? "text-primary-foreground" : "text-foreground"}`}>
            {valor}
          </p>
          {subtitulo && (
            <p className={`text-xs mt-1 ${gradiente ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
              {subtitulo}
            </p>
          )}
          {tendencia && (
            <p className={`text-xs mt-1 font-medium ${tendencia.positivo ? "text-success" : "text-destructive"}`}>
              {tendencia.positivo ? "↑" : "↓"} {tendencia.valor}
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${gradiente ? "bg-primary-foreground/10" : "bg-muted"}`}>
          <Icone className={`w-4 h-4 ${gradiente ? "text-primary-foreground" : "text-muted-foreground"}`} />
        </div>
      </div>
    </div>
  );
}
