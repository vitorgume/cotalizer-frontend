import './detalhesOrcamento.css';
import { useEffect, useState } from 'react';

import ModalDelete from '../../componentes/modalDelete/modalDelete';
import Loading from '../../componentes/loading/loading';
import { atualizarOrcamento, consultarPorId, deletar } from '../../orcamento.service';
import { useNavigate, useParams } from 'react-router-dom';
import { formatarData } from '../../../../utils/formataData';
import type Orcamento from '../../../../models/orcamento';
import { extrairNomeArquivo } from '../../../../utils/urlUtils';
import { notificarSucesso } from '../../../../utils/notificacaoUtils';

// Ícones Lucide
import { Trash2, Download, ExternalLink } from 'lucide-react';

export default function DetalhesOrcamento() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusOrcamento, setStatusOrcamento] = useState<'aprovado' | 'reprovado' | null>(null);

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const handleDelete = async () => {
        try {
            if (orcamento?.id) {
                await deletar(orcamento.id);
                navigate('/menu');
            }
        } catch (error) {
            console.error('Erro ao deletar orçamento:', error);
        }
    };

    const handleOpenDeleteModal = () => setShowDeleteModal(true);
    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    const handleAprovar = () => {
        if (!orcamento) return;
        setStatusOrcamento('aprovado');
        orcamento.status = 'APROVADO';
        atualizarOrcamento(orcamento);
        notificarSucesso('Aprovado com sucesso');
    };

    const handleReprovar = () => {
        if (!orcamento) return;
        setStatusOrcamento('reprovado');
        orcamento.status = 'REPROVADO';
        atualizarOrcamento(orcamento);
        notificarSucesso('Reprovado com sucesso');
    };

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }
        async function carregarOrcamento(idOrc: string) {
            try {
                const resp = await consultarPorId(idOrc);
                if (resp.dado?.status === 'APROVADO') setStatusOrcamento('aprovado');
                else if (resp.dado?.status === 'REPROVADO') setStatusOrcamento('reprovado');
                setOrcamento(resp.dado);
            } catch (err) {
                console.error('Erro ao carregar orçamento:', err);
            } finally {
                setLoading(false);
            }
        }
        carregarOrcamento(id);
    }, [id]);

    if (loading) return <Loading message="Carregando orçamento..." />;

    if (!orcamento) {
        return (
            <div className="orcamento-nao-encontrado">
                <p>Orçamento não encontrado</p>
            </div>
        );
    }

    return (
        <div className="orc-details-page">
            <div className="detalhes-orcamento card-shell">
                <header className="header-detalhes-orc">
                    <div className="titulo-header">
                        <h1>{orcamento.titulo}</h1>
                        <p>{formatarData(orcamento.dataCriacao)}</p>
                    </div>

                    <div className="botoes-header">
                        <button
                            className={`botao-reprovacao ${statusOrcamento === 'reprovado' ? 'ativo' : ''}`}
                            onClick={handleReprovar}
                        >
                            {statusOrcamento === 'reprovado' ? 'Reprovado' : 'Reprovar'}
                        </button>

                        <button
                            className={`botao-aprovacao ${statusOrcamento === 'aprovado' ? 'ativo' : ''}`}
                            onClick={handleAprovar}
                        >
                            {statusOrcamento === 'aprovado' ? 'Aprovado' : 'Aprovar'}
                        </button>

                        <button
                            className="icon-btn btn-ghost-danger"
                            onClick={handleOpenDeleteModal}
                            type="button"
                            aria-label="Excluir orçamento"
                            title="Excluir orçamento"
                        >
                            <Trash2 size={22} className="icon" />
                        </button>
                    </div>
                </header>

                <section className="info-orcamento-texto card-glass">
                    <p>{orcamento.conteudoOriginal}</p>
                </section>

                <section className="orcamento-group">
                    <h2>Visualize seu orçamento</h2>

                    <div className="pdf-card card-glass">
                        <iframe
                            src={orcamento.urlArquivo}
                            width="100%"
                            height="600"
                            className="pdf-frame"
                            title="Visualização do Orçamento"
                        />
                    </div>

                    <div className="botoes-orcamento-group">
                        <a
                            href={`http://localhost:8080/arquivos/download/${extrairNomeArquivo(orcamento.urlArquivo)}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-btn btn-ghost"
                            aria-label="Baixar PDF"
                            title="Baixar PDF"
                        >
                            <Download size={20} className="icon" />
                        </a>

                        <a
                            href={orcamento.urlArquivo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                        >
                            Abrir em nova aba
                            <ExternalLink size={16} className="icon-inline" />
                        </a>
                    </div>
                </section>

                <ModalDelete
                    isOpen={showDeleteModal}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleDelete}
                    title={orcamento.titulo}
                />
            </div>
        </div>
    );
}
