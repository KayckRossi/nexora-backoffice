import { useState } from "react";
import { DollarSign, Server, Cloud, Code, Headphones, Plus, TrendingDown, MoreHorizontal, Ban, CheckCircle } from "lucide-react";
import CartaoEstatistica from "@/components/CartaoEstatistica";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAlterarStatus, useCriar, useDespesas, type NovaDespesa } from "@/api/recursos";
import EstadoTabela from "@/components/EstadoTabela";
import { formatarMoeda } from "@/lib/formatos";

const iconesCategorias: Record<string, React.ElementType> = {
  infraestrutura: Server,
  nuvem: Cloud,
  ferramentas: Code,
  suporte: Headphones,
  outros: DollarSign,
};

const rotulosCategorias: Record<string, string> = {
  infraestrutura: "Infraestrutura",
  nuvem: "Cloud / Hosting",
  ferramentas: "Ferramentas & SaaS",
  suporte: "Suporte & RH",
  outros: "Outros",
};

const coresCategorias: Record<string, string> = {
  infraestrutura: "bg-primary/10 text-primary border-primary/20",
  nuvem: "bg-secondary/10 text-secondary border-secondary/20",
  ferramentas: "bg-warning/10 text-warning border-warning/20",
  suporte: "bg-success/10 text-success border-success/20",
  outros: "bg-muted text-muted-foreground border-border",
};

// Categoria começa vazia e o custo é texto até o envio; o backend valida os dois (422)
type Formulario = Omit<NovaDespesa, "categoria" | "custoMensal"> & { categoria: NovaDespesa["categoria"] | ""; custoMensal: string };
const FORMULARIO_VAZIO: Formulario = { descricao: "", categoria: "", custoMensal: "", fornecedor: "", observacoes: "" };

export default function Despesas() {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [formulario, setFormulario] = useState<Formulario>(FORMULARIO_VAZIO);
  const { toast } = useToast();
  const { data: todas = [], isLoading, error } = useDespesas();
  const criar = useCriar("despesas");
  const alterarStatus = useAlterarStatus("despesas");

  const aoCriar = () =>
    criar.mutate({ ...formulario, custoMensal: Number(formulario.custoMensal.replace(",", ".")) } as NovaDespesa, {
      onSuccess: () => {
        setDialogAberto(false);
        setFormulario(FORMULARIO_VAZIO);
        toast({ title: "Gasto registrado", description: `${formulario.descricao} foi adicionado.` });
      },
    });

  // Os totais consideram só os gastos ativos; os cancelados continuam na tabela
  const despesas = todas.filter((d) => d.status === "ativo");
  const totalMensal = despesas.reduce((acc, d) => acc + d.custoMensal, 0);
  const totalAnual = totalMensal * 12;
  const categorias = [...new Set(despesas.map((d) => d.categoria))];
  const maiorCategoria = categorias
    .map((c) => ({ categoria: c, total: despesas.filter((d) => d.categoria === c).reduce((acc, d) => acc + d.custoMensal, 0) }))
    .sort((a, b) => b.total - a.total)[0];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gastos do Sistema</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie os custos operacionais do NexoHub ERP</p>
        </div>
        <Button className="gradient-primary text-primary-foreground border-0" onClick={() => setDialogAberto(true)}>
          <Plus className="w-4 h-4 mr-2" /> Novo Gasto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CartaoEstatistica titulo="Custo Mensal Total" valor={formatarMoeda(totalMensal)} icone={DollarSign} gradiente />
        <CartaoEstatistica titulo="Custo Anual Projetado" valor={formatarMoeda(totalAnual)} icone={TrendingDown} />
        <CartaoEstatistica titulo="Itens de Custo" valor={despesas.length} icone={Server} />
        <CartaoEstatistica titulo="Maior Categoria" valor={rotulosCategorias[maiorCategoria?.categoria || "outros"]} icone={Cloud} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categorias.map((cat) => {
          const despesasDaCategoria = despesas.filter((d) => d.categoria === cat);
          const totalCategoria = despesasDaCategoria.reduce((acc, d) => acc + d.custoMensal, 0);
          const Icone = iconesCategorias[cat] || DollarSign;
          return (
            <div key={cat} className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icone className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {rotulosCategorias[cat]}
                </h3>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatarMoeda(totalCategoria)}</p>
              <p className="text-xs text-muted-foreground mt-1">{despesasDaCategoria.length} itens • {((totalCategoria / totalMensal) * 100).toFixed(0)}% do total</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <h2 className="text-sm font-semibold text-foreground">Todos os Gastos</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground text-xs">Descrição</TableHead>
              <TableHead className="text-muted-foreground text-xs">Categoria</TableHead>
              <TableHead className="text-muted-foreground text-xs">Fornecedor</TableHead>
              <TableHead className="text-muted-foreground text-xs">Custo/Mês</TableHead>
              <TableHead className="text-muted-foreground text-xs">Status</TableHead>
              <TableHead className="text-muted-foreground text-xs w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <EstadoTabela colunas={6} carregando={isLoading} erro={error} vazio={todas.length === 0} />
            {todas.map((d) => (
              <TableRow key={d.id} className="border-border/30 hover:bg-muted/30">
                <TableCell>
                  <p className="text-sm font-medium text-foreground">{d.descricao}</p>
                  <p className="text-xs text-muted-foreground">{d.observacoes}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${coresCategorias[d.categoria]}`}>
                    {rotulosCategorias[d.categoria]}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{d.fornecedor}</TableCell>
                <TableCell className="text-sm font-bold text-foreground">{formatarMoeda(d.custoMensal)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    d.status === "ativo"
                      ? "text-xs bg-success/10 text-success border-success/20"
                      : "text-xs bg-muted text-muted-foreground border-border"
                  }>
                    {d.status === "ativo" ? "Ativo" : "Cancelado"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      {d.status === "ativo" ? (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => alterarStatus.mutate({ id: d.id, status: "cancelado" })}
                        >
                          <Ban className="w-4 h-4 mr-2" /> Cancelar Gasto
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="text-success focus:text-success"
                          onClick={() => alterarStatus.mutate({ id: d.id, status: "ativo" })}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> Reativar Gasto
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Novo Gasto</DialogTitle>
            <DialogDescription className="text-muted-foreground">Registre um novo custo operacional do sistema.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Descrição</Label>
              <Input value={formulario.descricao} onChange={(e) => setFormulario({ ...formulario, descricao: e.target.value })} placeholder="Ex: Servidor AWS" className="bg-muted border-border text-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Categoria</Label>
                <Select value={formulario.categoria} onValueChange={(categoria) => setFormulario({ ...formulario, categoria: categoria as Formulario["categoria"] })}>
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                    <SelectItem value="nuvem">Cloud / Hosting</SelectItem>
                    <SelectItem value="ferramentas">Ferramentas & SaaS</SelectItem>
                    <SelectItem value="suporte">Suporte & RH</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Custo Mensal (R$)</Label>
                <Input type="number" min="0" step="0.01" value={formulario.custoMensal} onChange={(e) => setFormulario({ ...formulario, custoMensal: e.target.value })} placeholder="0,00" className="bg-muted border-border text-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Fornecedor</Label>
              <Input value={formulario.fornecedor} onChange={(e) => setFormulario({ ...formulario, fornecedor: e.target.value })} placeholder="Ex: Amazon Web Services" className="bg-muted border-border text-foreground" />
            </div>
            <Button
              className="w-full gradient-primary text-primary-foreground border-0"
              disabled={criar.isPending}
              onClick={aoCriar}
            >
              {criar.isPending ? "Registrando..." : "Registrar Gasto"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
