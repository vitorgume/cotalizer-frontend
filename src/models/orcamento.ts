export default interface Orcamento {
    id: string;
    conteudoOriginal: string;
    orcamentoFormatado?: any | undefined;
    dataCriacao: string;
    titulo: string;
    urlArquivo: string;
    usuarioId: string;
}