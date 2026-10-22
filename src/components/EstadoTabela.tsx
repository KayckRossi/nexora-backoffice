import { TableCell, TableRow } from "@/components/ui/table";

interface EstadoTabelaProps {
  colunas: number;
  carregando: boolean;
  erro: unknown;
  vazio: boolean;
  textoVazio?: string;
}

// Linha única da tabela enquanto carrega, quando a API falha ou quando não há registros
export default function EstadoTabela({ colunas, carregando, erro, vazio, textoVazio = "Nenhum registro encontrado." }: EstadoTabelaProps) {
  const texto = carregando
    ? "Carregando..."
    : erro
      ? `Não foi possível carregar: ${erro instanceof Error ? erro.message : "erro desconhecido"}`
      : vazio ? textoVazio : null;
  if (!texto) return null;
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colunas} className={`text-center text-xs py-8 ${erro && !carregando ? "text-destructive" : "text-muted-foreground"}`}>
        {texto}
      </TableCell>
    </TableRow>
  );
}
