import { TrendingUp, Receipt, Building2, DollarSign } from "lucide-react";
import CartaoEstatistica from "@/components/CartaoEstatistica";
import { useInquilinos, usePlanos } from "@/api/recursos";
import { formatarMoeda } from "@/lib/formatos";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const CORES = ["hsl(217, 91%, 60%)", "hsl(263, 70%, 58%)", "hsl(142, 71%, 45%)"];

export default function Faturamento() {
  const { data: inquilinos = [] } = useInquilinos();
  const { data: planos = [] } = usePlanos();

  const dadosFaturamento = inquilinos.map((i) => {
    const plano = planos.find((p) => p.id === i.planoId);
    return { ...i, nomePlano: plano?.nome ?? i.planoId, precoPlano: plano?.preco ?? 0 };
  });

  const dadosAtivos = dadosFaturamento.filter((d) => d.status === "ativo");
  const mrrTotal = dadosAtivos.reduce((acc, d) => acc + d.precoPlano, 0);
  const receitaMediaPorInquilino = dadosAtivos.length ? Math.round(mrrTotal / dadosAtivos.length) : 0;

  const receitaPorPlano = planos.map((plano) => {
    const receita = dadosAtivos
      .filter((d) => d.planoId === plano.id)
      .reduce((acc, d) => acc + d.precoPlano, 0);
    return { name: plano.nome, value: receita };
  }).filter((d) => d.value > 0);

  const inquilinosPorPlano = planos.map((plano) => {
    const qtd = dadosAtivos.filter((d) => d.planoId === plano.id).length;
    return { name: plano.nome, value: qtd };
  }).filter((d) => d.value > 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Faturamento</h1>
        <p className="text-sm text-muted-foreground mt-1">Receita e métricas financeiras</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CartaoEstatistica titulo="MRR Total" valor={formatarMoeda(mrrTotal)} icone={TrendingUp} gradiente />
        <CartaoEstatistica titulo="ARR Projetado" valor={formatarMoeda(mrrTotal * 12)} icone={Receipt} />
        <CartaoEstatistica titulo="Tenants Ativos" valor={dadosAtivos.length} icone={Building2} />
        <CartaoEstatistica titulo="Receita Média/Tenant" valor={formatarMoeda(receitaMediaPorInquilino)} icone={DollarSign} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Receita por Plano</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={receitaPorPlano}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {receitaPorPlano.map((_, indice) => (
                    <Cell key={`celula-${indice}`} fill={CORES[indice % CORES.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(222, 47%, 9%)", border: "1px solid hsl(222, 20%, 18%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }}
                  formatter={(valor: number) => [`R$ ${valor.toLocaleString("pt-BR")}`, "Receita"]}
                />
                <Legend wrapperStyle={{ color: "hsl(215, 20%, 55%)", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Tenants por Plano</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inquilinosPorPlano}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                  labelLine={false}
                >
                  {inquilinosPorPlano.map((_, indice) => (
                    <Cell key={`celula-${indice}`} fill={CORES[indice % CORES.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(222, 47%, 9%)", border: "1px solid hsl(222, 20%, 18%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }}
                />
                <Legend wrapperStyle={{ color: "hsl(215, 20%, 55%)", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Detalhamento Mensal por Tenant</h2>
        <div className="space-y-3">
          {dadosAtivos.map((d) => (
            <div key={d.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{d.nome}</p>
                <p className="text-xs text-muted-foreground">{d.nomePlano}</p>
              </div>
              <p className="text-sm font-bold gradient-text">{formatarMoeda(d.precoPlano)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
