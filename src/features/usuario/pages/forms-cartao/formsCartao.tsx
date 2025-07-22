import { loadMercadoPago } from "@mercadopago/sdk-js";
import './formsCartao.css';
import { useEffect } from 'react';
import { criarAssinatura } from '../../pagamento.service';
import { CardPayment } from '@mercadopago/sdk-react';
import { initMercadoPago } from '@mercadopago/sdk-react'

initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY);

// declare global {
//     interface Window {
//         MercadoPago: any;
//     }
// }



export default function CheckoutCartao() {
    // useEffect(() => {
    // }, []);

    const initialization = {
        amount: 39.90,
    };

    const onError = async (error: any) => {

        // callback chamado para todos os casos de erro do Brick
        console.log(error);
    };

    const onSubmit = async (formData: any) => {
        const idUsuario = localStorage.getItem("id-usuario");

        if (idUsuario) {
            await criarAssinatura({
                tokenCardId: formData.token,
                cardholderName: formData.cardholderName ?? '',
                emailUsuario: formData.payer.email,
                identification: formData.payer.identification,
                idUsuario
            })
        }
    }

    const onReady = async () => {
        /*
            Callback chamado quando o Brick estiver pronto.
            Aqui você pode ocultar loadings do seu site, por exemplo.
          */
    };


    return (
        <CardPayment
            initialization={initialization}
            onSubmit={onSubmit}
            onReady={onReady}
            onError={onError}
        />
    );
}
