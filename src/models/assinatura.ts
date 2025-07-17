export default interface Assinatura {
    id: string;
    cardTokenId: string
    email: string;
    paymentMethodId: string;
    transactionAmount: number;
    reason: string;
    status: string;
    idUsuario: string
}