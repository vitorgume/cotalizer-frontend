export default interface Assinatura {
    cardTokenId: string;
    cardholderName: string;
    email: string;
    identification: {
        type: string;
        number: string;
    };
    idUsuario: string;  
}