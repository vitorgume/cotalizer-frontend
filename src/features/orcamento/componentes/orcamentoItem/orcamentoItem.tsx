import './orcamentoItem.css';
import { formatarData } from "../../../../utils/formataData";
import { useNavigate } from 'react-router-dom';
import { extrairNomeArquivo } from "../../../../utils/urlUtils";
import { Check, Download, X } from 'lucide-react';

export interface OrcamentoItemProps {
  orcamento: any;
  misturado: boolean;
}

export default function OrcamentoItem({ orcamento, misturado }: OrcamentoItemProps) {
  const navigate = useNavigate();

  const handleNavigateToDetails = () => {
    if (orcamento.tipoOrcamento === 'IA') navigate(`/orcamento/${orcamento.id}`);
    else navigate(`/orcamento/tradicional/${orcamento.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigateToDetails();
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    // evita navegar para a página de detalhes ao clicar no download
    e.stopPropagation();
  };

  const getStatusClass = (tipo: string) => {
    if (tipo === 'IA') return 'tipo-ia';
    return 'tipo-tradicional';
  };

  // título depende do tipo/mistura
  const titulo =
    orcamento.tipoOrcamento === 'IA' || misturado ? orcamento.titulo : orcamento.cliente;

  const data = formatarData(orcamento.dataCriacao);

  const arquivo = extrairNomeArquivo(orcamento?.urlArquivo || '');

  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <div className="orcamento-item-container">
      <div
        className="orcamento-item card-glass"
        onClick={handleNavigateToDetails}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Abrir orçamento ${titulo}`}
        title={titulo}
      >
        <div className="texto-orc-item">
          <h1 className="titulo" title={titulo}>{titulo}</h1>
          <p className="data">{data}</p>
        </div>

        <div className="botoes-orc-item">
          <div className={`status-badge ${getStatusClass(orcamento.tipoOrcamento)}`}>
            {orcamento.tipoOrcamento}
          </div>

          {orcamento.status === 'APROVADO' && (
            <Check size={25} color="#18af91" strokeWidth={5} />
          )}

          {orcamento.status === 'REPROVADO' && (
            <X size={25} color="#ff6464" strokeWidth={5} />
          )}

          {arquivo && (
            <a
              href={`${API_URL}/arquivos/download/${extrairNomeArquivo(extrairNomeArquivo(orcamento.urlArquivo))}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="botao-download-orc-item"
              onClick={handleDownloadClick}
              aria-label="Baixar PDF"
              title="Baixar PDF"
            >
              <Download size={16} color="#ffffff" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
