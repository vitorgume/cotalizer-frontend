import './assinaturaForms.css';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { criarAssinatura } from "../../pagamento.service";

export default function AssinaturaForms() {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (elements) {
            const cardElement = elements.getElement(CardElement);

            if (stripe && cardElement) {
                const { error, paymentMethod } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: cardElement,
                });

                if (!error) {
                    const idUsuario = localStorage.getItem('id-usuario');

                    if (idUsuario) {
                        await criarAssinatura({
                            paymentMethodId: paymentMethod.id,
                            customerEmail: 'cliente@email.com',
                            idUsuario
                        });
                    }
                }
            }
        }
    };

    return (
        <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
                <h2>Insira seus dados do cartão</h2>
                <CardElement className="card-element" />
                <button type="submit">Assinar</button>
            </form>
        </div>
    );
}
