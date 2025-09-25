export default interface Plano {
    id: string;
    titulo: string;
    descricao: string;
    valor: number;
    limite: number;
    idPlanoStripe: string;
    padrao: boolean;
    sequencia: number;
    servicos: string[];
}