import './assinaturaForms.css';
import { criarAssinatura } from '../../pagamento.service';
import { useState } from 'react';
import Loading from '../../../orcamento/componentes/loading/Loading';
import { notificarErro, notificarSucesso } from '../../../../utils/notificacaoUtils';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

type Props = {
    open: boolean;
    onClose: () => void;
    idUsuario: string;
    emailInicial?: string;
    nomeInicial?: string;
    onAssinou?: () => Promise<void> | void; // para o pai recarregar usuário/atualizar UI
};

export default function AssinaturaForms({ open, onClose, idUsuario, emailInicial = '', nomeInicial = '', onAssinou }: Props) {
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState(emailInicial);
    const [nome, setNome] = useState(nomeInicial);
    const [loading, setLoading] = useState(false);

    const [okNumber, setOkNumber] = useState(false);
    const [okExpiry, setOkExpiry] = useState(false);
    const [okCvc, setOkCvc] = useState(false);

    if (!open) return null;

    const stripeReady = !!stripe && !!elements;
    const podeEnviar = stripeReady && okNumber && okExpiry && okCvc && !loading;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!stripe || !elements) return;

        const numberEl = elements.getElement(CardNumberElement);
        if (!numberEl) return;

        try {
            setLoading(true);

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: numberEl, // em split elements, passe o CardNumberElement
                billing_details: { name: nome, email }
            });

            if (error) {
                notificarErro(error.message ?? 'Cartão inválido.');
                return;
            }

            await criarAssinatura({
                paymentMethodId: paymentMethod!.id,
                customerEmail: email,
                idUsuario
            });

            notificarSucesso('Assinatura criada com sucesso!');
            if (onAssinou) await onAssinou();
            onClose();
        } catch (err: any) {
            notificarErro(err?.message ?? 'Falha ao processar assinatura.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* backdrop clicável acima do sheet */}
            <div className="assinatura-sheet-backdrop" onClick={onClose} />
            <div className="assinatura-sheet" role="dialog" aria-modal="true" aria-label="Assinatura Plus">
                <div className="sheet-handle" aria-hidden="true" />
                <div className="assinatura-sheet__header">
                    <h2>Obter Plus</h2>
                    <button className="assinatura-modal__close" onClick={onClose} aria-label="Fechar">×</button>
                </div>

                {loading ? (
                    <div style={{ padding: '1rem' }}><Loading message="Processando" /></div>
                ) : (
                    <form className="assinatura-sheet__form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <label className="label-assinatura">E-mail</label>
                            <input
                                type="email"
                                className="input-assinatura"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="seuemail@exemplo.com"
                            />
                        </div>

                        <div className="form-row">
                            <label className="label-assinatura">Nome do Portador</label>
                            <input
                                type="text"
                                className="input-assinatura"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                                placeholder="João Silva"
                            />
                        </div>

                        {/* Campos separados do Stripe */}
                        <div className="form-row">
                            <label className="label-assinatura">Número do cartão</label>
                            <div className="card-element-wrapper">
                                <CardNumberElement
                                    className="card-element"
                                    onChange={(e) => setOkNumber(!!e.complete)}
                                    options={{
                                        placeholder: '0000 0000 0000 0000',
                                        style: {
                                            base: { fontSize: '16px', color: '#111827', '::placeholder': { color: '#9CA3AF' } },
                                            invalid: { color: '#e53e3e' }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="form-row two-cols">
                            <div className="col">
                                <label className="label-assinatura">Validade (MM/AA)</label>
                                <div className="card-element-wrapper">
                                    <CardExpiryElement
                                        className="card-element"
                                        onChange={(e) => setOkExpiry(!!e.complete)}
                                        options={{
                                            style: {
                                                base: { fontSize: '16px', color: '#111827', '::placeholder': { color: '#9CA3AF' } },
                                                invalid: { color: '#e53e3e' }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col">
                                <label className="label-assinatura">CVV</label>
                                <div className="card-element-wrapper">
                                    <CardCvcElement
                                        className="card-element"
                                        onChange={(e) => setOkCvc(!!e.complete)}
                                        options={{
                                            placeholder: '123',
                                            style: {
                                                base: { fontSize: '16px', color: '#111827', '::placeholder': { color: '#9CA3AF' } },
                                                invalid: { color: '#e53e3e' }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="assinatura-sheet__actions">
                            <button type="button" className="botao-cancelar" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="botao-gerar" disabled={!podeEnviar}>
                                Confirmar pagamento
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}
