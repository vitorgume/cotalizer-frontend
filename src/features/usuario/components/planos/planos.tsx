import { useEffect, useRef } from 'react';
import './planos.css';

interface PlanosProps {
    onAssinar: () => void;
    open: boolean;
}

export default function Planos({ onAssinar, open }: PlanosProps) {

    const panelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (open) {
            requestAnimationFrame(() => {
                const el = panelRef.current;
                if (!el) return;

                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }, [open]);

    return (
        <div>
            <header>
                <div className="kicker"><span className="dot"></span>Planos e preços</div>
                <h1 id="heading">Escolha o plano que acompanha o seu volume de orçamentos</h1>
                <p>Comece no <strong>Free</strong> para testar o fluxo. Quando precisar de mais volume e recursos, migre para o <strong>Plus</strong>. Se a sua operação é grande, fale com a gente sobre o <strong>Enterprise</strong>.</p>
            </header>

            <section className="grid" aria-label="Comparação de planos">
                <article className="card" aria-labelledby="p-free">
                    <h2 className="title" id="p-free">Free</h2>
                    <div className="subtitle">Para experimentar e validar o processo</div>
                    <div className="price">R$ 0,00 <span className="per">/ mês</span></div>
                    <ul className="features">
                        <li>Até <strong>5 orçamentos/mês</strong></li>
                        <li>Geração de PDF com o seu logo</li>
                        <li>Templates básicos de orçamento</li>
                    </ul>
                    <div className="actions">
                        <button className="btn btn-outline" aria-label="Criar conta gratuita">Começar grátis</button>
                    </div>
                    <div className="note">Sem cartão de crédito. Ideal para testar a ferramenta.</div>
                </article>

                <article className="card is-featured" aria-labelledby="p-plus">
                    <div className="ribbon" aria-hidden="true">Mais popular</div>
                    <h2 className="title" id="p-plus">Plus</h2>
                    <div className="subtitle">Para quem envia orçamentos com frequência</div>
                    <div className="price">R$ 29,90 <span className="per">/ mês</span></div>
                    <ul className="features">
                        <li>Até <strong>100 orçamentos/mês</strong></li>
                        <li>Geração de PDF com o seu logo</li>
                        <li>Templates básicos de orçamento</li>
                    </ul>
                    <div className="actions">
                        <button className="btn btn-primary" aria-label="Assinar plano Plus" onClick={onAssinar}>Assinar</button>
                    </div>
                    <div className="note">Cancele quando quiser. Sem fidelidade.</div>
                </article>

                <article className="card" aria-labelledby="p-ent">
                    <h2 className="title" id="p-ent">Enterprise</h2>
                    <div className="subtitle">Negociável — para alto volume</div>
                    <div className="price">R$ 59,90 <span className="per">/ mês</span></div>
                    <ul className="features">
                        <li>Orçamentos ilimitados</li>
                        <li>Geração de PDF com o seu logo</li>
                        <li>Templates básicos de orçamento</li>
                    </ul>
                    <div className="actions">
                        <button className="btn btn-primary" aria-label="Assinar plano Plus" onClick={onAssinar}>Assinar</button>
                    </div>
                    <div className="note">Projetado para times que precisam de escala e governança.</div>
                </article>
            </section>
        </div>
    )
}