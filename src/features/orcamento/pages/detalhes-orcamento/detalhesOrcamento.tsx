import './detalhesOrcamento.css';
import { useEffect, useState } from 'react';
import DeleteImage from '../../../../assets/delete_7022659 1.png';
import PdfExemplo from '../../../../assets/Documento A4 Orçamento Simples Azul 1.png';
import DowloadImage from '../../../../assets/flecha 1.png';
import ModalDelete from '../../componentes/modalDelete/modalDelete';
import Loading from '../../componentes/loading/Loading';
import { consultarPorId, deletar } from '../../orcamento.service';
import type Orcamento from '../../../../models/orcamento';
import { useNavigate } from 'react-router-dom';

export default function DetalhesOrcamento() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            if(orcamento) {
                await deletar(orcamento.id);
                navigate("/");
            }
        } catch (error) {
            console.error('Erro ao carregar orçamento:', error);
        }
    };

    const handleOpenDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    useEffect(() => {
        const idOrc = "684b23b1ef70de14663605a1";

        async function carregarOrcamento(idOrcamento: string) {
            try {
                const orcamento = await consultarPorId(idOrcamento);
                setOrcamento(orcamento.dado);
            } catch (error) {
                console.error('Erro ao carregar orçamento:', error);
            } finally {
                setLoading(false);
            }
        }

        carregarOrcamento(idOrc);
    }, []);

    return (
        <>
            {orcamento ?
                <div className='detalhes-orcamento'>
                    <header className='header-detalhes-orc'>
                        <div className='titulo-header'>
                            <h1>{orcamento.titulo}</h1>
                            <p>{orcamento.dataCriacao}</p>
                        </div>
                        <button onClick={handleOpenDeleteModal}><img src={DeleteImage} alt="Imagem de delete" /></button>
                    </header>

                    <div className='info-orcamento-texto'>
                        <p>
                            {orcamento.conteudoOriginal}
                        </p>
                    </div>

                    <div className='orcamento-group'>
                        <h2>Vizualize seu orçamento</h2>

                        <div className='pdf-group'>
                            <img src={PdfExemplo} alt="Pdf exemplo" />
                        </div>

                        <div className='botoes-orcamento-group'>
                            <button className='botao-dowload-pdf'><img src={DowloadImage} alt="Dowload de imagem" /></button>
                            {/* <button className='botao-ver-mais-pdf'>Ver mais</button> */}
                        </div>
                    </div>

                    <ModalDelete
                        isOpen={showDeleteModal}
                        onClose={handleCloseDeleteModal}
                        onConfirm={handleDelete}
                        title="Orçamento para Maria"
                    />
                </div>
                :
                loading ? (
                    <Loading message="Carregando orçamento..." />
                ) : (
                    <div className="orcamento-nao-encontrado">
                        <p>Orçamento não encontrado</p>
                    </div>
                )
            }
        </>
    );
}