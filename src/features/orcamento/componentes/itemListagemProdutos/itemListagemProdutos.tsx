import './ItemListagemProdutos.css';

interface ItemProps {
  titulo: string;
  quantidade: number;
  preco: number;
  index: number;
  onRemove: () => void;
}

export function ItemListagemProdutos({
  titulo,
  quantidade,
  preco,
  index,
  onRemove
}: ItemProps) {
  const rowClass = index % 2 === 0 ? 'even' : 'odd';
  const precoTotal = quantidade * preco;

  return (
    <div className={`item-produto glass-card ${rowClass}`}>
      <div className="item-info">
        <div className="item-titulo">
          <h4>{titulo}</h4>
        </div>

        <div className="item-detalhes">
          <div className="item-quantidade">
            <span className="label">Quantidade</span>
            <span className="value chip">{quantidade}</span>
          </div>

          <div className="item-preco-unitario">
            <span className="label">Preço Unit.</span>
            <span className="value">R$ {preco.toFixed(2)}</span>
          </div>

          <div className="item-preco-total">
            <span className="label">Total</span>
            <span className="value total">R$ {precoTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="item-acoes">
        <button
          className="btn-deletar"
          onClick={onRemove}
          aria-label={`Remover ${titulo}`}
          title="Remover produto"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          <span className="btn-text">Remover</span>
        </button>
      </div>
    </div>
  );
}
