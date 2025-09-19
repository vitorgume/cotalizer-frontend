export default interface Usuario {
    id?: string | null;
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    plano: string;
    idCustomer: string;
    idAssinatura: string;
    url_logo: string;
    feedback: boolean;
    quantidade_orcamentos: number;
    tipo_cadastro: string;
}