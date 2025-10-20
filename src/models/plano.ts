type TipoPlano = "GRATIS" | "PADRAO" | "PAGO";

export default interface Plano {
    id: string;
    titulo: string;
    descricao: string;
    valor: number;
    limite: number;
    idPlanoStripe: string;
    tipoPlano: TipoPlano;
    sequencia: number;
    servicos: string[];
}