import type Orcamento from "../../../../models/orcamento";
import DeleteImage from '../../../../assets/delete_7022659 1.png';
import DowloadImage from '../../../../assets/flecha 1.png';
import AprovacaoImage from '../../../../assets/positivo-removebg-preview (1).png';
import ReprovacaoImage from '../../../../assets/negativo-removebg-preview (1).png';
import './orcamentoItem.css';
import { formatarData } from "../../../../utils/formataData";
import { useNavigate } from 'react-router-dom';
import { extrairNomeArquivo } from "../../../../utils/urlUtils";

export interface OrcamentoItemProps {
    orcamento: Orcamento,
    handleOpenDeleteModal: () => void;
    deleteButton: boolean;
}

export default function OrcamentoItem({ orcamento, handleOpenDeleteModal, deleteButton }: OrcamentoItemProps) {
    const navigate = useNavigate();

    const handleNavigateToDetails = () => {
        navigate(`/orcamento/${orcamento.id}`);
    };

    return (
        <div className="orcamento-item" onClick={handleNavigateToDetails}>
            <div className="texto-orc-item">
                <h1>{orcamento.titulo}</h1>
                <p>{formatarData(orcamento.dataCriacao)}</p>
            </div>
            <div className="botoes-orc-item">

                {orcamento.status == 'APROVADO' &&
                    <img src={AprovacaoImage} alt="Imagem de Aprovação" />
                }

                {orcamento.status == 'REPROVADO' &&
                    <img src={ReprovacaoImage} alt="Imagem de Reprovação" />
                }

                <a href={`http://localhost:8080/arquivos/download/${extrairNomeArquivo(orcamento.urlArquivo)}`} download target="_blank" rel="noopener noreferrer" className='botao-dowload-orc-item'>
                    <img src={DowloadImage} alt="Download de imagem" />
                </a>
            </div>
        </div>
    );
}