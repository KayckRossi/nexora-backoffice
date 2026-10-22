// Datas só com o dia ("2026-10-18") são do calendário local; new Date() as leria como UTC e mostraria o dia anterior.
const paraData = (valor: string) => (/^\d{4}-\d{2}-\d{2}$/.test(valor) ? new Date(`${valor}T00:00:00`) : new Date(valor));

export const formatarData = (valor: string | null | undefined) =>
  valor ? paraData(valor).toLocaleDateString("pt-BR") : "—";

export const formatarDataHora = (valor: string | null | undefined, vazio = "—") =>
  valor ? paraData(valor).toLocaleString("pt-BR") : vazio;

export const formatarMoeda = (valor: number) =>
  `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
