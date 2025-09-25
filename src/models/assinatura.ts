import type Plano from "./plano";

export default interface Assinatura {
    paymentMethodId: string;
    customerEmail: string; 
    idUsuario: string;
    plano: Plano;
}