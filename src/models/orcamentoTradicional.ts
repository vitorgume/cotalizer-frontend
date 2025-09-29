import type { CampoPersonalizado } from "./campoPersonalizado";
import type { Produto } from "./produto";
import type Template from "./template";

export interface OrcamentoTradicional {
    id?: string;
    cliente: string;
    cnpjCpf: string;
    observacoes: string;
    camposPersonalizados: CampoPersonalizado[];
    produtos: Produto[];
    tipoOrcamento: string;
    status: string;
    dataCriacao: string;
    idUsuario: string;
    valorTotal: number;
    urlArquivo: string;
    template: Template;
}