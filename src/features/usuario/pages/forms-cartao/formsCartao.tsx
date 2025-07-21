import { loadMercadoPago } from "@mercadopago/sdk-js";
import './formsCartao.css';
import { useEffect } from 'react';
import { criarAssinatura } from '../../pagamento.service';

declare global {
    interface Window {
        MercadoPago: any;
    }
}



export default function CheckoutCartao() {

    useEffect(() => {
        const idUsuario = localStorage.getItem("id-usuario");

        async function carregarMercadoPago() {
            await loadMercadoPago();

            const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

            const mp = new window.MercadoPago(publicKey);

            const cardForm = mp.cardForm({
                amount: "39.9",
                iframe: true,
                form: {
                    id: "form-checkout",
                    cardNumber: {
                        id: "form-checkout__cardNumber",
                        placeholder: "Número do cartão",
                    },
                    expirationDate: {
                        id: "form-checkout__expirationDate",
                        placeholder: "MM/YY",
                    },
                    securityCode: {
                        id: "form-checkout__securityCode",
                        placeholder: "Código de segurança",
                    },
                    cardholderName: {
                        id: "form-checkout__cardholderName",
                        placeholder: "Titular do cartão",
                    },
                    issuer: {
                        id: "form-checkout__issuer",
                        placeholder: "Banco emissor",
                    },
                    installments: {
                        id: "form-checkout__installments",
                        placeholder: "Parcelas",
                    },
                    identificationType: {
                        id: "form-checkout__identificationType",
                        placeholder: "Tipo de documento",
                    },
                    identificationNumber: {
                        id: "form-checkout__identificationNumber",
                        placeholder: "Número do documento",
                    },
                    cardholderEmail: {
                        id: "form-checkout__cardholderEmail",
                        placeholder: "E-mail",
                    },
                },
                callbacks: {
                    onFormMounted: (error: any) => {
                        if (error) return console.warn("Form Mounted handling error: ", error);
                        console.log("Form mounted");
                    },
                    onSubmit: async (event: any) => {
                        event.preventDefault();

                        const {
                            token,
                            cardholderEmail: email,
                            cardholderName,
                            identificationType,
                            identificationNumber
                        } = cardForm.getCardFormData();

                        if (!idUsuario) {
                            alert("Usuário não identificado.");
                            return;
                        }

                        try {
                            await criarAssinatura({
                                    cardTokenId: token,
                                    cardholderName,
                                    email,
                                    identification: {
                                        type: identificationType,
                                        number: identificationNumber
                                    },
                                    idUsuario
                                })
                        } catch (erro) {
                            console.error(erro);
                            alert("Erro ao enviar dados para a API.");
                        }
                    },
                    onFetching: (resource: any) => {
                        console.log("Fetching resource: ", resource);

                        const progressBar = document.querySelector(".progress-bar") as HTMLProgressElement;
                        if (progressBar) {
                            progressBar.removeAttribute("value");
                        }

                        return () => {
                            if (progressBar) {
                                progressBar.setAttribute("value", "0");
                            }
                        };
                    }
                },
            });
        }

        carregarMercadoPago();
    }, []);




    return (
        <div>
            <form id="form-checkout">
                <div id="form-checkout__cardNumber" className="container"></div>
                <div id="form-checkout__expirationDate" className="container"></div>
                <div id="form-checkout__securityCode" className="container"></div>
                <input type="text" id="form-checkout__cardholderName" />
                <select id="form-checkout__issuer"></select>
                <select id="form-checkout__installments"></select>
                <select id="form-checkout__identificationType"></select>
                <input type="text" id="form-checkout__identificationNumber" />
                <input type="email" id="form-checkout__cardholderEmail" />

                <button type="submit" id="form-checkout__submit">Pagar</button>
                <progress value="0" className="progress-bar">Carregando...</progress>
            </form>
        </div>
    );
}
