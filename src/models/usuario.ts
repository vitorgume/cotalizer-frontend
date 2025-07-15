export default interface Usuario {
    id?: string | null;
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    cnpj: string;
    senha: string;
    plano: string;
}