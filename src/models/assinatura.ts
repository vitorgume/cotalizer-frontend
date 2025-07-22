export default interface Assinatura {
    tokenCardId: string;
    cardholderName: string;
    emailUsuario: string;
    identification: {
        type: string;
        number: string;
    };
    idUsuario: string;  
}