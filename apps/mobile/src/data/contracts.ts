/**
 * Dados demonstrativos: o KONECTA ainda não tem um modelo de "contratos"
 * no backend. Quando existir, isto passa a vir de api.listContracts().
 */
export type ContractStatus = "active" | "pending" | "completed";

export type Contract = {
  id: string;
  title: string;
  provider: string;
  status: ContractStatus;
  date: string;
  value: string;
};

export const CONTRACTS: Contract[] = [
  { id: "1", title: "Instalação elétrica residencial", provider: "Eduardo Lopes", status: "active", date: "22 Set 2026", value: "45.000 AOA" },
  { id: "2", title: "Design de logotipo", provider: "Ana Silva", status: "pending", date: "20 Set 2026", value: "30.000 AOA" },
  { id: "3", title: "Reparação de canalização", provider: "Manuel Costa", status: "completed", date: "15 Set 2026", value: "15.000 AOA" },
];

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Ativo", color: "#15988b", bg: "#e7f8f6" },
  pending: { label: "Pendente", color: "#f49a00", bg: "#fff8e6" },
  completed: { label: "Concluído", color: "#5379b2", bg: "#eef2fa" },
};
