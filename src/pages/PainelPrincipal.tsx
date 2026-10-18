import { Building2, Users, Activity, Receipt, AlertTriangle, TrendingUp } from "lucide-react";
import CartaoEstatistica from "@/components/CartaoEstatistica";
import BadgeStatus from "@/components/BadgeStatus";
import { inquilinos, usuarios, registrosAuditoria } from "@/data/dadosMock";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PainelPrincipal() {
  const inquilinosAtivos = inquilinos.filter((i) => i.status === "ativo").length;
  const totalUsuarios = usuarios.length;
  const usuariosAtivos = usuarios.filter((u) => u.status === "ativo").length;
  const inquilinosSuspensos = inquilinos.filter((i) => i.status === "suspenso").length;
  const mrr = inquilinos
    .filter((i) => i.status === "ativo")
    .reduce((acc, i) => {
      const precos: Record<string, number> = { starter: 99, professional: 299, enterprise: 799 };
      return acc + (precos[i.planoId] || 0);
    }, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral do NexoHub</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CartaoEstatistica titulo="Tenants Ativos" valor={inquilinosAtivos} icone={Building2} gradiente tendencia={{ valor: "+2 este mês", positivo: true }} />
        <CartaoEstatistica titulo="Usuários Totais" valor={totalUsuarios} subtitulo={`${usuariosAtivos} ativos`} icone={Users} tendencia={{ valor: "+12%", positivo: true }} />
        <CartaoEstatistica titulo="MRR" valor={`R$ ${mrr.toLocaleString("pt-BR")}`} icone={TrendingUp} tendencia={{ valor: "+8.5%", positivo: true }} />
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
            {registrosAuditoria.slice(0, 5).map((registro) => (
              <TableRow key={registro.id} className="border-border/30 hover:bg-muted/30">
                <TableCell className="text-xs font-mono text-primary">{registro.acao}</TableCell>
                <TableCell className="text-xs text-foreground">{registro.ator}</TableCell>
                <TableCell className="text-xs text-foreground">{registro.alvo}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{registro.nomeInquilino}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(registro.dataHora).toLocaleDateString("pt-BR")}
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
            {inquilinos.map((i) => (
              <TableRow key={i.id} className="border-border/30 hover:bg-muted/30">
                <TableCell className="text-sm font-medium text-foreground">{i.nome}</TableCell>
                <TableCell className="text-xs text-muted-foreground capitalize">{i.planoId}</TableCell>
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
