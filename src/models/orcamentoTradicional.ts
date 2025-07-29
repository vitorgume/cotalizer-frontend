import type { CampoPersonalizado } from "./campoPersonalizado";
import type { Produto } from "./produto";

export interface OrcamentoTradicional {
    id?: string;
    cliente: string;
    cnpjCpf: string;
    observacoes: string;
    customFields: CampoPersonalizado[];
    produtos: Produto[];
}