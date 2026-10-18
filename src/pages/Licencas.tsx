import { Users, Building2, AlertTriangle } from "lucide-react";
import CartaoEstatistica from "@/components/CartaoEstatistica";
import { inquilinos, planos } from "@/data/dadosMock";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BadgeStatus from "@/components/BadgeStatus";

export default function Licencas() {
  const dadosLicenca = inquilinos.map((i) => {
    const plano = planos.find((p) => p.id === i.planoId)!;
    return {
      ...i,
      nomePlano: plano.nome,
      precoPlano: plano.preco,
      percentualUso: Math.round((i.qtdUsuarios / i.maxUsuarios) * 100),
    };
  });

  const totalAssentos = dadosLicenca.reduce((acc, d) => acc + d.maxUsuarios, 0);
  const assentosUsados = dadosLicenca.reduce((acc, d) => acc + d.qtdUsuarios, 0);
  const altoUso = dadosLicenca.filter((d) => d.percentualUso >= 80).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Licenças</h1>
        <p className="text-sm text-muted-foreground mt-1">Controle de assentos e uso por tenant</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CartaoEstatistica titulo="Total de Assentos" valor={totalAssentos} icone={Users} gradiente />
        <CartaoEstatistica titulo="Assentos Utilizados" valor={assentosUsados} icone={Users} />
        <CartaoEstatistica titulo="Taxa de Ocupação" valor={`${Math.round((assentosUsados / totalAssentos) * 100)}%`} icone={Building2} />
        <CartaoEstatistica titulo="Alta Utilização (>80%)" valor={altoUso} icone={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {planos.map((plano) => {
          const inquilinosDoPlano = inquilinos.filter((i) => i.planoId === plano.id);
          const qtdAtivos = inquilinosDoPlano.filter((i) => i.status === "ativo").length;
          const totalAssentosPlano = inquilinosDoPlano.reduce((acc, i) => acc + i.maxUsuarios, 0);
          const assentosUsadosPlano = inquilinosDoPlano.reduce((acc, i) => acc + i.qtdUsuarios, 0);
          return (
            <div key={plano.id} className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">{plano.nome}</h3>
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                  até {plano.maxUsuarios} users
                </Badge>
              </div>
              <p className="text-3xl font-bold text-foreground">{qtdAtivos}</p>
              <p className="text-xs text-muted-foreground mt-1">tenants ativos</p>
              <div className="mt-3 flex items-center gap-2">
                <Progress value={totalAssentosPlano > 0 ? (assentosUsadosPlano / totalAssentosPlano) * 100 : 0} className="h-1.5 bg-muted [&>div]:gradient-primary" />
                <span className="text-xs text-muted-foreground">{assentosUsadosPlano}/{totalAssentosPlano}</span>
              </div>
              <div className="mt-3 space-y-1">
                {plano.funcionalidades.map((f) => (
                  <p key={f} className="text-[10px] text-muted-foreground">• {f}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <h2 className="text-sm font-semibold text-foreground">Uso de Assentos por Tenant</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground text-xs">Tenant</TableHead>
              <TableHead className="text-muted-foreground text-xs">Plano</TableHead>
              <TableHead className="text-muted-foreground text-xs">Assentos</TableHead>
              <TableHead className="text-muted-foreground text-xs">Uso</TableHead>
              <TableHead className="text-muted-foreground text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dadosLicenca.map((d) => (
              <TableRow key={d.id} className="border-border/30 hover:bg-muted/30">
                <TableCell className="text-sm font-medium text-foreground">{d.nome}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs border-border text-muted-foreground">{d.nomePlano}</Badge>
                </TableCell>
                <TableCell className="text-xs text-foreground">{d.qtdUsuarios}/{d.maxUsuarios}</TableCell>
                <TableCell className="w-[160px]">
                  <div className="flex items-center gap-2">
                    <Progress value={d.percentualUso} className="h-1.5 bg-muted [&>div]:gradient-primary" />
                    <span className={`text-xs w-8 ${d.percentualUso >= 80 ? "text-warning" : "text-muted-foreground"}`}>
                      {d.percentualUso}%
                    </span>
                  </div>
                </TableCell>
                <TableCell><BadgeStatus status={d.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
