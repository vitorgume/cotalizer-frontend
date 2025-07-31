import DowloadImage from '../../../../assets/flecha 1.png';
import AprovacaoImage from '../../../../assets/positivo-removebg-preview (1).png';
import ReprovacaoImage from '../../../../assets/negativo-removebg-preview (1).png';
import './orcamentoItem.css';
import { formatarData } from "../../../../utils/formataData";
import { useNavigate } from 'react-router-dom';
import { extrairNomeArquivo } from "../../../../utils/urlUtils";

export interface OrcamentoItemProps {
    orcamento: any,
    misturado: boolean
}

export default function OrcamentoItem({ orcamento, misturado }: OrcamentoItemProps) {
    const navigate = useNavigate();

    const handleNavigateToDetails = () => {
        if (orcamento.tipoOrcamento === 'IA') {
            navigate(`/orcamento/${orcamento.id}`);
        }
        else {
            navigate(`/orcamento/tradicional/${orcamento.id}`);
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'TRADICIONAL':
                return 'status-pendente';
            case 'IA':
                return 'status-aprovado';
        }
    };

    return (
        <div className="orcamento-item-container">

            {orcamento.tipoOrcamento === 'IA' || misturado
                ?
                <div className="orcamento-item" onClick={handleNavigateToDetails}>
                    <div className="texto-orc-item">
                        <h1>{orcamento.titulo}</h1>
                        <p>{formatarData(orcamento.dataCriacao)}</p>
                    </div>
                    <div className="botoes-orc-item">

                        <div className={`status-badge ${getStatusClass(orcamento.tipoOrcamento)}`}>
                            {orcamento.tipoOrcamento}
                        </div>

                        {orcamento.status == 'APROVADO' &&
                            <img className="imagem-status-orc" src={AprovacaoImage} alt="Imagem de Aprovação" />
                        }

                        {orcamento.status == 'REPROVADO' &&
                            <img className="imagem-status-orc" src={ReprovacaoImage} alt="Imagem de Reprovação" />
                        }

                        <a href={`http://localhost:8080/arquivos/download/${extrairNomeArquivo(orcamento.urlArquivo)}`} download target="_blank" rel="noopener noreferrer" className='botao-dowload-orc-item'>
                            <img src={DowloadImage} alt="Download de imagem" />
                        </a>
                    </div>
                </div>
                :
                <div className="orcamento-item" onClick={handleNavigateToDetails}>
                    <div className="texto-orc-item">
                        <h1>{orcamento.cliente}</h1>
                        <p>{formatarData(orcamento.dataCriacao)}</p>
                    </div>
                    <div className="botoes-orc-item">

                        <div className={`status-badge ${getStatusClass(orcamento.tipoOrcamento)}`}>
                            {orcamento.tipoOrcamento}
                        </div>

                        {orcamento.status == 'APROVADO' &&
                            <img className="imagem-status-orc" src={AprovacaoImage} alt="Imagem de Aprovação" />
                        }

                        {orcamento.status == 'REPROVADO' &&
                            <img className="imagem-status-orc" src={ReprovacaoImage} alt="Imagem de Reprovação" />
                        }

                        <a href={`http://localhost:8080/arquivos/download/${extrairNomeArquivo(orcamento.urlArquivo)}`} download target="_blank" rel="noopener noreferrer" className='botao-dowload-orc-item'>
                            <img src={DowloadImage} alt="Download de imagem" />
                        </a>
                    </div>
                </div>
            }

        </div>
    );
}