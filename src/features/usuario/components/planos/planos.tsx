import { useEffect, useRef } from 'react';
import './planos.css';
import type Usuario from '../../../../models/usuario';

interface PlanosProps {
  onAssinar: () => void;
  open: boolean;
  onPlanoSelecionado: (plano: string) => void;
  usuario: Usuario;
}

export default function Planos({ onAssinar, open, onPlanoSelecionado, usuario }: PlanosProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }, [open]);

  // normaliza o plano vindo do backend
  const planoAtual = (usuario?.plano || 'GRATIS').toUpperCase();
  const isFree = planoAtual === 'GRATIS';
  const isPlus = planoAtual === 'PLUS';
  const isEnt  = planoAtual === 'ENTERPRISE';

  return (
    <div ref={panelRef} className="planos-scope">
      <header>
        <div className="kicker"><span className="dot"></span>Planos e preços</div>
        <h1 id="heading">Escolha o plano que acompanha o seu volume de orçamentos</h1>
        <p>
          Comece no <strong>Free</strong> para testar o fluxo. Quando precisar de mais volume e recursos, migre para o <strong>Plus</strong>. 
          Se a sua operação é grande, fale com a gente sobre o <strong>Enterprise</strong>.
        </p>
      </header>

      <section className="grid" aria-label="Comparação de planos">
        {/* FREE */}
        <article className={`card ${isFree ? 'is-current' : ''}`} aria-labelledby="p-free">
          {isFree && <span className="badge-atual" aria-label="Seu plano atual">Seu plano</span>}
          <h2 className="title" id="p-free">Free</h2>
          <div className="subtitle">Para experimentar e validar o processo</div>
          <div className="price">R$ 0,00 <span className="per">/ mês</span></div>
          <ul className="features">
            <li>Até <strong>5 orçamentos/mês</strong></li>
            <li>Geração de PDF com o seu logo</li>
            <li>Templates básicos de orçamento</li>
          </ul>
          <div className="actions">
            <button
              className="btn btn-outline"
              aria-label="Criar conta gratuita"
              disabled={isFree}
              aria-disabled={isFree}
              title={isFree ? 'Este já é o seu plano' : undefined}
            >
              {isFree ? 'Plano atual' : 'Começar grátis'}
            </button>
          </div>
          <div className="note">Sem cartão de crédito. Ideal para testar a ferramenta.</div>
        </article>

        {/* PLUS */}
        <article className={`card is-featured ${isPlus ? 'is-current' : ''}`} aria-labelledby="p-plus">
          <div className="ribbon" aria-hidden="true">Mais popular</div>
          {isPlus && <span className="badge-atual" aria-label="Seu plano atual">Seu plano</span>}
          <h2 className="title" id="p-plus">Plus</h2>
          <div className="subtitle">Para quem envia orçamentos com frequência</div>
          <div className="price">R$ 29,90 <span className="per">/ mês</span></div>
          <ul className="features">
            <li>Até <strong>100 orçamentos/mês</strong></li>
            <li>Geração de PDF com o seu logo</li>
            <li>Templates básicos de orçamento</li>
          </ul>
          <div className="actions">
            <button
              className="btn btn-primary"
              aria-label={isPlus ? 'Seu plano atual' : 'Assinar plano Plus'}
              onClick={() => { if (!isPlus) { onAssinar(); onPlanoSelecionado('Plus'); } }}
              disabled={isPlus}
              aria-disabled={isPlus}
              title={isPlus ? 'Este já é o seu plano' : undefined}
            >
              {isPlus ? 'Plano atual' : 'Assinar'}
            </button>
          </div>
          <div className="note">Cancele quando quiser. Sem fidelidade.</div>
        </article>

        {/* ENTERPRISE */}
        <article className={`card ${isEnt ? 'is-current' : ''}`} aria-labelledby="p-ent">
          {isEnt && <span className="badge-atual" aria-label="Seu plano atual">Seu plano</span>}
          <h2 className="title" id="p-ent">Enterprise</h2>
          <div className="subtitle">Negociável — para alto volume</div>
          <div className="price">R$ 59,90 <span className="per">/ mês</span></div>
          <ul className="features">
            <li>Até <strong>500 orçamentos/mês</strong></li>
            <li>Geração de PDF com o seu logo</li>
            <li>Templates básicos de orçamento</li>
          </ul>
          <div className="actions">
            <button
              className="btn btn-primary"
              aria-label={isEnt ? 'Seu plano atual' : 'Assinar plano Enterprise'}
              onClick={() => { if (!isEnt) { onAssinar(); onPlanoSelecionado('Enterprise'); } }}
              disabled={isEnt}
              aria-disabled={isEnt}
              title={isEnt ? 'Este já é o seu plano' : undefined}
            >
              {isEnt ? 'Plano atual' : 'Assinar'}
            </button>
          </div>
          <div className="note">Projetado para times que precisam de escala e governança.</div>
        </article>
      </section>
    </div>
  );
}
