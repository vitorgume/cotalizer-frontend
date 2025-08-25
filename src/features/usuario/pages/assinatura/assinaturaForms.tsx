import './assinaturaForms.css';
import { criarAssinatura } from '../../pagamento.service';
import { useState, useRef, useEffect } from 'react';
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
    onAssinou?: () => Promise<void> | void;
};

export default function AssinaturaForms({
    open,
    onClose,
    idUsuario,
    emailInicial = '',
    nomeInicial = '',
    onAssinou
}: Props) {
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState(emailInicial);
    const [nome, setNome] = useState(nomeInicial);
    const [loading, setLoading] = useState(false);

    const [okNumber, setOkNumber] = useState(false);
    const [okExpiry, setOkExpiry] = useState(false);
    const [okCvc, setOkCvc] = useState(false);

    const stripeReady = !!stripe && !!elements;
    const podeEnviar = stripeReady && okNumber && okExpiry && okCvc && !loading;

    const panelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (open) {
            requestAnimationFrame(() => {
                const el = panelRef.current;
                if (!el) return;

                // respeita o scroll-margin-top do CSS
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // fallback (se quiser forçar um offset manual):
                // const y = el.getBoundingClientRect().top + window.scrollY - 84;
                // window.scrollTo({ top: y, behavior: 'smooth' });
            });
        }
    }, [open]);

    if (!open) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!stripe || !elements) return;

        const numberEl = elements.getElement(CardNumberElement);
        if (!numberEl) return;

        try {
            setLoading(true);

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: numberEl, // split elements: usar CardNumberElement
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
        // INLINE: card embutido no fluxo da página (sem backdrop / sem position: fixed)
        <section
            ref={panelRef}
            className="assinatura-panel glass-card"
            role="region"
            aria-label="Assinatura Plus"
        >
            <header className="assinatura-panel__header">
                <div>
                    <h2>Obter Plus</h2>
                    <p className="assinatura-panel__subtitle">
                        Preencha seus dados de pagamento para liberar o plano.
                    </p>
                </div>
                <button className="btn-ghost-sm" onClick={onClose} aria-label="Fechar">
                    Fechar
                </button>
            </header>

            {loading ? (
                <div className="assinatura-panel__loading">
                    <Loading message="Processando" />
                </div>
            ) : (
                <form className="assinatura-panel__form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label className="label-assinatura">E-mail</label>
                        <input
                            type="email"
                            className="input-assinatura"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seuemail@exemplo.com"
                            maxLength={100}
                        />
                    </div>

                    <div className="form-row">
                        <label className="label-assinatura">Nome do portador</label>
                        <input
                            type="text"
                            className="input-assinatura"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            placeholder="João Silva"
                            maxLength={100}
                        />
                    </div>

                    {/* Stripe split elements */}
                    <div className="form-row">
                        <label className="label-assinatura">Número do cartão</label>
                        <div className="card-element-wrapper">
                            <CardNumberElement
                                className="card-element"
                                onChange={(e) => setOkNumber(!!e.complete)}
                                options={{
                                    placeholder: '0000 0000 0000 0000',
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#ffffff',
                                            '::placeholder': { color: '#b9c8d6' }
                                        },
                                        invalid: { color: '#ffd1d1' }
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
                                            base: {
                                                fontSize: '16px',
                                                color: '#ffffff',
                                                '::placeholder': { color: '#b9c8d6' }
                                            },
                                            invalid: { color: '#ffd1d1' }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col">
                            <label className="label-assinatura">CVC</label>
                            <div className="card-element-wrapper">
                                <CardCvcElement
                                    className="card-element"
                                    onChange={(e) => setOkCvc(!!e.complete)}
                                    options={{
                                        placeholder: '123',
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#ffffff',
                                                '::placeholder': { color: '#b9c8d6' }
                                            },
                                            invalid: { color: '#ffd1d1' }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <footer className="assinatura-panel__actions">
                        <button type="button" className="btn-ghost" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary" disabled={!podeEnviar}>
                            Confirmar pagamento
                        </button>
                    </footer>
                </form>
            )}
        </section>
    );
}
