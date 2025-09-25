import type Plano from "../../../../../models/plano";
import './planoItem.css';

interface PlanoItemProps {
    plano: Plano;
    isCurrent: boolean;
    onAssinar: () => void;
    onPlanoSelecionado: (plano: Plano) => void;
}

export default function PlanoItem({ plano, isCurrent, onAssinar, onPlanoSelecionado }: PlanoItemProps) {
    return (
        <article className={`card ${isCurrent ? 'is-current' : ''}`} aria-labelledby="p-free">
            {isCurrent && <span className="badge-atual" aria-label="Seu plano atual">Seu plano</span>}
            <h2 className="title" id="p-free">{plano.titulo}</h2>
            <div className="subtitle">{plano.descricao}</div>
            <div className="price">R$ {plano.valor.toFixed(2).replace('.', ',')}  <span className="per">/ mês</span></div>
            <ul className="features">
                <li>Até <strong>{plano.limite} orçamentos/mês</strong></li>
                {plano.servicos.map((servico) => (
                    <li key={servico}>{servico}</li>
                ))}
            </ul>
            <div className="actions">
                {plano.sequencia === 1 ? (
                    <button
                        className="btn btn-outline"
                        aria-label="Criar conta gratuita"
                        disabled={isCurrent}
                        aria-disabled={isCurrent}
                        title={isCurrent ? 'Este já é o seu plano' : undefined}
                    >
                        {isCurrent ? 'Plano atual' : 'Começar grátis'}
                    </button>
                ) : (
                    <button
                        className="btn btn-primary"
                        aria-label={isCurrent ? 'Seu plano atual' : 'Assinar plano Plus'}
                        onClick={() => { if (!isCurrent) { onAssinar(); onPlanoSelecionado(plano); } }}
                        disabled={isCurrent}
                        aria-disabled={isCurrent}
                        title={isCurrent ? 'Este já é o seu plano' : undefined}
                    >
                        {isCurrent ? 'Plano atual' : 'Assinar'}
                    </button>
                )
                }
            </div>
        </article>
    );
}