import { useState } from "react";
import { Search } from "lucide-react";
import { useAuditoria } from "@/api/recursos";
import EstadoTabela from "@/components/EstadoTabela";
import { formatarDataHora } from "@/lib/formatos";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const rotulosAcao: Record<string, { rotulo: string; cor: string }> = {
  "usuario.suspenso": { rotulo: "Suspensão", cor: "bg-destructive/10 text-destructive border-destructive/20" },
  "inquilino.suspenso": { rotulo: "Suspensão", cor: "bg-destructive/10 text-destructive border-destructive/20" },
  "usuario.criado": { rotulo: "Criação", cor: "bg-success/10 text-success border-success/20" },
  "usuario.excluido": { rotulo: "Exclusão", cor: "bg-destructive/10 text-destructive border-destructive/20" },
  "permissao.alterada": { rotulo: "Permissão", cor: "bg-warning/10 text-warning border-warning/20" },
  "usuario.senha_resetada": { rotulo: "Reset Senha", cor: "bg-primary/10 text-primary border-primary/20" },
  "usuario.senha_redefinida": { rotulo: "Reset Senha", cor: "bg-primary/10 text-primary border-primary/20" },
  "equipe.senha_redefinida": { rotulo: "Reset Senha", cor: "bg-primary/10 text-primary border-primary/20" },
  "usuario.reativado": { rotulo: "Reativação", cor: "bg-success/10 text-success border-success/20" },
  "inquilino.reativado": { rotulo: "Reativação", cor: "bg-success/10 text-success border-success/20" },
  "equipe.criado": { rotulo: "Criação", cor: "bg-success/10 text-success border-success/20" },
  "equipe.suspenso": { rotulo: "Suspensão", cor: "bg-destructive/10 text-destructive border-destructive/20" },
  "equipe.reativado": { rotulo: "Reativação", cor: "bg-success/10 text-success border-success/20" },
  "despesa.criada": { rotulo: "Gasto", cor: "bg-warning/10 text-warning border-warning/20" },
  "despesa.cancelado": { rotulo: "Gasto", cor: "bg-muted text-muted-foreground border-border" },
  "despesa.reativado": { rotulo: "Gasto", cor: "bg-warning/10 text-warning border-warning/20" },
  "plano.atualizado": { rotulo: "Upgrade", cor: "bg-success/10 text-success border-success/20" },
  "inquilino.criado": { rotulo: "Criação", cor: "bg-success/10 text-success border-success/20" },
};

export default function LogAuditoria() {
  const [busca, setBusca] = useState("");
  const { data: registrosAuditoria = [], isLoading, error } = useAuditoria();

  const filtrados = registrosAuditoria.filter(
    (r) =>
      r.acao.toLowerCase().includes(busca.toLowerCase()) ||
      r.ator.toLowerCase().includes(busca.toLowerCase()) ||
      r.alvo.toLowerCase().includes(busca.toLowerCase()) ||
      r.detalhes.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Log de Auditoria</h1>
        <p className="text-sm text-muted-foreground mt-1">Rastreie todas as ações críticas do sistema</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por ação, ator, alvo ou detalhes..."
          className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground text-xs">Data/Hora</TableHead>
              <TableHead className="text-muted-foreground text-xs">Tipo</TableHead>
              <TableHead className="text-muted-foreground text-xs">Ação</TableHead>
              <TableHead className="text-muted-foreground text-xs">Ator</TableHead>
              <TableHead className="text-muted-foreground text-xs">Alvo</TableHead>
              <TableHead className="text-muted-foreground text-xs">Tenant</TableHead>
              <TableHead className="text-muted-foreground text-xs">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <EstadoTabela colunas={7} carregando={isLoading} erro={error} vazio={filtrados.length === 0} />
            {filtrados.map((registro) => {
              const metaAcao = rotulosAcao[registro.acao] || { rotulo: registro.acao, cor: "bg-muted text-muted-foreground border-border" };
              return (
                <TableRow key={registro.id} className="border-border/30 hover:bg-muted/30">
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatarDataHora(registro.dataHora)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${metaAcao.cor}`}>
                      {metaAcao.rotulo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-primary">{registro.acao}</TableCell>
                  <TableCell className="text-xs text-foreground">{registro.ator}</TableCell>
                  <TableCell className="text-xs text-foreground">{registro.alvo}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{registro.nomeInquilino}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[250px] truncate">{registro.detalhes}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
