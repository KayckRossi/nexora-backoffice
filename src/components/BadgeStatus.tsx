import { Badge } from "@/components/ui/badge";

interface BadgeStatusProps {
  status: "ativo" | "suspenso";
}

export default function BadgeStatus({ status }: BadgeStatusProps) {
  return (
    <Badge
      variant={status === "ativo" ? "default" : "destructive"}
      className={
        status === "ativo"
          ? "bg-success/10 text-success border-success/20 hover:bg-success/20"
          : "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20"
      }
    >
      {status === "ativo" ? "Ativo" : "Suspenso"}
    </Badge>
  );
}
