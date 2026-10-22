import { useState } from "react";
import { Building2, Plus, Search, MoreHorizontal, Ban, CheckCircle } from "lucide-react";
import { useAlterarStatus, useCriar, useInquilinos, usePlanos, type NovoInquilino } from "@/api/recursos";
import EstadoTabela from "@/components/EstadoTabela";
import { formatarData } from "@/lib/formatos";
import BadgeStatus from "@/components/BadgeStatus";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const FORMULARIO_VAZIO: NovoInquilino = { nome: "", cnpj: "", emailContato: "", telefoneContato: "", planoId: "" };

export default function Inquilinos() {
  const [busca, setBusca] = useState("");
  const [dialogAberto, setDialogAberto] = useState(false);
  const [formulario, setFormulario] = useState<NovoInquilino>(FORMULARIO_VAZIO);
  const { toast } = useToast();
  const { data: inquilinos = [], isLoading, error } = useInquilinos();
  const { data: planos = [] } = usePlanos();
  const criar = useCriar("inquilinos");
  const alterarStatus = useAlterarStatus("inquilinos");

  const campo = (nome: keyof NovoInquilino) => ({
    value: formulario[nome] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFormulario({ ...formulario, [nome]: e.target.value }),
  });

  const aoCriar = () =>
    criar.mutate(formulario, {
      onSuccess: () => {
        setDialogAberto(false);
        setFormulario(FORMULARIO_VAZIO);
        toast({ title: "Tenant criado com sucesso", description: `${formulario.nome} foi adicionado ao sistema.` });
      },
    });

  const filtrados = inquilinos.filter(
    (i) =>
      i.nome.toLowerCase().includes(busca.toLowerCase()) ||
      i.emailContato.toLowerCase().includes(busca.toLowerCase())
  );

  const obterPlano = (planoId: string) => planos.find((p) => p.id === planoId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tenants</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie os clientes do NexoHub</p>
        </div>
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground border-0">
              <Plus className="w-4 h-4 mr-2" /> Novo Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Criar Novo Tenant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Nome da Empresa</Label>
                <Input {...campo("nome")} placeholder="Ex: Empresa XPTO" className="bg-muted border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">CNPJ</Label>
                <Input {...campo("cnpj")} placeholder="00.000.000/0000-00" className="bg-muted border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Email de Contato</Label>
                <Input {...campo("emailContato")} type="email" placeholder="admin@empresa.com" className="bg-muted border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Telefone</Label>
                <Input {...campo("telefoneContato")} placeholder="(00) 00000-0000" className="bg-muted border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Plano</Label>
                <Select value={formulario.planoId} onValueChange={(planoId) => setFormulario({ ...formulario, planoId })}>
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {planos.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nome} — R$ {p.preco}/mês (até {p.maxUsuarios} users)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full gradient-primary text-primary-foreground border-0"
                disabled={criar.isPending}
                onClick={aoCriar}
              >
                {criar.isPending ? "Criando..." : "Criar Tenant"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou email..."
          className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground text-xs">Tenant</TableHead>
              <TableHead className="text-muted-foreground text-xs">Plano</TableHead>
              <TableHead className="text-muted-foreground text-xs">Usuários</TableHead>
              <TableHead className="text-muted-foreground text-xs">Contato</TableHead>
              <TableHead className="text-muted-foreground text-xs">Criado em</TableHead>
              <TableHead className="text-muted-foreground text-xs">Status</TableHead>
              <TableHead className="text-muted-foreground text-xs w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <EstadoTabela colunas={7} carregando={isLoading} erro={error} vazio={filtrados.length === 0} />
            {filtrados.map((i) => {
              const plano = obterPlano(i.planoId);
              return (
                <TableRow key={i.id} className="border-border/30 hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{i.nome}</p>
                        <p className="text-xs text-muted-foreground">{i.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                      {plano?.nome ?? i.planoId}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground">{i.qtdUsuarios}</span>
                    <span className="text-xs text-muted-foreground">/{i.maxUsuarios}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{i.emailContato}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatarData(i.criadoEm)}
                  </TableCell>
                  <TableCell><BadgeStatus status={i.status} /></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        {i.status === "ativo" ? (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => alterarStatus.mutate({ id: i.id, status: "suspenso" })}
                          >
                            <Ban className="w-4 h-4 mr-2" /> Suspender Tenant
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-success focus:text-success"
                            onClick={() => alterarStatus.mutate({ id: i.id, status: "ativo" })}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Reativar Tenant
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
