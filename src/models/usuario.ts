import type Plano from "./plano";

export default interface Usuario {
    id?: string | null;
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    plano: Plano;
    idCustomer: string;
    idAssinatura: string;
    url_logo: string;
    feedback: boolean;
    quantidade_orcamentos: number;
    tipo_cadastro: string;
    onboarding: boolean;
}