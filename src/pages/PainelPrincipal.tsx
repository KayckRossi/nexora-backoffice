import { Building2, Users, AlertTriangle, TrendingUp } from "lucide-react";
import CartaoEstatistica from "@/components/CartaoEstatistica";
import BadgeStatus from "@/components/BadgeStatus";
import { useAuditoria, useInquilinos, usePlanos, useUsuarios } from "@/api/recursos";
import EstadoTabela from "@/components/EstadoTabela";
import { formatarData, formatarMoeda } from "@/lib/formatos";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PainelPrincipal() {
  const { data: inquilinos = [], isLoading: carregandoInquilinos, error: erroInquilinos } = useInquilinos();
  const { data: usuarios = [] } = useUsuarios();
  const { data: planos = [] } = usePlanos();
  const { data: registrosAuditoria = [], isLoading: carregandoAuditoria, error: erroAuditoria } = useAuditoria();

  const inquilinosAtivos = inquilinos.filter((i) => i.status === "ativo").length;
  const totalUsuarios = usuarios.length;
  const usuariosAtivos = usuarios.filter((u) => u.status === "ativo").length;
  const inquilinosSuspensos = inquilinos.filter((i) => i.status === "suspenso").length;
  const mrr = inquilinos
    .filter((i) => i.status === "ativo")
    .reduce((acc, i) => acc + (planos.find((p) => p.id === i.planoId)?.preco ?? 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral do NexoHub</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CartaoEstatistica titulo="Tenants Ativos" valor={inquilinosAtivos} icone={Building2} gradiente />
        <CartaoEstatistica titulo="Usuários Totais" valor={totalUsuarios} subtitulo={`${usuariosAtivos} ativos`} icone={Users} />
        <CartaoEstatistica titulo="MRR" valor={formatarMoeda(mrr)} icone={TrendingUp} />
        <CartaoEstatistica titulo="Alertas" valor={inquilinosSuspensos} subtitulo="tenants suspensos" icone={AlertTriangle} />
      </div>

      <div className="glass-card rounded-xl p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Atividade Recente</h2>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground text-xs">Ação</TableHead>
              <TableHead className="text-muted-foreground text-xs">Ator</TableHead>
              <TableHead className="text-muted-foreground text-xs">Alvo</TableHead>
              <TableHead className="text-muted-foreground text-xs">Tenant</TableHead>
              <TableHead className="text-muted-foreground text-xs">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <EstadoTabela colunas={5} carregando={carregandoAuditoria} erro={erroAuditoria} vazio={registrosAuditoria.length === 0} />
            {registrosAuditoria.slice(0, 5).map((registro) => (
              <TableRow key={registro.id} className="border-border/30 hover:bg-muted/30">
                <TableCell className="text-xs font-mono text-primary">{registro.acao}</TableCell>
                <TableCell className="text-xs text-foreground">{registro.ator}</TableCell>
                <TableCell className="text-xs text-foreground">{registro.alvo}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{registro.nomeInquilino}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatarData(registro.dataHora)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Tenants</h2>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground text-xs">Nome</TableHead>
              <TableHead className="text-muted-foreground text-xs">Plano</TableHead>
              <TableHead className="text-muted-foreground text-xs">Usuários</TableHead>
              <TableHead className="text-muted-foreground text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <EstadoTabela colunas={4} carregando={carregandoInquilinos} erro={erroInquilinos} vazio={inquilinos.length === 0} />
            {inquilinos.map((i) => (
              <TableRow key={i.id} className="border-border/30 hover:bg-muted/30">
                <TableCell className="text-sm font-medium text-foreground">{i.nome}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{planos.find((p) => p.id === i.planoId)?.nome ?? i.planoId}</TableCell>
                <TableCell className="text-xs text-foreground">
                  {i.qtdUsuarios}/{i.maxUsuarios}
                </TableCell>
                <TableCell><BadgeStatus status={i.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
