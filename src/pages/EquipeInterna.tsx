import { useState } from "react";
import { Search, MoreHorizontal, Ban, CheckCircle, KeyRound, UserPlus, Shield } from "lucide-react";
import { useAlterarStatus, useCriar, useEquipe, useRedefinirSenha, type NovoColaborador } from "@/api/recursos";
import EstadoTabela from "@/components/EstadoTabela";
import { podeGerenciarEquipe, useUsuarioAtual } from "@/lib/auth";
import { formatarDataHora } from "@/lib/formatos";
import BadgeStatus from "@/components/BadgeStatus";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Cargo começa vazio até ser escolhido; o backend recusa (422) se continuar vazio
type Formulario = Omit<NovoColaborador, "papel"> & { papel: NovoColaborador["papel"] | "" };
const FORMULARIO_VAZIO: Formulario = { nome: "", email: "", papel: "", departamento: "" };

export default function EquipeInterna() {
  const [busca, setBusca] = useState("");
  const [dialogAberto, setDialogAberto] = useState(false);
  const [formulario, setFormulario] = useState<Formulario>(FORMULARIO_VAZIO);
  const { toast } = useToast();
  const { data: equipe = [], isLoading, error } = useEquipe();
  const { data: eu } = useUsuarioAtual();
  const podeGerenciar = podeGerenciarEquipe(eu);
  const criar = useCriar("equipe");
  const alterarStatus = useAlterarStatus("equipe");
  const redefinirSenha = useRedefinirSenha("equipe");

  const aoCriar = () =>
    criar.mutate(formulario as NovoColaborador, {
      onSuccess: () => {
        setDialogAberto(false);
        setFormulario(FORMULARIO_VAZIO);
        toast({ title: "Colaborador criado", description: `${formulario.email} foi adicionado à equipe.` });
      },
    });

  const filtrados = equipe.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase())
  );

  const coresPapel: Record<string, string> = {
    superadmin: "bg-destructive/10 text-destructive border-destructive/20",
    admin: "bg-primary/10 text-primary border-primary/20",
    suporte: "bg-secondary/10 text-secondary border-secondary/20",
    financeiro: "bg-warning/10 text-warning border-warning/20",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Equipe Interna</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie os colaboradores do NexoHub</p>
        </div>
        {podeGerenciar && (
          <Button className="gradient-primary text-primary-foreground border-0" onClick={() => setDialogAberto(true)}>
            <UserPlus className="w-4 h-4 mr-2" /> Novo Colaborador
          </Button>
        )}
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
              <TableHead className="text-muted-foreground text-xs">Colaborador</TableHead>
              <TableHead className="text-muted-foreground text-xs">Cargo</TableHead>
              <TableHead className="text-muted-foreground text-xs">Departamento</TableHead>
              <TableHead className="text-muted-foreground text-xs">Último Acesso</TableHead>
              <TableHead className="text-muted-foreground text-xs">Status</TableHead>
              <TableHead className="text-muted-foreground text-xs w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <EstadoTabela colunas={6} carregando={isLoading} erro={error} vazio={filtrados.length === 0} />
            {filtrados.map((u) => (
              <TableRow key={u.id} className="border-border/30 hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary-foreground">
                        {u.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.nome}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${coresPapel[u.papel] || ""}`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {u.papel}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{u.departamento}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatarDataHora(u.ultimoLogin, "Nunca")}
                </TableCell>
                <TableCell><BadgeStatus status={u.status} /></TableCell>
                <TableCell>
                  {podeGerenciar && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem onClick={() => redefinirSenha.mutate(u)}>
                          <KeyRound className="w-4 h-4 mr-2" /> Reset de Senha
                        </DropdownMenuItem>
                        {u.id !== eu?.id && <DropdownMenuSeparator className="bg-border" />}
                        {u.id === eu?.id ? null : u.status === "ativo" ? (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => alterarStatus.mutate({ id: u.id, status: "suspenso" })}
                          >
                            <Ban className="w-4 h-4 mr-2" /> Desativar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-success focus:text-success"
                            onClick={() => alterarStatus.mutate({ id: u.id, status: "ativo" })}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Reativar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Novo Colaborador</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Adicione um novo membro à equipe interna do NexoHub.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Nome Completo</Label>
              <Input value={formulario.nome} onChange={(e) => setFormulario({ ...formulario, nome: e.target.value })} placeholder="Ex: João da Silva" className="bg-muted border-border text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Email</Label>
              <Input type="email" value={formulario.email} onChange={(e) => setFormulario({ ...formulario, email: e.target.value })} placeholder="joao@nexohub.com" className="bg-muted border-border text-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Cargo</Label>
                <Select value={formulario.papel} onValueChange={(papel) => setFormulario({ ...formulario, papel: papel as Formulario["papel"] })}>
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="suporte">Suporte</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Departamento</Label>
                <Select value={formulario.departamento} onValueChange={(departamento) => setFormulario({ ...formulario, departamento })}>
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="Suporte">Suporte</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              className="w-full gradient-primary text-primary-foreground border-0"
              disabled={criar.isPending}
              onClick={aoCriar}
            >
              {criar.isPending ? "Criando..." : "Criar Colaborador"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
