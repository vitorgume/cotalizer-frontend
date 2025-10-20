import { useEffect, useMemo, useRef } from 'react';
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
  cancelarPlano: () => void;
}

export default function Planos({
  onAssinar,
  open,
  onPlanoSelecionado,
  usuario,
  planos,
  cancelarPlano,
}: PlanosProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() =>
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    }
  }, [open]);

  const planosFiltrados = useMemo(() => {
    const atual = usuario?.plano;
    if (!atual) return [...planos].sort((a, b) => (a.sequencia ?? 999) - (b.sequencia ?? 999));

    const isTrialAtual = atual.tipoPlano === "GRATIS";
    const isStarterAtual = atual.tipoPlano === "PADRAO";

    const filtrados = planos.filter((p) => {
      const isTrial = p.tipoPlano === "GRATIS";
      const isStarter = p.tipoPlano === "PADRAO";

      if (isTrialAtual) {
        // Usuário no teste grátis → NÃO mostrar Starter
        return !isStarter;
      }
      if (isStarterAtual) {
        // Usuário no Starter → NÃO mostrar Trial
        return !isTrial || p.id === atual.id;
      }
      // Usuário em plano PAGO → não mostrar Trial (a não ser que seja o atual por segurança)
      return !isTrial || p.id === atual.id;
    });

    return filtrados.sort((a, b) => (a.sequencia ?? 999) - (b.sequencia ?? 999));
  }, [planos, usuario?.plano]);

  const usuarioIsPaid = (usuario?.plano?.tipoPlano ?? "GRATIS") === "PAGO";

  return (
    <div ref={panelRef} className="planos-scope">
      <header>
        <div className="kicker">
          <span className="dot"></span>Planos e preços
        </div>
        <h1 id="heading">Escolha o plano que acompanha o seu volume de orçamentos</h1>
        <p>
          Comece no <strong>Free</strong> para testar o fluxo. Quando precisar de mais volume e recursos, migre
          para o plano que melhor se adapte à sua necessidade.
        </p>
      </header>

      <section className="grid" aria-label="Comparação de planos">
        {planosFiltrados.map((plano) => (
          <PlanoItem
            key={plano.id}
            plano={plano}
            isCurrent={plano.id === usuario?.plano?.id}
            onAssinar={onAssinar}
            onPlanoSelecionado={onPlanoSelecionado}
            usuarioIsPaid={usuarioIsPaid}
            onDowngrade={(target) => {
              onPlanoSelecionado(target); 
              cancelarPlano();            
            }}
          />
        ))}
      </section>
    </div>
  );
}
