import type Plano from "../../../../../models/plano";
import './planoItem.css';

interface PlanoItemProps {
    plano: Plano;
    isCurrent: boolean;
    onAssinar: () => void;
    onPlanoSelecionado: (plano: Plano) => void;
    usuarioIsPaid?: boolean;
    onDowngrade?: (plano: Plano) => void;
}

export default function PlanoItem({
  plano,
  isCurrent,
  onAssinar,
  onPlanoSelecionado,
  usuarioIsPaid = false,
  onDowngrade,
}: PlanoItemProps) {
  const isTrial = plano.tipoPlano === "GRATIS";
  const isStarter = plano.tipoPlano === "PADRAO";
  const isPaidPlan = plano.tipoPlano === "PAGO";

  const handleAssinar = () => {
    if (isCurrent) return;
    onAssinar();
    onPlanoSelecionado(plano);
  };

  const handleDowngrade = () => {
    if (isCurrent) return;
    onDowngrade?.(plano);
  };

  return (
    <article className={`card ${isCurrent ? "is-current" : ""}`} aria-labelledby={`plano-${plano.id}`}>
      {isCurrent && <span className="badge-atual" aria-label="Seu plano atual">Seu plano</span>}

      <h2 className="title" id={`plano-${plano.id}`}>{plano.titulo}</h2>
      <div className="subtitle">{plano.descricao}</div>

      <div className="price">
        R$ {Number(plano.valor ?? 0).toFixed(2).replace(".", ",")} <span className="per">/ mês</span>
      </div>

      <ul className="features">
        {plano.limite > 0 && (
          <li>
            Até <strong>{plano.limite} orçamentos/mês</strong>
          </li>
        )}
        {plano.servicos.map((servico) => (
          <li key={servico}>{servico}</li>
        ))}
      </ul>

      <div className="actions">
        {isCurrent ? (
          <button
            className="btn btn-outline"
            aria-label="Seu plano atual"
            disabled
            aria-disabled
            title="Este já é o seu plano"
          >
            Plano atual
          </button>
        ) : usuarioIsPaid && isStarter ? (
          <button
            className="btn btn-warning"
            aria-label="Voltar para o plano Starter"
            onClick={handleDowngrade}
            title="Voltar para o Starter"
          >
            Voltar para Starter
          </button>
        ) : isTrial ? (
          <button
            className="btn btn-outline"
            aria-label="Criar conta gratuita"
            onClick={handleAssinar}
            title="Começar grátis"
          >
            Começar grátis
          </button>
        ) : isPaidPlan || isStarter ? (
          <button
            className="btn btn-primary"
            aria-label={`Assinar ${plano.titulo}`}
            onClick={handleAssinar}
            title="Assinar plano"
          >
            Assinar
          </button>
        ) : (
          <button
            className="btn btn-primary"
            aria-label={`Selecionar ${plano.titulo}`}
            onClick={handleAssinar}
            title="Selecionar plano"
          >
            Selecionar
          </button>
        )}
      </div>
    </article>
  );
}