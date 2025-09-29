import type Template from "./template";

export default interface Orcamento {
    id?: string | undefined;
    conteudoOriginal: string;
    orcamentoFormatado?: any | undefined;
    dataCriacao: string;
    titulo: string;
    urlArquivo: string;
    usuarioId: string;
    status: string;
    tipoOrcamento: string;
    template: Template;
}