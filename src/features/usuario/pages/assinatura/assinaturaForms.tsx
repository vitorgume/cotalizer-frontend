import './assinaturaForms.css';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { criarAssinatura } from '../../pagamento.service';
import { useState } from 'react';

export default function AssinaturaForms() {
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [previewNome, setPreviewNome] = useState('SEU NOME');
    const [previewExp, setPreviewExp] = useState('MM/AA');
    const [previewCard, setPreviewCard] = useState('•••• •••• •••• ••••');
    const [bandeira, setBandeira] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cardElement = elements?.getElement(CardElement);
        if (!stripe || !cardElement) return;

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: nome,
                email: email,
            },
        });

        if (error) {
            console.error(error);
            return;
        }

        const idUsuario = localStorage.getItem('id-usuario');
        if (idUsuario) {
            await criarAssinatura({
                paymentMethodId: paymentMethod.id,
                customerEmail: email,
                idUsuario,
            });
        }
    };

    const handleCardChange = (event: any) => {
        if (event.complete) {
            const brand = event.brand;
            setBandeira(brand);
        }

        const number = event.value?.cardNumber?.replace(/\s+/g, '').replace(/[^0-9]/gi, '') ?? '';
        const formattedNumber = number.match(/.{1,4}/g)?.join(' ') || '•••• •••• •••• ••••';
        setPreviewCard(formattedNumber);

        const exp = event.value?.expiry || '';
        setPreviewExp(exp || 'MM/AA');
    };

    return (
        <div className='body-forms-cartao'>
            <div className="container">
                <div className="header">
                    <h1>Dados do Cartão</h1>
                    <p>Insira as informações do seu cartão de forma segura</p>
                </div>

                <div className="card-preview">
                    <div className="card-number">{previewCard}</div>
                    <div className="card-info">
                        <div className="card-holder">
                            <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 4 }}>PORTADOR</div>
                            <div>{previewNome}</div>
                        </div>
                        <div className="card-expiry">
                            <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 4 }}>VÁLIDO ATÉ</div>
                            <div>{previewExp}</div>
                        </div>
                    </div>
                    {bandeira && <div style={{ marginTop: '8px' }}>Bandeira: {bandeira.toUpperCase()}</div>}
                </div>

                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="seuemail@exemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="nome">Nome do Portador</label>
                        <input
                            type="text"
                            id="nome"
                            placeholder="João Silva"
                            value={nome}
                            onChange={(e) => {
                                setNome(e.target.value);
                                setPreviewNome(e.target.value.toUpperCase());
                            }}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Cartão de Crédito</label>
                        <div className="card-element-wrapper">
                            <CardElement
                                className="card-element"
                                onChange={handleCardChange}
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#32325d',
                                            '::placeholder': { color: '#a0aec0' },
                                        },
                                        invalid: { color: '#e53e3e' },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">Confirmar Pagamento</button>
                </form>
            </div>
        </div>
    );
}
