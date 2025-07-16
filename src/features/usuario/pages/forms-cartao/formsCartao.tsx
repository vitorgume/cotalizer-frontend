import { loadMercadoPago } from "@mercadopago/sdk-js";
import './formsCartao.css';
import { useEffect } from 'react';
import { processarPagamento } from '../../pagamento.service';

declare global {
    interface Window {
        MercadoPago: any;
    }
}

export default function CheckoutCartao() {

    useEffect(() => {
        async function carregarMercadoPago() {
            await loadMercadoPago();

            const mp = new window.MercadoPago("YOUR_PUBLIC_KEY");

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
                            paymentMethodId: payment_method_id,
                            issuerId: issuer_id,
                            cardholderEmail: email,
                            amount,
                            token,
                            installments,
                            identificationNumber,
                            identificationType,
                        } = cardForm.getCardFormData();

                        try {
                            const resultado = await processarPagamento({
                                token,
                                issuer_id,
                                payment_method_id,
                                transaction_amount: Number(amount),
                                installments: Number(installments),
                                description: "Plano Plus - Assinatura",
                                payer: {
                                    email,
                                    identification: {
                                        type: identificationType,
                                        number: identificationNumber,
                                    },
                                },
                            });

                            if (resultado.status === "approved") {
                                alert("Pagamento aprovado! 🎉");
                            } else {
                                alert(`Pagamento ${resultado.status}.`);
                            }
                        } catch (error) {
                            alert("Erro ao processar pagamento.");
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
