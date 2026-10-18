import { useState } from "react";
import { Search, MoreHorizontal, Ban, CheckCircle, KeyRound, UserPlus, Shield } from "lucide-react";
import { usuariosInternos } from "@/data/dadosMock";
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

export default function EquipeInterna() {
  const [busca, setBusca] = useState("");
  const [dialogAberto, setDialogAberto] = useState(false);
  const { toast } = useToast();

  const filtrados = usuariosInternos.filter(
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
        <Button className="gradient-primary text-primary-foreground border-0" onClick={() => setDialogAberto(true)}>
          <UserPlus className="w-4 h-4 mr-2" /> Novo Colaborador
        </Button>
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
                  {new Date(u.ultimoLogin).toLocaleString("pt-BR")}
                </TableCell>
                <TableCell><BadgeStatus status={u.status} /></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem onClick={() => toast({ title: "Reset enviado", description: `Email de reset enviado para ${u.email}` })}>
                        <KeyRound className="w-4 h-4 mr-2" /> Reset de Senha
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                      {u.status === "ativo" ? (
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Ban className="w-4 h-4 mr-2" /> Desativar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-success focus:text-success">
                          <CheckCircle className="w-4 h-4 mr-2" /> Reativar
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
            <DialogTitle className="text-foreground">Novo Colaborador</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Adicione um novo membro à equipe interna do NexoHub.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Nome Completo</Label>
              <Input placeholder="Ex: João da Silva" className="bg-muted border-border text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Email</Label>
              <Input placeholder="joao@nexohub.com" className="bg-muted border-border text-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Cargo</Label>
                <Select>
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
                <Select>
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
              onClick={() => {
                setDialogAberto(false);
                toast({ title: "Colaborador criado", description: "Novo membro adicionado à equipe." });
              }}
            >
              Criar Colaborador
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
