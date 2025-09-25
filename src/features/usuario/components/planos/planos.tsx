import { useEffect, useRef } from 'react';
import './planos.css';
import type Usuario from '../../../../models/usuario';
import PlanoItem from './planoItem/planoItem';
import type Plano from '../../../../models/plano';

interface PlanosProps {
  onAssinar: () => void;
  open: boolean;
  onPlanoSelecionado: (plano: Plano) => void;
  usuario: Usuario;
  planos: Plano[];
}

export default function Planos({ onAssinar, open, onPlanoSelecionado, usuario, planos }: PlanosProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }, [open]);

  return (
    <div ref={panelRef} className="planos-scope">
      <header>
        <div className="kicker"><span className="dot"></span>Planos e preços</div>
        <h1 id="heading">Escolha o plano que acompanha o seu volume de orçamentos</h1>
        <p>
          Comece no <strong>Free</strong> para testar o fluxo. Quando precisar de mais volume e recursos, migre para o plano que melhor se 
          adapte a sua necessidade.
        </p>
      </header>

      <section className="grid" aria-label="Comparação de planos">

        {planos.map((plano) => (
          <PlanoItem
            key={plano.id}
            plano={plano}
            isCurrent={plano.id === usuario.plano.id}
            onAssinar={onAssinar}
            onPlanoSelecionado={onPlanoSelecionado}
          />
        ))}
      </section>
    </div>
  );
}
