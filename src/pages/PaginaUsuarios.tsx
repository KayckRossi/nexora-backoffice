import { useState } from "react";
import { Search, MoreHorizontal, Ban, CheckCircle, KeyRound, UserPlus } from "lucide-react";
import { usuarios, inquilinos } from "@/data/dadosMock";
import BadgeStatus from "@/components/BadgeStatus";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function PaginaUsuarios() {
  const [busca, setBusca] = useState("");
  const [filtroInquilino, setFiltroInquilino] = useState("todos");
  const [dialogAberto, setDialogAberto] = useState(false);
  const { toast } = useToast();

  const filtrados = usuarios.filter((u) => {
    const correspondeABusca =
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase());
    const correspondeAoInquilino = filtroInquilino === "todos" || u.inquilinoId === filtroInquilino;
    return correspondeABusca && correspondeAoInquilino;
  });

  const obterInquilino = (inquilinoId: string) => inquilinos.find((i) => i.id === inquilinoId);

  const coresPapel: Record<string, string> = {
    admin: "bg-primary/10 text-primary border-primary/20",
    gerente: "bg-secondary/10 text-secondary border-secondary/20",
    usuario: "bg-muted text-muted-foreground border-border",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuários dos Tenants</h1>
          <p className="text-sm text-muted-foreground mt-1">Visualize e gerencie usuários de todos os tenants</p>
        </div>
        <Button className="gradient-primary text-primary-foreground border-0" onClick={() => setDialogAberto(true)}>
          <UserPlus className="w-4 h-4 mr-2" /> Criar Usuário
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou email..."
            className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <Select value={filtroInquilino} onValueChange={setFiltroInquilino}>
          <SelectTrigger className="w-[220px] bg-muted border-border text-foreground">
            <SelectValue placeholder="Filtrar por tenant" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="todos">Todos os tenants</SelectItem>
            {inquilinos.map((i) => (
              <SelectItem key={i.id} value={i.id}>{i.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground text-xs">Usuário</TableHead>
              <TableHead className="text-muted-foreground text-xs">Tenant</TableHead>
              <TableHead className="text-muted-foreground text-xs">Papel</TableHead>
              <TableHead className="text-muted-foreground text-xs">Último Login</TableHead>
              <TableHead className="text-muted-foreground text-xs">Status</TableHead>
              <TableHead className="text-muted-foreground text-xs w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((u) => {
              const inquilino = obterInquilino(u.inquilinoId);
              return (
                <TableRow key={u.id} className="border-border/30 hover:bg-muted/30">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.nome}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{inquilino?.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${coresPapel[u.papel]}`}>
                      {u.papel}
                    </Badge>
                  </TableCell>
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
                            <Ban className="w-4 h-4 mr-2" /> Suspender
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
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Criar Usuário</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Adicione um novo usuário a um tenant existente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Nome Completo</Label>
              <Input placeholder="Ex: João da Silva" className="bg-muted border-border text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Email</Label>
              <Input placeholder="joao@empresa.com.br" className="bg-muted border-border text-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Tenant</Label>
                <Select>
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {inquilinos.map((i) => (
                      <SelectItem key={i.id} value={i.id}>{i.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Papel</Label>
                <Select>
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="gerente">Gerente</SelectItem>
                    <SelectItem value="usuario">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              className="w-full gradient-primary text-primary-foreground border-0"
              onClick={() => {
                setDialogAberto(false);
                toast({ title: "Usuário criado", description: "O novo usuário foi adicionado ao tenant." });
              }}
            >
              Criar Usuário
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
